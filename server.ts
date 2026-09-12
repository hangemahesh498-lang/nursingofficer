import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './server/db';
import {
  explainNursingConcept,
  generateMnemonic,
  generateRevisionPlan,
  askStudyCoachDoubt,
  generateAiDraftQuestion
} from './server/gemini';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper to extract authenticated user from header
function getActor(req: express.Request) {
  const userId = (req.headers['x-user-id'] as string) || 'usr-student-01';
  return db.getUserById(userId) || db.getUsers()[0];
}

// -------------------------------------------------------------
// 1. HEALTH & METADATA
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// -------------------------------------------------------------
// 2. AUTH & USER ROLES
// -------------------------------------------------------------
app.get('/api/auth/users', (req, res) => {
  res.json(db.getUsers());
});

app.get('/api/auth/me', (req, res) => {
  const user = getActor(req);
  res.json(user);
});

app.post('/api/auth/switch-user', (req, res) => {
  const { userId } = req.body;
  const user = db.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

app.post('/api/auth/register', (req, res) => {
  const { email, name, role, targetExam, preferredLanguage } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.json(existing);
  }
  const user = db.createUser({ email, name, role, targetExam, preferredLanguage });
  res.status(201).json(user);
});

app.put('/api/auth/profile', (req, res) => {
  const actor = getActor(req);
  const updated = db.updateUser(actor.id, req.body);
  res.json(updated);
});

// -------------------------------------------------------------
// 3. SUBJECTS & HIERARCHY
// -------------------------------------------------------------
app.get('/api/subjects', (req, res) => {
  const subjects = db.getSubjects();
  // Recalculate dynamic question counts
  const allQuestions = db.getQuestions({ status: 'published' });
  const mapped = subjects.map(s => ({
    ...s,
    totalQuestions: allQuestions.filter(q => q.subject_id === s.id).length
  }));
  res.json(mapped);
});

app.post('/api/subjects', (req, res) => {
  const actor = getActor(req);
  if (actor.role !== 'admin' && actor.role !== 'super_admin') {
    return res.status(403).json({ error: 'Admin permission required' });
  }
  const subject = db.addSubject(req.body, actor);
  res.status(201).json(subject);
});

// -------------------------------------------------------------
// 4. QUESTIONS & WORKFLOW
// -------------------------------------------------------------
app.get('/api/questions', (req, res) => {
  const { subject_id, difficulty, status, is_verified_pyq, case_id, search } = req.query;
  const actor = getActor(req);

  // Non-staff users can only query published questions by default
  const isStaff = ['content_editor', 'reviewer', 'admin', 'super_admin'].includes(actor.role);
  const filterStatus = isStaff ? (status as string) : 'published';

  const questions = db.getQuestions({
    subject_id: subject_id as string,
    difficulty: difficulty as string,
    status: filterStatus,
    is_verified_pyq: is_verified_pyq !== undefined ? is_verified_pyq === 'true' : undefined,
    case_id: case_id as string,
    search: search as string
  });

  res.json(questions);
});

app.get('/api/questions/:id', (req, res) => {
  const question = db.getQuestionById(req.params.id);
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }
  res.json(question);
});

app.post('/api/questions', (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'reviewer', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied. Only editors and admins can create questions.' });
  }

  const {
    subject_id, question_en, question_mr,
    option_a_en, option_b_en, option_c_en, option_d_en,
    correct_option, explanation_en, explanation_mr,
    difficulty, question_type, exam_tags, exam_name, exam_year, shift,
    case_id, image_url, status
  } = req.body;

  if (!subject_id || !question_en || !option_a_en || !option_b_en || !option_c_en || !option_d_en || !correct_option || !explanation_en) {
    return res.status(400).json({ error: 'All 4 options, question stem, correct option, and explanation are required.' });
  }

  // Duplicate detection check
  const duplicateHash = db.computeDuplicateHash(question_en);
  const existingDup = db.getQuestions().find(q => q.duplicate_hash === duplicateHash);
  if (existingDup) {
    return res.status(409).json({
      error: 'Duplicate question detected with similar wording',
      existing_id: existingDup.id
    });
  }

  const newQuestion = db.addQuestion({
    subject_id,
    question_en,
    question_mr,
    option_a_en,
    option_a_mr: req.body.option_a_mr,
    option_b_en,
    option_b_mr: req.body.option_b_mr,
    option_c_en,
    option_c_mr: req.body.option_c_mr,
    option_d_en,
    option_d_mr: req.body.option_d_mr,
    correct_option,
    explanation_en,
    explanation_mr,
    difficulty: difficulty || 'medium',
    question_type: question_type || 'single_best',
    exam_tags: exam_tags || [],
    exam_name,
    exam_year: exam_year ? parseInt(exam_year) : undefined,
    shift,
    case_id,
    image_url,
    status: status || 'draft',
    is_verified_pyq: !!req.body.is_verified_pyq,
    created_by: actor.id
  }, actor);

  res.status(201).json(newQuestion);
});

app.put('/api/questions/:id', (req, res) => {
  const actor = getActor(req);
  const questionId = req.params.id;
  const question = db.getQuestionById(questionId);
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  // Role permissions check
  if (req.body.status === 'published' && !['reviewer', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Only Reviewers or Admins can publish questions.' });
  }

  const updated = db.updateQuestion(questionId, req.body, actor);
  res.json(updated);
});

app.delete('/api/questions/:id', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Only Administrators can delete questions.' });
  }
  const deleted = db.deleteQuestion(req.params.id, actor);
  if (!deleted) return res.status(404).json({ error: 'Question not found' });
  res.json({ success: true });
});

// -------------------------------------------------------------
// 5. CLINICAL CASE VIGNETTES
// -------------------------------------------------------------
app.get('/api/cases', (req, res) => {
  res.json(db.getCases());
});

app.get('/api/cases/:id', (req, res) => {
  const item = db.getCaseById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Case not found' });
  res.json(item);
});

app.post('/api/cases', (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'reviewer', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const newCase = db.addCase(req.body, actor);
  res.status(201).json(newCase);
});

// -------------------------------------------------------------
// 6. MOCK TESTS & ATTEMPT ENGINE
// -------------------------------------------------------------
app.get('/api/mock-tests', (req, res) => {
  res.json(db.getMockTests());
});

app.get('/api/mock-tests/:id', (req, res) => {
  const test = db.getMockTestById(req.params.id);
  if (!test) return res.status(404).json({ error: 'Test not found' });

  // Hydrate full questions
  const allQ = db.getQuestions();
  const testQuestions = test.question_ids
    .map(qid => allQ.find(q => q.id === qid))
    .filter(Boolean);

  res.json({
    ...test,
    questions: testQuestions
  });
});

app.post('/api/mock-tests', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Only administrators can create mock tests' });
  }
  const newTest = db.addMockTest(req.body, actor);
  res.status(201).json(newTest);
});

app.post('/api/mock-tests/:id/submit', (req, res) => {
  const actor = getActor(req);
  const test = db.getMockTestById(req.params.id);
  if (!test) return res.status(404).json({ error: 'Mock test not found' });

  const { answers, started_at, time_spent_seconds } = req.body;
  // answers is an array: { question_id, selected_option, time_spent_seconds, is_marked_for_review }

  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;

  const evaluatedAnswers = answers.map((ans: any) => {
    const q = db.getQuestionById(ans.question_id);
    const isAnswered = !!ans.selected_option;
    const isCorrect = isAnswered && q && q.correct_option === ans.selected_option;

    if (!isAnswered) {
      unattemptedCount += 1;
    } else if (isCorrect) {
      correctCount += 1;
    } else {
      wrongCount += 1;
    }

    return {
      question_id: ans.question_id,
      selected_option: ans.selected_option || null,
      is_correct: isCorrect,
      time_spent_seconds: ans.time_spent_seconds || 0,
      is_marked_for_review: !!ans.is_marked_for_review
    };
  });

  const totalQuestions = answers.length;
  const marksPerQuestion = test.total_marks / (totalQuestions || 1);
  const negativeMarkPenalty = marksPerQuestion * (test.negative_marking_rate || 0.33);

  // Exact negative marking math:
  const rawScore = (correctCount * marksPerQuestion) - (wrongCount * negativeMarkPenalty);
  const finalScore = Math.max(0, Math.round(rawScore * 100) / 100);
  const accuracy = (correctCount + wrongCount) > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0;

  const attempt = db.recordAttempt({
    test_id: test.id,
    test_title: test.title_en,
    user_id: actor.id,
    user_name: actor.name,
    started_at: started_at || new Date().toISOString(),
    completed_at: new Date().toISOString(),
    time_spent_seconds: time_spent_seconds || 0,
    score: finalScore,
    total_marks: test.total_marks,
    correct_count: correctCount,
    wrong_count: wrongCount,
    unattempted_count: unattemptedCount,
    accuracy_percentage: accuracy,
    answers: evaluatedAnswers
  });

  res.json(attempt);
});

// -------------------------------------------------------------
// 7. STUDENT ANALYTICS, MISTAKES, BOOKMARKS
// -------------------------------------------------------------
app.get('/api/student/stats', (req, res) => {
  const actor = getActor(req);
  const stats = db.getStudentStats(actor.id);
  res.json(stats);
});

app.get('/api/student/mistakes', (req, res) => {
  const actor = getActor(req);
  const mistakes = db.getMistakesByUser(actor.id);
  const questions = db.getQuestions();
  const enriched = mistakes.map(m => ({
    ...m,
    question: questions.find(q => q.id === m.question_id)
  })).filter(m => !!m.question);
  res.json(enriched);
});

app.post('/api/student/mistakes/master', (req, res) => {
  const actor = getActor(req);
  const { question_id, is_mastered } = req.body;
  const updated = db.updateMistakeMastery(actor.id, question_id, is_mastered);
  res.json(updated);
});

app.get('/api/student/bookmarks', (req, res) => {
  const actor = getActor(req);
  const bms = db.getBookmarksByUser(actor.id);
  const questions = db.getQuestions();
  const enriched = bms.map(b => ({
    ...b,
    question: questions.find(q => q.id === b.question_id)
  })).filter(b => !!b.question);
  res.json(enriched);
});

app.post('/api/student/bookmarks/toggle', (req, res) => {
  const actor = getActor(req);
  const { question_id } = req.body;
  const isBookmarked = db.toggleBookmark(actor.id, question_id);
  res.json({ isBookmarked });
});

// -------------------------------------------------------------
// 8. QUESTION REPORTS
// -------------------------------------------------------------
app.post('/api/reports', (req, res) => {
  const actor = getActor(req);
  const { question_id, reason, details } = req.body;
  if (!question_id || !reason) {
    return res.status(400).json({ error: 'Question ID and reason are required' });
  }
  const report = db.addReport({
    question_id,
    user_id: actor.id,
    user_name: actor.name,
    reason,
    details: details || ''
  });
  res.status(201).json(report);
});

app.get('/api/admin/reports', (req, res) => {
  const actor = getActor(req);
  if (!['reviewer', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const reports = db.getReports();
  const questions = db.getQuestions();
  const enriched = reports.map(r => ({
    ...r,
    question: questions.find(q => q.id === r.question_id)
  }));
  res.json(enriched);
});

app.post('/api/admin/reports/:id/resolve', (req, res) => {
  const actor = getActor(req);
  if (!['reviewer', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const { status, notes } = req.body;
  const resolved = db.resolveReport(req.params.id, status, notes || '', actor);
  res.json(resolved);
});

// -------------------------------------------------------------
// 9. ADMIN ANALYTICS, BULK IMPORT, AUDIT & SETTINGS
// -------------------------------------------------------------
app.get('/api/admin/stats', (req, res) => {
  res.json(db.getAdminStats());
});

app.get('/api/admin/audit-logs', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  res.json(db.getAuditLogs());
});

app.get('/api/admin/settings', (req, res) => {
  res.json(db.getSettings());
});

app.put('/api/admin/settings', (req, res) => {
  const actor = getActor(req);
  if (!['admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const updated = db.updateSettings(req.body, actor);
  res.json(updated);
});

// Bulk import validation & insertion
app.post('/api/admin/bulk-import', (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }

  const { rows, executeInsert } = req.body;
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'Rows array is required' });
  }

  const validationResults: {
    row_number: number;
    valid: boolean;
    errors: string[];
    is_duplicate?: boolean;
    data: any;
  }[] = [];

  const existingQuestions = db.getQuestions();
  const validRowsToInsert: any[] = [];

  rows.forEach((row, idx) => {
    const rowNum = idx + 1;
    const errors: string[] = [];

    if (!row.question_en || String(row.question_en).trim().length < 5) {
      errors.push('English question text is missing or too short');
    }
    if (!row.option_a_en || !row.option_b_en || !row.option_c_en || !row.option_d_en) {
      errors.push('All 4 English options (A, B, C, D) are required');
    }
    const correct = String(row.correct_option || '').toUpperCase();
    if (!['A', 'B', 'C', 'D'].includes(correct)) {
      errors.push(`Invalid correct option "${row.correct_option}". Must be A, B, C, or D.`);
    }
    if (!row.explanation_en) {
      errors.push('Explanation in English is required');
    }
    if (!row.subject_id) {
      row.subject_id = 'subj-fon'; // default fallback
    }

    // Duplicate detection
    const hash = db.computeDuplicateHash(row.question_en || '');
    const isDuplicate = existingQuestions.some(q => q.duplicate_hash === hash);
    if (isDuplicate) {
      errors.push('Likely duplicate of an existing question in database');
    }

    const isValid = errors.length === 0;
    if (isValid) {
      validRowsToInsert.push({ ...row, correct_option: correct, status: 'draft' });
    }

    validationResults.push({
      row_number: rowNum,
      valid: isValid,
      errors,
      is_duplicate: isDuplicate,
      data: row
    });
  });

  if (executeInsert && validRowsToInsert.length > 0) {
    const created: any[] = [];
    for (const item of validRowsToInsert) {
      const q = db.addQuestion(item, actor);
      created.push(q);
    }
    return res.json({
      success: true,
      total_rows: rows.length,
      valid_count: validRowsToInsert.length,
      inserted_count: created.length,
      results: validationResults
    });
  }

  res.json({
    total_rows: rows.length,
    valid_count: validRowsToInsert.length,
    error_count: rows.length - validRowsToInsert.length,
    results: validationResults
  });
});

// -------------------------------------------------------------
// 10. AI STUDY COACH & QUESTION GENERATOR (Gemini 3.8 Flash)
// -------------------------------------------------------------
app.post('/api/ai/explain', async (req, res) => {
  const { concept, language } = req.body;
  if (!concept) return res.status(400).json({ error: 'Concept is required' });
  const result = await explainNursingConcept(concept, language || 'en');
  res.json(result);
});

app.post('/api/ai/mnemonic', async (req, res) => {
  const { topic, language } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic is required' });
  const result = await generateMnemonic(topic, language || 'en');
  res.json(result);
});

app.post('/api/ai/revision-plan', async (req, res) => {
  const actor = getActor(req);
  const { language } = req.body;
  const stats = db.getStudentStats(actor.id);
  const weakNames = stats.weakSubjects.map(w => {
    const s = db.getSubjectById(w.subject_id);
    return s ? s.name_en : w.subject_id;
  });
  const result = await generateRevisionPlan(weakNames, stats.totalMistakes, language || 'en');
  res.json(result);
});

app.post('/api/ai/doubt', async (req, res) => {
  const { doubt, context, language } = req.body;
  if (!doubt) return res.status(400).json({ error: 'Doubt query is required' });
  const result = await askStudyCoachDoubt(doubt, context, language || 'en');
  res.json(result);
});

app.post('/api/ai/generate-question', async (req, res) => {
  const actor = getActor(req);
  if (!['content_editor', 'admin', 'super_admin'].includes(actor.role)) {
    return res.status(403).json({ error: 'Only editors and admins can use AI Question Generator' });
  }

  const { subject_id, topic, difficulty, is_clinical_case } = req.body;
  const subject = db.getSubjectById(subject_id) || db.getSubjects()[0];

  const result = await generateAiDraftQuestion({
    subject_name: subject.name_en,
    topic: topic || 'Emergency Cardiac Management',
    difficulty: difficulty || 'medium',
    is_clinical_case: !!is_clinical_case
  });

  if (!result.success || !result.draft) {
    return res.status(500).json(result);
  }

  // Strictly save as DRAFT for human reviewer approval (never auto-publish)
  const savedDraft = db.addQuestion({
    ...result.draft,
    subject_id: subject.id,
    status: 'draft',
    source_reference: 'AI Draft Generation (Requires Reviewer Verification)',
    created_by: actor.id
  }, actor);

  res.status(201).json({
    success: true,
    draft: savedDraft,
    message: 'Question generated and saved strictly in DRAFT status for human review.'
  });
});

// -------------------------------------------------------------
// 11. VITE INTEGRATION / STATIC SERVING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NursingPrep Server running on port ${PORT}`);
  });
}

startServer();
