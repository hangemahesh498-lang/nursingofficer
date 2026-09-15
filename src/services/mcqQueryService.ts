import { Question, Chapter, Topic, Subject } from '../types';

export interface McqQueryFilters {
  subject_id?: string;
  chapter_id?: string;
  topic_id?: string;
  difficulty?: string;
  status?: string;
  is_verified_pyq?: boolean;
  is_free?: boolean;
  case_id?: string;
  search?: string;
}

/**
 * Authoritative client & shared MCQ filtering function.
 * Matches questions exactly as the server database query does.
 */
export function filterQuestions(
  questions: Question[],
  filters: McqQueryFilters = {},
  chapters: Chapter[] = [],
  topics: Topic[] = []
): Question[] {
  if (!Array.isArray(questions)) return [];

  const targetStatus = filters.status !== undefined ? filters.status : 'published';

  return questions.filter(q => {
    if (!q || !q.id) return false;

    // Status filter (default to published)
    if (targetStatus && targetStatus !== 'all') {
      const qStatus = q.status || 'published';
      if (targetStatus === 'published') {
        if (qStatus !== 'published') return false;
      } else {
        if (qStatus !== targetStatus) return false;
      }
    }

    // Subject filter
    if (filters.subject_id && filters.subject_id !== 'all') {
      const targetSub = filters.subject_id;
      const isDirectSub = q.subject_id === targetSub;
      const isChapterSub = Boolean(
        q.chapter_id && chapters.some(c => c.id === q.chapter_id && c.subject_id === targetSub)
      );
      if (!isDirectSub && !isChapterSub) return false;
    }

    // Chapter filter (exact chapter match)
    if (filters.chapter_id && filters.chapter_id !== 'all') {
      if (q.chapter_id !== filters.chapter_id) return false;
    }

    // Topic filter (exact topic match)
    if (filters.topic_id && filters.topic_id !== 'all') {
      if (q.topic_id !== filters.topic_id) return false;
    }

    // Difficulty filter
    if (filters.difficulty && filters.difficulty !== 'all') {
      if (q.difficulty !== filters.difficulty) return false;
    }

    // PYQ filter
    if (filters.is_verified_pyq !== undefined) {
      if (Boolean(q.is_verified_pyq) !== Boolean(filters.is_verified_pyq)) return false;
    }

    // Free filter
    if (filters.is_free !== undefined) {
      if (Boolean(q.is_free) !== Boolean(filters.is_free)) return false;
    }

    // Case study filter
    if (filters.case_id) {
      if (q.case_id !== filters.case_id) return false;
    }

    // Search query filter
    if (filters.search && filters.search.trim()) {
      const query = filters.search.trim().toLowerCase();
      const textEn = (q.question_en || '').toLowerCase();
      const textMr = (q.question_mr || '').toLowerCase();
      const expEn = (q.explanation_en || '').toLowerCase();
      const expMr = (q.explanation_mr || '').toLowerCase();
      if (!textEn.includes(query) && !textMr.includes(query) && !expEn.includes(query) && !expMr.includes(query)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Calculate published questions count for a specific subject
 */
export function getSubjectQuestionCount(
  subjectId: string,
  questions: Question[],
  chapters: Chapter[] = []
): number {
  return filterQuestions(questions, { subject_id: subjectId, status: 'published' }, chapters).length;
}

/**
 * Calculate published questions count for a specific chapter
 */
export function getChapterQuestionCount(
  chapterId: string,
  questions: Question[]
): number {
  return filterQuestions(questions, { chapter_id: chapterId, status: 'published' }).length;
}

/**
 * Calculate published questions count for a specific topic
 */
export function getTopicQuestionCount(
  topicId: string,
  questions: Question[]
): number {
  return filterQuestions(questions, { topic_id: topicId, status: 'published' }).length;
}

/**
 * Calculate total master practice questions available
 */
export function getMasterPracticeCount(questions: Question[]): number {
  return filterQuestions(questions, { status: 'published' }).length;
}
