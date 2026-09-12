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
  SystemSettings
} from '../types';

let currentUserId = 'usr-student-01';

export function setApiUserId(id: string) {
  currentUserId = id;
}

export function getApiUserId() {
  return currentUserId;
}

const headers = () => ({
  'Content-Type': 'application/json',
  'x-user-id': currentUserId
});

export const api = {
  // Auth
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

  // Questions
  async getQuestions(params?: {
    subject_id?: string;
    difficulty?: string;
    status?: string;
    is_verified_pyq?: boolean;
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
  }
};
