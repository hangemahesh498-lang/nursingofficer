import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  UserProfile,
  Subject,
  Chapter,
  Topic,
  Subtopic,
  Question,
  CaseStudy,
  MockTest,
  TestAttempt,
  MistakeRecord,
  BookmarkRecord,
  QuestionReport,
  AuditLogEntry,
  SystemSettings,
  SyllabusGapItem,
  PaymentPlan,
  PaymentRecord,
  StudyMaterial,
  RecruitmentNotice,
  ImportBatch,
  ImportedQuestionItem,
  AdminAiImportSettings,
  PromoAd,
  PushNotification,
  PromoCode,
  ProctoringSnapshot,
  SuccessfulStudent,
  YouTubeLecture,
  UploadedMediaItem,
  PromotionalGrant,
  ReferralTier,
  ReferralRewardHistory
} from '../src/types';
import {
  INITIAL_SUBJECTS,
  INITIAL_CHAPTERS,
  INITIAL_TOPICS,
  INITIAL_CASE_STUDIES,
  INITIAL_QUESTIONS,
  INITIAL_MOCK_TESTS
} from '../src/data/initialData';
import { deleteFromCloudinary } from './cloudinary';

export const DEFAULT_REFERRAL_TIERS: ReferralTier[] = [
  { id: 'tier-5', min_referrals: 5, reward_days: 5, label_en: '5 Referrals → 5 Days PRO Access', label_mr: '५ रेफरल्स → ५ दिवस PRO मोफत' },
  { id: 'tier-10', min_referrals: 10, reward_days: 7, label_en: '10 Referrals → 7 Days PRO Access', label_mr: '१० रेफरल्स → ७ दिवस PRO मोफत' },
  { id: 'tier-25', min_referrals: 25, reward_days: 15, label_en: '25 Referrals → 15 Days PRO Access', label_mr: '२५ रेफरल्स → १५ दिवस PRO मोफत' },
  { id: 'tier-50', min_referrals: 50, reward_days: 30, label_en: '50 Referrals → 30 Days PRO Access', label_mr: '५० रेफरल्स → ३० दिवस PRO मोफत' }
];

export const INITIAL_AI_IMPORT_SETTINGS: AdminAiImportSettings = {
  autoApprovalEnabled: true,
  minAutoApprovalConfidence: 90,
  minQualityScore: 85,
  autoDuplicateDetection: true,
  autoExplanationGeneration: true,
  autoSubjectDetection: true,
  autoTopicDetection: true,
  medicalSafetyReview: true,
  autoPublish: true,
  processingMode: 'balanced',
  duplicateSimilarityThreshold: 0.85
};

interface DatabaseStore {
  users: UserProfile[];
  subjects: Subject[];
  chapters: Chapter[];
  topics: Topic[];
  subtopics: Subtopic[];
  questions: Question[];
  case_studies: CaseStudy[];
  mock_tests: MockTest[];
  test_attempts: TestAttempt[];
  mistakes: MistakeRecord[];
  bookmarks: BookmarkRecord[];
  reports: QuestionReport[];
  audit_logs: AuditLogEntry[];
  settings: SystemSettings;
  payment_plans: PaymentPlan[];
  payments: PaymentRecord[];
  study_materials: StudyMaterial[];
  recruitment_notices: RecruitmentNotice[];
  import_batches: ImportBatch[];
  promo_ads: PromoAd[];
  push_notifications: PushNotification[];
  promo_codes: PromoCode[];
  proctoring_snapshots?: ProctoringSnapshot[];
  successful_students?: SuccessfulStudent[];
  youtube_lectures?: YouTubeLecture[];
  uploaded_media?: UploadedMediaItem[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-student-01',
    email: 'aspirant@nursingprep.ai',
    name: 'Nursing Officer Aspirant (PRO)',
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
    id: 'usr-student-free',
    email: 'free.student@nursingprep.ai',
    name: 'Free Tier Student (5 MCQs/Topic)',
    role: 'student',
    preferredLanguage: 'mr',
    targetExam: 'Maha DMER Staff Nurse',
    dailyTarget: 20,
    streakDays: 4,
    points: 100,
    isPremium: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-editor-01',
    email: 'editor@nursingprep.ai',
    name: 'Content Editor',
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
    name: 'Subject Reviewer',
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
    email: 'hangemahesh916@gmail.com',
    name: 'Mahesh Hange (Admin)',
    role: 'super_admin',
    preferredLanguage: 'mr',
    targetExam: 'Exam Operations & Recruitment Admin',
    dailyTarget: 50,
    streakDays: 45,
    points: 1500,
    isPremium: true,
    createdAt: new Date().toISOString()
  }
];

const INITIAL_SETTINGS: SystemSettings = {
  app_name: 'Nursing Officer Exam Preparation Platform',
  support_email: 'HANGEMAHESH498@gmail.com',
  support_phone: '+91 98765 43210',
  show_support_phone: true,
  whatsapp_number: '+91 98765 43210',
  show_whatsapp: true,
  support_hours: '9:00 AM - 8:00 PM IST (Mon - Sat)',
  default_language: 'en',
  allow_registration: true,
  maintenance_mode: false,
  maintenance_message: 'Platform scheduled maintenance in progress. Please check back shortly.',
  default_negative_marking: 0.33,
  ai_rate_limit_per_user_per_day: 50,
  enable_ai_question_generation: true,
  enable_ai_study_coach: true,
  
  // Telegram Smart System
  telegram_username: 'Indian0916',
  telegram_contact_url: 'https://t.me/Indian0916',
  telegram_group_url: 'https://t.me/NursingofficerAPP',
  telegram_channel_url: 'https://t.me/NursingofficerAPP',
  telegram_support_message: 'Namaste! Contact our official Telegram admin for instant doubt clearing, study notes PDFs, and payment verification.',

  // Payment & QR Settings
  premium_enabled: true,
  payment_mode: 'MANUAL_QR',
  manual_qr_enabled: true,
  razorpay_enabled: false,
  currency: 'INR',
  upi_id: 'nursingprep@upi',
  receiver_name: 'Nursing Officer Exam Academy',
  payment_instructions_en: '1. Scan the QR code or pay using UPI ID.\n2. Note down the 12-digit UPI / UTR Transaction ID from Google Pay / PhonePe / Paytm.\n3. Enter the UTR number below and attach payment screenshot.\n4. Admin will verify and activate your PRO subscription within 15-30 minutes.',
  payment_instructions_mr: '१. खालील QR कोड स्कॅन करा किंवा UPI ID द्वारे रक्कम भरा.\n२. गुगल पे / फोनपे / पेटीएम मधील १२-अंकी UTR किंवा Transaction ID कॉपी करा.\n३. खालील बॉक्समध्ये UTR क्रमांक टाका व स्क्रीनशॉट अपलोड करा.\n४. अ‍ॅडमिन तपासणी करून १५-३० मिनिटांत तुमचा PRO प्लॅन सुरू करेल.',
  announcement_banner: '⚡ AIIMS NORCET 2025 Grand Mock Test Series & Verified 2024 Question Bank Live Now!',
  announcement_banner_active: true,

  // Running Ticker Bar
  ticker_text_mr: '🎉 विशेष सराव ऑफर: MH50 प्रोमो कोड वापरा आणि ५०% सूट मिळवा! 🎉',
  ticker_text_en: '🎉 Special Fest Offer: Use promo code MH50 to get 50% OFF! 🎉',
  ticker_active: true,

  // App-Opening Offer Popup Notification
  offer_popup_active: true,
  offer_popup_title_mr: '🔥 विशेष सवलत ऑफर! (Flat 50% OFF)',
  offer_popup_title_en: '🔥 Special Festival Offer (50% OFF)',
  offer_popup_message_mr: 'सर्व १८ नर्सिंग विषयांचे सराव प्रश्नसंच, ५०+ ग्रँड मॉक टेस्ट्स आणि ऑल-इंडिया रँक प्रेडिक्टर ५०% डिस्काउंटसह मिळवा!',
  offer_popup_message_en: 'Unlock 18 Nursing Subjects, 50+ Mock Tests, and AI Clinical Coach with 50% discount using code MH50.',
  offer_popup_badge_mr: 'मर्यादित कालावधी ऑफर',
  offer_popup_promo_code: 'MH50',
  offer_popup_target_tab: 'upgrade-pro',

  // Success Students Section Toggle
  show_successful_students_section: true,

  // YouTube Lectures Section Toggle (Admin Controlled)
  show_youtube_lectures_section: true
};

const INITIAL_YOUTUBE_LECTURES: YouTubeLecture[] = [
  {
    id: 'yt-marathi-01',
    title_mr: 'मराठी व्याकरण - प्रयोग, समास व शब्दसंग्रह (DMER/DHS विशेष व्याख्यान)',
    title_en: 'Marathi Grammar - Prayog, Samas & Vocabulary for DHS/DMER Exam',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtube_video_id: 'dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
    subject_name: 'मराठी व्याकरण',
    duration_label: '40 Min',
    instructor_name: 'मराठी व्याकरण तज्ज्ञ (Faculty)',
    description_mr: 'कर्मणी, कर्तरी व भावे प्रयोग, अव्ययीभाव व तत्पुरुष समास, आणि वारंवार विचारलेले समानार्थी शब्द.',
    description_en: 'In-depth Marathi grammar covering sentence structures, compound words and vocabulary.',
    is_active: true,
    is_paid: false,
    price: 0,
    view_count: 3200,
    created_at: new Date().toISOString()
  },
  {
    id: 'yt-01',
    title_mr: 'AIIMS NORCET ७.० फार्माकोलॉजी आणि डोस गणिते (High-Yield Masterclass)',
    title_en: 'AIIMS NORCET 7.0 Pharmacology & Dosage Calculations Masterclass',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtube_video_id: 'dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600',
    subject_name: 'Pharmacology & Dosage',
    duration_label: '45 Min',
    instructor_name: 'MH Sir (Senior Nursing Expert)',
    description_mr: 'डायजॉक्सिन, इन्सुलिन प्रकार, आणि डोस गणिताचे महत्त्वाचे नियम सविस्तर समजून घ्या.',
    description_en: 'Comprehensive breakdown of Digoxin toxicity, Insulin classification, and IV drop rate formulas.',
    is_active: true,
    is_paid: false,
    price: 0,
    view_count: 1420,
    created_at: new Date().toISOString()
  },
  {
    id: 'yt-02',
    title_mr: 'पार्कलँड बर्न्स फॉर्म्युला आणि फ्लुइड रीससिटेशन (Burn Management)',
    title_en: 'Parkland Burn Resuscitation & Rule of Nines Calculation',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtube_video_id: 'dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600',
    subject_name: 'Medical Surgical Nursing',
    duration_label: '35 Min',
    instructor_name: 'Nursing Officer Team',
    description_mr: 'पहिल्या २४ तासांतील Ringer Lactate गणिताची सोपी पद्धत आणि NORCET विचारलेले प्रश्न.',
    description_en: 'Step-by-step fluid resuscitation calculation using Parkland formula with clinical examples.',
    is_active: true,
    is_paid: true,
    price: 49,
    view_count: 980,
    created_at: new Date().toISOString()
  },
  {
    id: 'yt-03',
    title_mr: 'इसीजी (ECG) स्ट्रिप वाचण्याची सोपी पद्धत (Cardiac Emergency Nursing)',
    title_en: 'ECG Interpretation & Cardiac Arrhythmia Recognition',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtube_video_id: 'dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600',
    subject_name: 'ICU & Cardiac Nursing',
    duration_label: '50 Min',
    instructor_name: 'MH Sir',
    description_mr: 'VT, VF, STEMI आणि Atrial Fibrillation ओळखण्याची सोपी पद्धत.',
    description_en: 'Master ECG reading, lethal arrhythmias, and emergency cardiac drug interventions.',
    is_active: true,
    is_paid: false,
    price: 0,
    view_count: 2150,
    created_at: new Date().toISOString()
  }
];

const INITIAL_SUCCESSFUL_STUDENTS: SuccessfulStudent[] = [
  {
    id: 'stud-01',
    student_name: 'स्नेहल पाटील (Snehal Patil)',
    photo_url: 'https://images.unsplash.com/photo-1594824813571-28a77885097a?auto=format&fit=crop&q=80&w=300',
    selected_post: 'DHS Nursing Officer',
    posting_location: 'शासकीय वैद्यकीय महाविद्यालय (GMC) छत्रपती संभाजीनगर',
    marks_or_rank: '१८४ गुण (गुणवत्ता यादी १ ली)',
    exam_batch: '२०२४ भरती',
    testimonial_mr: 'या प्लॅटफॉर्मवरील सर्व १८ विषयांचे सराव MCQs आणि वेळेवर आधारित ५०+ मॉक टेस्ट्समुळे मला पहिल्याच प्रयत्नात शासकीय सेवेत यश मिळाले.',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'stud-02',
    student_name: 'राहुल देशमुख (Rahul Deshmukh)',
    photo_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    selected_post: 'DMER Staff Nurse',
    posting_location: 'बी. जे. शासकीय वैद्यकीय महाविद्यालय व ससून रुग्णालय, पुणे',
    marks_or_rank: '१७६ गुण (रँक #०४)',
    exam_batch: '२०२४ भरती',
    testimonial_mr: 'क्लीनिकल केसेस, ईसीजी प्रश्न आणि अचूक स्पष्टीकरणामुळे माझा सराव मजबूत झाला. टेस्ट सिरीज अत्यंत दर्जाची आहे.',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'stud-03',
    student_name: 'प्रिया शिंदे (Priya Shinde)',
    photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    selected_post: 'AIIMS NORCET Officer',
    posting_location: 'एम्स (AIIMS) नागपूर',
    marks_or_rank: 'All India Rank 18',
    exam_batch: 'NORCET 6.0',
    testimonial_mr: '१/३ निगेटिव्ह मार्किंग टाइमर टेस्ट्समुळे प्रत्यक्ष परीक्षेत वेळेचे नियोजन करणे सोपे झाले.',
    is_active: true,
    created_at: new Date().toISOString()
  }
];

const INITIAL_PROMO_CODES: PromoCode[] = [
  {
    id: 'promo-01',
    code: 'MH50',
    discount_type: 'percentage',
    discount_value: 50,
    valid_till: '2026-12-31',
    is_active: true,
    description: '50% Flat Special Fest Discount',
    usage_count: 18,
    created_at: new Date().toISOString()
  },
  {
    id: 'promo-02',
    code: 'NORCET20',
    discount_type: 'fixed',
    discount_value: 50,
    valid_till: '2026-12-31',
    is_active: true,
    description: '₹50 Flat Instant Discount on All Plans',
    usage_count: 42,
    created_at: new Date().toISOString()
  }
];

const INITIAL_PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: 'plan-mcq-only',
    name: 'MCQ Practice Special Plan',
    name_mr: 'फक्त MCQs सराव प्लॅन',
    price: 99,
    currency: 'INR',
    duration_days: 90,
    duration_label: '90 Days (3 Months)',
    duration_label_mr: '९० दिवस (३ महिने अमर्यादित MCQ सराव)',
    is_active: true,
    plan_type: 'PRO_MCQ',
    tax_label: '(Inclusive of all taxes)',
    fulfillment_note: 'Instant Digital Access upon payment',
    features: [
      'Unlimited MCQ Practice (18 Core Nursing Subjects)',
      'Clinical Vignettes, ECG & Image-based Questions',
      'Marathi & English Explanations',
      'Mistake Notebook & Spaced Repetition'
    ],
    features_mr: [
      'सर्व १८ विषयांचे अमर्यादित सराव MCQs',
      'क्लिनिकल केसेस, ईसीजी व फोटो प्रश्नसंच',
      'मराठी व इंग्रजी सविस्तर स्पष्टीकरण',
      'चूक वही व स्वयंचलित उजळणी'
    ]
  },
  {
    id: 'plan-test-series-only',
    name: 'Full Mock Test Series Plan',
    name_mr: 'फक्त टेस्ट सिरीज प्लॅन',
    price: 149,
    currency: 'INR',
    duration_days: 180,
    duration_label: '180 Days (6 Months)',
    duration_label_mr: '१८० दिवस (६ महिने टेस्ट सिरीज पास)',
    is_active: true,
    popular: true,
    plan_type: 'TEST_SERIES',
    tax_label: '(Inclusive of all taxes)',
    fulfillment_note: 'Instant Digital Access upon payment',
    features: [
      '50+ Grand Mock Tests with 1/3 Negative Marking',
      'Timed Exam Environment & Auto-Submit Proctoring',
      'Verified Previous Year Papers (NORCET, ESIC, DMER, DHS)',
      'Instant Downloadable PDF Scorecards'
    ],
    features_mr: [
      '५०+ संपूर्ण मॉक टेस्ट्स (१/३ निगेटिव्ह मार्किंग)',
      'परीक्षेसारखा टाइमर व ऑटो-सबमिट सुविधा',
      'मागील वर्षांचे प्रमाणित प्रश्नपत्रिका संच',
      'पीडीएफ गुणपत्रिका डाऊनलोड सुविधा'
    ]
  },
  {
    id: 'plan-youtube-only',
    name: 'YouTube Video Access Plan',
    name_mr: 'YouTube व्हिडिओ प्लॅन',
    price: 99,
    currency: 'INR',
    duration_days: 90,
    duration_label: '90 Days',
    duration_label_mr: '९० दिवस',
    is_active: true,
    plan_type: 'YOUTUBE',
    tax_label: '(Inclusive of all taxes)',
    fulfillment_note: 'Instant digital access after successful payment',
    features: [
      'Paid YouTube Lecture Library',
      'Nursing Exam Video Classes',
      'Access while plan is active'
    ],
    features_mr: [
      'पेड YouTube व्याख्यान लायब्ररी',
      'नर्सिंग परीक्षा व्हिडिओ क्लासेस',
      'प्लॅन सक्रिय असेपर्यंत प्रवेश'
    ]
  },
  {
    id: 'plan-combo-pass',
    name: 'All-Access Combo Plan (MCQ + Test Series + Videos)',
    name_mr: 'सर्व सुविधा कम्बो प्लॅन (MCQ + टेस्ट + व्हिडिओ)',
    price: 199,
    currency: 'INR',
    duration_days: 365,
    duration_label: '365 Days (1 Year)',
    duration_label_mr: '३६५ दिवस (१ वर्ष संपूर्ण कव्हरेज)',
    is_active: true,
    plan_type: 'COMBO',
    tax_label: '(Inclusive of all taxes)',
    fulfillment_note: 'Instant Digital Access upon payment',
    features: [
      'All 18 Subject MCQ Question Banks Included',
      'All 50+ Mock Test Series Pass Included',
      'All Paid YouTube Video Lectures Included',
      'AI Clinical Study Coach & Memory Mnemonics',
      'VIP Telegram Doubt & Verification Support'
    ],
    features_mr: [
      'सर्व १८ विषयांचे विषयवार सराव MCQs समाविष्ट',
      'सर्व ५०+ मॉक टेस्ट सिरीज पूर्ण प्रवेश',
      'सर्व पेड YouTube व्हिडिओ व्याख्याने समाविष्ट',
      'एआय क्लिनिकल स्टडी कोच व मेमरी ट्रिक्स',
      'व्हीआयपी टेलिग्राम थेट शंका निरसन'
    ]
  }
];

const INITIAL_STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-01',
    title: 'Parkland Burns Fluid Resuscitation Formula Guide',
    title_mr: 'पार्कलँड बर्न फ्लुईड फॉर्म्युला व क्लिनिकल मार्गदर्शक',
    description: 'Complete 24-hour calculation breakdown for Rule of Nines, fluid titration, urine output goals, and hyperkalemia monitoring in severe thermal burns.',
    description_mr: 'बर्न रुग्णांसाठी २४ तासांचे आरएल फ्लुईड कॅल्क्युलेशन, युरिन आउटपुट लक्ष्य आणि नर्सिंग काळजी.',
    category: 'clinical_guide',
    exam: 'AIIMS NORCET',
    subject_id: 'subj-msn',
    file_url: 'https://example.com/materials/parkland-burns-formula.pdf',
    file_name: 'Parkland_Burns_Formula_NORCET.pdf',
    file_size_mb: 1.4,
    source: 'Indian Nursing Council & AIIMS Clinical Protocols',
    is_premium: false,
    is_published: true,
    year: 2025,
    created_at: new Date().toISOString()
  },
  {
    id: 'mat-02',
    title: 'Glasgow Coma Scale (GCS) Assessment Reference Chart',
    title_mr: 'ग्लासगो कोमा स्केल (GCS) संदर्भ तक्ता',
    description: 'Eye (E4), Verbal (V5), Motor (M6) full response scoring chart with clinical triggers for mechanical intubation at score <= 8.',
    description_mr: 'ई४, व्ही५, एम६ संपूर्ण स्कोअरिंग तक्ता आणि इन्ट्युबेशन मार्गदर्शक सूचना.',
    category: 'notes',
    exam: 'AIIMS NORCET & ESIC',
    subject_id: 'subj-fon',
    file_url: 'https://example.com/materials/glasgow-coma-scale-chart.pdf',
    file_name: 'GCS_Scoring_Quick_Reference.pdf',
    file_size_mb: 0.8,
    source: 'Advanced Trauma Nursing Course',
    is_premium: false,
    is_published: true,
    year: 2025,
    created_at: new Date().toISOString()
  },
  {
    id: 'mat-03',
    title: 'National Immunization Schedule (NIS) & Cold Chain 2025',
    title_mr: 'राष्ट्रीय लसीकरण वेळापत्रक २०२५ आणि कोल्ड चेन',
    description: 'Updated vaccine dosages, routes, sites, temperature storage (ILR 2-8 C), and open vial policy rules for pediatric nursing.',
    description_mr: 'लसींचे डोस, रूट, साठवणूक तापमान आणि कोल्ड चेन मार्गदर्शक तत्त्वे.',
    category: 'notes',
    exam: 'AIIMS NORCET, ESIC & NHM',
    subject_id: 'subj-peds',
    file_url: 'https://example.com/materials/immunization-schedule-2025.pdf',
    file_name: 'National_Immunization_Schedule_2025.pdf',
    file_size_mb: 2.1,
    source: 'Ministry of Health and Family Welfare (MoHFW)',
    is_premium: true,
    is_published: true,
    year: 2025,
    created_at: new Date().toISOString()
  },
  {
    id: 'mat-04',
    title: 'Biomedical Waste Management (BMWM) Rules 2016 (Amended)',
    title_mr: 'बायोमेडिकल वेस्ट मॅनेजमेंट (कचरा व्यवस्थापन) मार्गदर्शक',
    description: 'Yellow, Red, White translucent, and Blue puncture-proof container categories, autoclave parameters, and cytotoxic waste segregation.',
    description_mr: 'पिवळा, लाल, पांढरा आणि निळा डबा वर्गीकरण नियम.',
    category: 'clinical_guide',
    exam: 'AIIMS NORCET & State Nursing',
    subject_id: 'subj-fon',
    file_url: 'https://example.com/materials/bmwm-rules-summary.pdf',
    file_name: 'BMW_Management_Rules_Summary.pdf',
    file_size_mb: 1.2,
    source: 'Central Pollution Control Board & INC',
    is_premium: false,
    is_published: true,
    year: 2024,
    created_at: new Date().toISOString()
  }
];

const INITIAL_RECRUITMENTS: RecruitmentNotice[] = [
  {
    id: 'rec-norcet-08',
    organization: 'AIIMS New Delhi (Central Institutes)',
    post_name: 'Nursing Officer (NORCET 8 / 9)',
    year: 2025,
    notification_date: '2025-02-15',
    application_start_date: '2025-02-20',
    application_end_date: '2025-03-25',
    total_vacancies: 3850,
    eligibility_summary: 'B.Sc (Hons.) Nursing / B.Sc Nursing from an INC recognized institute OR GNM with 2 years experience in min 50 bedded hospital.',
    qualification_details: 'Registered as Nurses & Midwife with State / Indian Nursing Council.',
    age_limit: '18 - 30 Years (Age relaxation for SC/ST/OBC/PwD as per Central Govt Rules)',
    experience_required: 'No experience for B.Sc / Post-Basic B.Sc Nursing. 2 Years for GNM.',
    application_fee: 'General/OBC: ₹3000 | SC/ST/EWS: ₹2400 | PwD: Exempted',
    exam_pattern_summary: 'NORCET Prelims: 100 MCQs (80 Nursing + 20 GK/Aptitude), 90 Minutes, 1/3 Negative Marking. NORCET Mains: 100 Scenario-based Clinical Questions.',
    official_website: 'https://www.aiimsexams.ac.in',
    source_document_url: 'https://www.aiimsexams.ac.in/pdf/NORCET_Notification.pdf',
    source_disclaimer: 'Official details sourced from AIIMS Examination Section portal. Always verify from official AIIMS notification.',
    status: 'active'
  },
  {
    id: 'rec-esic-2025',
    organization: 'ESIC (Employees State Insurance Corporation)',
    post_name: 'Nursing Officer (Group B Non-Gazetted)',
    year: 2025,
    notification_date: '2025-03-01',
    application_start_date: '2025-03-07',
    application_end_date: '2025-04-10',
    total_vacancies: 1930,
    eligibility_summary: 'B.Sc Nursing or GNM with 1 year experience in 50 bedded hospital.',
    qualification_details: 'Registered with State Nursing Council.',
    age_limit: 'Up to 30 Years',
    experience_required: 'GNM candidates require 1 year clinical hospital experience.',
    application_fee: 'General/OBC: ₹500 | SC/ST/Female: Exempted/Refundable',
    exam_pattern_summary: '100 MCQs (100 Technical Nursing + 25 General Ability), 2 Hours, 0.25 Negative Marking.',
    official_website: 'https://www.esic.gov.in',
    source_disclaimer: 'Official notification published via UPSC / ESIC recruitment cell.',
    status: 'upcoming'
  },
  {
    id: 'rec-maha-dmer-2025',
    organization: 'Maharashtra DMER & Directorate of Health Services (DHS)',
    post_name: 'Adhiparicharika (Staff Nurse / Nursing Officer)',
    year: 2025,
    notification_date: '2025-01-10',
    application_start_date: '2025-01-15',
    application_end_date: '2025-02-28',
    total_vacancies: 4200,
    eligibility_summary: 'G.N.M. or B.Sc. Nursing with Maharashtra Nursing Council (MNC) Registration.',
    qualification_details: 'MNC Registration mandatory. Knowledge of Marathi language required.',
    age_limit: '18 - 38 Years (Open) / 43 Years (Reserved)',
    experience_required: 'Freshers eligible.',
    application_fee: 'Open: ₹1000 | Reserved: ₹900',
    exam_pattern_summary: '100 Questions (80 Nursing in English/Marathi + 20 Marathi/English/GK/Intellect), 200 Marks, 120 Minutes. No negative marking in state exam.',
    official_website: 'https://med-edu.maharashtra.gov.in',
    source_disclaimer: 'Sourced from Maharashtra Medical Education & Research Department.',
    status: 'active'
  }
];

const INITIAL_PROMO_ADS: PromoAd[] = [
  {
    id: 'ad-all-exam-masterclass',
    title_en: 'All Nursing Officer Exams Master Strategy & High-Yield Preparation (DMER, DHS, RRB, ESIC, NORCET)',
    title_mr: 'सर्व नर्सिंग अधिकारी परीक्षांची महा-रणनीती (DMER • DHS • RRB • ESIC • NORCET • CHO)',
    description_en: 'Comprehensive scoring roadmap for all Central and Maharashtra state nursing recruitment exams. Master High-Yield MCQs, Technical syllabus, Non-nursing subjects & negative marking tips.',
    description_mr: 'महाराष्ट्र व केंद्र सरकारच्या सर्व नर्सिंग भरती परीक्षांसाठी (DMER, DHS, RRB, ESIC, NORCET, CHO, ZP) १००% परिपूर्ण रणनीती, तांत्रिक घटक, मराठी/इंग्रजी/जीके व निगेटिव्ह मार्किंग टाळण्याच्या युक्त्या.',
    aspect_ratio: '16:9',
    media_type: 'video',
    video_url: 'https://res.cloudinary.com/demo/video/upload/c_scale,w_854/sea_turtle.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    cta_text_en: 'Enroll in All-Exam Pro Batch ₹199',
    cta_text_mr: 'सर्व परीक्षांसाठी PRO बॅच (फक्त ₹१९९)',
    cta_link: 'upgrade-pro',
    target_screen: 'all',
    is_active: true,
    enable_sticky_pip: true,
    order_index: 1,
    badge_text_en: 'All Nursing Exams Strategy',
    badge_text_mr: 'सर्व नर्सिंग परीक्षांसाठी विशेष',
    sponsor_tag: 'All Nursing Exams Academy',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'ad-parkland-reel-short',
    title_en: '1-Minute Parkland Burn & Pediatric Drug Dose Calculation (All Nursing Exams)',
    title_mr: '१ मिनिटात शिका: पार्कलँड बर्न सूत्र व औषध गणना (सर्व परीक्षांसाठी)',
    description_en: 'High-yield calculation formula frequently asked in DMER, DHS, RRB, ESIC, AIIMS NORCET & State Staff Nurse exams.',
    description_mr: 'DMER, DHS, ESIC, RRB, NORCET व जिल्हा परिषद स्टाफ नर्स परीक्षेत १००% विचारल्या जाणाऱ्या फॉर्म्युला ट्रिक्स एका मिनिटाच्या शॉर्ट रीलमध्ये समजून घ्या.',
    aspect_ratio: '9:16',
    media_type: 'video',
    video_url: 'https://res.cloudinary.com/demo/video/upload/c_fill,ar_9:16,w_720/dog.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=720&q=80',
    cta_text_en: 'Join Free All-Exam Telegram',
    cta_text_mr: 'मोफत टेलिग्राम चॅनेल जॉईन करा',
    cta_link: 'https://t.me/NursingOfficerPrep',
    target_screen: 'all',
    is_active: true,
    enable_sticky_pip: true,
    order_index: 2,
    badge_text_en: 'All-Exam High Yield Reel',
    badge_text_mr: 'सर्व परीक्षांसाठी शॉर्ट रील',
    sponsor_tag: 'Rapid Nursing Reels',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

class DatabaseService {
  private store: DatabaseStore;

  constructor() {
    this.store = this.loadOrInitialize();
  }

  public reloadFromDisk(): void {
    this.store = this.loadOrInitialize();
  }

  private loadOrInitialize(): DatabaseStore {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (err) {
      console.warn('Error creating data directory', err);
    }

    const adminUser = INITIAL_USERS.find(u => u.email === 'gitevijay123@gmail.com');
    if (adminUser) {
      const { hash, salt } = this.hashPassword('9623790916');
      adminUser.passwordHash = hash;
      adminUser.passwordSalt = salt;
    }

    const defaultStore: DatabaseStore = {
      users: INITIAL_USERS,
      subjects: INITIAL_SUBJECTS,
      chapters: INITIAL_CHAPTERS,
      topics: INITIAL_TOPICS,
      subtopics: [],
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
          details: 'Nursing Officer Preparation Platform initialized with certified subject banks, study materials, and manual QR payment subsystem.',
          created_at: new Date().toISOString()
        }
      ],
      settings: { ...INITIAL_SETTINGS, ai_import_settings: INITIAL_AI_IMPORT_SETTINGS },
      payment_plans: INITIAL_PAYMENT_PLANS,
      payments: [],
      study_materials: INITIAL_STUDY_MATERIALS,
      recruitment_notices: [],
      import_batches: [],
      promo_ads: INITIAL_PROMO_ADS,
      push_notifications: [],
      promo_codes: INITIAL_PROMO_CODES,
      proctoring_snapshots: [],
      successful_students: INITIAL_SUCCESSFUL_STUDENTS,
      youtube_lectures: INITIAL_YOUTUBE_LECTURES
    };

    if (fs.existsSync(STORE_PATH)) {
      try {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          ...defaultStore,
          ...parsed,
          users: (() => {
            const rawUsers = (parsed.users && parsed.users.length > 0 ? parsed.users : INITIAL_USERS);
            let hasSuperAdmin = false;
            const updated = rawUsers.map((u: any) => {
              if (
                u.email?.toLowerCase() === 'hangemahesh916@gmail.com' ||
                u.email?.toLowerCase() === 'gitevijay123@gmail.com' ||
                u.id === 'usr-admin-01'
              ) {
                hasSuperAdmin = true;
                const { hash, salt } = this.hashPassword('458498');
                return {
                  ...u,
                  id: 'usr-admin-01',
                  email: 'hangemahesh916@gmail.com',
                  name: 'Mahesh Hange (Admin)',
                  role: 'super_admin',
                  passwordHash: hash,
                  passwordSalt: salt,
                  isPremium: true
                };
              }
              return u;
            });
            if (!hasSuperAdmin) {
              const { hash, salt } = this.hashPassword('458498');
              updated.push({
                id: 'usr-admin-01',
                email: 'hangemahesh916@gmail.com',
                name: 'Mahesh Hange (Admin)',
                role: 'super_admin',
                preferredLanguage: 'mr',
                targetExam: 'Exam Operations & Recruitment Admin',
                dailyTarget: 50,
                streakDays: 45,
                points: 1500,
                isPremium: true,
                passwordHash: hash,
                passwordSalt: salt,
                createdAt: new Date().toISOString()
              });
            }
            return updated;
          })(),
          chapters: parsed.chapters && parsed.chapters.length > 0 ? parsed.chapters : INITIAL_CHAPTERS,
          topics: parsed.topics && parsed.topics.length > 0 ? parsed.topics : INITIAL_TOPICS,
          subtopics: parsed.subtopics || [],
          questions: (parsed.questions && parsed.questions.length > 0 ? parsed.questions : INITIAL_QUESTIONS).map((q: any) => ({
            ...q,
            duplicate_hash: q.duplicate_hash || this.computeDuplicateHash(q.question_en || '')
          })),
          subjects: parsed.subjects && parsed.subjects.length > 0 ? parsed.subjects : INITIAL_SUBJECTS,
          payment_plans: parsed.payment_plans && parsed.payment_plans.length > 0 ? parsed.payment_plans : INITIAL_PAYMENT_PLANS,
          payments: parsed.payments || [],
          study_materials: parsed.study_materials && parsed.study_materials.length > 0 ? parsed.study_materials : INITIAL_STUDY_MATERIALS,
          recruitment_notices: parsed.recruitment_notices !== undefined ? parsed.recruitment_notices : [],
          import_batches: parsed.import_batches || [],
          promo_ads: (parsed.promo_ads && parsed.promo_ads.length > 0 ? parsed.promo_ads : INITIAL_PROMO_ADS).map((ad: PromoAd) => {
            if (ad.id === 'ad-norcet-grand-masterclass' || (ad.title_en && ad.title_en.includes('AIIMS NORCET 2025 Grand Strategy'))) {
              return INITIAL_PROMO_ADS[0];
            }
            if (ad.id === 'ad-parkland-reel-short' && !ad.title_en?.includes('All Nursing Exams')) {
              return INITIAL_PROMO_ADS[1];
            }
            if (ad.video_url && ad.video_url.includes('commondatastorage.googleapis.com')) {
              return {
                ...ad,
                video_url: ad.aspect_ratio === '9:16'
                  ? 'https://res.cloudinary.com/demo/video/upload/c_fill,ar_9:16,w_720/dog.mp4'
                  : 'https://res.cloudinary.com/demo/video/upload/c_scale,w_854/sea_turtle.mp4'
              };
            }
            return ad;
          }),
          settings: {
            ...INITIAL_SETTINGS,
            ...(parsed.settings || {}),
            ai_import_settings: {
              ...INITIAL_AI_IMPORT_SETTINGS,
              ...(parsed.settings?.ai_import_settings || {})
            }
          },
          push_notifications: parsed.push_notifications || [],
          successful_students: parsed.successful_students && parsed.successful_students.length > 0
            ? parsed.successful_students
            : INITIAL_SUCCESSFUL_STUDENTS
        };
      } catch (e) {
        console.warn('Failed parsing existing store, using default', e);
      }
    }

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

  // Subscription Helper
  public processSubscriptionValidity(user: UserProfile): UserProfile {
    if (!user) return user;
    if (user.planEndDate) {
      const nowMs = Date.now();
      const endMs = new Date(user.planEndDate).getTime();
      const diffDays = Math.ceil((endMs - nowMs) / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) {
        user.isPremium = false;
        user.daysRemaining = 0;
        user.hasMcqAccess = false;
        user.hasTestSeriesAccess = false;
        user.hasYoutubeAccess = false;
      } else {
        user.daysRemaining = diffDays;
        user.isPremium = Boolean(user.hasMcqAccess || user.hasTestSeriesAccess || user.hasYoutubeAccess);
      }
    } else if (user.isPremium) {
      user.daysRemaining = user.daysRemaining || 180;
    } else {
      user.daysRemaining = 0;
    }
    return user;
  }

  private makeReferralCode(name: string, email: string): string {
    const base = (name || email.split('@')[0] || 'NURSE').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6) || 'NURSE';
    let code = `${base}${Math.floor(1000 + Math.random() * 9000)}`;
    while (this.store.users.some(u => u.referralCode === code)) code = `${base}${Math.floor(1000 + Math.random() * 9000)}`;
    return code;
  }

  public getReferralTiers(): ReferralTier[] {
    return this.store.settings.referral_tiers && this.store.settings.referral_tiers.length > 0
      ? this.store.settings.referral_tiers
      : DEFAULT_REFERRAL_TIERS;
  }

  public getReferralLeaderboard() {
    const users = this.getUsers();
    const tiers = this.getReferralTiers();

    // Map of referee students grouped by referredByCode
    const refMap = new Map<string, UserProfile[]>();
    users.forEach(u => {
      if (u.referredByCode) {
        const code = u.referredByCode.toUpperCase().trim();
        const list = refMap.get(code) || [];
        list.push(u);
        refMap.set(code, list);
      }
    });

    const rows = users
      .filter(u => u.role === 'student')
      .map(u => {
        const code = (u.referralCode || '').toUpperCase().trim();
        const rawReferred = refMap.get(code) || [];
        // Exclude self-referrals
        const validReferred = rawReferred.filter(r => r.id !== u.id && r.email.toLowerCase() !== u.email.toLowerCase());
        const validCount = validReferred.length;

        // Calculate earned reward days based on tiers
        let earnedRewardDays = 0;
        const sortedTiersDesc = [...tiers].sort((a, b) => b.min_referrals - a.min_referrals);
        for (const tier of sortedTiersDesc) {
          if (validCount >= tier.min_referrals) {
            earnedRewardDays = tier.reward_days;
            break;
          }
        }

        return {
          user: this.sanitizeUser(u),
          referralCode: u.referralCode,
          referralCount: validCount,
          rewardDays: earnedRewardDays,
          rewardHistory: u.referralRewardHistory || [],
          promotionalGrants: u.promotional_grants || [],
          referredStudents: validReferred.map(x => ({
            id: x.id,
            name: x.name,
            email: x.email,
            mobile: x.mobile || x.phone,
            district: x.district,
            taluka: x.taluka,
            village_city: x.village_city,
            pincode: x.pincode,
            createdAt: x.createdAt
          }))
        };
      })
      .sort((a, b) => (b.referralCount || 0) - (a.referralCount || 0));

    return rows.map((r, i) => ({
      ...r,
      rank: i + 1
    }));
  }

  public setReferral(userId: string, referredByCode?: string) {
    if (!referredByCode) return;
    const cleanCode = String(referredByCode).trim().toUpperCase();
    if (!cleanCode) return;

    const user = this.store.users.find(u => u.id === userId);
    if (!user) return;

    // Prevent duplicate referral attribution
    if (user.referredByCode) return;

    // Find referrer
    const ref = this.store.users.find(u => u.referralCode?.toUpperCase() === cleanCode);
    if (!ref) return;

    // Prevent self-referral
    if (ref.id === user.id || ref.email.toLowerCase() === user.email.toLowerCase()) return;
    if (ref.mobile && user.mobile && ref.mobile === user.mobile) return;

    // Save referral relationship permanently
    user.referredByCode = ref.referralCode;

    // Recalculate referrer's count and check reward tiers
    const allUsers = this.store.users;
    const validRefs = allUsers.filter(
      u => u.referredByCode?.toUpperCase() === ref.referralCode?.toUpperCase() && u.id !== ref.id
    );
    const newCount = validRefs.length;
    ref.referralCount = newCount;

    // Check reward tiers and apply reward if a new tier is reached
    const tiers = this.getReferralTiers();
    if (!ref.referralRewardHistory) {
      ref.referralRewardHistory = [];
    }

    const sortedTiersAsc = [...tiers].sort((a, b) => a.min_referrals - b.min_referrals);
    for (const tier of sortedTiersAsc) {
      if (newCount >= tier.min_referrals) {
        const alreadyGranted = ref.referralRewardHistory.some(h => h.tier_id === tier.id);
        if (!alreadyGranted) {
          const now = new Date();
          const currentEnd = ref.planEndDate ? new Date(ref.planEndDate) : null;
          const baseDate = (currentEnd && currentEnd.getTime() > now.getTime()) ? currentEnd : now;
          const newEnd = new Date(baseDate.getTime() + tier.reward_days * 24 * 60 * 60 * 1000);

          ref.isPremium = true;
          ref.hasMcqAccess = true;
          ref.hasTestSeriesAccess = true;
          ref.hasYoutubeAccess = true;
          ref.planName = `Referral Reward (${tier.min_referrals} Referrals Milestone)`;
          ref.planStartDate = ref.planStartDate || now.toISOString();
          ref.planEndDate = newEnd.toISOString();
          ref.daysRemaining = Math.max(1, Math.ceil((newEnd.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
          ref.referralRewardDays = (ref.referralRewardDays || 0) + tier.reward_days;

          ref.referralRewardHistory.push({
            id: `rew-${Date.now()}-${tier.id}`,
            tier_id: tier.id,
            min_referrals: tier.min_referrals,
            reward_days: tier.reward_days,
            unlocked_at: now.toISOString(),
            applied: true
          });

          this.logAudit(
            ref.id,
            ref.name,
            ref.role,
            'REFERRAL_REWARD_UNLOCKED',
            'User',
            ref.id,
            `Unlocked referral milestone: ${tier.min_referrals} referrals -> +${tier.reward_days} days PRO access rewarded`
          );
        }
      }
    }

    this.save();
  }

  public deleteUsers(ids: string[], actor: UserProfile, deletePassword: string): { deleted: number; skipped: number } {
    if (!['admin', 'super_admin'].includes(actor.role)) {
      throw new Error('Unauthorized. Only administrators can delete students.');
    }
    const validPassword = process.env.ADMIN_DELETE_SECRET || '790916';
    if (String(deletePassword).trim() !== validPassword) {
      throw new Error('Invalid protected deletion password');
    }
    const targets = new Set(ids);
    const before = this.store.users.length;
    const deletedUsers = this.store.users.filter(u => targets.has(u.id) && !['admin', 'super_admin'].includes(u.role));
    this.store.users = this.store.users.filter(u => !(targets.has(u.id) && !['admin', 'super_admin'].includes(u.role)));
    const deleted = before - this.store.users.length;
    
    const details = deletedUsers.map(u => `${u.name} (${u.email})`).join(', ');
    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'DELETE_USERS',
      'User',
      'multiple',
      `Deleted ${deleted} student accounts: ${details}`
    );
    this.save();
    return { deleted, skipped: ids.length - deleted };
  }

  // Users
  public getUsers(): UserProfile[] {
    return this.store.users.map(u => this.processSubscriptionValidity(u));
  }

  public getUserById(id: string): UserProfile | undefined {
    const user = this.store.users.find(u => u.id === id);
    if (!user) return undefined;
    return this.processSubscriptionValidity(user);
  }

  public getUserByEmail(email: string): UserProfile | undefined {
    const user = this.store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return undefined;
    return this.processSubscriptionValidity(user);
  }

  public getUsersWithStats() {
    const users = this.getUsers();
    const totalUsers = users.length;
    const proUsers = users.filter(u => u.isPremium && (u.daysRemaining ?? 0) > 0).length;
    const freeUsers = users.filter(u => !u.isPremium).length;
    const expiredUsers = users.filter(u => !u.isPremium && u.planEndDate && new Date(u.planEndDate).getTime() < Date.now()).length;

    return {
      totalUsers,
      proUsers,
      freeUsers,
      expiredUsers,
      users
    };
  }

  public grantUserPro(
    userId: string,
    durationDays: number = 30,
    planName: string = 'Admin Manual Grant',
    productScope: 'PRO_MCQ' | 'TEST_SERIES' | 'YOUTUBE' | 'COMBO' = 'COMBO',
    reason: string = 'Admin Promotional Grant',
    actor?: UserProfile
  ): UserProfile | null {
    const user = this.store.users.find(u => u.id === userId);
    if (!user) return null;

    const days = Number(durationDays) || 30;
    const now = new Date();
    const currentEnd = user.planEndDate ? new Date(user.planEndDate) : null;
    const baseDate = (currentEnd && currentEnd.getTime() > now.getTime()) ? currentEnd : now;
    const expiry = new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000);

    user.isPremium = true;
    if (productScope === 'PRO_MCQ') {
      user.hasMcqAccess = true;
    } else if (productScope === 'TEST_SERIES') {
      user.hasTestSeriesAccess = true;
    } else if (productScope === 'YOUTUBE') {
      user.hasYoutubeAccess = true;
    } else {
      user.hasMcqAccess = true;
      user.hasTestSeriesAccess = true;
      user.hasYoutubeAccess = true;
    }

    user.planName = planName;
    user.planType = productScope;
    user.planStartDate = user.planStartDate || now.toISOString();
    user.planEndDate = expiry.toISOString();
    user.daysRemaining = Math.max(1, Math.ceil((expiry.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));

    const grantRecord: PromotionalGrant = {
      id: `grant-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      student_id: user.id,
      student_name: user.name,
      student_email: user.email,
      product_type: productScope,
      plan_name: planName,
      duration_days: days,
      start_date: now.toISOString(),
      expiry_date: expiry.toISOString(),
      admin_id: actor?.id || 'admin',
      admin_name: actor?.name || 'Administrator',
      admin_role: actor?.role || 'admin',
      reason: reason || 'Promotional Free Access',
      created_at: now.toISOString()
    };

    if (!user.promotional_grants) {
      user.promotional_grants = [];
    }
    user.promotional_grants.unshift(grantRecord);

    if (actor) {
      this.logAudit(
        actor.id,
        actor.name,
        actor.role,
        'GRANT_PROMOTIONAL_ACCESS',
        'User',
        userId,
        `Granted ${days} days ${productScope} promotional access to ${user.name} (${user.email}). Reason: ${reason}`
      );
    }
    this.save();
    return this.processSubscriptionValidity(user);
  }

  public revokeUserPro(userId: string, actor?: UserProfile): UserProfile | null {
    const user = this.store.users.find(u => u.id === userId);
    if (!user) return null;

    user.isPremium = false;
    user.daysRemaining = 0;
    user.hasMcqAccess = false;
    user.hasTestSeriesAccess = false;
    user.hasYoutubeAccess = false;
    user.planEndDate = new Date(Date.now() - 1000).toISOString();

    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'REVOKE_USER_PRO', 'User', userId, `Revoked PRO status from ${user.name} (${user.email})`);
    }
    this.save();
    return this.processSubscriptionValidity(user);
  }

  // Push Notifications
  public registerPushToken(userId: string, token: string) {
    const user = this.store.users.find(u => u.id === userId);
    if (!user) return false;
    (user as any).fcm_token = token; this.save(); return true;
  }

  public getPushNotifications(userId?: string): PushNotification[] {
    const all = this.store.push_notifications || [];
    if (!userId) return all;

    const user = this.getUserById(userId);
    if (!user) return [];
    const isPro = user.isPremium;
    const daysLeft = user.daysRemaining ?? 0;

    return all.filter(n => {
      if (n.target_type === 'all') return true;
      if ((n.target_type === 'user' || (n.target_type as any) === 'individual') && n.target_user_id === userId) return true;
      if (n.target_type === 'free_users' && !isPro) return true;
      if (n.target_type === 'pro_users' && isPro) return true;
      if (n.target_type === 'plan_mcq' && user.hasMcqAccess) return true;
      if (n.target_type === 'plan_test_series' && user.hasTestSeriesAccess) return true;
      if (n.target_type === 'plan_youtube' && user.hasYoutubeAccess) return true;
      if (n.target_type === 'plan_combo' && user.hasMcqAccess && user.hasTestSeriesAccess && user.hasYoutubeAccess) return true;
      if (n.target_type === 'expiring_soon' && isPro && daysLeft > 0 && daysLeft <= 7) return true;
      return false;
    }).sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());
  }

  public addPushNotification(
    notification: Omit<PushNotification, 'id' | 'sent_at'>,
    actor?: UserProfile
  ): PushNotification {
    const newNotif: PushNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sent_at: new Date().toISOString(),
      is_read_by: []
    };
    if (!this.store.push_notifications) {
      this.store.push_notifications = [];
    }
    this.store.push_notifications.unshift(newNotif);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'SEND_PUSH_NOTIFICATION', 'PushNotification', newNotif.id, `Sent push: ${newNotif.title_mr || newNotif.title_en}`);
    }
    this.save();
    return newNotif;
  }

  public markNotificationRead(notifId: string, userId: string): boolean {
    const notif = (this.store.push_notifications || []).find(n => n.id === notifId);
    if (!notif) return false;
    if (!notif.is_read_by) notif.is_read_by = [];
    if (!notif.is_read_by.includes(userId)) {
      notif.is_read_by.push(userId);
      this.save();
    }
    return true;
  }

  public deletePushNotification(id: string, actor?: UserProfile): boolean {
    if (!this.store.push_notifications) return false;
    const initialLen = this.store.push_notifications.length;
    this.store.push_notifications = this.store.push_notifications.filter(n => n.id !== id);
    if (this.store.push_notifications.length !== initialLen) {
      if (actor) {
        this.logAudit(actor.id, actor.name, actor.role, 'DELETE_PUSH_NOTIFICATION', 'PushNotification', id, `Deleted push notification`);
      }
      this.save();
      return true;
    }
    return false;
  }

  public createUser(user: Partial<UserProfile> & {
    email: string;
    name: string;
    password?: string;
    mobile?: string;
    phone?: string;
    district?: string;
    taluka?: string;
    village_city?: string;
    pincode?: string;
    fullAddress?: string;
    address?: string;
    avatar?: string;
    avatarUrl?: string;
  }): UserProfile {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      email: user.email.toLowerCase().trim(),
      mobile: user.mobile || user.phone,
      phone: user.mobile || user.phone,
      district: user.district || '',
      taluka: user.taluka || '',
      village_city: user.village_city || '',
      pincode: user.pincode || '',
      fullAddress: user.fullAddress || user.address || '',
      address: user.fullAddress || user.address || '',
      avatar: user.avatar || user.avatarUrl || '',
      avatarUrl: user.avatar || user.avatarUrl || '',
      name: user.name,
      role: user.role || 'student',
      preferredLanguage: user.preferredLanguage || 'en',
      targetExam: user.targetExam || 'AIIMS NORCET + महाराष्ट्र स्टाफ नर्स',
      dailyTarget: user.dailyTarget || 20,
      streakDays: 1,
      points: 50,
      isPremium: !!user.isPremium,
      referralCode: user.referralCode || this.makeReferralCode(user.name, user.email),
      referredByCode: user.referredByCode,
      referralCount: 0,
      referralRewardDays: 0,
      referralRewardHistory: [],
      promotional_grants: [],
      createdAt: new Date().toISOString()
    };
    if (user.password) {
      const { hash, salt } = this.hashPassword(user.password);
      newUser.passwordHash = hash;
      newUser.passwordSalt = salt;
    }
    this.store.users.push(newUser);
    this.logAudit(newUser.id, newUser.name, newUser.role, 'USER_REGISTER', 'User', newUser.id, `User signed up: ${newUser.name} (${newUser.email})`);
    this.save();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const idx = this.store.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    
    // Normalize aliases
    if (updates.mobile) updates.phone = updates.mobile;
    if (updates.phone) updates.mobile = updates.phone;
    if (updates.fullAddress !== undefined) updates.address = updates.fullAddress;
    if (updates.address !== undefined) updates.fullAddress = updates.address;
    if (updates.avatar !== undefined) updates.avatarUrl = updates.avatar;
    if (updates.avatarUrl !== undefined) updates.avatar = updates.avatarUrl;

    this.store.users[idx] = { ...this.store.users[idx], ...updates };
    this.save();
    return this.processSubscriptionValidity(this.store.users[idx]);
  }

  // ---------------------------------------------------------------
  // Password hashing (Node's built-in scrypt — no extra dependency)
  // ---------------------------------------------------------------
  public hashPassword(password: string): { hash: string; salt: string } {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return { hash, salt };
  }

  public verifyPassword(user: UserProfile, password: string): boolean {
    if (!user.passwordHash || !user.passwordSalt) {
      // Legacy/never-set-password account: treat as "no password protection yet".
      return true;
    }
    const attemptHash = crypto.scryptSync(password || '', user.passwordSalt, 64).toString('hex');
    try {
      return crypto.timingSafeEqual(Buffer.from(attemptHash, 'hex'), Buffer.from(user.passwordHash, 'hex'));
    } catch {
      return false;
    }
  }

  public setUserPassword(id: string, password: string): UserProfile | null {
    const { hash, salt } = this.hashPassword(password);
    return this.updateUser(id, { passwordHash: hash, passwordSalt: salt });
  }

  // ---------------------------------------------------------------
  // Single-device login lock
  // ---------------------------------------------------------------
  /** Returns { ok:true } if this device is allowed to use the account (and binds it on first use). */
  public checkAndBindDevice(id: string, deviceId: string, deviceName?: string): { ok: boolean; reason?: string } {
    const user = this.getUserById(id);
    if (!user) return { ok: false, reason: 'User not found' };
    if (!deviceId) return { ok: true }; // old client without device info - don't hard-block
    // Only bind/lock device if user is a paid PRO subscriber
    if (!user.isPremium) {
      return { ok: true };
    }
    if (!user.deviceId) {
      this.updateUser(id, { deviceId, deviceName: deviceName || 'Unknown device', deviceBoundAt: new Date().toISOString() });
      return { ok: true };
    }
    if (user.deviceId !== deviceId) {
      return { ok: false, reason: 'DEVICE_MISMATCH' };
    }
    return { ok: true };
  }

  public resetUserDevice(id: string): UserProfile | null {
    return this.updateUser(id, { deviceId: undefined, deviceName: undefined, deviceBoundAt: undefined });
  }

  /** Strip server-only secrets before sending a user object to the client. */
  public sanitizeUser(user: UserProfile): UserProfile {
    const { passwordHash, passwordSalt, ...safe } = user;
    return safe as UserProfile;
  }

  // Subjects
  public getSubjects(): Subject[] {
    return this.store.subjects.map(s => {
      const subQs = this.getAvailableMcqsByTarget(s.id, { status: 'published' });
      return {
        ...s,
        totalQuestions: subQs.length, // Exact dynamic count of published MCQs
        freeQuestionsCount: subQs.filter(q => q.is_free).length
      };
    });
  }

  public getSubjectById(id: string): Subject | undefined {
    return this.getSubjects().find(s => s.id === id);
  }

  public addSubject(subject: Subject, actor?: UserProfile): Subject {
    this.store.subjects.push(subject);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'CREATE_SUBJECT', 'Subject', subject.id, `Added subject: ${subject.name_en}`);
    }
    this.save();
    return subject;
  }

  /**
   * Authoritative method to retrieve available MCQs for a given target (subject, chapter, or topic).
   * Guarantees that the count on the Chapter/Subject card and the questions returned in Practice Mode
   * use the EXACT SAME filter logic.
   */
  public getAvailableMcqsByTarget(targetId?: string, filters?: {
    difficulty?: string;
    status?: string;
    is_verified_pyq?: boolean;
    is_free?: boolean;
    topic_id?: string;
    chapter_id?: string;
    subject_id?: string;
    search?: string;
  }): Question[] {
    const defaultStatus = filters?.status !== undefined ? filters.status : 'published';
    const effectiveFilters = {
      ...filters,
      status: defaultStatus
    };

    if (targetId && targetId !== 'all') {
      const isSub = (this.store.subjects || []).some(s => s.id === targetId);
      const isCh = (this.store.chapters || []).some(c => c.id === targetId);
      const isTop = (this.store.topics || []).some(t => t.id === targetId);

      if (isSub) {
        effectiveFilters.subject_id = targetId;
      } else if (isCh) {
        effectiveFilters.chapter_id = targetId;
      } else if (isTop) {
        effectiveFilters.topic_id = targetId;
      } else {
        if (targetId.startsWith('subj-')) effectiveFilters.subject_id = targetId;
        else if (targetId.startsWith('ch-')) effectiveFilters.chapter_id = targetId;
        else if (targetId.startsWith('top-')) effectiveFilters.topic_id = targetId;
      }
    }

    return this.getQuestions(effectiveFilters);
  }

  // Chapters & Topics
  public getChapters(subjectId?: string): Chapter[] {
    const list = this.store.chapters || [];
    const mapped = list.map(ch => {
      const chQs = this.getAvailableMcqsByTarget(ch.id, { status: 'published' });
      return {
        ...ch,
        totalQuestions: chQs.length, // Exact dynamic count of published MCQs
        freeQuestionsCount: chQs.filter(q => q.is_free).length
      };
    });
    return subjectId ? mapped.filter(c => c.subject_id === subjectId) : mapped;
  }

  public getTopics(chapterId?: string, subjectId?: string): Topic[] {
    let list = this.store.topics || [];
    if (chapterId) list = list.filter(t => t.chapter_id === chapterId);
    if (subjectId) list = list.filter(t => t.subject_id === subjectId);
    return list.map(t => {
      const topQs = this.getAvailableMcqsByTarget(t.id, { status: 'published' });
      return {
        ...t,
        totalQuestions: topQs.length,
        freeQuestionsCount: topQs.filter(q => q.is_free).length
      };
    });
  }

  public addChapter(chapter: Omit<Chapter, 'id'>, actor?: UserProfile): Chapter {
    const newCh: Chapter = {
      ...chapter,
      id: `ch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    if (!this.store.chapters) this.store.chapters = [];
    this.store.chapters.push(newCh);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'CREATE_CHAPTER', 'Chapter', newCh.id, `Created chapter: ${newCh.name_en}`);
    }
    this.save();
    return newCh;
  }

  public addTopic(topic: Omit<Topic, 'id'>, actor?: UserProfile): Topic {
    const newTop: Topic = {
      ...topic,
      id: `top-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    if (!this.store.topics) this.store.topics = [];
    this.store.topics.push(newTop);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'CREATE_TOPIC', 'Topic', newTop.id, `Created topic: ${newTop.name_en}`);
    }
    this.save();
    return newTop;
  }

  // Content Gaps & Syllabus Coverage
  public getContentGaps(): SyllabusGapItem[] {
    const subjects = this.store.subjects || [];
    const chapters = this.store.chapters || [];
    const topics = this.store.topics || [];
    const questions = this.store.questions || [];
    const cases = this.store.case_studies || [];

    const gaps: SyllabusGapItem[] = [];

    for (const sub of subjects) {
      const subChapters = chapters.filter(c => c.subject_id === sub.id);
      if (subChapters.length === 0) {
        gaps.push({
          subject_id: sub.id,
          subject_name: sub.name_en,
          chapter_id: 'general',
          chapter_name: 'All Chapters',
          topic_id: 'general',
          topic_name: 'Core Curriculum',
          total_questions: questions.filter(q => q.subject_id === sub.id).length,
          published_questions: questions.filter(q => q.subject_id === sub.id && q.status === 'published').length,
          has_pyq: questions.some(q => q.subject_id === sub.id && q.is_verified_pyq),
          has_image_question: questions.some(q => q.subject_id === sub.id && !!q.image_url),
          has_clinical_case: cases.length > 0,
          gap_status: 'critical_zero'
        });
        continue;
      }

      for (const ch of subChapters) {
        const chTopics = topics.filter(t => t.chapter_id === ch.id);
        if (chTopics.length === 0) {
          const qCount = questions.filter(q => q.chapter_id === ch.id || q.subject_id === sub.id).length;
          gaps.push({
            subject_id: sub.id,
            subject_name: sub.name_en,
            chapter_id: ch.id,
            chapter_name: ch.name_en,
            topic_id: 'general',
            topic_name: 'General Topics',
            total_questions: qCount,
            published_questions: questions.filter(q => (q.chapter_id === ch.id || q.subject_id === sub.id) && q.status === 'published').length,
            has_pyq: questions.some(q => q.chapter_id === ch.id && q.is_verified_pyq),
            has_image_question: questions.some(q => q.chapter_id === ch.id && !!q.image_url),
            has_clinical_case: false,
            gap_status: qCount === 0 ? 'critical_zero' : qCount < 5 ? 'low_count' : 'adequate'
          });
          continue;
        }

        for (const top of chTopics) {
          const topQuestions = questions.filter(q => q.topic_id === top.id || (q.chapter_id === ch.id && !q.topic_id));
          const totalQ = topQuestions.length;
          const pubQ = topQuestions.filter(q => q.status === 'published').length;
          const hasPyq = topQuestions.some(q => q.is_verified_pyq);
          const hasImage = topQuestions.some(q => !!q.image_url);

          let status: SyllabusGapItem['gap_status'] = 'critical_zero';
          if (totalQ >= 15) status = 'rich';
          else if (totalQ >= 5) status = 'adequate';
          else if (totalQ > 0) status = 'low_count';

          gaps.push({
            subject_id: sub.id,
            subject_name: sub.name_en,
            chapter_id: ch.id,
            chapter_name: ch.name_en,
            topic_id: top.id,
            topic_name: top.name_en,
            total_questions: totalQ,
            published_questions: pubQ,
            has_pyq: hasPyq,
            has_image_question: hasImage,
            has_clinical_case: cases.length > 0,
            gap_status: status
          });
        }
      }
    }

    return gaps;
  }

  // Questions
  public getQuestions(filters?: {
    subject_id?: string;
    chapter_id?: string;
    topic_id?: string;
    difficulty?: string;
    status?: string;
    is_verified_pyq?: boolean;
    is_free?: boolean;
    case_id?: string;
    search?: string;
  }): Question[] {
    // Determine topic ranking for free question quota (first 5 questions per topic are free)
    const topicCountMap = new Map<string, number>();

    const enrichedList = (this.store.questions || []).map(q => {
      // Find fallback topic if not set
      let assignedTopicId = q.topic_id;
      if (!assignedTopicId) {
        if (q.chapter_id) {
          const matchingTopic = (this.store.topics || []).find(t => t.chapter_id === q.chapter_id);
          if (matchingTopic) assignedTopicId = matchingTopic.id;
        }
        if (!assignedTopicId && q.subject_id) {
          const matchingTopic = (this.store.topics || []).find(t => t.subject_id === q.subject_id);
          if (matchingTopic) assignedTopicId = matchingTopic.id;
        }
      }

      const groupingKey = assignedTopicId || (q.chapter_id ? `ch_${q.chapter_id}` : `sub_${q.subject_id}`);
      const currentRank = (topicCountMap.get(groupingKey) || 0) + 1;
      topicCountMap.set(groupingKey, currentRank);

      // Rule: First 5 questions of every topic are 100% Free
      const calculatedFree = q.is_free !== undefined ? q.is_free : currentRank <= 5;

      return {
        ...q,
        topic_id: assignedTopicId || q.topic_id,
        is_free: calculatedFree
      };
    });

    let list = enrichedList;

    if (filters?.subject_id) {
      const target = filters.subject_id;
      list = list.filter(q => {
        if (q.subject_id === target) return true;
        if (q.chapter_id) {
          const matchCh = (this.store.chapters || []).find(c => c.id === q.chapter_id);
          return matchCh && matchCh.subject_id === target;
        }
        return false;
      });
    }
    if (filters?.chapter_id) {
      const target = filters.chapter_id;
      list = list.filter(q => q.chapter_id === target);
    }
    if (filters?.topic_id) {
      list = list.filter(q => q.topic_id === filters.topic_id);
    }
    if (filters?.difficulty) {
      list = list.filter(q => q.difficulty === filters.difficulty);
    }
    if (filters?.status) {
      const targetStatus = filters.status;
      list = list.filter(q => !q.status || q.status === targetStatus || (targetStatus === 'published' && q.status !== 'archived'));
    }
    if (filters?.is_verified_pyq !== undefined) {
      list = list.filter(q => !!q.is_verified_pyq === filters.is_verified_pyq);
    }
    if (filters?.is_free !== undefined) {
      list = list.filter(q => !!q.is_free === filters.is_free);
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
    const data = { ...questionData };
    // Auto-sync subject_id if chapter_id is provided
    if (data.chapter_id && !data.subject_id) {
      const ch = (this.store.chapters || []).find(c => c.id === data.chapter_id);
      if (ch) data.subject_id = ch.subject_id;
    }
    // Auto-sync chapter_id and subject_id if topic_id is provided
    if (data.topic_id) {
      const top = (this.store.topics || []).find(t => t.id === data.topic_id);
      if (top) {
        if (!data.chapter_id && top.chapter_id) data.chapter_id = top.chapter_id;
        if (!data.subject_id && top.subject_id) data.subject_id = top.subject_id;
      }
    }

    const hash = this.computeDuplicateHash(data.question_en);
    const newQ: Question = {
      ...data,
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

  public createQuestion(question: Question): Question {
    const existingIdx = this.store.questions.findIndex(q => q.id === question.id);
    if (existingIdx !== -1) {
      this.store.questions[existingIdx] = { ...this.store.questions[existingIdx], ...question };
    } else {
      this.store.questions.push(question);
    }
    this.save();
    return question;
  }

  public createAuditLog(entry: AuditLogEntry): AuditLogEntry {
    if (!this.store.audit_logs) {
      this.store.audit_logs = [];
    }
    this.store.audit_logs.unshift(entry);
    this.save();
    return entry;
  }

  public updateQuestion(id: string, updates: Partial<Question>, actor?: UserProfile): Question | null {
    const idx = this.store.questions.findIndex(q => q.id === id);
    if (idx === -1) return null;
    const old = this.store.questions[idx];
    const newHash = updates.question_en ? this.computeDuplicateHash(updates.question_en) : old.duplicate_hash;

    const effectiveUpdates = { ...updates };
    if (effectiveUpdates.chapter_id && !effectiveUpdates.subject_id) {
      const ch = (this.store.chapters || []).find(c => c.id === effectiveUpdates.chapter_id);
      if (ch) effectiveUpdates.subject_id = ch.subject_id;
    }

    const updated: Question = {
      ...old,
      ...effectiveUpdates,
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

  public checkDuplicate(text: string, currentId?: string): { isDuplicate: boolean; matchedQuestion?: Question } {
    const hash = this.computeDuplicateHash(text);
    const match = this.store.questions.find(q => q.duplicate_hash === hash && (!currentId || q.id !== currentId));
    return {
      isDuplicate: !!match,
      matchedQuestion: match
    };
  }

  public deleteQuestion(id: string, actor?: UserProfile): boolean {
    const idx = this.store.questions.findIndex(q => q.id === id);
    if (idx === -1) return false;
    const removed = this.store.questions.splice(idx, 1)[0];
    if (removed.image_public_id) {
      deleteFromCloudinary(removed.image_public_id).catch(e => console.warn('Cloudinary cleanup error', e));
    }
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'DELETE_QUESTION', 'Question', id, `Deleted question: ${removed.question_en.substring(0, 40)}...`);
    }
    this.save();
    return true;
  }

  public bulkDeleteQuestions(ids: string[], actor?: UserProfile): number {
    let count = 0;
    for (const id of ids) {
      const idx = this.store.questions.findIndex(q => q.id === id);
      if (idx !== -1) {
        const removed = this.store.questions.splice(idx, 1)[0];
        if (removed.image_public_id) {
          deleteFromCloudinary(removed.image_public_id).catch(e => console.warn('Cloudinary cleanup error', e));
        }
        count++;
      }
    }
    if (count > 0 && actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'BULK_DELETE_QUESTIONS', 'Question', `${count} items`, `Bulk deleted ${count} questions`);
    }
    this.save();
    return count;
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

  public updateMockTest(id: string, updates: Partial<MockTest>, actor?: UserProfile): MockTest {
    const idx = this.store.mock_tests.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Mock test not found');
    this.store.mock_tests[idx] = {
      ...this.store.mock_tests[idx],
      ...updates
    };
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'UPDATE_MOCK_TEST', 'MockTest', id, `Updated test: ${this.store.mock_tests[idx].title_en}`);
    }
    this.save();
    return this.store.mock_tests[idx];
  }

  public toggleMockTestActive(id: string, isActive: boolean, actor?: UserProfile): MockTest {
    const idx = this.store.mock_tests.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Mock test not found');
    this.store.mock_tests[idx].is_active = isActive;
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'TOGGLE_MOCK_TEST_ACTIVE', 'MockTest', id, `Set test ${id} active status to ${isActive}`);
    }
    this.save();
    return this.store.mock_tests[idx];
  }

  public addProctoringSnapshot(snapshot: ProctoringSnapshot): ProctoringSnapshot {
    this.store.proctoring_snapshots = this.store.proctoring_snapshots || [];
    this.store.proctoring_snapshots.push(snapshot);
    this.save();
    return snapshot;
  }

  public getProctoringSnapshots(testId?: string, userId?: string): ProctoringSnapshot[] {
    let list = this.store.proctoring_snapshots || [];
    if (testId) list = list.filter(s => s.test_id === testId);
    if (userId) list = list.filter(s => s.user_id === userId);
    return list;
  }

  public deleteProctoringSnapshot(id: string, actor?: UserProfile): boolean {
    this.store.proctoring_snapshots = this.store.proctoring_snapshots || [];
    const initialLen = this.store.proctoring_snapshots.length;
    this.store.proctoring_snapshots = this.store.proctoring_snapshots.filter(s => s.id !== id);
    if (this.store.proctoring_snapshots.length < initialLen) {
      if (actor) {
        this.logAudit(actor.id, actor.name, actor.role, 'DELETE_PROCTORING_SNAPSHOT', 'ProctoringSnapshot', id, `Deleted proctoring snapshot ${id}`);
      }
      this.save();
      return true;
    }
    return false;
  }

  public toggleStarStudent(userId: string, isStar: boolean, actor?: UserProfile): UserProfile {
    const user = this.store.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    user.is_star_student = isStar;
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'TOGGLE_STAR_STUDENT', 'UserProfile', userId, `Set star student status to ${isStar}`);
    }
    this.save();
    return user;
  }

  public bulkGenerateMockTests(
    params: {
      pattern: 'maharashtra' | 'aiims';
      count: number;
      questionsPerTest: number;
    },
    actor?: UserProfile
  ): { success: boolean; createdCount: number; tests: MockTest[] } {
    const allQuestions = this.store.questions || [];
    if (allQuestions.length === 0) {
      throw new Error('No questions available in the question bank to generate mock tests');
    }

    const created: MockTest[] = [];
    const isMaharashtra = params.pattern === 'maharashtra';
    const examName = isMaharashtra ? 'Maharashtra Govt (DMER / DHS / ZP)' : 'AIIMS NORCET';
    const negRate = isMaharashtra ? 0.25 : 0.33;
    const duration = isMaharashtra ? 90 : 180;
    const marks = params.questionsPerTest;

    for (let i = 1; i <= params.count; i++) {
      const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
      const selectedQ = shuffled.slice(0, Math.min(params.questionsPerTest, shuffled.length));
      const qIds = selectedQ.map(q => q.id);

      const titleEn = isMaharashtra
        ? `Maharashtra Govt Nursing Officer Mock Test ${i} (DMER/DHS Pattern)`
        : `AIIMS NORCET High-Yield Mock Test ${i} (CBT Pattern)`;

      const titleMr = isMaharashtra
        ? `महाराष्ट्र शासन नर्सिंग ऑफिसर सराव चाचणी ${i} (डीएमईआर/डीएचएस पॅटर्न)`
        : `एम्स नॉर्सेट (AIIMS NORCET) विशेष मॉक टेस्ट ${i}`;

      const newTest: MockTest = {
        id: `mock-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        title_en: titleEn,
        title_mr: titleMr,
        exam_name: examName,
        description: isMaharashtra
          ? 'Comprehensive practice test following Maharashtra Health Department (DMER/DHS/ZP) exam guidelines with bilingual support and clinical MCQs.'
          : 'High-yield AIIMS NORCET multi-disciplinary CBT mock test with negative marking and image-based clinical scenarios.',
        duration_minutes: duration,
        total_marks: marks,
        passing_marks: Math.round(marks * 0.5),
        negative_marking_rate: negRate,
        question_ids: qIds,
        is_published: true,
        is_premium: false,
        created_at: new Date().toISOString()
      };

      this.store.mock_tests.push(newTest);
      created.push(newTest);
    }

    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'BULK_GENERATE_MOCK_TESTS', 'MockTest', 'bulk', `Bulk generated ${params.count} tests for ${examName}`);
    }
    this.save();
    return { success: true, createdCount: created.length, tests: created };
  }

  public deleteMockTest(id: string, actor?: UserProfile): { success: boolean } {
    const idx = this.store.mock_tests.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Mock test not found');
    const removed = this.store.mock_tests.splice(idx, 1)[0];
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'DELETE_MOCK_TEST', 'MockTest', id, `Deleted test: ${removed.title_en}`);
    }
    this.save();
    return { success: true };
  }

  public clearAllMockTests(actor?: UserProfile): { success: boolean } {
    const count = this.store.mock_tests.length;
    this.store.mock_tests = [];
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'CLEAR_ALL_MOCK_TESTS', 'MockTest', 'all', `Cleared all ${count} mock tests`);
    }
    this.save();
    return { success: true };
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

  // Audit Logs (with 45-day auto deletion policy & bulk management)
  public cleanupOldAuditLogs(days = 45): number {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const beforeCount = (this.store.audit_logs || []).length;
    this.store.audit_logs = (this.store.audit_logs || []).filter(log => {
      const logTime = new Date(log.created_at).getTime();
      return !isNaN(logTime) && logTime >= cutoff;
    });
    const deletedCount = beforeCount - this.store.audit_logs.length;
    if (deletedCount > 0) {
      this.save();
    }
    return deletedCount;
  }

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
    if (!this.store.audit_logs) this.store.audit_logs = [];
    this.store.audit_logs.unshift(entry);
    // Auto-clean logs older than 45 days
    this.cleanupOldAuditLogs(45);
    // Keep max 1000 logs
    if (this.store.audit_logs.length > 1000) {
      this.store.audit_logs = this.store.audit_logs.slice(0, 1000);
    }
    this.save();
    return entry;
  }

  public getAuditLogs(): AuditLogEntry[] {
    this.cleanupOldAuditLogs(45);
    return this.store.audit_logs || [];
  }

  public deleteAuditLog(id: string, actor?: UserProfile): boolean {
    if (!this.store.audit_logs) return false;
    const before = this.store.audit_logs.length;
    this.store.audit_logs = this.store.audit_logs.filter(l => l.id !== id);
    if (this.store.audit_logs.length < before) {
      this.save();
      return true;
    }
    return false;
  }

  public deleteAuditLogsBulk(ids?: string[], actor?: UserProfile): number {
    if (!this.store.audit_logs) return 0;
    const before = this.store.audit_logs.length;
    if (ids && ids.length > 0) {
      const set = new Set(ids);
      this.store.audit_logs = this.store.audit_logs.filter(l => !set.has(l.id));
    } else {
      // Clear all audit logs
      this.store.audit_logs = [];
    }
    const deletedCount = before - this.store.audit_logs.length;
    if (deletedCount > 0) {
      this.save();
    }
    return deletedCount;
  }

  // -------------------------------------------------------------
  // CLOUDINARY & UPLOADED MEDIA GALLERY SUBSYSTEM
  // -------------------------------------------------------------
  public getUploadedMedia(): UploadedMediaItem[] {
    const list: UploadedMediaItem[] = [...(this.store.uploaded_media || [])];
    const existingUrls = new Set(list.map(m => m.url));

    // Aggregate from Question images
    for (const q of this.store.questions || []) {
      if (q.image_url && !existingUrls.has(q.image_url)) {
        existingUrls.add(q.image_url);
        list.push({
          id: `med-q-${q.id}`,
          url: q.image_url,
          public_id: q.image_public_id || `question_${q.id}`,
          resource_type: 'image',
          folder: 'questions',
          source_context: `Question (${q.subject_id || 'MCQ'})`,
          created_at: q.created_at || new Date().toISOString()
        });
      }
    }

    // Aggregate from Payment screenshots
    for (const p of this.store.payments || []) {
      if (p.screenshot_url && !existingUrls.has(p.screenshot_url)) {
        existingUrls.add(p.screenshot_url);
        list.push({
          id: `med-pay-${p.id}`,
          url: p.screenshot_url,
          public_id: p.screenshot_public_id || `payment_${p.id}`,
          resource_type: 'image',
          folder: 'payment_proofs',
          source_context: `Payment UTR: ${p.utr_number} (${p.user_name})`,
          created_at: p.submitted_at || new Date().toISOString()
        });
      }
    }

    // Aggregate from Promo Ads & Video Banners
    for (const ad of this.store.promo_ads || []) {
      if (ad.thumbnail_url && !existingUrls.has(ad.thumbnail_url)) {
        existingUrls.add(ad.thumbnail_url);
        list.push({
          id: `med-ad-thumb-${ad.id}`,
          url: ad.thumbnail_url,
          public_id: ad.cloudinary_public_id || `ad_thumb_${ad.id}`,
          resource_type: 'image',
          folder: 'promo_ads',
          source_context: `Promo Banner: ${ad.title_en || ad.id}`,
          created_at: ad.created_at || new Date().toISOString()
        });
      }
    }

    // Aggregate from Successful Students photos
    for (const st of this.store.successful_students || []) {
      if (st.photo_url && !existingUrls.has(st.photo_url)) {
        existingUrls.add(st.photo_url);
        list.push({
          id: `med-st-${st.id}`,
          url: st.photo_url,
          public_id: `student_${st.id}`,
          resource_type: 'image',
          folder: 'successful_students',
          source_context: `Topper Photo: ${st.student_name}`,
          created_at: new Date().toISOString()
        });
      }
    }

    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public addUploadedMedia(item: Omit<UploadedMediaItem, 'id' | 'created_at'>): UploadedMediaItem {
    if (!this.store.uploaded_media) this.store.uploaded_media = [];
    const newMedia: UploadedMediaItem = {
      ...item,
      id: `med-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString()
    };
    this.store.uploaded_media.unshift(newMedia);
    this.save();
    return newMedia;
  }

  public deleteUploadedMedia(identifier: string, actor?: UserProfile): boolean {
    if (!this.store.uploaded_media) this.store.uploaded_media = [];
    const beforeLen = this.store.uploaded_media.length;
    this.store.uploaded_media = this.store.uploaded_media.filter(
      m => m.id !== identifier && m.public_id !== identifier && m.url !== identifier
    );
    if (this.store.uploaded_media.length < beforeLen) {
      if (actor) {
        this.logAudit(actor.id, actor.name, actor.role, 'DELETE_MEDIA', 'Media', identifier, `Deleted media item ${identifier}`);
      }
      this.save();
      return true;
    }
    return true;
  }

  public deleteUploadedMediaBulk(identifiers: string[], actor?: UserProfile): number {
    if (!this.store.uploaded_media) this.store.uploaded_media = [];
    const beforeLen = this.store.uploaded_media.length;
    const set = new Set(identifiers);
    this.store.uploaded_media = this.store.uploaded_media.filter(
      m => !set.has(m.id) && !set.has(m.public_id) && !set.has(m.url)
    );
    const deletedCount = beforeLen - this.store.uploaded_media.length;
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'BULK_DELETE_MEDIA', 'Media', 'bulk', `Deleted ${identifiers.length} media items`);
    }
    this.save();
    return deletedCount || identifiers.length;
  }

  // Settings
  public getSettings(): SystemSettings {
    return this.store.settings;
  }

  public getSystemSettings(): SystemSettings {
    return this.getSettings();
  }

  public updateSettings(settings: Partial<SystemSettings>, actor?: UserProfile): SystemSettings {
    this.store.settings = { ...this.store.settings, ...settings };
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'UPDATE_SETTINGS', 'Settings', 'global', 'System settings updated');
    }
    this.save();
    return this.store.settings;
  }

  // Payment Plans & Manual QR Subsystem
  public getPaymentPlans(): PaymentPlan[] {
    let list = (this.store.payment_plans || []).filter(Boolean);
    if (list.length === 0) {
      list = [...INITIAL_PAYMENT_PLANS];
    }
    // Ensure all standard initial plans exist
    for (const initPlan of INITIAL_PAYMENT_PLANS) {
      if (!list.some(p => p.id === initPlan.id)) {
        list.push(initPlan);
      }
    }
    this.store.payment_plans = list;
    return list;
  }

  public markPaymentApproved(id: string) {
    const p = (this.store.payments || []).find(x => x.id === id);
    if (!p) return false;
    p.status = 'APPROVED';
    p.verified_at = new Date().toISOString();
    this.save();
    return true;
  }

  public getPaymentPlanById(id: string): PaymentPlan | undefined {
    return this.getPaymentPlans().find(p => p.id === id);
  }

  public createPaymentPlan(plan: Omit<PaymentPlan, 'id'>, actor?: UserProfile): PaymentPlan {
    const newPlan: PaymentPlan = {
      ...plan,
      id: `plan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    if (!this.store.payment_plans) this.store.payment_plans = [];
    this.store.payment_plans.push(newPlan);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'CREATE_PAYMENT_PLAN', 'PaymentPlan', newPlan.id, `Created plan ${newPlan.name} for ₹${newPlan.price}`);
    }
    this.save();
    return newPlan;
  }

  public updatePaymentPlan(id: string, updates: Partial<PaymentPlan>, actor?: UserProfile): PaymentPlan | undefined {
    const plan = this.getPaymentPlanById(id);
    if (!plan) return undefined;
    Object.assign(plan, updates);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'UPDATE_PAYMENT_PLAN', 'PaymentPlan', id, `Updated plan ${plan.name}`);
    }
    this.save();
    return plan;
  }

  public deletePaymentPlan(id: string, actor?: UserProfile): boolean {
    if (!this.store.payment_plans) return false;
    const idx = this.store.payment_plans.findIndex(p => p.id === id);
    if (idx === -1) return false;
    const removed = this.store.payment_plans.splice(idx, 1)[0];
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'DELETE_PAYMENT_PLAN', 'PaymentPlan', id, `Deleted plan ${removed.name}`);
    }
    this.save();
    return true;
  }

  // Payments / Manual QR Verification Subsystem
  public getPayments(): PaymentRecord[] {
    return this.store.payments || [];
  }

  public getPaymentsByUser(userId: string): PaymentRecord[] {
    return (this.store.payments || []).filter(p => p.user_id === userId);
  }

  public submitPayment(data: {
    user_id: string;
    user_name: string;
    user_email: string;
    plan_id: string;
    utr_number: string;
    screenshot_url?: string;
    screenshot_public_id?: string;
    payment_method?: 'MANUAL_QR' | 'RAZORPAY';
    amount?: number;
  }): PaymentRecord {
    const plan = this.getPaymentPlanById(data.plan_id);
    const newRecord: PaymentRecord = {
      id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: data.user_id,
      user_name: data.user_name,
      user_email: data.user_email,
      plan_id: data.plan_id,
      plan_name: plan?.name || 'PRO Membership',
      amount: data.amount ?? plan?.price ?? 99,
      currency: plan?.currency || 'INR',
      payment_method: data.payment_method || 'MANUAL_QR',
      utr_number: data.utr_number.trim(),
      screenshot_url: data.screenshot_url,
      screenshot_public_id: data.screenshot_public_id,
      status: 'PENDING',
      submitted_at: new Date().toISOString()
    };

    if (!this.store.payments) this.store.payments = [];
    this.store.payments.unshift(newRecord);
    this.logAudit(data.user_id, data.user_name, 'student', 'SUBMIT_PAYMENT_UTR', 'PaymentRecord', newRecord.id, `Submitted UTR ${newRecord.utr_number} for plan ${newRecord.plan_name}`);
    this.save();
    return newRecord;
  }

  public processRazorpayPaymentAuto(data: {
    user_id: string; user_name: string; user_email: string; plan_id: string;
    razorpay_payment_id: string; razorpay_order_id?: string; amount?: number;
  }): PaymentRecord {
    const existing = (this.store.payments || []).find(p => p.payment_method === 'RAZORPAY' && p.utr_number === data.razorpay_payment_id && p.status === 'APPROVED');
    if (existing) return existing;
    const plan = this.getPaymentPlanById(data.plan_id);
    const now = new Date();
    const days = plan?.duration_days || 90;
    
    // Renewal / extension calculation
    const user = this.store.users.find(u => u.id === data.user_id);
    let startDate = now.toISOString();
    let expiryDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    if (user && user.planEndDate && new Date(user.planEndDate).getTime() > now.getTime()) {
      // User is currently active: extend subscription
      const currentEndMs = new Date(user.planEndDate).getTime();
      expiryDate = new Date(currentEndMs + days * 24 * 60 * 60 * 1000);
      startDate = user.planStartDate || now.toISOString();
    }

    const newRecord: PaymentRecord = {
      id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: data.user_id,
      user_name: data.user_name,
      user_email: data.user_email,
      plan_id: data.plan_id,
      plan_name: plan?.name || 'Paid Membership Plan',
      amount: data.amount ?? plan?.price ?? 99,
      currency: plan?.currency || 'INR',
      payment_method: 'RAZORPAY',
      utr_number: data.razorpay_payment_id,
      status: 'APPROVED',
      admin_reviewer_id: 'system_razorpay',
      admin_reviewer_name: 'Razorpay Auto Gateway',
      admin_notes: `Automated instant verification via Razorpay Gateway (Payment: ${data.razorpay_payment_id}, Order: ${data.razorpay_order_id || 'N/A'})`,
      submitted_at: now.toISOString(),
      verified_at: now.toISOString(),
      expires_at: expiryDate.toISOString()
    };

    if (!this.store.payments) this.store.payments = [];
    this.store.payments.unshift(newRecord);

    // Activate only the entitlements purchased by this plan.
    if (user) {
      const type = plan?.plan_type;
      if (type === 'PRO_MCQ') {
        user.hasMcqAccess = true;
      } else if (type === 'TEST_SERIES') {
        user.hasTestSeriesAccess = true;
      } else if (type === 'YOUTUBE') {
        user.hasYoutubeAccess = true;
      } else if (type === 'COMBO') {
        user.hasMcqAccess = true;
        user.hasTestSeriesAccess = true;
        user.hasYoutubeAccess = true;
      } else {
        // Fallback for custom or legacy plans
        user.hasMcqAccess = true;
      }
      user.isPremium = Boolean(user.hasMcqAccess || user.hasTestSeriesAccess || user.hasYoutubeAccess);
      user.planId = data.plan_id;
      user.planName = plan?.name || 'Paid Plan';
      user.planStartDate = startDate;
      user.planEndDate = expiryDate.toISOString();
      const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      user.daysRemaining = Math.max(0, diffDays);
    }

    this.logAudit(data.user_id, data.user_name, 'student', 'AUTO_RAZORPAY_PAYMENT', 'PaymentRecord', newRecord.id, `Razorpay automated payment successful (₹${newRecord.amount}). Entitlement activated till ${expiryDate.toISOString()}`);
    this.save();
    return newRecord;
  }

  public verifyPayment(
    paymentId: string,
    action: 'APPROVE' | 'REJECT',
    notes: string,
    reviewer: UserProfile
  ): PaymentRecord | undefined {
    const record = (this.store.payments || []).find(p => p.id === paymentId);
    if (!record) return undefined;

    const now = new Date();
    record.admin_reviewer_id = reviewer.id;
    record.admin_reviewer_name = reviewer.name;
    record.admin_notes = notes;

    if (action === 'APPROVE') {
      record.status = 'APPROVED';
      record.verified_at = now.toISOString();
      const plan = this.getPaymentPlanById(record.plan_id);
      const days = plan?.duration_days || 90;

      const user = this.store.users.find(u => u.id === record.user_id);
      let startDate = now.toISOString();
      let expiryDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

      if (user && user.planEndDate && new Date(user.planEndDate).getTime() > now.getTime()) {
        const currentEndMs = new Date(user.planEndDate).getTime();
        expiryDate = new Date(currentEndMs + days * 24 * 60 * 60 * 1000);
        startDate = user.planStartDate || now.toISOString();
      }

      record.expires_at = expiryDate.toISOString();

      // Upgrade User Entitlements
      if (user) {
        const type = plan?.plan_type;
        if (type === 'PRO_MCQ') {
          user.hasMcqAccess = true;
        } else if (type === 'TEST_SERIES') {
          user.hasTestSeriesAccess = true;
        } else if (type === 'YOUTUBE') {
          user.hasYoutubeAccess = true;
        } else if (type === 'COMBO') {
          user.hasMcqAccess = true;
          user.hasTestSeriesAccess = true;
          user.hasYoutubeAccess = true;
        } else {
          user.hasMcqAccess = true;
        }
        user.isPremium = Boolean(user.hasMcqAccess || user.hasTestSeriesAccess || user.hasYoutubeAccess);
        user.planId = record.plan_id;
        user.planName = record.plan_name;
        user.planStartDate = startDate;
        user.planEndDate = expiryDate.toISOString();
        const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        user.daysRemaining = Math.max(0, diffDays);
      }
      this.logAudit(reviewer.id, reviewer.name, reviewer.role, 'APPROVE_PAYMENT', 'PaymentRecord', paymentId, `Approved payment of ₹${record.amount} for user ${record.user_email}. Entitlements unlocked until ${record.expires_at}`);
    } else {
      record.status = 'REJECTED';
      record.rejection_reason = notes || 'Invalid UTR or screenshot mismatch.';
      this.logAudit(reviewer.id, reviewer.name, reviewer.role, 'REJECT_PAYMENT', 'PaymentRecord', paymentId, `Rejected payment UTR ${record.utr_number}: ${record.rejection_reason}`);
    }

    this.save();
    return record;
  }

  // Study Materials & PDFs
  public getStudyMaterials(): StudyMaterial[] {
    return this.store.study_materials || [];
  }

  public addStudyMaterial(material: Omit<StudyMaterial, 'id' | 'created_at'>, actor?: UserProfile): StudyMaterial {
    const newMat: StudyMaterial = {
      ...material,
      id: `mat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString()
    };
    if (!this.store.study_materials) this.store.study_materials = [];
    this.store.study_materials.unshift(newMat);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'ADD_STUDY_MATERIAL', 'StudyMaterial', newMat.id, `Added material: ${newMat.title}`);
    }
    this.save();
    return newMat;
  }

  public deleteStudyMaterial(id: string, actor?: UserProfile): boolean {
    if (!this.store.study_materials) return false;
    const idx = this.store.study_materials.findIndex(m => m.id === id);
    if (idx === -1) return false;
    const removed = this.store.study_materials.splice(idx, 1)[0];
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'DELETE_STUDY_MATERIAL', 'StudyMaterial', id, `Removed material: ${removed.title}`);
    }
    this.save();
    return true;
  }

  // Recruitment Notices
  public getRecruitmentNotices(): RecruitmentNotice[] {
    return this.store.recruitment_notices || [];
  }

  public addRecruitmentNotice(notice: Omit<RecruitmentNotice, 'id'>, actor?: UserProfile): RecruitmentNotice {
    const newNotice: RecruitmentNotice = {
      ...notice,
      id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString()
    };
    if (!this.store.recruitment_notices) this.store.recruitment_notices = [];
    this.store.recruitment_notices.unshift(newNotice);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'ADD_RECRUITMENT_NOTICE', 'RecruitmentNotice', newNotice.id, `Added notice: ${newNotice.organization} - ${newNotice.post_name}`);
    }
    this.save();
    return newNotice;
  }

  public updateRecruitmentNotice(id: string, updates: Partial<RecruitmentNotice>, actor?: UserProfile): RecruitmentNotice | null {
    if (!this.store.recruitment_notices) return null;
    const idx = this.store.recruitment_notices.findIndex(n => n.id === id);
    if (idx === -1) return null;

    this.store.recruitment_notices[idx] = {
      ...this.store.recruitment_notices[idx],
      ...updates
    };

    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'UPDATE_RECRUITMENT_NOTICE', 'RecruitmentNotice', id, `Updated notice: ${this.store.recruitment_notices[idx].post_name}`);
    }
    this.save();
    return this.store.recruitment_notices[idx];
  }

  public deleteRecruitmentNotice(id: string, actor?: UserProfile): boolean {
    if (!this.store.recruitment_notices) return false;
    const idx = this.store.recruitment_notices.findIndex(n => n.id === id);
    if (idx === -1) return false;

    const removed = this.store.recruitment_notices.splice(idx, 1)[0];
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'DELETE_RECRUITMENT_NOTICE', 'RecruitmentNotice', id, `Deleted notice: ${removed.post_name}`);
    }
    this.save();
    return true;
  }

  public clearAllRecruitmentNotices(actor?: UserProfile): boolean {
    this.store.recruitment_notices = [];
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'CLEAR_ALL_RECRUITMENT_NOTICES', 'RecruitmentNotice', 'all', 'Cleared all recruitment notices');
    }
    this.save();
    return true;
  }

  // Statistics calculation for Student Dashboard & Admin
  public getAdminStats() {
    const totalUsers = this.store.users.length;
    const totalQuestions = this.store.questions.length;
    const publishedQuestions = this.store.questions.filter(q => q.status === 'published').length;
    const draftQuestions = this.store.questions.filter(q => q.status === 'draft').length;
    const inReviewQuestions = this.store.questions.filter(q => q.status === 'in_review').length;
    const verifiedPyqs = this.store.questions.filter(q => q.is_verified_pyq).length;
    const imageQuestions = this.store.questions.filter(q => !!q.image_url).length;
    const clinicalCases = this.store.case_studies.length;
    const totalAttempts = this.store.test_attempts.length;
    const totalTests = this.store.mock_tests.length;
    const pendingReports = this.store.reports.filter(r => r.status === 'pending').length;
    const chaptersCount = (this.store.chapters || []).length;
    const topicsCount = (this.store.topics || []).length;
    const gaps = this.getContentGaps();
    const criticalGapsCount = gaps.filter(g => g.gap_status === 'critical_zero').length;

    return {
      totalUsers,
      totalQuestions,
      publishedQuestions,
      draftQuestions,
      inReviewQuestions,
      verifiedPyqs,
      imageQuestions,
      clinicalCases,
      totalAttempts,
      totalTests,
      pendingReports,
      chaptersCount,
      topicsCount,
      criticalGapsCount,
      totalGapsCount: gaps.length
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

  // --------------------------------------------------------------------------
  // AI QUESTION IMPORT & REVIEW QUEUE SUBSYSTEM
  // --------------------------------------------------------------------------

  public getImportBatches(): ImportBatch[] {
    return (this.store.import_batches || []).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getImportBatchById(id: string): ImportBatch | undefined {
    return (this.store.import_batches || []).find(b => b.id === id);
  }

  public createImportBatch(batch: ImportBatch): ImportBatch {
    if (!this.store.import_batches) {
      this.store.import_batches = [];
    }
    this.store.import_batches.unshift(batch);
    this.save();
    return batch;
  }

  public updateImportBatch(id: string, updates: Partial<ImportBatch>): ImportBatch | null {
    const idx = (this.store.import_batches || []).findIndex(b => b.id === id);
    if (idx === -1) return null;

    this.store.import_batches[idx] = {
      ...this.store.import_batches[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.store.import_batches[idx];
  }

  public deleteImportBatch(id: string): boolean {
    const initialLen = (this.store.import_batches || []).length;
    this.store.import_batches = (this.store.import_batches || []).filter(b => b.id !== id);
    if (this.store.import_batches.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  public getAiImportSettings(): AdminAiImportSettings {
    return this.store.settings.ai_import_settings || INITIAL_AI_IMPORT_SETTINGS;
  }

  public updateAiImportSettings(newSettings: Partial<AdminAiImportSettings>): AdminAiImportSettings {
    const merged: AdminAiImportSettings = {
      ...(this.store.settings.ai_import_settings || INITIAL_AI_IMPORT_SETTINGS),
      ...newSettings
    };
    this.store.settings.ai_import_settings = merged;
    this.save();
    return merged;
  }

  // Approve a single or list of questions from an Import Batch into the Question Bank
  public approveQuestionFromBatch(params: {
    batchId: string;
    questionId: string;
    actorId: string;
    actorName: string;
    modifiedFields?: Partial<ImportedQuestionItem>;
  }): { success: boolean; question?: Question; error?: string } {
    const batch = this.getImportBatchById(params.batchId);
    if (!batch) return { success: false, error: 'Import batch not found' };

    const qItem = batch.questions.find(q => q.id === params.questionId);
    if (!qItem) return { success: false, error: 'Question item not found in batch' };

    // Apply any edits
    if (params.modifiedFields) {
      Object.assign(qItem, params.modifiedFields);
    }

    // Upsert into active Question Bank
    const qbId = qItem.publishedQuestionId || `qb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const finalAnswer = qItem.sourceAnswer || qItem.aiAnswer || 'A';

    const questionToSave: Question = {
      id: qbId,
      subject_id: qItem.detectedSubjectId || 'subj-fon',
      topic_id: qItem.detectedTopicId,
      exam_target: 'both',
      question_en: qItem.question_en,
      question_mr: qItem.question_mr,
      option_a_en: qItem.option_a_en,
      option_a_mr: qItem.option_a_mr,
      option_b_en: qItem.option_b_en,
      option_b_mr: qItem.option_b_mr,
      option_c_en: qItem.option_c_en,
      option_c_mr: qItem.option_c_mr,
      option_d_en: qItem.option_d_en,
      option_d_mr: qItem.option_d_mr,
      correct_option: finalAnswer,
      explanation_en: qItem.explanation_en || qItem.aiExplanation || '',
      explanation_mr: qItem.explanation_mr || '',
      difficulty: qItem.difficulty || 'medium',
      question_type: qItem.questionType || 'single_best',
      status: 'published',
      source: `Batch: ${batch.id} (${qItem.sourceFile})`,
      source_reference: qItem.sourcePage ? `Page ${qItem.sourcePage} - ${qItem.sourceQuestionNumber || ''}` : qItem.sourceQuestionNumber,
      exam_name: qItem.examName || batch.examName || 'AIIMS NORCET / State Nursing Officer Exam',
      exam_year: qItem.examYear || new Date().getFullYear(),
      created_by: params.actorName,
      reviewed_by: params.actorName,
      approved_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: 1,
      is_free: true,
      duplicate_hash: this.computeDuplicateHash(qItem.question_en)
    };

    this.createQuestion(questionToSave);

    // Update item status in batch
    qItem.verificationStatus = 'approved_by_admin';
    qItem.reviewedBy = params.actorName;
    qItem.reviewedAt = new Date().toISOString();
    qItem.publishedQuestionId = qbId;

    // Recalculate batch counters
    batch.autoApprovedCount = batch.questions.filter(q => q.verificationStatus === 'auto_approved' || q.verificationStatus === 'approved_by_admin').length;
    batch.reviewRequiredCount = batch.questions.filter(q => q.verificationStatus === 'review_required' || q.verificationStatus === 'conflict').length;

    this.save();

    this.createAuditLog({
      id: `log-${Date.now()}`,
      actor_id: params.actorId,
      actor_name: params.actorName,
      actor_role: 'admin',
      action: 'APPROVE_IMPORTED_QUESTION',
      entity: 'Question',
      entity_id: qbId,
      details: `Approved question from batch ${batch.id}: "${qItem.question_en.substring(0, 60)}..."`,
      created_at: new Date().toISOString()
    });

    return { success: true, question: questionToSave };
  }

  // Reject a question from a batch
  public rejectQuestionFromBatch(params: {
    batchId: string;
    questionId: string;
    actorId: string;
    actorName: string;
    reason?: string;
  }): { success: boolean; error?: string } {
    const batch = this.getImportBatchById(params.batchId);
    if (!batch) return { success: false, error: 'Import batch not found' };

    const qItem = batch.questions.find(q => q.id === params.questionId);
    if (!qItem) return { success: false, error: 'Question item not found in batch' };

    qItem.verificationStatus = 'rejected';
    qItem.reviewedBy = params.actorName;
    qItem.reviewedAt = new Date().toISOString();
    qItem.reviewNotes = params.reason || 'Rejected during manual review';

    batch.rejectedCount = batch.questions.filter(q => q.verificationStatus === 'rejected').length;
    batch.reviewRequiredCount = batch.questions.filter(q => q.verificationStatus === 'review_required' || q.verificationStatus === 'conflict').length;

    this.save();
    return { success: true };
  }

  // Bulk Approve all high confidence questions in a batch (>= threshold)
  public approveBatchHighConfidence(params: {
    batchId: string;
    minConfidence: number;
    actorId: string;
    actorName: string;
  }): { approvedCount: number; batch: ImportBatch | null } {
    const batch = this.getImportBatchById(params.batchId);
    if (!batch) return { approvedCount: 0, batch: null };

    let count = 0;
    for (const qItem of batch.questions) {
      if (
        (qItem.verificationStatus === 'review_required' || qItem.verificationStatus === 'auto_approved') &&
        qItem.aiConfidence >= params.minConfidence &&
        !qItem.flags.includes('ANSWER_CONFLICT') &&
        !qItem.flags.includes('POSSIBLE_DUPLICATE') &&
        !qItem.publishedQuestionId
      ) {
        this.approveQuestionFromBatch({
          batchId: batch.id,
          questionId: qItem.id,
          actorId: params.actorId,
          actorName: params.actorName
        });
        count++;
      }
    }

    return { approvedCount: count, batch: this.getImportBatchById(params.batchId) || null };
  }

  // Get aggregated pending review queue items
  public getImportReviewQueue(filters?: {
    batchId?: string;
    flag?: string;
    status?: string;
    search?: string;
  }): { items: ImportedQuestionItem[]; totalCount: number } {
    const batches = this.store.import_batches || [];
    let allItems: ImportedQuestionItem[] = [];

    for (const b of batches) {
      if (filters?.batchId && b.id !== filters.batchId) continue;
      for (const q of b.questions) {
        allItems.push(q);
      }
    }

    let filtered = allItems;

    if (filters?.status && filters.status !== 'all') {
      filtered = filtered.filter(q => q.verificationStatus === filters.status);
    } else {
      // By default show items needing review or conflicts
      filtered = filtered.filter(
        q => q.verificationStatus === 'review_required' || q.verificationStatus === 'conflict' || q.verificationStatus === 'duplicate'
      );
    }

    if (filters?.flag && filters.flag !== 'all') {
      filtered = filtered.filter(q => q.flags.includes(filters.flag as any));
    }

    if (filters?.search) {
      const qLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        q =>
          q.question_en.toLowerCase().includes(qLower) ||
          q.sourceFile.toLowerCase().includes(qLower) ||
          (q.detectedSubjectName && q.detectedSubjectName.toLowerCase().includes(qLower)) ||
          (q.detectedTopicName && q.detectedTopicName.toLowerCase().includes(qLower))
      );
    }

    return {
      items: filtered,
      totalCount: filtered.length
    };
  }

  // -------------------------------------------------------------
  // PROMO ADS & VIDEO BANNERS (16:9 and 9:16)
  // -------------------------------------------------------------
  public getPromoAds(filters?: { is_active?: boolean; target_screen?: string }): PromoAd[] {
    let ads = this.store.promo_ads || [];
    if (filters?.is_active !== undefined) {
      ads = ads.filter(a => a.is_active === filters.is_active);
    }
    if (filters?.target_screen && filters.target_screen !== 'all') {
      ads = ads.filter(a => a.target_screen === 'all' || a.target_screen === filters.target_screen);
    }
    return ads.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  }

  public getPromoAdById(id: string): PromoAd | undefined {
    return (this.store.promo_ads || []).find(a => a.id === id);
  }

  public createPromoAd(data: Partial<PromoAd>, actor: UserProfile): PromoAd {
    const id = data.id || `ad-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newAd: PromoAd = {
      id,
      title_en: data.title_en || 'New Nursing Feature & Promo',
      title_mr: data.title_mr || data.title_en || 'नवीन नर्सिंग वैशिष्ट्ये व प्रोमो',
      description_en: data.description_en || '',
      description_mr: data.description_mr || '',
      aspect_ratio: data.aspect_ratio || '16:9',
      media_type: data.media_type || 'video',
      video_url: data.video_url || '',
      thumbnail_url: data.thumbnail_url || '',
      cta_text_en: data.cta_text_en || 'Learn More',
      cta_text_mr: data.cta_text_mr || 'अधिक माहिती मिळवा',
      cta_link: data.cta_link || 'upgrade-pro',
      target_screen: data.target_screen || 'all',
      is_active: data.is_active !== undefined ? data.is_active : true,
      enable_sticky_pip: data.enable_sticky_pip !== undefined ? data.enable_sticky_pip : true,
      order_index: data.order_index !== undefined ? data.order_index : (this.store.promo_ads?.length || 0) + 1,
      badge_text_en: data.badge_text_en || 'Featured Promo',
      badge_text_mr: data.badge_text_mr || 'विशेष जाहिरात',
      sponsor_tag: data.sponsor_tag || 'Nursing Officer Academy',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (!this.store.promo_ads) {
      this.store.promo_ads = [];
    }
    this.store.promo_ads.push(newAd);
    this.save();

    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'CREATE_PROMO_AD',
      'Media',
      newAd.id,
      `Created promo ad: ${newAd.title_en} (${newAd.aspect_ratio})`
    );

    return newAd;
  }

  public updatePromoAd(id: string, data: Partial<PromoAd>, actor: UserProfile): PromoAd | undefined {
    const ad = this.getPromoAdById(id);
    if (!ad) return undefined;

    Object.assign(ad, data, { updated_at: new Date().toISOString() });
    this.save();

    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'UPDATE_PROMO_AD',
      'Media',
      id,
      `Updated promo ad: ${ad.title_en}`
    );

    return ad;
  }

  public deletePromoAd(id: string, actor: UserProfile): boolean {
    const idx = (this.store.promo_ads || []).findIndex(a => a.id === id);
    if (idx === -1) return false;

    const removed = this.store.promo_ads.splice(idx, 1)[0];
    this.save();

    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'DELETE_PROMO_AD',
      'Media',
      id,
      `Deleted promo ad: ${removed.title_en}`
    );

    return true;
  }

  // Promo Code / Offer Code System
  public getPromoCodes(): PromoCode[] {
    return this.store.promo_codes || [];
  }

  public getPromoCodeByCode(code: string): PromoCode | undefined {
    return (this.store.promo_codes || []).find(
      p => p.code.trim().toUpperCase() === code.trim().toUpperCase() && p.is_active
    );
  }

  public addPromoCode(data: Omit<PromoCode, 'id' | 'usage_count' | 'created_at'>, actor: UserProfile): PromoCode {
    if (!this.store.promo_codes) this.store.promo_codes = [];
    const newCode: PromoCode = {
      ...data,
      id: `promo-${Date.now()}`,
      code: data.code.trim().toUpperCase(),
      usage_count: 0,
      created_at: new Date().toISOString()
    };
    this.store.promo_codes.unshift(newCode);
    this.save();

    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'CREATE_PROMO_CODE',
      'Payment',
      newCode.id,
      `Created promo code: ${newCode.code} (${newCode.discount_value}${newCode.discount_type === 'percentage' ? '%' : ' Rs'})`
    );

    return newCode;
  }

  public updatePromoCode(id: string, data: Partial<PromoCode>, actor: UserProfile): PromoCode | undefined {
    const item = (this.store.promo_codes || []).find(p => p.id === id);
    if (!item) return undefined;
    if (data.code) data.code = data.code.trim().toUpperCase();
    Object.assign(item, data);
    this.save();

    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'UPDATE_PROMO_CODE',
      'Payment',
      id,
      `Updated promo code: ${item.code}`
    );

    return item;
  }

  public deletePromoCode(id: string, actor: UserProfile): boolean {
    const idx = (this.store.promo_codes || []).findIndex(p => p.id === id);
    if (idx === -1) return false;
    const removed = this.store.promo_codes.splice(idx, 1)[0];
    this.save();

    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'DELETE_PROMO_CODE',
      'Payment',
      id,
      `Deleted promo code: ${removed.code}`
    );

    return true;
  }

  public verifyPromoCode(code: string, originalAmount: number): {
    valid: boolean;
    discountAmount: number;
    finalAmount: number;
    message: string;
    promo?: PromoCode;
  } {
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) {
      return { valid: false, discountAmount: 0, finalAmount: originalAmount, message: 'कृपया प्रोमो कोड टाका' };
    }

    const promo = (this.store.promo_codes || []).find(p => p.code.toUpperCase() === cleanCode);
    if (!promo || !promo.is_active) {
      return { valid: false, discountAmount: 0, finalAmount: originalAmount, message: 'हा प्रोमो कोड अमान्य किंवा कालबाह्य झाला आहे.' };
    }

    if (promo.valid_till && new Date(promo.valid_till) < new Date()) {
      return { valid: false, discountAmount: 0, finalAmount: originalAmount, message: 'या प्रोमो कोडची मुदत संपली आहे.' };
    }

    let discount = 0;
    if (promo.discount_type === 'percentage') {
      discount = Math.round((originalAmount * promo.discount_value) / 100);
    } else {
      discount = promo.discount_value;
    }

    if (discount > originalAmount) discount = originalAmount;
    const finalAmount = Math.max(0, originalAmount - discount);

    return {
      valid: true,
      discountAmount: discount,
      finalAmount,
      message: `प्रोमो कोड '${promo.code}' यशस्वीरीत्या लागू झाला! ₹${discount} सूट मिळालेली आहे.`,
      promo
    };
  }

  // --- Successful Students (यशस्वी विद्यार्थी) Methods ---
  public getSuccessfulStudents(includeInactive = false): SuccessfulStudent[] {
    const list = this.store.successful_students || [];
    if (includeInactive) return list;
    return list.filter(s => s.is_active !== false);
  }

  public addSuccessfulStudent(data: Partial<SuccessfulStudent>, actor: UserProfile): SuccessfulStudent {
    if (!this.store.successful_students) {
      this.store.successful_students = [];
    }
    const newStudent: SuccessfulStudent = {
      id: `stud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      student_name: data.student_name || 'यशस्वी विद्यार्थी',
      photo_url: data.photo_url || 'https://images.unsplash.com/photo-1594824813571-28a77885097a?auto=format&fit=crop&q=80&w=300',
      selected_post: data.selected_post || 'DHS / DMER Nursing Officer',
      posting_location: data.posting_location || 'शासकीय वैद्यकीय महाविद्यालय (GMC)',
      marks_or_rank: data.marks_or_rank || '',
      exam_batch: data.exam_batch || '२०२४ भरती',
      testimonial_mr: data.testimonial_mr || 'उत्कृष्ट सराव टेस्ट्स!',
      is_active: data.is_active !== undefined ? data.is_active : true,
      created_at: new Date().toISOString()
    };

    this.store.successful_students.unshift(newStudent);
    this.save();

    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'ADD_SUCCESSFUL_STUDENT',
      'Settings',
      newStudent.id,
      `Added successful student: ${newStudent.student_name}`
    );

    return newStudent;
  }

  public updateSuccessfulStudent(id: string, data: Partial<SuccessfulStudent>, actor: UserProfile): SuccessfulStudent | null {
    const list = this.store.successful_students || [];
    const item = list.find(s => s.id === id);
    if (!item) return null;

    Object.assign(item, data);
    this.save();

    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'UPDATE_SUCCESSFUL_STUDENT',
      'Settings',
      id,
      `Updated successful student: ${item.student_name}`
    );

    return item;
  }

  public deleteSuccessfulStudent(id: string, actor: UserProfile): boolean {
    const list = this.store.successful_students || [];
    const idx = list.findIndex(s => s.id === id);
    if (idx === -1) return false;

    const removed = list.splice(idx, 1)[0];
    this.save();

    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'DELETE_SUCCESSFUL_STUDENT',
      'Settings',
      id,
      `Deleted successful student: ${removed.student_name}`
    );

    return true;
  }

  public toggleSuccessfulStudentActive(id: string, isActive: boolean, actor: UserProfile): SuccessfulStudent | null {
    return this.updateSuccessfulStudent(id, { is_active: isActive }, actor);
  }

  // Unlock single test for a student
  public unlockTestForUser(userId: string, testId: string): UserProfile | null {
    const user = this.store.users.find(u => u.id === userId);
    if (!user) return null;

    if (!user.unlocked_test_ids) {
      user.unlocked_test_ids = [];
    }

    if (!user.unlocked_test_ids.includes(testId)) {
      user.unlocked_test_ids.push(testId);
    }

    this.save();
    return user;
  }

  // YouTube Video Lectures Management
  public getYouTubeLectures(onlyActive = false): YouTubeLecture[] {
    const list = this.store.youtube_lectures || [];
    if (onlyActive) {
      return list.filter(l => l.is_active && !l.is_hidden);
    }
    return list;
  }

  public addYouTubeLecture(data: Partial<YouTubeLecture>, actor: UserProfile): YouTubeLecture {
    if (!this.store.youtube_lectures) {
      this.store.youtube_lectures = [];
    }

    const rawUrl = data.video_url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const ytIdMatch = rawUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    const youtube_video_id = ytIdMatch ? ytIdMatch[1] : (data.youtube_video_id || 'dQw4w9WgXcQ');

    const newLecture: YouTubeLecture = {
      id: `yt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title_mr: data.title_mr || 'नर्सिंग अधिकारी व्हिडिओ व्याख्यान',
      title_en: data.title_en || 'Nursing Officer Video Masterclass',
      video_url: rawUrl,
      youtube_video_id,
      thumbnail_url: data.thumbnail_url || `https://img.youtube.com/vi/${youtube_video_id}/hqdefault.jpg`,
      subject_name: data.subject_name || 'High-Yield Nursing',
      duration_label: data.duration_label || '30 Min',
      instructor_name: data.instructor_name || 'MH Sir & Nursing Experts',
      description_mr: data.description_mr || '',
      description_en: data.description_en || '',
      is_active: data.is_active !== undefined ? data.is_active : true,
      is_hidden: Boolean(data.is_hidden),
      is_paid: Boolean(data.is_paid),
      price: data.price !== undefined ? Number(data.price) : 0,
      unlocked_by: Array.isArray(data.unlocked_by) ? data.unlocked_by : [],
      view_count: 0,
      created_at: new Date().toISOString()
    };

    this.store.youtube_lectures.unshift(newLecture);
    this.save();

    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'ADD_YOUTUBE_LECTURE',
      'Settings',
      newLecture.id,
      `Added YouTube lecture: ${newLecture.title_en}`
    );

    return newLecture;
  }

  public updateYouTubeLecture(id: string, data: Partial<YouTubeLecture>, actor: UserProfile): YouTubeLecture | null {
    const list = this.store.youtube_lectures || [];
    const item = list.find(l => l.id === id);
    if (!item) return null;

    if (data.video_url) {
      const ytIdMatch = data.video_url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (ytIdMatch) {
        data.youtube_video_id = ytIdMatch[1];
        if (!data.thumbnail_url) {
          data.thumbnail_url = `https://img.youtube.com/vi/${ytIdMatch[1]}/hqdefault.jpg`;
        }
      }
    }

    Object.assign(item, data);
    this.save();

    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'UPDATE_YOUTUBE_LECTURE',
      'Settings',
      id,
      `Updated YouTube lecture: ${item.title_en}`
    );

    return item;
  }

  public deleteYouTubeLecture(id: string, actor: UserProfile): boolean {
    const list = this.store.youtube_lectures || [];
    const idx = list.findIndex(l => l.id === id);
    if (idx === -1) return false;

    const removed = list.splice(idx, 1)[0];
    this.save();

    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'DELETE_YOUTUBE_LECTURE',
      'Settings',
      id,
      `Deleted YouTube lecture: ${removed.title_en}`
    );

    return true;
  }

  public toggleYouTubeLectureActive(id: string, isActive: boolean, actor: UserProfile): YouTubeLecture | null {
    return this.updateYouTubeLecture(id, { is_active: isActive }, actor);
  }

  public unlockYouTubeLecture(lectureId: string, userId: string): YouTubeLecture | null {
    const list = this.store.youtube_lectures || [];
    const item = list.find(l => l.id === lectureId);
    if (!item) return null;

    if (!item.unlocked_by) {
      item.unlocked_by = [];
    }
    if (!item.unlocked_by.includes(userId)) {
      item.unlocked_by.push(userId);
    }

    const user = this.store.users.find(u => u.id === userId);
    if (user) {
      if (!user.unlocked_lecture_ids) {
        user.unlocked_lecture_ids = [];
      }
      if (!user.unlocked_lecture_ids.includes(lectureId)) {
        user.unlocked_lecture_ids.push(lectureId);
      }
    }

    this.save();
    return item;
  }
}

export const db = new DatabaseService();

