import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  UserProfile,
  Subject,
  Question,
  CaseStudy,
  MockTest,
  TestAttempt,
  MistakeRecord,
  BookmarkRecord,
  QuestionReport,
  AuditLogEntry,
  SystemSettings
} from '../src/types';
import {
  INITIAL_SUBJECTS,
  INITIAL_CASE_STUDIES,
  INITIAL_QUESTIONS,
  INITIAL_MOCK_TESTS
} from '../src/data/initialData';

interface DatabaseStore {
  users: UserProfile[];
  subjects: Subject[];
  questions: Question[];
  case_studies: CaseStudy[];
  mock_tests: MockTest[];
  test_attempts: TestAttempt[];
  mistakes: MistakeRecord[];
  bookmarks: BookmarkRecord[];
  reports: QuestionReport[];
  audit_logs: AuditLogEntry[];
  settings: SystemSettings;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-student-01',
    email: 'student@nursingprep.ai',
    name: 'Sunita Patil (AIIMS Aspirant)',
    role: 'student',
    preferredLanguage: 'en',
    targetExam: 'AIIMS NORCET 2025',
    dailyTarget: 30,
    streakDays: 14,
    points: 480,
    isPremium: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-editor-01',
    email: 'editor@nursingprep.ai',
    name: 'Dr. Ramesh Shinde (Content Editor)',
    role: 'content_editor',
    preferredLanguage: 'mr',
    targetExam: 'Faculty',
    dailyTarget: 10,
    streakDays: 5,
    points: 120,
    isPremium: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-reviewer-01',
    email: 'reviewer@nursingprep.ai',
    name: 'Sister Mary Fernandez (Nursing Super-Reviewer)',
    role: 'reviewer',
    preferredLanguage: 'en',
    targetExam: 'Quality Review',
    dailyTarget: 20,
    streakDays: 28,
    points: 920,
    isPremium: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-admin-01',
    email: 'admin@nursingprep.ai',
    name: 'Chief Admin (Examination Board)',
    role: 'admin',
    preferredLanguage: 'en',
    targetExam: 'Exam Operations',
    dailyTarget: 50,
    streakDays: 45,
    points: 1500,
    isPremium: true,
    createdAt: new Date().toISOString()
  }
];

const INITIAL_SETTINGS: SystemSettings = {
  app_name: 'Nursing Officer Exam Preparation Platform',
  default_language: 'en',
  allow_registration: true,
  maintenance_mode: false,
  default_negative_marking: 0.33,
  ai_rate_limit_per_user_per_day: 50,
  enable_ai_question_generation: true,
  enable_ai_study_coach: true
};

class DatabaseService {
  private store: DatabaseStore;

  constructor() {
    this.store = this.loadOrInitialize();
  }

  private loadOrInitialize(): DatabaseStore {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Error reading store.json, reinitializing default data', err);
    }

    const defaultStore: DatabaseStore = {
      users: INITIAL_USERS,
      subjects: INITIAL_SUBJECTS,
      questions: INITIAL_QUESTIONS.map(q => ({
        ...q,
        duplicate_hash: this.computeDuplicateHash(q.question_en)
      })),
      case_studies: INITIAL_CASE_STUDIES,
      mock_tests: INITIAL_MOCK_TESTS,
      test_attempts: [],
      mistakes: [],
      bookmarks: [],
      reports: [],
      audit_logs: [
        {
          id: 'log-01',
          actor_id: 'usr-admin-01',
          actor_name: 'Chief Admin',
          actor_role: 'admin',
          action: 'SYSTEM_BOOTSTRAP',
          entity: 'System',
          entity_id: 'root',
          details: 'Nursing Officer Preparation Platform initialized with certified subject banks and PYQs.',
          created_at: new Date().toISOString()
        }
      ],
      settings: INITIAL_SETTINGS
    };

    this.save(defaultStore);
    return defaultStore;
  }

  private save(storeToSave = this.store): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(STORE_PATH, JSON.stringify(storeToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write store.json', err);
    }
  }

  public computeDuplicateHash(text: string): string {
    const normalized = text.toLowerCase().replace(/[^a-z0-9]/g, '');
    return crypto.createHash('sha256').update(normalized).digest('hex').substring(0, 16);
  }

  // Users
  public getUsers(): UserProfile[] {
    return this.store.users;
  }

  public getUserById(id: string): UserProfile | undefined {
    return this.store.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): UserProfile | undefined {
    return this.store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: Partial<UserProfile> & { email: string; name: string }): UserProfile {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      email: user.email,
      name: user.name,
      role: user.role || 'student',
      preferredLanguage: user.preferredLanguage || 'en',
      targetExam: user.targetExam || 'NORCET',
      dailyTarget: user.dailyTarget || 20,
      streakDays: 1,
      points: 50,
      isPremium: !!user.isPremium,
      createdAt: new Date().toISOString()
    };
    this.store.users.push(newUser);
    this.logAudit(newUser.id, newUser.name, newUser.role, 'USER_REGISTER', 'User', newUser.id, `User signed up`);
    this.save();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const idx = this.store.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.store.users[idx] = { ...this.store.users[idx], ...updates };
    this.save();
    return this.store.users[idx];
  }

  // Subjects
  public getSubjects(): Subject[] {
    return this.store.subjects;
  }

  public getSubjectById(id: string): Subject | undefined {
    return this.store.subjects.find(s => s.id === id);
  }

  public addSubject(subject: Subject, actor?: UserProfile): Subject {
    this.store.subjects.push(subject);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'CREATE_SUBJECT', 'Subject', subject.id, `Added subject: ${subject.name_en}`);
    }
    this.save();
    return subject;
  }

  // Questions
  public getQuestions(filters?: {
    subject_id?: string;
    difficulty?: string;
    status?: string;
    is_verified_pyq?: boolean;
    case_id?: string;
    search?: string;
  }): Question[] {
    let list = this.store.questions;

    if (filters?.subject_id) {
      list = list.filter(q => q.subject_id === filters.subject_id);
    }
    if (filters?.difficulty) {
      list = list.filter(q => q.difficulty === filters.difficulty);
    }
    if (filters?.status) {
      list = list.filter(q => q.status === filters.status);
    }
    if (filters?.is_verified_pyq !== undefined) {
      list = list.filter(q => !!q.is_verified_pyq === filters.is_verified_pyq);
    }
    if (filters?.case_id) {
      list = list.filter(q => q.case_id === filters.case_id);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(q =>
        q.question_en.toLowerCase().includes(s) ||
        (q.question_mr && q.question_mr.toLowerCase().includes(s)) ||
        q.explanation_en.toLowerCase().includes(s)
      );
    }

    return list;
  }

  public getQuestionById(id: string): Question | undefined {
    return this.store.questions.find(q => q.id === id);
  }

  public addQuestion(questionData: Omit<Question, 'id' | 'created_at' | 'updated_at' | 'version'>, actor?: UserProfile): Question {
    const hash = this.computeDuplicateHash(questionData.question_en);
    const newQ: Question = {
      ...questionData,
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      duplicate_hash: hash,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.store.questions.push(newQ);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'CREATE_QUESTION', 'Question', newQ.id, `Created question: ${newQ.question_en.substring(0, 40)}...`);
    }
    this.save();
    return newQ;
  }

  public updateQuestion(id: string, updates: Partial<Question>, actor?: UserProfile): Question | null {
    const idx = this.store.questions.findIndex(q => q.id === id);
    if (idx === -1) return null;
    const old = this.store.questions[idx];
    const newHash = updates.question_en ? this.computeDuplicateHash(updates.question_en) : old.duplicate_hash;

    const updated: Question = {
      ...old,
      ...updates,
      duplicate_hash: newHash,
      version: (old.version || 1) + 1,
      updated_at: new Date().toISOString()
    };

    if (updates.status === 'published' && old.status !== 'published') {
      updated.published_at = new Date().toISOString();
    }

    this.store.questions[idx] = updated;

    if (actor) {
      this.logAudit(
        actor.id,
        actor.name,
        actor.role,
        updates.status ? `STATUS_CHANGE_${updates.status.toUpperCase()}` : 'UPDATE_QUESTION',
        'Question',
        id,
        `Question updated. Status: ${updated.status}`
      );
    }
    this.save();
    return updated;
  }

  public deleteQuestion(id: string, actor?: UserProfile): boolean {
    const idx = this.store.questions.findIndex(q => q.id === id);
    if (idx === -1) return false;
    const removed = this.store.questions.splice(idx, 1)[0];
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'DELETE_QUESTION', 'Question', id, `Deleted question: ${removed.question_en.substring(0, 40)}...`);
    }
    this.save();
    return true;
  }

  // Cases
  public getCases(): CaseStudy[] {
    return this.store.case_studies;
  }

  public getCaseById(id: string): CaseStudy | undefined {
    return this.store.case_studies.find(c => c.id === id);
  }

  public addCase(caseData: Omit<CaseStudy, 'id' | 'created_at'>, actor?: UserProfile): CaseStudy {
    const newCase: CaseStudy = {
      ...caseData,
      id: `case-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString()
    };
    this.store.case_studies.push(newCase);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'CREATE_CASE', 'CaseStudy', newCase.id, `Created case: ${newCase.title_en}`);
    }
    this.save();
    return newCase;
  }

  // Mock Tests
  public getMockTests(): MockTest[] {
    return this.store.mock_tests;
  }

  public getMockTestById(id: string): MockTest | undefined {
    return this.store.mock_tests.find(t => t.id === id);
  }

  public addMockTest(testData: Omit<MockTest, 'id' | 'created_at'>, actor?: UserProfile): MockTest {
    const newTest: MockTest = {
      ...testData,
      id: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString()
    };
    this.store.mock_tests.push(newTest);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'CREATE_MOCK_TEST', 'MockTest', newTest.id, `Created test: ${newTest.title_en}`);
    }
    this.save();
    return newTest;
  }

  // Test Attempts
  public recordAttempt(attempt: Omit<TestAttempt, 'id'>): TestAttempt {
    const newAttempt: TestAttempt = {
      ...attempt,
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    this.store.test_attempts.push(newAttempt);

    // Auto-record mistakes into Mistake Notebook
    for (const ans of attempt.answers) {
      if (ans.selected_option && !ans.is_correct) {
        this.recordMistake(attempt.user_id, ans.question_id);
      }
    }

    // Award user points
    const user = this.getUserById(attempt.user_id);
    if (user) {
      user.points = (user.points || 0) + Math.max(10, Math.floor(attempt.score * 5));
      this.updateUser(user.id, { points: user.points });
    }

    this.save();
    return newAttempt;
  }

  public getAttemptsByUser(userId: string): TestAttempt[] {
    return this.store.test_attempts
      .filter(a => a.user_id === userId)
      .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
  }

  // Mistake Notebook & Spaced Repetition
  public recordMistake(userId: string, questionId: string): MistakeRecord {
    const existing = this.store.mistakes.find(m => m.user_id === userId && m.question_id === questionId);
    const now = new Date();
    if (existing) {
      existing.wrong_count += 1;
      existing.last_wrong_at = now.toISOString();
      existing.is_mastered = false;
      existing.revision_interval_days = 1;
      const nextDue = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
      existing.next_revision_due = nextDue.toISOString();
      this.save();
      return existing;
    }

    const nextDue = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
    const newMistake: MistakeRecord = {
      id: `mstk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: userId,
      question_id: questionId,
      wrong_count: 1,
      first_wrong_at: now.toISOString(),
      last_wrong_at: now.toISOString(),
      is_mastered: false,
      revision_interval_days: 1,
      next_revision_due: nextDue.toISOString()
    };
    this.store.mistakes.push(newMistake);
    this.save();
    return newMistake;
  }

  public getMistakesByUser(userId: string): MistakeRecord[] {
    return this.store.mistakes.filter(m => m.user_id === userId);
  }

  public updateMistakeMastery(userId: string, questionId: string, mastered: boolean): MistakeRecord | null {
    const m = this.store.mistakes.find(item => item.user_id === userId && item.question_id === questionId);
    if (!m) return null;
    m.is_mastered = mastered;
    if (mastered) {
      m.mastered_at = new Date().toISOString();
      // Increase spaced revision interval
      const intervals = [1, 3, 7, 15, 30];
      const currIdx = intervals.indexOf(m.revision_interval_days);
      const nextInterval = currIdx < intervals.length - 1 ? intervals[currIdx + 1] : 30;
      m.revision_interval_days = nextInterval;
      const nextDue = new Date(Date.now() + nextInterval * 24 * 60 * 60 * 1000);
      m.next_revision_due = nextDue.toISOString();
    }
    this.save();
    return m;
  }

  // Bookmarks
  public toggleBookmark(userId: string, questionId: string): boolean {
    const idx = this.store.bookmarks.findIndex(b => b.user_id === userId && b.question_id === questionId);
    if (idx !== -1) {
      this.store.bookmarks.splice(idx, 1);
      this.save();
      return false; // Removed
    }
    this.store.bookmarks.push({
      id: `bm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: userId,
      question_id: questionId,
      created_at: new Date().toISOString()
    });
    this.save();
    return true; // Added
  }

  public getBookmarksByUser(userId: string): BookmarkRecord[] {
    return this.store.bookmarks.filter(b => b.user_id === userId);
  }

  // Reports
  public addReport(report: Omit<QuestionReport, 'id' | 'status' | 'created_at'>): QuestionReport {
    const newReport: QuestionReport = {
      ...report,
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    this.store.reports.push(newReport);
    this.save();
    return newReport;
  }

  public getReports(): QuestionReport[] {
    return this.store.reports.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public resolveReport(reportId: string, status: 'resolved' | 'rejected', notes: string, actor?: UserProfile): QuestionReport | null {
    const r = this.store.reports.find(item => item.id === reportId);
    if (!r) return null;
    r.status = status;
    r.resolution_notes = notes;
    r.resolved_at = new Date().toISOString();
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'RESOLVE_REPORT', 'QuestionReport', reportId, `Report ${status}: ${notes}`);
    }
    this.save();
    return r;
  }

  // Audit Logs
  public logAudit(
    actorId: string,
    actorName: string,
    actorRole: string,
    action: string,
    entity: string,
    entityId: string,
    details: string
  ): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actor_id: actorId,
      actor_name: actorName,
      actor_role: actorRole,
      action,
      entity,
      entity_id: entityId,
      details,
      created_at: new Date().toISOString()
    };
    this.store.audit_logs.unshift(entry);
    // Keep max 1000 logs
    if (this.store.audit_logs.length > 1000) {
      this.store.audit_logs = this.store.audit_logs.slice(0, 1000);
    }
    this.save();
    return entry;
  }

  public getAuditLogs(): AuditLogEntry[] {
    return this.store.audit_logs;
  }

  // Settings
  public getSettings(): SystemSettings {
    return this.store.settings;
  }

  public updateSettings(settings: Partial<SystemSettings>, actor?: UserProfile): SystemSettings {
    this.store.settings = { ...this.store.settings, ...settings };
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'UPDATE_SETTINGS', 'Settings', 'global', 'System settings updated');
    }
    this.save();
    return this.store.settings;
  }

  // Statistics calculation for Student Dashboard & Admin
  public getAdminStats() {
    const totalUsers = this.store.users.length;
    const totalQuestions = this.store.questions.length;
    const publishedQuestions = this.store.questions.filter(q => q.status === 'published').length;
    const draftQuestions = this.store.questions.filter(q => q.status === 'draft').length;
    const inReviewQuestions = this.store.questions.filter(q => q.status === 'in_review').length;
    const totalAttempts = this.store.test_attempts.length;
    const totalTests = this.store.mock_tests.length;
    const pendingReports = this.store.reports.filter(r => r.status === 'pending').length;

    return {
      totalUsers,
      totalQuestions,
      publishedQuestions,
      draftQuestions,
      inReviewQuestions,
      totalAttempts,
      totalTests,
      pendingReports
    };
  }

  public getStudentStats(userId: string) {
    const userAttempts = this.getAttemptsByUser(userId);
    const mistakes = this.getMistakesByUser(userId);
    const bookmarks = this.getBookmarksByUser(userId);

    const totalTestsTaken = userAttempts.length;
    const totalQuestionsSolved = userAttempts.reduce((acc, att) => acc + att.correct_count + att.wrong_count, 0);
    const totalCorrect = userAttempts.reduce((acc, att) => acc + att.correct_count, 0);
    const overallAccuracy = totalQuestionsSolved > 0 ? Math.round((totalCorrect / totalQuestionsSolved) * 100) : 0;

    // Weakness analysis
    const subjectStats: Record<string, { total: number; correct: number }> = {};
    for (const att of userAttempts) {
      for (const ans of att.answers) {
        const q = this.getQuestionById(ans.question_id);
        if (q && ans.selected_option) {
          if (!subjectStats[q.subject_id]) {
            subjectStats[q.subject_id] = { total: 0, correct: 0 };
          }
          subjectStats[q.subject_id].total += 1;
          if (ans.is_correct) subjectStats[q.subject_id].correct += 1;
        }
      }
    }

    const weakSubjects: { subject_id: string; accuracy: number; total: number }[] = [];
    for (const [subId, data] of Object.entries(subjectStats)) {
      const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 100;
      if (acc < 65 || (data.total >= 3 && acc < 70)) {
        weakSubjects.push({ subject_id: subId, accuracy: acc, total: data.total });
      }
    }

    const unmasteredMistakes = mistakes.filter(m => !m.is_mastered);
    const dueForRevision = mistakes.filter(m => !m.is_mastered && new Date(m.next_revision_due).getTime() <= Date.now());

    return {
      totalTestsTaken,
      totalQuestionsSolved,
      overallAccuracy,
      weakSubjects,
      totalMistakes: unmasteredMistakes.length,
      dueForRevisionCount: dueForRevision.length,
      totalBookmarks: bookmarks.length,
      recentAttempts: userAttempts.slice(0, 5)
    };
  }
}

export const db = new DatabaseService();
