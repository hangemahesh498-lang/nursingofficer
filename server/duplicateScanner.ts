import { Question } from '../src/types/index.ts';

export interface DuplicateMatch {
  id: string;
  originalQuestion: {
    id: string;
    question_en: string;
    question_mr?: string;
    subject_id: string;
    subject_name?: string;
    correct_option: string;
    options: string[];
    explanation_en?: string;
    explanation_mr?: string;
    created_at?: string;
  };
  duplicateQuestion: {
    id: string;
    question_en: string;
    question_mr?: string;
    subject_id: string;
    subject_name?: string;
    correct_option: string;
    options: string[];
    explanation_en?: string;
    explanation_mr?: string;
    created_at?: string;
  };
  similarity: number;
  matchType: 'EXACT' | 'HIGH_SIMILARITY' | 'SAME_STEM_DIFF_OPTIONS';
  reason_en: string;
  reason_mr: string;
}

export interface DuplicateReport {
  totalDuplicates: number;
  exactMatchesCount: number;
  similarMatchesCount: number;
  affectedSubjectsCount: number;
  subjectDuplicateCounts: Record<string, number>;
  duplicates: DuplicateMatch[];
}

function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculateJaccardSimilarity(str1: string, str2: string): number {
  const norm1 = normalizeText(str1);
  const norm2 = normalizeText(str2);
  if (norm1 === norm2 && norm1.length > 0) return 1.0;

  const words1 = new Set(norm1.split(' ').filter(w => w.length > 2));
  const words2 = new Set(norm2.split(' ').filter(w => w.length > 2));

  if (words1.size === 0 || words2.size === 0) return 0;

  let intersection = 0;
  words1.forEach(w => {
    if (words2.has(w)) intersection++;
  });

  const union = words1.size + words2.size - intersection;
  return union > 0 ? Number((intersection / union).toFixed(2)) : 0;
}

export function scanDuplicates(questions: Question[], subjectNameMap: Map<string, string>): DuplicateReport {
  const duplicates: DuplicateMatch[] = [];
  const subjectDuplicateCounts: Record<string, number> = {};

  const seenExactMap = new Map<string, Question>();

  for (let i = 0; i < questions.length; i++) {
    const q1 = questions[i];
    if (!q1 || !q1.question_en) continue;

    const normEn = normalizeText(q1.question_en);
    if (normEn.length > 10) {
      if (seenExactMap.has(normEn)) {
        const qOriginal = seenExactMap.get(normEn)!;
        if (qOriginal.id !== q1.id) {
          const match: DuplicateMatch = {
            id: `dup-${qOriginal.id}-${q1.id}`,
            originalQuestion: {
              id: qOriginal.id,
              question_en: qOriginal.question_en,
              question_mr: qOriginal.question_mr,
              subject_id: qOriginal.subject_id,
              subject_name: subjectNameMap.get(qOriginal.subject_id) || qOriginal.subject_id,
              correct_option: qOriginal.correct_option,
              options: [qOriginal.option_a_en, qOriginal.option_b_en, qOriginal.option_c_en, qOriginal.option_d_en],
              explanation_en: qOriginal.explanation_en,
              explanation_mr: qOriginal.explanation_mr,
              created_at: qOriginal.created_at
            },
            duplicateQuestion: {
              id: q1.id,
              question_en: q1.question_en,
              question_mr: q1.question_mr,
              subject_id: q1.subject_id,
              subject_name: subjectNameMap.get(q1.subject_id) || q1.subject_id,
              correct_option: q1.correct_option,
              options: [q1.option_a_en, q1.option_b_en, q1.option_c_en, q1.option_d_en],
              explanation_en: q1.explanation_en,
              explanation_mr: q1.explanation_mr,
              created_at: q1.created_at
            },
            similarity: 1.0,
            matchType: 'EXACT',
            reason_en: 'Exact identical question stem detected.',
            reason_mr: 'हुबेहूब समान इंग्रजी प्रश्न आधीपासून अस्तित्वात आहे.'
          };
          duplicates.push(match);
          subjectDuplicateCounts[q1.subject_id] = (subjectDuplicateCounts[q1.subject_id] || 0) + 1;
        }
      } else {
        seenExactMap.set(normEn, q1);
      }
    }
  }

  // Scan for high similarity (> 82%) among remaining questions (up to 300 pairwise checks)
  const maxChecks = Math.min(questions.length, 250);
  for (let i = 0; i < maxChecks; i++) {
    const q1 = questions[i];
    for (let j = i + 1; j < maxChecks; j++) {
      const q2 = questions[j];
      if (q1.id === q2.id) continue;
      // Skip if already in exact matches
      if (duplicates.some(d => (d.originalQuestion.id === q1.id && d.duplicateQuestion.id === q2.id) || (d.originalQuestion.id === q2.id && d.duplicateQuestion.id === q1.id))) {
        continue;
      }

      const simEn = calculateJaccardSimilarity(q1.question_en, q2.question_en);
      const simMr = (q1.question_mr && q2.question_mr) ? calculateJaccardSimilarity(q1.question_mr, q2.question_mr) : 0;
      const maxSim = Math.max(simEn, simMr);

      if (maxSim >= 0.82) {
        const match: DuplicateMatch = {
          id: `dup-sim-${q1.id}-${q2.id}`,
          originalQuestion: {
            id: q1.id,
            question_en: q1.question_en,
            question_mr: q1.question_mr,
            subject_id: q1.subject_id,
            subject_name: subjectNameMap.get(q1.subject_id) || q1.subject_id,
            correct_option: q1.correct_option,
            options: [q1.option_a_en, q1.option_b_en, q1.option_c_en, q1.option_d_en],
            explanation_en: q1.explanation_en,
            explanation_mr: q1.explanation_mr,
            created_at: q1.created_at
          },
          duplicateQuestion: {
            id: q2.id,
            question_en: q2.question_en,
            question_mr: q2.question_mr,
            subject_id: q2.subject_id,
            subject_name: subjectNameMap.get(q2.subject_id) || q2.subject_id,
            correct_option: q2.correct_option,
            options: [q2.option_a_en, q2.option_b_en, q2.option_c_en, q2.option_d_en],
            explanation_en: q2.explanation_en,
            explanation_mr: q2.explanation_mr,
            created_at: q2.created_at
          },
          similarity: maxSim,
          matchType: 'HIGH_SIMILARITY',
          reason_en: `High similarity (${Math.round(maxSim * 100)}%) detected in question statements.`,
          reason_mr: `प्रश्नांच्या रचनेत ${Math.round(maxSim * 100)}% समानता आढळली.`
        };
        duplicates.push(match);
        subjectDuplicateCounts[q2.subject_id] = (subjectDuplicateCounts[q2.subject_id] || 0) + 1;
      }
    }
  }

  const exactMatchesCount = duplicates.filter(d => d.matchType === 'EXACT').length;
  const similarMatchesCount = duplicates.filter(d => d.matchType === 'HIGH_SIMILARITY').length;

  return {
    totalDuplicates: duplicates.length,
    exactMatchesCount,
    similarMatchesCount,
    affectedSubjectsCount: Object.keys(subjectDuplicateCounts).length,
    subjectDuplicateCounts,
    duplicates
  };
}
