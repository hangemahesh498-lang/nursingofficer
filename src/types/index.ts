export type UserRole = 'student' | 'content_editor' | 'reviewer' | 'admin' | 'super_admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  preferredLanguage: 'en' | 'mr';
  targetExam?: string;
  dailyTarget?: number;
  streakDays?: number;
  points?: number;
  isPremium?: boolean;
  premiumExpiry?: string;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Subject {
  id: string;
  name_en: string;
  name_mr: string;
  code: string;
  description_en: string;
  description_mr: string;
  icon_name: string;
  color: string;
  is_active: boolean;
  total_questions_count?: number;
  total_chapters_count?: number;
  category?: 'nursing' | 'non_nursing' | 'exam_specific';
}

export interface Chapter {
  id: string;
  subject_id: string;
  name_en: string;
  name_mr: string;
  chapter_number: number;
  description_en?: string;
  description_mr?: string;
  is_active: boolean;
  total_questions_count?: number;
}

export interface Topic {
  id: string;
  chapter_id: string;
  name_en: string;
  name_mr: string;
  topic_number: number;
  is_active: boolean;
}

export interface Subtopic {
  id: string;
  topic_id: string;
  name_en: string;
  name_mr: string;
  is_active: boolean;
}

export type QuestionDifficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type QuestionType = 'single_choice' | 'multiple_choice' | 'image_based' | 'scenario_based';

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
  explanation_en?: string;
  explanation_mr?: string;
  difficulty: QuestionDifficulty;
  question_type: QuestionType;
  image_url?: string;
  exam_tags?: string[];
  pyq_exam_name?: string;
  pyq_year?: number;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  verification_status?: 'verified' | 'pending' | 'flagged';
}

export interface CaseStudy {
  id: string;
  title_en: string;
  title_mr: string;
  clinical_scenario_en: string;
  clinical_scenario_mr: string;
  subject_id: string;
  question_ids: string[];
  created_at: string;
}

export interface MockTest {
  id: string;
  title_en: string;
  title_mr: string;
  description_en: string;
  description_mr: string;
  exam_type: string;
  total_questions: number;
  time_limit_minutes: number;
  total_marks: number;
  negative_marking_ratio: number;
  question_ids: string[];
  is_free: boolean;
  is_active: boolean;
  scheduled_start?: string;
  created_at: string;
}

export interface TestAttempt {
  id: string;
  user_id: string;
  mock_test_id: string;
  score: number;
  total_marks: number;
  percentage: number;
  time_taken_seconds: number;
  user_answers: Record<string, string>;
  correct_count: number;
  incorrect_count: number;
  unanswered_count: number;
  completed_at: string;
}

export interface MistakeRecord {
  id: string;
  user_id: string;
  question_id: string;
  selected_option: string;
  attempted_at: string;
}

export interface BookmarkRecord {
  id: string;
  user_id: string;
  question_id: string;
  created_at: string;
}

export interface QuestionReport {
  id: string;
  question_id: string;
  user_id: string;
  issue_type: 'typo' | 'wrong_answer' | 'bad_explanation' | 'other';
  comment: string;
  status: 'pending' | 'resolved' | 'rejected';
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  actor_id: string;
  actor_name: string;
  actor_role: string;
  action: string;
  target_type: string;
  target_id: string;
  details: string;
  timestamp: string;
}

export interface SystemSettings {
  app_name: string;
  maintenance_mode: boolean;
  allow_guest_mode: boolean;
  free_questions_limit_per_topic: number;
  daily_quiz_question_count: number;
  default_language: 'en' | 'mr';
  contact_email: string;
  support_phone: string;
}

export interface SyllabusGapItem {
  id: string;
  subject_name: string;
  topic_name: string;
  missing_question_count: number;
  priority: 'high' | 'medium' | 'low';
}

export type PlanType =
  | 'FREE'
  | 'EXAM_SPECIFIC'
  | 'ALL_EXAMS'
  | 'SUBJECT_MCQ'
  | 'MOCK_TEST'
  | 'PRO_MCQ'
  | 'TEST_SERIES'
  | 'COMBO';

export interface PaymentPlan {
  id: string;
  name: string;
  name_en?: string;
  name_mr: string;
  price: number;
  price_inr?: number;
  currency?: string;
  duration_days: number;
  duration_label?: string;
  duration_label_mr?: string;
  plan_type: PlanType;
  included_exams?: string[];
  has_mcq_access?: boolean;
  has_mock_test_access?: boolean;
  has_explanations_access?: boolean;
  features: string[];
  features_en?: string[];
  features_mr: string[];
  popular?: boolean;
  is_popular?: boolean;
  is_active: boolean;
  tax_label?: string;
  fulfillment_note?: string;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  plan_id: string;
  plan_name?: string;
  amount: number;
  amount_inr?: number;
  currency?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FAILED' | 'success' | 'pending' | 'failed';
  payment_method: 'MANUAL_QR' | 'RAZORPAY';
  utr_number: string;
  transaction_id?: string;
  order_id?: string;
  screenshot_url?: string;
  screenshot_public_id?: string;
  admin_reviewer_id?: string;
  admin_reviewer_name?: string;
  admin_notes?: string;
  submitted_at: string;
  verified_at?: string;
  expires_at?: string;
  created_at?: string;
}

export interface EntitlementRecord {
  id: string;
  user_id: string;
  plan_id: string;
  plan_type: PlanType;
  included_exams: string[];
  has_mcq_access: boolean;
  has_mock_test_access: boolean;
  has_explanations_access: boolean;
  starts_at: string;
  expires_at: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  created_at: string;
  updated_at: string;
}

export interface OrderRecord {
  id: string;
  user_id: string;
  plan_id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: 'CREATED' | 'PAID' | 'FAILED' | 'EXPIRED';
  receipt?: string;
  promo_code?: string;
  discount_amount?: number;
  created_at: string;
  updated_at: string;
}

export interface WebhookEventRecord {
  id: string;
  event_id: string;
  event_type: string;
  payload: any;
  processed: boolean;
  processed_at?: string;
  created_at: string;
}

export interface StudyMaterial {
  id: string;
  title_en: string;
  title_mr: string;
  subject_id: string;
  chapter_id?: string;
  category: 'ebook' | 'flashcard' | 'notes' | 'pyq_paper' | 'summary_pdf';
  file_url: string;
  file_size_mb?: number;
  file_type?: string;
  exam_name?: string;
  exam_year?: number;
  is_free: boolean;
  created_at: string;
}

export interface RecruitmentNotice {
  id: string;
  organization: string;
  organization_mr?: string;
  post_name: string;
  post_name_mr?: string;
  year: number;
  notification_date: string;
  application_start_date: string;
  application_end_date: string;
  total_vacancies: number;
  eligibility_summary: string;
  eligibility_summary_mr?: string;
  qualification_details: string;
  qualification_details_mr?: string;
  age_limit: string;
  experience_required: string;
  application_fee: string;
  exam_pattern_summary: string;
  official_website: string;
  source_document_url?: string;
  source_disclaimer: string;
  status: 'active' | 'upcoming' | 'expired';
}

export type ImportFileType = 'pdf' | 'docx' | 'txt' | 'csv' | 'xlsx' | 'json' | 'zip' | 'image';
export type ImportFlag = 'duplicate' | 'missing_options' | 'bad_answer' | 'formatting_issue';

export interface ImportBatch {
  id: string;
  file_name: string;
  file_type: ImportFileType;
  file_size_bytes: number;
  uploaded_by: string;
  mode: 'manual_subject' | 'auto_detect' | 'pyq_upload';
  target_subject_id?: string;
  pyq_exam_name?: string;
  pyq_year?: number;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  total_questions_found: number;
  imported_count: number;
  duplicate_count: number;
  flagged_count: number;
  progress_percent: number;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export interface ImportedQuestionItem {
  id: string;
  batch_id: string;
  parsed_question: Partial<Question>;
  confidence_score: number;
  flags: ImportFlag[];
  duplicate_of_id?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AdminAiImportSettings {
  autoApprovalEnabled: boolean;
  minAutoApprovalConfidence: number;
  minQualityScore: number;
  autoDuplicateDetection: boolean;
  autoExplanationGeneration: boolean;
  autoSubjectDetection: boolean;
  autoTopicDetection: boolean;
  medicalSafetyReview: boolean;
  autoPublish: boolean;
  processingMode: 'accurate' | 'balanced' | 'fast';
  duplicateSimilarityThreshold: number;
}

export interface PromoAd {
  id: string;
  title_en: string;
  title_mr: string;
  description_en: string;
  description_mr: string;
  aspect_ratio: string;
  media_type: 'image' | 'video';
  video_url?: string;
  image_url?: string;
  thumbnail_url?: string;
  cta_text_en: string;
  cta_text_mr: string;
  cta_link: string;
  target_screen: string;
  is_active: boolean;
}

export interface PushNotification {
  id: string;
  title_en: string;
  title_mr?: string;
  body_en: string;
  body_mr?: string;
  target_role?: string;
  sent_at: string;
  sent_by: string;
  delivered_count: number;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_percentage?: number;
  discount_flat_inr?: number;
  discount_type?: 'percentage' | 'flat';
  discount_value?: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  max_uses?: number;
  usage_limit?: number;
  used_count?: number;
  usage_count?: number;
  is_active: boolean;
  is_secret?: boolean;
  is_hidden?: boolean;
  expires_at?: string;
  valid_till?: string;
  valid_until?: string;
  created_at?: string;
}

export interface ProctoringSnapshot {
  id: string;
  attempt_id: string;
  user_id: string;
  image_url: string;
  flag_reason?: string;
  timestamp: string;
}

export interface SuccessfulStudent {
  id: string;
  name: string;
  exam_selected: string;
  rank?: string;
  year: number;
  photo_url?: string;
  testimonial_mr?: string;
  testimonial_en?: string;
}

export interface YouTubeLecture {
  id: string;
  title_en: string;
  title_mr: string;
  youtube_video_id: string;
  subject_id: string;
  duration_minutes?: number;
  is_free: boolean;
}

export interface UploadedMediaItem {
  id: string;
  url: string;
  file_name: string;
  file_type: string;
  folder: string;
  size_bytes: number;
  created_at: string;
}

export interface PromotionalGrant {
  id: string;
  user_id: string;
  duration_days: number;
  granted_by: string;
  reason: string;
  granted_at: string;
}

export interface ReferralTier {
  id: string;
  min_referrals: number;
  reward_days: number;
  label_en: string;
  label_mr: string;
}

export interface ReferralRewardHistory {
  id: string;
  referrer_id: string;
  referred_user_id: string;
  reward_days: number;
  created_at: string;
}

// ---------------------------------------------------------------------------
// NEW SUPABASE HEALTH & HEARTBEAT MONITOR TYPES
// ---------------------------------------------------------------------------
export interface SupabaseHealthStatus {
  is_healthy: boolean;
  database_status: 'online' | 'degraded' | 'offline';
  latency_ms: number;
  last_heartbeat_at: string;
  total_questions_count: number;
  total_users_count: number;
  total_pyq_papers_count: number;
  total_ebooks_count: number;
  total_test_attempts_count: number;
  active_storage_buckets: string[];
  backup_status: 'ready' | 'running' | 'completed' | 'failed';
  last_backup_at?: string;
}

export interface HeartbeatLog {
  id: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
  latency_ms: number;
  db_response: string;
  triggered_by: 'cron_scheduler' | 'manual_ping' | 'system_startup';
}

// ---------------------------------------------------------------------------
// NEW PYQ & ADVANCED UPLOAD TYPES
// ---------------------------------------------------------------------------
export interface PYQPaper {
  id: string;
  exam_name: string;
  year: number;
  subject_id?: string;
  chapter_id?: string;
  title_en: string;
  title_mr?: string;
  pdf_url?: string;
  document_url?: string;
  document_type: 'pdf' | 'docx' | 'xlsx' | 'image' | 'interactive_set';
  total_questions: number;
  created_at: string;
  created_by?: string;
}

export interface OCRResult {
  extracted_text: string;
  questions: Partial<Question>[];
  detected_subject?: string;
  confidence_score: number;
  processing_time_ms: number;
}

export interface QualityAuditReport {
  timestamp: string;
  total_scanned: number;
  duplicates_found: number;
  missing_options_found: number;
  invalid_answers_found: number;
  formatting_errors_found: number;
  issues: {
    question_id?: string;
    question_text: string;
    issue_type: ImportFlag;
    details: string;
  }[];
}
