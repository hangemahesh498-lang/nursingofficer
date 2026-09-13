export type Role = 'student' | 'content_editor' | 'reviewer' | 'admin' | 'super_admin';

export type ExamTrack = 'norcet' | 'maha_staff_nurse' | 'both';

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
  // Device-lock (single active device per account)
  deviceId?: string;
  deviceName?: string;
  deviceBoundAt?: string;
  // Password auth (server never sends passwordHash/passwordSalt to the client)
  passwordHash?: string;
  passwordSalt?: string;
}

export type QuestionType =
  | 'single_best'
  | 'multiple_response'
  | 'true_false'
  | 'clinical_scenario'
  | 'clinical_case'
  | 'case_study'
  | 'image_based'
  | 'ecg_based'
  | 'instrument_id'
  | 'drug_id'
  | 'lab_interpretation'
  | 'calculation'
  | 'match_following'
  | 'assertion_reasoning'
  | 'assertion_reason'
  | 'statement_based'
  | 'pyq';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type QuestionStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'archived' | 'rejected';

export interface CloudinaryImageMeta {
  url: string;
  public_id: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
  alt_text?: string;
}

export interface Question {
  id: string;
  subject_id: string;
  chapter_id?: string;
  topic_id?: string;
  subtopic_id?: string;
  exam_target?: ExamTrack | string;
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
  source?: string;
  source_reference?: string;
  image_url?: string;
  image_public_id?: string;
  image_width?: number;
  image_height?: number;
  image_format?: string;
  image_size?: number;
  image_alt_text?: string;
  case_id?: string;
  status: QuestionStatus;
  priority?: 'high' | 'medium' | 'normal';
  is_pyq?: boolean;
  is_verified_pyq?: boolean;
  is_free?: boolean;
  created_by?: string;
  updated_by?: string;
  reviewed_by?: string;
  approved_at?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  version: number;
  duplicate_hash?: string;
  review_status?: string;
  review_notes?: string;
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
  image_url?: string;
  image_public_id?: string;
  image_alt_text?: string;
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
  freeQuestionsCount?: number;
  category: 'core_nursing' | 'allied_health' | 'aptitude_gk';
  exam_track?: ExamTrack;
}

export interface Chapter {
  id: string;
  subject_id: string;
  name_en: string;
  name_mr: string;
  description?: string;
  order_index?: number;
  totalQuestions?: number;
  freeQuestionsCount?: number;
}

export interface Topic {
  id: string;
  chapter_id: string;
  subject_id: string;
  name_en: string;
  name_mr: string;
  description?: string;
  order_index?: number;
  totalQuestions?: number;
  freeQuestionsCount?: number;
}

export interface Subtopic {
  id: string;
  topic_id: string;
  name_en: string;
  name_mr: string;
}

export interface SyllabusGapItem {
  subject_id: string;
  subject_name: string;
  chapter_id: string;
  chapter_name: string;
  topic_id: string;
  topic_name: string;
  total_questions: number;
  published_questions: number;
  has_pyq: boolean;
  has_image_question: boolean;
  has_clinical_case: boolean;
  gap_status: 'critical_zero' | 'low_count' | 'adequate' | 'rich';
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

export interface PaymentPlan {
  id: string;
  name: string;
  name_mr?: string;
  price: number;
  currency: string;
  duration_days: number;
  duration_label: string;
  duration_label_mr?: string;
  is_active: boolean;
  features: string[];
  features_mr?: string[];
  popular?: boolean;
}

export type PaymentStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'REFUNDED';
export type PaymentMode = 'MANUAL_QR' | 'RAZORPAY';

export interface PaymentRecord {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  plan_id: string;
  plan_name: string;
  amount: number;
  currency: string;
  payment_method: 'MANUAL_QR' | 'RAZORPAY';
  utr_number: string;
  screenshot_url?: string;
  screenshot_public_id?: string;
  status: PaymentStatus;
  admin_reviewer_id?: string;
  admin_reviewer_name?: string;
  admin_notes?: string;
  rejection_reason?: string;
  submitted_at: string;
  verified_at?: string;
  expires_at?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  title_mr?: string;
  description: string;
  description_mr?: string;
  category: 'notes' | 'syllabus' | 'recruitment_notice' | 'official_notification' | 'clinical_guide';
  exam: string;
  subject_id?: string;
  file_url: string;
  file_name: string;
  file_size_mb?: number;
  source: string;
  is_premium: boolean;
  is_published: boolean;
  year?: number;
  created_at: string;
}

export interface RecruitmentNotice {
  id: string;
  organization: string; // AIIMS, ESIC, RRB, Maharashtra DMER, etc.
  post_name: string;
  year: number;
  notification_date: string;
  application_start_date: string;
  application_end_date: string;
  total_vacancies: number;
  eligibility_summary: string;
  qualification_details: string;
  age_limit: string;
  experience_required: string;
  application_fee: string;
  exam_pattern_summary: string;
  official_website: string;
  source_document_url?: string;
  source_disclaimer: string;
  status: 'active' | 'upcoming' | 'closed';
}

export interface SystemSettings {
  app_name: string;
  app_logo_url?: string;
  support_email: string;
  support_phone?: string;
  support_hours?: string;
  default_language: 'en' | 'mr';
  allow_registration: boolean;
  maintenance_mode: boolean;
  maintenance_message?: string;
  default_negative_marking: number;
  ai_rate_limit_per_user_per_day: number;
  enable_ai_question_generation: boolean;
  enable_ai_study_coach: boolean;
  
  // Telegram Smart System
  telegram_username?: string;
  telegram_contact_url?: string;
  telegram_group_url?: string;
  telegram_channel_url?: string;
  telegram_support_message?: string;

  // Payment & QR Settings
  premium_enabled: boolean;
  payment_mode: PaymentMode; // MANUAL_QR or RAZORPAY
  manual_qr_enabled: boolean;
  razorpay_enabled: boolean;
  razorpay_key_id?: string;
  razorpay_key_secret?: string;
  currency: string;
  upi_id: string;
  receiver_name: string;
  custom_qr_image_url?: string;
  custom_qr_public_id?: string;
  payment_instructions_en: string;
  payment_instructions_mr: string;
  announcement_banner?: string;
  announcement_banner_active?: boolean;

  // AI Question Ingestion & Auto-Verification Settings
  ai_import_settings?: AdminAiImportSettings;
}

export type ImportProcessingMode = 'fast' | 'balanced' | 'strict';
export type ImportFileType = 'json' | 'excel' | 'csv' | 'pdf' | 'image' | 'images' | 'zip' | 'raw_text';
export type ImportedQuestionStatus = 'auto_approved' | 'review_required' | 'rejected' | 'duplicate' | 'approved_by_admin' | 'conflict';

export type ImportFlag =
  | 'ANSWER_CONFLICT'
  | 'LOW_CONFIDENCE'
  | 'POSSIBLE_DUPLICATE'
  | 'OCR_LOW_QUALITY'
  | 'INCOMPLETE_OPTIONS'
  | 'MISSING_ANSWER'
  | 'MEDICAL_REVIEW_REQUIRED'
  | 'AMBIGUOUS_QUESTION'
  | 'FORMATTING_ERROR'
  | 'DOSAGE_WARNING';

export interface AdminAiImportSettings {
  autoApprovalEnabled: boolean;
  minAutoApprovalConfidence: number; // e.g. 90
  minQualityScore: number; // e.g. 85
  autoDuplicateDetection: boolean;
  autoExplanationGeneration: boolean;
  autoSubjectDetection: boolean;
  autoTopicDetection: boolean;
  medicalSafetyReview: boolean;
  autoPublish: boolean;
  processingMode: ImportProcessingMode;
  duplicateSimilarityThreshold: number; // e.g. 0.85
}

export interface ImportedQuestionItem {
  id: string;
  batchId: string;
  sourceType: ImportFileType;
  sourceFile: string;
  sourcePage?: number;
  sourceQuestionNumber?: string;
  originalText?: string;
  processedText?: string;
  imageUrl?: string;
  imagePublicId?: string;

  // Question stems
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

  // Answers & Rationales
  sourceAnswer: 'A' | 'B' | 'C' | 'D' | null;
  aiAnswer?: 'A' | 'B' | 'C' | 'D';
  aiConfidence: number; // 0 - 100
  qualityScore: number; // 0 - 100
  aiExplanation?: string;
  sourceExplanation?: string;
  explanation_en?: string;
  explanation_mr?: string;

  // Taxonomy & Classification
  detectedSubjectId?: string;
  detectedSubjectName?: string;
  detectedChapterId?: string;
  detectedTopicId?: string;
  detectedTopicName?: string;
  detectedSubtopic?: string;
  difficulty: QuestionDifficulty;
  questionType: QuestionType;
  examName?: string;
  examYear?: number;
  tags?: string[];

  // Verification & Status
  verificationStatus: ImportedQuestionStatus;
  flags: ImportFlag[];
  confidenceLevel: 'high' | 'good' | 'review_recommended' | 'manual_review_required';
  duplicateMatchId?: string;
  duplicateOfQuestionId?: string;
  duplicateSimilarity?: number;
  correctionsApplied?: string[];
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  publishedQuestionId?: string;
}

export interface ImportBatch {
  id: string; // e.g. IMP-2026-000145
  fileName: string;
  fileType: ImportFileType;
  fileSizeMb?: number;
  uploadedBy: string;
  uploadedByName: string;
  createdAt: string;
  updatedAt: string;
  status: 'processing' | 'completed' | 'failed' | 'cancelled';
  totalDetected: number;
  autoApprovedCount: number;
  reviewRequiredCount: number;
  rejectedCount: number;
  duplicateCount: number;
  conflictCount: number;
  lowConfidenceCount: number;
  ocrFailedCount: number;
  processingTimeMs: number;
  mode: ImportProcessingMode;
  settings: AdminAiImportSettings;
  targetSubjectId?: string;
  examName?: string;
  questions: ImportedQuestionItem[];
  errorSummary?: string;
}

