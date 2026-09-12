export type Role = 'student' | 'content_editor' | 'reviewer' | 'admin' | 'super_admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  targetExam?: string;
  preferredLanguage: 'en' | 'mr';
  dailyTarget: number;
  streakDays: number;
  points: number;
  isPremium?: boolean;
  createdAt: string;
}

export type QuestionType =
  | 'single_best'
  | 'clinical_case'
  | 'image_based'
  | 'assertion_reason'
  | 'statement_based'
  | 'pyq';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type QuestionStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'archived';

export interface Question {
  id: string;
  subject_id: string;
  chapter_id?: string;
  topic_id?: string;
  subtopic_id?: string;
  question_en: string;
  question_mr?: string;
  option_a_en: string;
  option_a_mr?: string;
  option_b_en: string;
  option_b_mr?: string;
  option_c_en: string;
  option_c_mr?: string;
  option_d_en: string;
  option_d_mr?: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation_en: string;
  explanation_mr?: string;
  difficulty: QuestionDifficulty;
  question_type: QuestionType;
  exam_tags?: string[];
  exam_name?: string;
  exam_year?: number;
  shift?: string;
  source_reference?: string;
  image_url?: string;
  case_id?: string;
  status: QuestionStatus;
  is_verified_pyq?: boolean;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  version: number;
  duplicate_hash?: string;
  review_status?: string;
  review_notes?: string;
  published_at?: string;
}

export interface CaseStudy {
  id: string;
  title_en: string;
  title_mr?: string;
  patient_age: number;
  patient_gender: 'Male' | 'Female' | 'Other' | 'Infant' | 'Pediatric' | 'Geriatric';
  chief_complaint_en: string;
  chief_complaint_mr?: string;
  history_and_vitals_en: string;
  history_and_vitals_mr?: string;
  clinical_investigations_en?: string;
  clinical_investigations_mr?: string;
  status: QuestionStatus;
  created_at: string;
  question_ids: string[];
}

export interface Subject {
  id: string;
  name_en: string;
  name_mr: string;
  description_en: string;
  description_mr: string;
  icon: string;
  totalQuestions: number;
  category: 'core_nursing' | 'allied_health' | 'aptitude_gk';
}

export interface MockTest {
  id: string;
  title_en: string;
  title_mr: string;
  exam_name: string;
  description: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
  negative_marking_rate: number; // e.g. 0.33 for 1/3rd penalty
  question_ids: string[];
  is_published: boolean;
  is_premium: boolean;
  created_at: string;
}

export interface AttemptAnswer {
  question_id: string;
  selected_option: 'A' | 'B' | 'C' | 'D' | null;
  is_correct: boolean;
  time_spent_seconds: number;
  is_marked_for_review: boolean;
}

export interface TestAttempt {
  id: string;
  test_id: string;
  test_title: string;
  user_id: string;
  user_name: string;
  started_at: string;
  completed_at: string;
  time_spent_seconds: number;
  score: number;
  total_marks: number;
  correct_count: number;
  wrong_count: number;
  unattempted_count: number;
  accuracy_percentage: number;
  answers: AttemptAnswer[];
}

export interface MistakeRecord {
  id: string;
  user_id: string;
  question_id: string;
  first_wrong_at: string;
  last_wrong_at: string;
  wrong_count: number;
  notes?: string;
  is_mastered: boolean;
  mastered_at?: string;
  revision_interval_days: number; // 1, 3, 7, 15, 30
  next_revision_due: string;
}

export interface BookmarkRecord {
  id: string;
  user_id: string;
  question_id: string;
  created_at: string;
  notes?: string;
}

export interface QuestionReport {
  id: string;
  question_id: string;
  user_id: string;
  user_name: string;
  reason:
    | 'wrong_answer'
    | 'wrong_explanation'
    | 'duplicate'
    | 'typographical_error'
    | 'ambiguous'
    | 'translation_problem'
    | 'image_problem'
    | 'other';
  details: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'rejected';
  resolution_notes?: string;
  created_at: string;
  resolved_at?: string;
}

export interface AuditLogEntry {
  id: string;
  actor_id: string;
  actor_name: string;
  actor_role: string;
  action: string;
  entity: string;
  entity_id: string;
  details: string;
  created_at: string;
}

export interface SystemSettings {
  app_name: string;
  default_language: 'en' | 'mr';
  allow_registration: boolean;
  maintenance_mode: boolean;
  default_negative_marking: number;
  ai_rate_limit_per_user_per_day: number;
  enable_ai_question_generation: boolean;
  enable_ai_study_coach: boolean;
}
