import { db } from './db.ts';
import { Question } from '../src/types/index.ts';
import { getSupabaseConfig } from './supabaseSync.ts';

export interface UploadSession {
  sessionId: string;
  filename: string;
  questions: Question[];
  totalQuestions: number;
  batchSize: number;
  totalBatches: number;
  createdAt: number;
}

const uploadSessions = new Map<string, UploadSession>();

// Auto cleanup old sessions (> 1 hour)
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of uploadSessions.entries()) {
    if (now - session.createdAt > 3600000) {
      uploadSessions.delete(id);
    }
  }
}, 600000);

/**
 * Fast SQL Dump Parser for PostgreSQL / Supabase questions table
 */
export function parseSqlDumpToQuestions(sqlContent: string): Question[] {
  const questions: Question[] = [];
  if (!sqlContent || typeof sqlContent !== 'string') return questions;

  const startVal = sqlContent.indexOf('VALUES');
  if (startVal === -1) return questions;

  const tuples: string[] = [];
  let inTuple = false;
  let currentTuple = '';
  let inString = false;
  let escape = false;

  for (let i = startVal + 6; i < sqlContent.length; i++) {
    const char = sqlContent[i];
    if (inString) {
      currentTuple += char;
      if (char === "'" && !escape) {
        if (i + 1 < sqlContent.length && sqlContent[i + 1] === "'") {
          currentTuple += "'";
          i++;
        } else {
          inString = false;
        }
      } else if (char === '\\') {
        escape = !escape;
      } else {
        escape = false;
      }
    } else {
      if (char === "'") {
        inString = true;
        currentTuple += char;
      } else if (char === '(') {
        if (!inTuple) {
          inTuple = true;
          currentTuple = '';
        } else {
          currentTuple += char;
        }
      } else if (char === ')') {
        if (inTuple) {
          inTuple = false;
          tuples.push(currentTuple);
          currentTuple = '';
        }
      } else if (inTuple) {
        currentTuple += char;
      }
    }
  }

  // Helper to split SQL value tuple by comma outside string quotes
  for (const rawTuple of tuples) {
    const values: string[] = [];
    let val = '';
    let inValStr = false;
    let valEsc = false;

    for (let j = 0; j < rawTuple.length; j++) {
      const c = rawTuple[j];
      if (inValStr) {
        if (c === "'" && !valEsc) {
          if (j + 1 < rawTuple.length && rawTuple[j + 1] === "'") {
            val += "'";
            j++;
          } else {
            inValStr = false;
          }
        } else if (c === '\\') {
          valEsc = !valEsc;
        } else {
          valEsc = false;
          val += c;
        }
      } else {
        if (c === "'") {
          inValStr = true;
        } else if (c === ',') {
          values.push(val.trim());
          val = '';
        } else {
          val += c;
        }
      }
    }
    values.push(val.trim());

    if (values.length >= 3) {
      const id = values[0] || `q-gen-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const subj = values[1] || 'subj-fon';
      const qEn = values[2] || '';
      const qMr = values[3] || qEn;
      const optAEn = values[4] || '';
      const optAMr = values[5] || optAEn;
      const optBEn = values[6] || '';
      const optBMr = values[7] || optBEn;
      const optCEn = values[8] || '';
      const optCMr = values[9] || optCEn;
      const optDEn = values[10] || '';
      const optDMr = values[11] || optDEn;
      const correct = (values[12] || 'A').toUpperCase().replace(/[^A-D]/g, '') || 'A';
      const expEn = values[13] || '';
      const expMr = values[14] || expEn;
      const diff = values[15] || 'medium';

      if (qEn) {
        questions.push({
          id,
          subject_id: subj,
          question_en: qEn,
          question_mr: qMr,
          option_a_en: optAEn,
          option_a_mr: optAMr,
          option_b_en: optBEn,
          option_b_mr: optBMr,
          option_c_en: optCEn,
          option_c_mr: optCMr,
          option_d_en: optDEn,
          option_d_mr: optDMr,
          correct_option: correct as any,
          explanation_en: expEn,
          explanation_mr: expMr,
          difficulty: diff as any,
          status: 'published',
          duplicate_hash: db.computeDuplicateHash(qEn)
        } as any);
      }
    }
  }

  return questions;
}

/**
 * Fast JSON or CSV file parser
 */
export function parseJsonOrCsvToQuestions(content: string, filename: string): Question[] {
  const ext = (filename.split('.').pop() || '').toLowerCase();
  if (ext === 'json') {
    try {
      const data = JSON.parse(content);
      const arr = Array.isArray(data) ? data : (data.questions || []);
      return arr.filter(q => q && q.question_en).map((q, idx) => ({
        id: q.id || `q-imported-${Date.now()}-${idx}`,
        subject_id: q.subject_id || 'subj-fon',
        question_en: q.question_en,
        question_mr: q.question_mr || q.question_en,
        option_a_en: q.option_a_en || q.options?.A?.en || '',
        option_a_mr: q.option_a_mr || q.options?.A?.mr || q.option_a_en || '',
        option_b_en: q.option_b_en || q.options?.B?.en || '',
        option_b_mr: q.option_b_mr || q.options?.B?.mr || q.option_b_en || '',
        option_c_en: q.option_c_en || q.options?.C?.en || '',
        option_c_mr: q.option_c_mr || q.options?.C?.mr || q.option_c_en || '',
        option_d_en: q.option_d_en || q.options?.D?.en || '',
        option_d_mr: q.option_d_mr || q.options?.D?.mr || q.option_d_en || '',
        correct_option: (q.correct_option || 'A').toUpperCase() as any,
        explanation_en: q.explanation_en || '',
        explanation_mr: q.explanation_mr || '',
        difficulty: q.difficulty || 'medium',
        status: 'published',
        duplicate_hash: db.computeDuplicateHash(q.question_en)
      } as any));
    } catch (e) {
      console.warn('JSON parse warning:', e);
      return [];
    }
  } else if (ext === 'sql') {
    return parseSqlDumpToQuestions(content);
  } else {
    // CSV or TXT simple parser
    const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
    const questions: Question[] = [];
    let startIdx = 0;
    if (lines.length > 0 && lines[0].toLowerCase().includes('question')) {
      startIdx = 1;
    }
    for (let i = startIdx; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      if (cols.length >= 2 && cols[1]) {
        questions.push({
          id: `q-csv-${Date.now()}-${i}`,
          subject_id: cols[0] || 'subj-fon',
          question_en: cols[1],
          question_mr: cols[2] || cols[1],
          option_a_en: cols[3] || '',
          option_a_mr: cols[4] || cols[3] || '',
          option_b_en: cols[5] || '',
          option_b_mr: cols[6] || cols[5] || '',
          option_c_en: cols[7] || '',
          option_c_mr: cols[8] || cols[7] || '',
          option_d_en: cols[9] || '',
          option_d_mr: cols[10] || cols[9] || '',
          correct_option: (cols[11] || 'A').toUpperCase() as any,
          explanation_en: cols[12] || '',
          explanation_mr: cols[13] || '',
          difficulty: 'medium',
          status: 'published',
          duplicate_hash: db.computeDuplicateHash(cols[1])
        } as any);
      }
    }
    return questions;
  }
}

/**
 * Creates an upload/sync session
 */
export function createUploadSession(
  questions: Question[],
  filename: string = 'local_questions_db.sql',
  batchSize: number = 300
): UploadSession {
  const sessionId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const totalQuestions = questions.length;
  const totalBatches = Math.ceil(totalQuestions / batchSize) || 1;

  const session: UploadSession = {
    sessionId,
    filename,
    questions,
    totalQuestions,
    batchSize,
    totalBatches,
    createdAt: Date.now()
  };

  uploadSessions.set(sessionId, session);
  return session;
}

export function getUploadSession(sessionId: string): UploadSession | undefined {
  return uploadSessions.get(sessionId);
}

export function deleteUploadSession(sessionId: string): boolean {
  return uploadSessions.delete(sessionId);
}

/**
 * Processes a single batch asynchronously
 */
export async function processUploadBatch(params: {
  sessionId: string;
  batchIndex: number;
  pushToSupabase?: boolean;
  saveToLocal?: boolean;
  customUrl?: string;
  customKey?: string;
}) {
  const session = uploadSessions.get(params.sessionId);
  if (!session) {
    throw new Error('Upload session expired or invalid. Please re-upload the file.');
  }

  const batchIndex = Math.max(0, Math.min(params.batchIndex, session.totalBatches - 1));
  const startIdx = batchIndex * session.batchSize;
  const endIdx = Math.min(startIdx + session.batchSize, session.totalQuestions);
  const batch = session.questions.slice(startIdx, endIdx);

  let addedLocal = 0;
  let pushedSupabase = 0;

  // 1. Save to Local DB
  if (params.saveToLocal !== false) {
    for (const q of batch) {
      db.addQuestion(q);
      addedLocal++;
    }
  }

  // 2. Push to Supabase if configured & requested
  if (params.pushToSupabase !== false) {
    const config = getSupabaseConfig(params.customUrl, params.customKey);
    if (config.isConfigured && batch.length > 0) {
      try {
        const headers: Record<string, string> = {
          'apikey': config.key,
          'Authorization': `Bearer ${config.key}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=representation'
        };

        const payload = batch.map(q => ({
          id: q.id,
          subject_id: q.subject_id,
          question_en: q.question_en,
          question_mr: q.question_mr,
          option_a_en: q.option_a_en,
          option_a_mr: q.option_a_mr,
          option_b_en: q.option_b_en,
          option_b_mr: q.option_b_mr,
          option_c_en: q.option_c_en,
          option_c_mr: q.option_c_mr,
          option_d_en: q.option_d_en,
          option_d_mr: q.option_d_mr,
          correct_option: q.correct_option,
          explanation_en: q.explanation_en,
          explanation_mr: q.explanation_mr,
          difficulty: q.difficulty,
          exam_name: q.exam_name || 'AIIMS NORCET / DMER / CHO',
          image_url: q.image_url || '',
          status: q.status || 'published',
          duplicate_hash: q.duplicate_hash || db.computeDuplicateHash(q.question_en)
        }));

        const resp = await fetch(`${config.url}/rest/v1/questions`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });

        if (resp.ok || resp.status === 201 || resp.status === 200) {
          pushedSupabase = batch.length;
        } else {
          console.warn(`Supabase batch ${batchIndex} push status HTTP ${resp.status}`);
        }
      } catch (err: any) {
        console.warn(`Supabase batch ${batchIndex} push notice:`, err?.message || err);
      }
    }
  }

  const processedCount = endIdx;
  const percentage = Math.min(100, Math.round((processedCount / session.totalQuestions) * 100));

  return {
    success: true,
    sessionId: session.sessionId,
    batchIndex,
    totalBatches: session.totalBatches,
    batchSize: session.batchSize,
    processedCount,
    totalQuestions: session.totalQuestions,
    percentage,
    isComplete: batchIndex === session.totalBatches - 1 || processedCount >= session.totalQuestions,
    addedLocal,
    pushedSupabase
  };
}
