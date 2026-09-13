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
  SystemSettings,
  StudyMaterial,
  RecruitmentNotice,
  PaymentPlan,
  PaymentRecord
} from '../types';

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

const headers = () => {
  const h: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-user-id': currentUserId
  };
  if (currentAuthToken) {
    h['Authorization'] = `Bearer ${currentAuthToken}`;
  }
  return h;
};

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
        'Authorization': `Bearer ${idToken}`
      }
    });
    if (!res.ok) {
      throw new Error('Firebase login failed');
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
    return res.json();
  },

  async register(data: { email: string; name: string; role?: string; targetExam?: string; preferredLanguage?: 'en' | 'mr' }): Promise<UserProfile> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
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
    const res = await fetch('/api/subjects', { headers: headers() });
    return res.json();
  },

  // Chapters & Topics (5-tier syllabus)
  async getChapters(subject_id?: string): Promise<any[]> {
    const url = new URL('/api/chapters', window.location.origin);
    if (subject_id) url.searchParams.set('subject_id', subject_id);
    const res = await fetch(url.toString(), { headers: headers() });
    return res.json();
  },

  async addChapter(data: { subject_id: string; name_en: string; name_mr: string; order_index?: number }): Promise<any> {
    const res = await fetch('/api/chapters', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getTopics(params?: { chapter_id?: string; subject_id?: string }): Promise<any[]> {
    const url = new URL('/api/topics', window.location.origin);
    if (params?.chapter_id) url.searchParams.set('chapter_id', params.chapter_id);
    if (params?.subject_id) url.searchParams.set('subject_id', params.subject_id);
    const res = await fetch(url.toString(), { headers: headers() });
    return res.json();
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
    const res = await fetch('/api/syllabus/gaps', { headers: headers() });
    return res.json();
  },

  // Cloudinary CDN
  async getCloudinaryStatus(): Promise<{ configured: boolean; folders: string[]; provider: string }> {
    const res = await fetch('/api/cloudinary/status', { headers: headers() });
    return res.json();
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
    const res = await fetch(url.toString(), { headers: headers() });
    return res.json();
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

  // Cases
  async getCases(): Promise<CaseStudy[]> {
    const res = await fetch('/api/cases', { headers: headers() });
    return res.json();
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
    const res = await fetch('/api/mock-tests', { headers: headers() });
    return res.json();
  },

  async getMockTest(id: string): Promise<MockTest & { questions: Question[] }> {
    const res = await fetch(`/api/mock-tests/${id}`, { headers: headers() });
    return res.json();
  },

  async createMockTest(data: any): Promise<MockTest> {
    const res = await fetch('/api/mock-tests', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
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
    const res = await fetch('/api/student/stats', { headers: headers() });
    return res.json();
  },

  async getMistakes(): Promise<(MistakeRecord & { question: Question })[]> {
    const res = await fetch('/api/student/mistakes', { headers: headers() });
    return res.json();
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
    const res = await fetch('/api/student/bookmarks', { headers: headers() });
    return res.json();
  },

  async toggleBookmark(questionId: string): Promise<{ isBookmarked: boolean }> {
    const res = await fetch('/api/student/bookmarks/toggle', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ question_id: questionId })
    });
    return res.json();
  },

  // Reports
  async submitReport(data: { question_id: string; reason: string; details?: string }): Promise<QuestionReport> {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getReports(): Promise<any[]> {
    const res = await fetch('/api/admin/reports', { headers: headers() });
    return res.json();
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
    const res = await fetch('/api/admin/stats', { headers: headers() });
    return res.json();
  },

  async getAuditLogs(): Promise<AuditLogEntry[]> {
    const res = await fetch('/api/admin/audit-logs', { headers: headers() });
    return res.json();
  },

  async getSettings(): Promise<SystemSettings> {
    const res = await fetch('/api/admin/settings', { headers: headers() });
    return res.json();
  },

  async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(settings)
    });
    return res.json();
  },

  async bulkImport(rows: any[], executeInsert = false): Promise<any> {
    const res = await fetch('/api/admin/bulk-import', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ rows, executeInsert })
    });
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

  // Payment Plans & Manual QR
  async getPaymentPlans(): Promise<PaymentPlan[]> {
    const res = await fetch('/api/payments/plans', { headers: headers() });
    return res.json();
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

  async getMyPaymentHistory(): Promise<PaymentRecord[]> {
    const res = await fetch('/api/payments/my-history', { headers: headers() });
    return res.json();
  },

  async submitManualPaymentUtr(data: {
    plan_id: string;
    utr_number: string;
    screenshot_url?: string;
    screenshot_public_id?: string;
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

  async verifyPayment(paymentId: string, action: 'APPROVE' | 'REJECT', notes?: string): Promise<PaymentRecord> {
    const res = await fetch(`/api/admin/payments/${paymentId}/verify`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ action, notes })
    });
    return res.json();
  }
};
