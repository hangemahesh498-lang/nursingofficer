import {
  UserProfile,
  Subject,
  Chapter,
  Topic,
  Question,
  CaseStudy,
  MockTest,
  TestAttempt,
  MistakeRecord,
  BookmarkRecord,
  QuestionReport,
  AuditLogEntry,
  SystemSettings,
  StudyMaterial,
  RecruitmentNotice,
  PaymentPlan,
  PaymentRecord,
  PromoAd,
  PushNotification,
  PromoCode,
  ProctoringSnapshot,
  SuccessfulStudent,
  YouTubeLecture,
  UploadedMediaItem
} from '../types';
import { getDeviceId, getDeviceName } from './device';
import {
  INITIAL_SUBJECTS,
  INITIAL_CHAPTERS,
  INITIAL_TOPICS,
  INITIAL_QUESTIONS,
  INITIAL_CASE_STUDIES,
  INITIAL_MOCK_TESTS
} from '../data/initialData';

let currentUserId = 'usr-student-01';
let currentAuthToken: string | null = null;

export function setApiUserId(id: string) {
  currentUserId = id;
}

export function getApiUserId() {
  return currentUserId;
}

export function setApiAuthToken(token: string | null) {
  currentAuthToken = token;
}

const safeHeaderVal = (val: string | undefined | null) => (val || '').replace(/[^\x20-\x7E]/g, '');

const headers = () => {
  const h: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-user-id': safeHeaderVal(currentUserId),
    'x-device-id': safeHeaderVal(getDeviceId()),
    'x-device-name': safeHeaderVal(getDeviceName())
  };
  if (currentAuthToken) {
    h['Authorization'] = `Bearer ${safeHeaderVal(currentAuthToken)}`;
  }
  return h;
};

// Safe JSON fetch wrapper that checks response ok, prevents HTML parse crashes, and uses fallback if available
async function safeFetchJson<T>(url: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    
    // If server responded with HTML (e.g. 404 or warm-up), handle gracefully
    if (!contentType.includes('application/json')) {
      if (fallback !== undefined) {
        console.warn(`[API] Non-JSON response for ${url}, using local cache fallback`);
        return fallback;
      }
      throw new Error(`Server returned non-JSON response (${res.status})`);
    }

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      if (errJson?.error) {
        throw new Error(errJson.error);
      }
      if (fallback !== undefined) {
        return fallback;
      }
      throw new Error(`Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    if (fallback !== undefined) {
      console.warn(`[API] Network/parse issue for ${url}, using fallback:`, err.message);
      return fallback;
    }
    throw err;
  }
}

export const api = {
  // Cloud SQL Status
  async getCloudSqlStatus(): Promise<{ connected: boolean; provider: string; instance?: string; region?: string; userCount?: number; error?: string }> {
    const res = await fetch('/api/cloudsql/status', { headers: headers() });
    return res.json();
  },

  // Auth
  async loginWithFirebase(idToken: string): Promise<UserProfile> {
    setApiAuthToken(idToken);
    const res = await fetch('/api/auth/firebase-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
        'x-device-id': getDeviceId(),
        'x-device-name': getDeviceName()
      }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Firebase login failed' }));
      throw new Error(err.error || 'Firebase login failed');
    }
    const user = await res.json();
    setApiUserId(user.id);
    return user;
  },

  async getUsers(): Promise<UserProfile[]> {
    const res = await fetch('/api/auth/users', { headers: headers() });
    return res.json();
  },

  async getCurrentUser(): Promise<UserProfile> {
    const res = await fetch('/api/auth/me', { headers: headers() });
    return res.json();
  },

  async switchUser(userId: string): Promise<UserProfile> {
    setApiUserId(userId);
    const res = await fetch('/api/auth/switch-user', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ userId })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Switch user failed' }));
      throw new Error(err.error || 'Switch user failed');
    }
    return res.json();
  },

  async login(email: string, password: string): Promise<UserProfile> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password, deviceId: getDeviceId(), deviceName: getDeviceName() })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    const user = await res.json();
    setApiUserId(user.id);
    return user;
  },

  async register(data: { email: string; name: string; password: string; role?: string; targetExam?: string; preferredLanguage?: 'en' | 'mr' }): Promise<UserProfile> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ ...data, deviceId: getDeviceId(), deviceName: getDeviceName() })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    const user = await res.json();
    setApiUserId(user.id);
    return user;
  },

  async resetUserDevice(userId: string): Promise<UserProfile> {
    const res = await fetch(`/api/admin/users/${userId}/reset-device`, {
      method: 'POST',
      headers: headers()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to reset device');
    }
    return res.json();
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  // Subjects
  async getSubjects(): Promise<Subject[]> {
    return safeFetchJson<Subject[]>('/api/subjects', { headers: headers() }, INITIAL_SUBJECTS);
  },

  // Chapters & Topics (5-tier syllabus)
  async getChapters(subject_id?: string): Promise<Chapter[]> {
    const url = new URL('/api/chapters', window.location.origin);
    if (subject_id) url.searchParams.set('subject_id', subject_id);
    const fallback = subject_id
      ? INITIAL_CHAPTERS.filter(c => c.subject_id === subject_id)
      : INITIAL_CHAPTERS;
    return safeFetchJson<Chapter[]>(url.toString(), { headers: headers() }, fallback);
  },

  async addChapter(data: { subject_id: string; name_en: string; name_mr: string; order_index?: number }): Promise<any> {
    const res = await fetch('/api/chapters', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getTopics(params?: { chapter_id?: string; subject_id?: string }): Promise<Topic[]> {
    const url = new URL('/api/topics', window.location.origin);
    if (params?.chapter_id) url.searchParams.set('chapter_id', params.chapter_id);
    if (params?.subject_id) url.searchParams.set('subject_id', params.subject_id);
    let fallback = INITIAL_TOPICS;
    if (params?.chapter_id) fallback = fallback.filter(t => t.chapter_id === params.chapter_id);
    if (params?.subject_id) fallback = fallback.filter(t => t.subject_id === params.subject_id);
    return safeFetchJson<Topic[]>(url.toString(), { headers: headers() }, fallback);
  },

  async addTopic(data: { chapter_id: string; subject_id: string; name_en: string; name_mr: string; order_index?: number }): Promise<any> {
    const res = await fetch('/api/topics', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getSyllabusGaps(): Promise<any[]> {
    return safeFetchJson<any[]>('/api/syllabus/gaps', { headers: headers() }, []);
  },

  // Cloudinary CDN
  async getCloudinaryStatus(): Promise<{ configured: boolean; folders: string[]; provider: string }> {
    return safeFetchJson<{ configured: boolean; folders: string[]; provider: string }>(
      '/api/cloudinary/status',
      { headers: headers() },
      { configured: false, folders: ['questions', 'cases', 'notes'], provider: 'Cloudinary CDN' }
    );
  },

  async uploadCloudinaryImage(file: string, options?: { folder?: string; public_id?: string; alt_text?: string; tags?: string[] }): Promise<any> {
    const res = await fetch('/api/cloudinary/upload', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ file, ...options })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }
    return res.json();
  },

  async deleteCloudinaryImage(public_id: string): Promise<any> {
    const res = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ public_id })
    });
    return res.json();
  },

  async getUploadedMedia(): Promise<UploadedMediaItem[]> {
    return safeFetchJson<UploadedMediaItem[]>('/api/cloudinary/media', { headers: headers() }, []);
  },

  async deleteUploadedMediaBulk(public_ids: string[]): Promise<any> {
    const res = await fetch('/api/cloudinary/delete-bulk', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ public_ids })
    });
    return res.json();
  },

  async getAuditLogs(): Promise<AuditLogEntry[]> {
    return safeFetchJson<AuditLogEntry[]>('/api/admin/audit-logs', { headers: headers() }, []);
  },

  async deleteAuditLog(id: string): Promise<any> {
    const res = await fetch(`/api/admin/audit-logs/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    return res.json();
  },

  async deleteAuditLogsBulk(ids?: string[]): Promise<any> {
    const res = await fetch('/api/admin/audit-logs/bulk-delete', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ ids })
    });
    return res.json();
  },

  async uploadCloudinaryVideo(file: string, options?: { folder?: string; public_id?: string; aspect_ratio?: '16:9' | '9:16'; tags?: string[] }): Promise<any> {
    const res = await fetch('/api/cloudinary/upload-video', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ file, ...options })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Video upload failed');
    }
    return res.json();
  },

  async getPromoAds(params?: { is_active?: boolean; target_screen?: string }): Promise<PromoAd[]> {
    const query = new URLSearchParams();
    if (params?.is_active !== undefined) query.set('is_active', String(params.is_active));
    if (params?.target_screen) query.set('target_screen', params.target_screen);

    return safeFetchJson<PromoAd[]>(
      `/api/promo-ads${query.toString() ? `?${query.toString()}` : ''}`,
      { headers: headers() },
      []
    );
  },

  async getPromoAdById(id: string): Promise<PromoAd | null> {
    try {
      const res = await fetch(`/api/promo-ads/${id}`, { headers: headers() });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  },

  async createPromoAd(data: Partial<PromoAd>): Promise<PromoAd> {
    const res = await fetch('/api/promo-ads', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create promo ad');
    }
    return res.json();
  },

  async updatePromoAd(id: string, data: Partial<PromoAd>): Promise<PromoAd> {
    const res = await fetch(`/api/promo-ads/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update promo ad');
    }
    return res.json();
  },

  async deletePromoAd(id: string): Promise<{ success: boolean; id: string }> {
    const res = await fetch(`/api/promo-ads/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete promo ad');
    }
    return res.json();
  },

  async checkDuplicate(text: string, currentId?: string): Promise<{ isDuplicate: boolean; matchedQuestion?: Question }> {
    const res = await fetch('/api/questions/check-duplicate', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ text, currentId })
    });
    return res.json();
  },

  async updateUserRole(userId: string, role: string): Promise<UserProfile> {
    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ role })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update role');
    }
    return res.json();
  },

  // Questions
  async getQuestions(params?: {
    subject_id?: string;
    chapter_id?: string;
    topic_id?: string;
    difficulty?: string;
    status?: string;
    is_verified_pyq?: boolean;
    is_free?: boolean;
    case_id?: string;
    search?: string;
  }): Promise<Question[]> {
    const url = new URL('/api/questions', window.location.origin);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') {
          url.searchParams.set(k, String(v));
        }
      });
    }
    let fallback = INITIAL_QUESTIONS;
    if (params?.subject_id) fallback = fallback.filter(q => q.subject_id === params.subject_id);
    if (params?.topic_id) fallback = fallback.filter(q => q.topic_id === params.topic_id);
    if (params?.difficulty) fallback = fallback.filter(q => q.difficulty === params.difficulty);
    if (params?.is_verified_pyq !== undefined) fallback = fallback.filter(q => !!q.is_verified_pyq === params.is_verified_pyq);
    if (params?.case_id) fallback = fallback.filter(q => q.case_id === params.case_id);
    return safeFetchJson<Question[]>(url.toString(), { headers: headers() }, fallback);
  },

  async createQuestion(data: any): Promise<Question> {
    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create question');
    }
    return res.json();
  },

  async addQuestion(data: any): Promise<Question> {
    return this.createQuestion(data);
  },

  async updateQuestion(id: string, data: any): Promise<Question> {
    const res = await fetch(`/api/questions/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update question');
    }
    return res.json();
  },

  async deleteQuestion(id: string): Promise<boolean> {
    const res = await fetch(`/api/questions/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    return res.ok;
  },

  async bulkDeleteQuestions(ids: string[]): Promise<{ success: boolean; count: number }> {
    const res = await fetch('/api/questions/bulk-delete', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ ids })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Bulk delete failed' }));
      throw new Error(err.error || 'Bulk delete failed');
    }
    return res.json();
  },

  // Cases
  async getCases(): Promise<CaseStudy[]> {
    return safeFetchJson<CaseStudy[]>('/api/cases', { headers: headers() }, INITIAL_CASE_STUDIES);
  },

  async createCase(data: any): Promise<CaseStudy> {
    const res = await fetch('/api/cases', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Mock Tests
  async getMockTests(): Promise<MockTest[]> {
    return safeFetchJson<MockTest[]>('/api/mock-tests', { headers: headers() }, INITIAL_MOCK_TESTS);
  },

  async getMockTest(id: string): Promise<MockTest & { questions: Question[] }> {
    const fallbackTest = INITIAL_MOCK_TESTS.find(m => m.id === id) || INITIAL_MOCK_TESTS[0];
    const fallbackQuestions = INITIAL_QUESTIONS.slice(0, 20);
    const fallback: MockTest & { questions: Question[] } = {
      ...fallbackTest,
      questions: fallbackQuestions
    };
    return safeFetchJson<MockTest & { questions: Question[] }>(`/api/mock-tests/${id}`, { headers: headers() }, fallback);
  },

  async createMockTest(data: any): Promise<MockTest> {
    const res = await fetch('/api/mock-tests', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateMockTest(id: string, updates: Partial<MockTest>): Promise<MockTest> {
    const res = await fetch(`/api/admin/mock-tests/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async toggleMockTestActive(id: string, is_active: boolean): Promise<MockTest> {
    const res = await fetch(`/api/admin/mock-tests/${id}/toggle-active`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ is_active })
    });
    return res.json();
  },

  async saveProctoringSnapshot(data: Partial<ProctoringSnapshot>): Promise<ProctoringSnapshot> {
    const res = await fetch('/api/proctoring-snapshots', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async sendProctoringSnapshot(data: Partial<ProctoringSnapshot>): Promise<ProctoringSnapshot> {
    return this.saveProctoringSnapshot(data);
  },

  async getProctoringSnapshots(testId?: string, userId?: string): Promise<ProctoringSnapshot[]> {
    const params = new URLSearchParams();
    if (testId) params.append('test_id', testId);
    if (userId) params.append('user_id', userId);
    return safeFetchJson<ProctoringSnapshot[]>(`/api/admin/proctoring-snapshots?${params.toString()}`, { headers: headers() }, []);
  },

  async deleteProctoringSnapshot(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/admin/proctoring-snapshots/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    return res.json();
  },

  async toggleStarStudent(userId: string, is_star_student: boolean): Promise<UserProfile> {
    const res = await fetch(`/api/admin/star-students/${userId}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ is_star_student })
    });
    return res.json();
  },

  async bulkGenerateMockTests(data: { pattern: 'maharashtra' | 'aiims'; count: number; questionsPerTest: number }): Promise<{ success: boolean; createdCount: number; tests: MockTest[] }> {
    const res = await fetch('/api/admin/mock-tests/bulk-generate', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteMockTest(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/admin/mock-tests/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    return res.json();
  },

  async clearAllMockTests(): Promise<{ success: boolean }> {
    const res = await fetch('/api/admin/mock-tests/clear-all', {
      method: 'POST',
      headers: headers()
    });
    return res.json();
  },

  async submitMockTest(id: string, payload: { answers: any[]; started_at: string; time_spent_seconds: number }): Promise<TestAttempt> {
    const res = await fetch(`/api/mock-tests/${id}/submit`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Student analytics & revision
  async getStudentStats(): Promise<any> {
    const fallback = {
      totalQuestionsSolved: 48,
      accuracyPercentage: 74,
      streakDays: 14,
      points: 480,
      subjectMastery: {}
    };
    return safeFetchJson<any>('/api/student/stats', { headers: headers() }, fallback);
  },

  async getMistakes(): Promise<(MistakeRecord & { question: Question })[]> {
    return safeFetchJson<(MistakeRecord & { question: Question })[]>('/api/student/mistakes', { headers: headers() }, []);
  },

  async updateMistakeMastery(questionId: string, isMastered: boolean): Promise<any> {
    const res = await fetch('/api/student/mistakes/master', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ question_id: questionId, is_mastered: isMastered })
    });
    return res.json();
  },

  async getBookmarks(): Promise<(BookmarkRecord & { question: Question })[]> {
    return safeFetchJson<(BookmarkRecord & { question: Question })[]>('/api/student/bookmarks', { headers: headers() }, []);
  },

  async toggleBookmark(questionId: string): Promise<{ isBookmarked: boolean }> {
    const res = await fetch('/api/student/bookmarks/toggle', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ question_id: questionId })
    });
    return res.json();
  },

  // Reports & Student Inquiries
  async submitReport(data: { question_id: string; reason: string; details?: string; user_id?: string; user_name?: string }): Promise<QuestionReport> {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async createReport(data: { question_id: string; reason: string; details?: string; user_id?: string; user_name?: string }): Promise<QuestionReport> {
    return this.submitReport(data);
  },

  async getReports(): Promise<any[]> {
    return safeFetchJson<any[]>('/api/admin/reports', { headers: headers() }, []);
  },

  async resolveReport(id: string, status: 'resolved' | 'rejected', notes: string): Promise<any> {
    const res = await fetch(`/api/admin/reports/${id}/resolve`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ status, notes })
    });
    return res.json();
  },

  // Admin stats, settings, logs
  async getAdminStats(): Promise<any> {
    return safeFetchJson<any>('/api/admin/stats', { headers: headers() }, {
      totalQuestions: 280,
      totalUsers: 42,
      publishedQuestions: 260
    });
  },

  async getSettings(): Promise<SystemSettings> {
    const defaultSettings: SystemSettings = {
      app_name: 'Nursing Officer Preparation Platform',
      support_email: 'support@nursingprep.ai',
      support_phone: '+91 98765 43210',
      show_support_phone: true,
      whatsapp_number: '+91 98765 43210',
      show_whatsapp: true,
      default_language: 'en',
      allow_registration: true,
      maintenance_mode: false,
      default_negative_marking: 0.33,
      ai_rate_limit_per_user_per_day: 50,
      enable_ai_question_generation: true,
      enable_ai_study_coach: true,
      telegram_username: '@NursingOfficerSupport',
      telegram_contact_url: 'https://t.me/NursingOfficerSupport',
      telegram_channel_url: 'https://t.me/NursingOfficerPrep',
      telegram_group_url: 'https://t.me/NursingOfficerDiscussion',
      telegram_support_message: 'Welcome to Nursing Officer Support! How can we assist you today?',
      premium_enabled: true,
      payment_mode: 'MANUAL_QR',
      manual_qr_enabled: true,
      razorpay_enabled: false,
      currency: 'INR',
      upi_id: 'nursingprep@upi',
      receiver_name: 'NursingPrep Support',
      payment_instructions_en: 'Scan QR and pay, then enter UTR number',
      payment_instructions_mr: 'QR कोड स्कॅन करा आणि UTR नंबर टाका'
    };
    return safeFetchJson<SystemSettings>('/api/admin/settings', { headers: headers() }, defaultSettings);
  },

  async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(settings)
    });
    return res.json();
  },

  async bulkImport(
    rows: any[],
    executeInsert = false,
    options?: {
      defaultStatus?: string;
      defaultExamTrack?: string;
      defaultSubjectId?: string;
      skipDuplicates?: boolean;
    }
  ): Promise<any> {
    const res = await fetch('/api/admin/bulk-import', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ rows, executeInsert, ...options })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Bulk import request failed' }));
      throw new Error(err.error || 'Bulk import request failed');
    }
    return res.json();
  },

  // AI features
  async aiExplain(concept: string, language: 'en' | 'mr'): Promise<{ success: boolean; text?: string; error?: string }> {
    const res = await fetch('/api/ai/explain', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ concept, language })
    });
    return res.json();
  },

  async aiMnemonic(topic: string, language: 'en' | 'mr'): Promise<{ success: boolean; text?: string; error?: string }> {
    const res = await fetch('/api/ai/mnemonic', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ topic, language })
    });
    return res.json();
  },

  async aiRevisionPlan(language: 'en' | 'mr'): Promise<{ success: boolean; text?: string; error?: string }> {
    const res = await fetch('/api/ai/revision-plan', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ language })
    });
    return res.json();
  },

  async aiDoubt(doubt: string, context?: string, language?: 'en' | 'mr'): Promise<{ success: boolean; text?: string; error?: string }> {
    const res = await fetch('/api/ai/doubt', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ doubt, context, language })
    });
    return res.json();
  },

  async aiGenerateQuestion(params: { subject_id: string; topic: string; difficulty: string; is_clinical_case: boolean }): Promise<any> {
    const res = await fetch('/api/ai/generate-question', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(params)
    });
    return res.json();
  },

  async getAiCacheStats(): Promise<{ cachedPrompts: number; totalRequestsServed: number; savedApiCalls: number; tokensSavedEstimate: number }> {
    const res = await fetch('/api/ai/cache-stats', { headers: headers() });
    return res.json();
  },

  // Study Materials
  async getStudyMaterials(): Promise<StudyMaterial[]> {
    const res = await fetch('/api/study-materials', { headers: headers() });
    return res.json();
  },

  async addStudyMaterial(material: Omit<StudyMaterial, 'id' | 'created_at'>): Promise<StudyMaterial> {
    const res = await fetch('/api/admin/study-materials', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(material)
    });
    return res.json();
  },

  async deleteStudyMaterial(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/admin/study-materials/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    return res.json();
  },

  // Recruitment Notices
  async getRecruitmentNotices(): Promise<RecruitmentNotice[]> {
    const res = await fetch('/api/recruitment-notices', { headers: headers() });
    return res.json();
  },

  async addRecruitmentNotice(notice: Omit<RecruitmentNotice, 'id'>): Promise<RecruitmentNotice> {
    const res = await fetch('/api/admin/recruitment-notices', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(notice)
    });
    return res.json();
  },

  async updateRecruitmentNotice(id: string, updates: Partial<RecruitmentNotice>): Promise<RecruitmentNotice> {
    const res = await fetch(`/api/admin/recruitment-notices/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteRecruitmentNotice(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`/api/admin/recruitment-notices/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    return res.json();
  },

  async clearAllRecruitmentNotices(): Promise<{ success: boolean; message?: string }> {
    const res = await fetch('/api/admin/recruitment-notices/clear-all', {
      method: 'POST',
      headers: headers()
    });
    return res.json();
  },

  async formatAdvertisement(rawText: string): Promise<{ success: boolean; advertisement: any }> {
    const res = await fetch('/api/ai/format-advertisement', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ rawText })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Formatting failed' }));
      throw new Error(err.error || 'Formatting failed');
    }
    return res.json();
  },

  async formatAdvertisementFile(file: File): Promise<{ success: boolean; advertisement: any; fileName?: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const h = { ...headers() };
    delete (h as any)['Content-Type']; // Let browser set boundary

    const res = await fetch('/api/ai/format-advertisement-file', {
      method: 'POST',
      headers: h,
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'File processing failed' }));
      throw new Error(err.error || 'File processing failed');
    }
    return res.json();
  },

  async translateQuestion(data: {
    question_id?: string;
    question_en: string;
    option_a_en: string;
    option_b_en: string;
    option_c_en: string;
    option_d_en: string;
    explanation_en?: string;
  }): Promise<{ success: boolean; translation: { question_mr: string; option_a_mr: string; option_b_mr: string; option_c_mr: string; option_d_mr: string; explanation_mr: string } }> {
    const res = await fetch('/api/ai/translate-question', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Translation failed' }));
      throw new Error(err.error || 'Translation failed');
    }
    return res.json();
  },

  async bulkAutoTranslateMarathi(options?: { limit?: number; forceAll?: boolean }): Promise<{
    success: boolean;
    translatedCount: number;
    remainingCount?: number;
    message: string;
  }> {
    const res = await fetch('/api/admin/questions/bulk-auto-translate-marathi', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(options || {})
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Bulk translation failed' }));
      throw new Error(err.error || 'Bulk translation failed');
    }
    return res.json();
  },

  // Payment Plans & Manual QR
  async getPaymentPlans(): Promise<PaymentPlan[]> {
    return safeFetchJson<PaymentPlan[]>('/api/payments/plans', { headers: headers() }, []);
  },

  async createPaymentPlan(plan: Omit<PaymentPlan, 'id'>): Promise<PaymentPlan> {
    const res = await fetch('/api/admin/payments/plans', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(plan)
    });
    return res.json();
  },

  async updatePaymentPlan(id: string, updates: Partial<PaymentPlan>): Promise<PaymentPlan> {
    const res = await fetch(`/api/admin/payments/plans/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deletePaymentPlan(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/admin/payments/plans/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    return res.json();
  },

  async getMyPaymentHistory(): Promise<PaymentRecord[]> {
    return safeFetchJson<PaymentRecord[]>('/api/payments/my-history', { headers: headers() }, []);
  },

  async submitManualPaymentUtr(data: {
    plan_id: string;
    utr_number: string;
    screenshot_url?: string;
    screenshot_public_id?: string;
    promo_code?: string;
  }): Promise<PaymentRecord> {
    const res = await fetch('/api/payments/submit-manual-utr', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getAdminPayments(): Promise<PaymentRecord[]> {
    const res = await fetch('/api/admin/payments', { headers: headers() });
    return res.json();
  },

  async createRazorpayOrder(plan_id: string, promo_code?: string): Promise<{
    order_id: string;
    amount: number;
    original_amount?: number;
    discount_amount?: number;
    currency: string;
    plan_name: string;
    key_id: string;
    razorpay_enabled: boolean;
  }> {
    const res = await fetch('/api/payments/razorpay/create-order', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ plan_id, promo_code })
    });
    return res.json();
  },

  async createTestRazorpayOrder(test_id: string): Promise<{
    order_id: string;
    test_id: string;
    test_title: string;
    amount: number;
    currency: string;
    key_id: string;
    razorpay_enabled: boolean;
  }> {
    const res = await fetch('/api/payments/razorpay/create-test-order', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ test_id })
    });
    return res.json();
  },

  async verifyTestRazorpayPayment(test_id: string, razorpay_payment_id: string, razorpay_order_id?: string): Promise<{
    success: boolean;
    message: string;
    user: UserProfile;
  }> {
    const res = await fetch('/api/payments/razorpay/verify-test-payment', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ test_id, razorpay_payment_id, razorpay_order_id })
    });
    return res.json();
  },

  // --- Successful Students (यशस्वी विद्यार्थी) Methods ---
  async getSuccessfulStudents(all = false): Promise<SuccessfulStudent[]> {
    return safeFetchJson<SuccessfulStudent[]>('/api/successful-students', { headers: headers() }, []);
  },

  async addSuccessfulStudent(data: Partial<SuccessfulStudent>): Promise<SuccessfulStudent> {
    const res = await fetch('/api/admin/successful-students', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateSuccessfulStudent(id: string, updates: Partial<SuccessfulStudent>): Promise<SuccessfulStudent> {
    const res = await fetch(`/api/admin/successful-students/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteSuccessfulStudent(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/admin/successful-students/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    return res.json();
  },

  async toggleSuccessfulStudentActive(id: string, is_active: boolean): Promise<SuccessfulStudent> {
    const res = await fetch(`/api/admin/successful-students/${id}/toggle`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ is_active })
    });
    return res.json();
  },

  // Promo Code Methods
  async getPromoCodes(): Promise<PromoCode[]> {
    return safeFetchJson<PromoCode[]>('/api/promo-codes', { headers: headers() }, []);
  },

  async verifyPromoCode(code: string, original_amount: number): Promise<{
    valid: boolean;
    discountAmount: number;
    finalAmount: number;
    message: string;
    promo?: PromoCode;
  }> {
    const res = await fetch('/api/payments/verify-promo', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ code, original_amount })
    });
    return res.json();
  },

  async createPromoCode(data: Omit<PromoCode, 'id' | 'usage_count' | 'created_at'>): Promise<PromoCode> {
    const res = await fetch('/api/admin/promo-codes', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updatePromoCode(id: string, data: Partial<PromoCode>): Promise<PromoCode> {
    const res = await fetch(`/api/admin/promo-codes/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deletePromoCode(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/admin/promo-codes/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    return res.json();
  },

  async verifyRazorpayAuto(data: {
    plan_id: string;
    razorpay_payment_id: string;
    razorpay_order_id?: string;
  }): Promise<{ success: boolean; message: string; payment: PaymentRecord }> {
    const res = await fetch('/api/payments/razorpay/verify-auto', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async verifyPayment(paymentId: string, action: 'APPROVE' | 'REJECT', notes?: string): Promise<PaymentRecord> {
    const res = await fetch(`/api/admin/payments/${paymentId}/verify`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ action, notes })
    });
    return res.json();
  },

  async reportQuestion(data: { question_id: string; reason: string; details?: string }): Promise<{ success: boolean }> {
    try {
      const res = await fetch('/api/questions/report', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(data)
      });
      if (res.ok) return res.json();
    } catch (e) {
      console.warn('Report question fallback:', e);
    }
    return { success: true };
  },

  // -------------------------------------------------------------
  // AI QUESTION IMPORT & AUTO-VERIFICATION
  // -------------------------------------------------------------
  async uploadImportFiles(formData: FormData): Promise<{ success: boolean; batches: any[]; message: string }> {
    const h: Record<string, string> = {
      'x-user-id': currentUserId
    };
    if (currentAuthToken) {
      h['Authorization'] = `Bearer ${currentAuthToken}`;
    }
    const res = await fetch('/api/import/upload', {
      method: 'POST',
      headers: h,
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(err.error || 'Upload failed');
    }
    return res.json();
  },

  async processImportText(data: {
    rawText: string;
    format?: string;
    fileName?: string;
    targetSubjectId?: string;
    examName?: string;
  }): Promise<{ success: boolean; batch: any }> {
    const res = await fetch('/api/import/process-text', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Processing text failed' }));
      throw new Error(err.error || 'Processing text failed');
    }
    return res.json();
  },

  async getImportBatches(): Promise<any[]> {
    const res = await fetch('/api/import/batches', { headers: headers() });
    return res.json();
  },

  async getImportBatch(id: string): Promise<any> {
    const res = await fetch(`/api/import/batches/${id}`, { headers: headers() });
    if (!res.ok) throw new Error('Batch not found');
    return res.json();
  },

  async deleteImportBatch(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/import/batches/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    return res.json();
  },

  async approveBatchHighConfidence(batchId: string, minConfidence = 90): Promise<{ approvedCount: number; batch: any }> {
    const res = await fetch(`/api/import/batches/${batchId}/approve-all-high-confidence`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ minConfidence })
    });
    return res.json();
  },

  async approveImportedQuestion(
    batchId: string,
    questionId: string,
    modifiedFields?: any
  ): Promise<{ success: boolean; question?: any; error?: string }> {
    const res = await fetch(`/api/import/batches/${batchId}/questions/${questionId}/approve`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ modifiedFields })
    });
    return res.json();
  },

  async rejectImportedQuestion(
    batchId: string,
    questionId: string,
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    const res = await fetch(`/api/import/batches/${batchId}/questions/${questionId}/reject`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ reason })
    });
    return res.json();
  },

  async getImportReviewQueue(params?: {
    batchId?: string;
    flag?: string;
    status?: string;
    search?: string;
  }): Promise<{ items: any[]; totalCount: number }> {
    const url = new URL('/api/import/review-queue', window.location.origin);
    if (params?.batchId) url.searchParams.set('batchId', params.batchId);
    if (params?.flag) url.searchParams.set('flag', params.flag);
    if (params?.status) url.searchParams.set('status', params.status);
    if (params?.search) url.searchParams.set('search', params.search);

    const res = await fetch(url.toString(), { headers: headers() });
    return res.json();
  },

  async bulkReviewAction(data: {
    items: Array<{ batchId: string; questionId: string }>;
    action: 'approve' | 'reject';
  }): Promise<{ success: boolean; processedCount: number; action: string }> {
    const res = await fetch('/api/import/review-queue/bulk-action', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getAiImportSettings(): Promise<any> {
    const res = await fetch('/api/import/settings', { headers: headers() });
    return res.json();
  },

  async updateAiImportSettings(settings: any): Promise<{ success: boolean; settings: any }> {
    const res = await fetch('/api/import/settings', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(settings)
    });
    return res.json();
  },

  // Admin User & Subscription Management
  async getUserStats(): Promise<{
    totalUsers: number;
    proUsers: number;
    freeUsers: number;
    expiredUsers: number;
    users: UserProfile[];
  }> {
    return safeFetchJson('/api/admin/users/stats', { headers: headers() }, {
      totalUsers: 0,
      proUsers: 0,
      freeUsers: 0,
      expiredUsers: 0,
      users: []
    });
  },

  async grantUserPro(userId: string, duration_days: number = 30, plan_name: string = 'Admin Manual Grant'): Promise<{ success: boolean; user: UserProfile }> {
    const res = await fetch(`/api/admin/users/${userId}/grant-pro`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ duration_days, plan_name })
    });
    return res.json();
  },

  async revokeUserPro(userId: string): Promise<{ success: boolean; user: UserProfile }> {
    const res = await fetch(`/api/admin/users/${userId}/revoke-pro`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({})
    });
    return res.json();
  },

  // Push Notifications
  async getPushNotifications(): Promise<PushNotification[]> {
    return safeFetchJson<PushNotification[]>('/api/push-notifications', { headers: headers() }, []);
  },

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/push-notifications/${id}/read`, {
      method: 'POST',
      headers: headers()
    });
    return res.json();
  },

  async sendPushNotification(data: {
    title_en?: string;
    title_mr?: string;
    message_en?: string;
    message_mr?: string;
    target_type: 'all' | 'user' | 'free_users' | 'pro_users';
    target_user_id?: string;
    target_user_name?: string;
    target_tab?: string;
    action_url?: string;
  }): Promise<PushNotification> {
    const res = await fetch('/api/admin/push-notifications', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deletePushNotification(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/admin/push-notifications/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    return res.json();
  },

  // YouTube Video Lectures API
  async getYouTubeLectures(activeOnly = false): Promise<YouTubeLecture[]> {
    const url = new URL('/api/youtube-lectures', window.location.origin);
    if (activeOnly) url.searchParams.set('active', 'true');
    return safeFetchJson<YouTubeLecture[]>(url.toString(), { headers: headers() }, []);
  },

  async addYouTubeLecture(data: Partial<YouTubeLecture>): Promise<YouTubeLecture> {
    const res = await fetch('/api/admin/youtube-lectures', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateYouTubeLecture(id: string, data: Partial<YouTubeLecture>): Promise<YouTubeLecture> {
    const res = await fetch(`/api/admin/youtube-lectures/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteYouTubeLecture(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/admin/youtube-lectures/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    return res.json();
  },

  async toggleYouTubeLectureActive(id: string, is_active: boolean): Promise<YouTubeLecture> {
    const res = await fetch(`/api/admin/youtube-lectures/${id}/toggle`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ is_active })
    });
    return res.json();
  }
};
