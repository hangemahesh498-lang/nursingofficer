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
  AdminAiImportSettings
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
    email: 'admin@nursingprep.ai',
    name: 'Platform Administrator',
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
  support_email: 'HANGEMAHESH498@gmail.com',
  support_phone: '+91 98765 43210',
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
  telegram_username: 'NursingOfficerPrep',
  telegram_contact_url: 'https://t.me/NursingOfficerSupport',
  telegram_group_url: 'https://t.me/NursingOfficerDiscussion',
  telegram_channel_url: 'https://t.me/NursingOfficerUpdates',
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
  announcement_banner_active: true
};

const INITIAL_PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: 'plan-1-month',
    name: '1 Month Quick Sprint',
    name_mr: '१ महिना रॅपिड रिव्हिजन प्लॅन',
    price: 199,
    currency: 'INR',
    duration_days: 30,
    duration_label: '1 Month Access',
    duration_label_mr: '१ महिन्यासाठी',
    is_active: true,
    features: [
      'Unlimited Subject Practice Questions (18 INC Core Subjects)',
      '10 Full-Length Timed AIIMS NORCET Mock Tests with 1/3 Negative Marking',
      'Clinical Case Vignettes & ECG / Image Question Bank',
      'Mistake Notebook with Automated Spaced Repetition (1, 3, 7, 15 Days)',
      'AI Clinical Study Coach (Mnemonics, Drug Calculations, Concepts)'
    ],
    features_mr: [
      'सर्व १८ विषयांचे अमर्यादित सराव प्रश्न',
      '१० संपूर्ण AIIMS NORCET टाइमर मॉक टेस्ट्स (१/३ निगेटिव्ह मार्किंग)',
      'क्लिनिकल केसेस, ईसीजी आणि इमेज आधारित प्रश्नसंच',
      'चूक वही व स्वयंचलित उजळणी प्रणाली',
      'एआय अभ्यास मार्गदर्शक (स्मृतीसूत्रे व गणित)'
    ]
  },
  {
    id: 'plan-6-months',
    name: '6 Months NORCET Master Pro',
    name_mr: '६ महिने NORCET मास्टर प्रो प्लॅन',
    price: 499,
    currency: 'INR',
    duration_days: 180,
    duration_label: '6 Months Access',
    duration_label_mr: '६ महिन्यांसाठी',
    is_active: true,
    popular: true,
    features: [
      'All 1-Month Features Included',
      '50+ Grand Mock Tests & Sectional Test Series',
      'Verified Previous Year Papers (NORCET 2020-2024, ESIC, RRB, DMER)',
      'High-Yield Downloadable Study Notes & Formulas (PDFs)',
      'Direct Telegram VIP Doubt Clearing & Daily Clinical Quiz Group',
      'AI Rank Predictor & Detailed Strength/Weakness Analytics'
    ],
    features_mr: [
      '१ महिन्याच्या सर्व सुविधा समाविष्ट',
      '५०+ संपूर्ण मॉक टेस्ट्स आणि विषयवार सराव',
      'मागील वर्षांचे प्रमाणित प्रश्नपत्रिका (NORCET, ESIC, RRB, DMER)',
      'उच्च दर्जाचे अभ्यास नोट्स व सूत्रे (PDF डाऊनलोड)',
      'टेलिग्राम VIP ग्रुपमध्ये शंका निरसन',
      'एआय रँक प्रेडिक्टर व अचूकता विश्लेषण'
    ]
  },
  {
    id: 'plan-1-year',
    name: '1 Year Lifetime Aspirant Pass',
    name_mr: '१ वर्ष संपूर्ण यश खात्री प्लॅन',
    price: 899,
    currency: 'INR',
    duration_days: 365,
    duration_label: '1 Year Full Access',
    duration_label_mr: '१ संपूर्ण वर्ष',
    is_active: true,
    features: [
      'Complete 365 Days Unlimited Access to All Current & Future Tests',
      'Upcoming ESIC, RRB Staff Nurse, DSSSB & State Recruitment Modules',
      'Priority AI Coaching & Unlimited Question Explanations in Marathi/English',
      'All Inc Standard Nursing Syllabus Revisions & Formula Sheets',
      'Personalized 1-on-1 Exam Preparation Guidance Support'
    ],
    features_mr: [
      '३६५ दिवस अमर्यादित मॉक टेस्ट्स व सराव संच',
      'आगामी सर्व ESIC, RRB आणि राज्य भरती चाचण्या',
      'प्राधान्य एआय स्पष्टीकरण (मराठी व इंग्रजी)',
      'संपूर्ण INC नर्सिंग अभ्यासक्रम कव्हरेज',
      'टेलिग्राम थेट सपोर्ट व मार्गदर्शन'
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
      recruitment_notices: INITIAL_RECRUITMENTS,
      import_batches: []
    };

    if (fs.existsSync(STORE_PATH)) {
      try {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          ...defaultStore,
          ...parsed,
          chapters: parsed.chapters && parsed.chapters.length > 0 ? parsed.chapters : INITIAL_CHAPTERS,
          topics: parsed.topics && parsed.topics.length > 0 ? parsed.topics : INITIAL_TOPICS,
          subtopics: parsed.subtopics || [],
          subjects: parsed.subjects && parsed.subjects.length > 0 ? parsed.subjects : INITIAL_SUBJECTS,
          payment_plans: parsed.payment_plans && parsed.payment_plans.length > 0 ? parsed.payment_plans : INITIAL_PAYMENT_PLANS,
          payments: parsed.payments || [],
          study_materials: parsed.study_materials && parsed.study_materials.length > 0 ? parsed.study_materials : INITIAL_STUDY_MATERIALS,
          recruitment_notices: parsed.recruitment_notices && parsed.recruitment_notices.length > 0 ? parsed.recruitment_notices : INITIAL_RECRUITMENTS,
          import_batches: parsed.import_batches || [],
          settings: {
            ...INITIAL_SETTINGS,
            ...(parsed.settings || {}),
            ai_import_settings: {
              ...INITIAL_AI_IMPORT_SETTINGS,
              ...(parsed.settings?.ai_import_settings || {})
            }
          }
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

  public createUser(user: Partial<UserProfile> & { email: string; name: string; password?: string }): UserProfile {
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
    if (user.password) {
      const { hash, salt } = this.hashPassword(user.password);
      newUser.passwordHash = hash;
      newUser.passwordSalt = salt;
    }
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
    const questions = this.getQuestions();
    return this.store.subjects.map(s => {
      const subQs = questions.filter(q => q.subject_id === s.id);
      return {
        ...s,
        totalQuestions: subQs.length,
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

  // Chapters & Topics
  public getChapters(subjectId?: string): Chapter[] {
    const list = this.store.chapters || [];
    const questions = this.getQuestions();
    const mapped = list.map(ch => {
      const chQs = questions.filter(q => q.chapter_id === ch.id);
      return {
        ...ch,
        totalQuestions: chQs.length,
        freeQuestionsCount: chQs.filter(q => q.is_free).length
      };
    });
    return subjectId ? mapped.filter(c => c.subject_id === subjectId) : mapped;
  }

  public getTopics(chapterId?: string, subjectId?: string): Topic[] {
    let list = this.store.topics || [];
    const questions = this.getQuestions();
    if (chapterId) list = list.filter(t => t.chapter_id === chapterId);
    if (subjectId) list = list.filter(t => t.subject_id === subjectId);
    return list.map(t => {
      const topQs = questions.filter(q => q.topic_id === t.id);
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
      list = list.filter(q => q.subject_id === filters.subject_id);
    }
    if (filters?.chapter_id) {
      list = list.filter(q => q.chapter_id === filters.chapter_id);
    }
    if (filters?.topic_id) {
      list = list.filter(q => q.topic_id === filters.topic_id);
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

  // Payment Plans & Manual QR Subsystem
  public getPaymentPlans(): PaymentPlan[] {
    return this.store.payment_plans || [];
  }

  public getPaymentPlanById(id: string): PaymentPlan | undefined {
    return (this.store.payment_plans || []).find(p => p.id === id);
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
  }): PaymentRecord {
    const plan = this.getPaymentPlanById(data.plan_id);
    const newRecord: PaymentRecord = {
      id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: data.user_id,
      user_name: data.user_name,
      user_email: data.user_email,
      plan_id: data.plan_id,
      plan_name: plan?.name || 'PRO Membership',
      amount: plan?.price || 499,
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
    user_id: string;
    user_name: string;
    user_email: string;
    plan_id: string;
    razorpay_payment_id: string;
    razorpay_order_id?: string;
  }): PaymentRecord {
    const plan = this.getPaymentPlanById(data.plan_id);
    const now = new Date();
    const days = plan?.duration_days || 180;
    const expiry = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const newRecord: PaymentRecord = {
      id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: data.user_id,
      user_name: data.user_name,
      user_email: data.user_email,
      plan_id: data.plan_id,
      plan_name: plan?.name || 'PRO Membership',
      amount: plan?.price || 499,
      currency: plan?.currency || 'INR',
      payment_method: 'RAZORPAY',
      utr_number: data.razorpay_payment_id,
      status: 'APPROVED',
      admin_reviewer_id: 'system_razorpay',
      admin_reviewer_name: 'Razorpay Auto Gateway',
      admin_notes: `Automated instant verification via Razorpay Gateway (Txn ID: ${data.razorpay_payment_id})`,
      submitted_at: now.toISOString(),
      verified_at: now.toISOString(),
      expires_at: expiry.toISOString()
    };

    if (!this.store.payments) this.store.payments = [];
    this.store.payments.unshift(newRecord);

    // Automatically activate PRO subscription on user profile
    const user = this.getUserById(data.user_id);
    if (user) {
      user.isPremium = true;
    }

    this.logAudit(data.user_id, data.user_name, 'student', 'AUTO_RAZORPAY_PAYMENT', 'PaymentRecord', newRecord.id, `Razorpay automated payment successful (₹${newRecord.amount}). Instant PRO activated till ${expiry.toISOString()}`);
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
      const days = plan?.duration_days || 180;
      const expiry = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      record.expires_at = expiry.toISOString();

      // Upgrade User to PRO
      const user = this.getUserById(record.user_id);
      if (user) {
        user.isPremium = true;
      }
      this.logAudit(reviewer.id, reviewer.name, reviewer.role, 'APPROVE_PAYMENT', 'PaymentRecord', paymentId, `Approved payment of ₹${record.amount} for user ${record.user_email}. PRO unlocked until ${record.expires_at}`);
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
      id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    if (!this.store.recruitment_notices) this.store.recruitment_notices = [];
    this.store.recruitment_notices.unshift(newNotice);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, 'ADD_RECRUITMENT_NOTICE', 'RecruitmentNotice', newNotice.id, `Added notice: ${newNotice.organization} - ${newNotice.post_name}`);
    }
    this.save();
    return newNotice;
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
}

export const db = new DatabaseService();

