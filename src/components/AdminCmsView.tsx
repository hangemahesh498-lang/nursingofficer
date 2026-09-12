import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import {
  Subject,
  Question,
  QuestionReport,
  AuditLogEntry,
  SystemSettings
} from '../types';
import {
  ShieldCheck,
  PlusCircle,
  Upload,
  Sparkles,
  FileText,
  AlertTriangle,
  History,
  Settings,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Download,
  Filter,
  Search,
  Check,
  Save,
  Loader2
} from 'lucide-react';

export const AdminCmsView: React.FC = () => {
  const { language } = useLanguage();
  const { currentUser, hasRole } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'analytics' | 'questions' | 'new_question' | 'bulk_import' | 'ai_generator' | 'reports' | 'audit' | 'settings'
  >('analytics');

  // Core Data
  const [stats, setStats] = useState<any>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  // Filters & State
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // New Question Form State
  const [formData, setFormData] = useState({
    subject_id: 'subj-fon',
    question_en: '',
    question_mr: '',
    option_a_en: '',
    option_a_mr: '',
    option_b_en: '',
    option_b_mr: '',
    option_c_en: '',
    option_c_mr: '',
    option_d_en: '',
    option_d_mr: '',
    correct_option: 'A' as 'A' | 'B' | 'C' | 'D',
    explanation_en: '',
    explanation_mr: '',
    difficulty: 'medium',
    question_type: 'single_best',
    exam_name: 'AIIMS NORCET',
    exam_year: '2024',
    shift: 'Morning Shift',
    is_verified_pyq: false,
    status: 'draft'
  });
  const [formMsg, setFormMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Bulk Import State
  const [csvText, setCsvText] = useState('');
  const [importPreview, setImportPreview] = useState<any>(null);
  const [importing, setImporting] = useState(false);

  // AI Generator State
  const [aiSubject, setAiSubject] = useState('subj-fon');
  const [aiTopic, setAiTopic] = useState('Emergency Triage Priority in Disaster Management');
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [aiIsClinical, setAiIsClinical] = useState(true);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGeneratedQuestion, setAiGeneratedQuestion] = useState<any>(null);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [st, subs, qs, rps, logs, setts] = await Promise.all([
        api.getAdminStats(),
        api.getSubjects(),
        api.getQuestions(),
        api.getReports(),
        api.getAuditLogs(),
        api.getSettings()
      ]);
      setStats(st);
      setSubjects(subs);
      setQuestions(qs);
      setReports(rps);
      setAuditLogs(logs);
      setSettings(setts);
    } catch (err) {
      console.error('Admin load error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg(null);
    try {
      const q = await api.createQuestion(formData);
      setQuestions(prev => [q, ...prev]);
      setFormMsg({ type: 'success', text: `Question created successfully with ID ${q.id.slice(0, 8)} in ${formData.status} status.` });
      // reset form
      setFormData({
        ...formData,
        question_en: '',
        question_mr: '',
        option_a_en: '',
        option_a_mr: '',
        option_b_en: '',
        option_b_mr: '',
        option_c_en: '',
        option_c_mr: '',
        option_d_en: '',
        option_d_mr: '',
        explanation_en: '',
        explanation_mr: ''
      });
      loadAllAdminData();
    } catch (err: any) {
      setFormMsg({ type: 'error', text: err.message || 'Failed to save question' });
    }
  };

  const handleUpdateStatus = async (qId: string, newStatus: string) => {
    try {
      const updated = await api.updateQuestion(qId, { status: newStatus });
      setQuestions(prev => prev.map(q => q.id === qId ? updated : q));
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!confirm('Are you sure you want to permanently delete this question?')) return;
    try {
      await api.deleteQuestion(qId);
      setQuestions(prev => prev.filter(q => q.id !== qId));
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Deletion failed');
    }
  };

  // Bulk CSV parser
  const handleValidateCsv = async () => {
    if (!csvText.trim()) return;
    setImporting(true);
    setImportPreview(null);
    try {
      // Simple robust CSV parser
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        alert('CSV must contain a header row and at least 1 data row.');
        setImporting(false);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const rows = lines.slice(1).map(line => {
        const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
        const obj: any = {};
        headers.forEach((h, i) => {
          obj[h] = parts[i] || '';
        });
        return obj;
      });

      const res = await api.bulkImport(rows, false);
      setImportPreview(res);
    } catch (err: any) {
      alert('Failed to parse CSV: ' + err.message);
    } finally {
      setImporting(false);
    }
  };

  const handleExecuteImport = async () => {
    if (!importPreview || !importPreview.results) return;
    setImporting(true);
    try {
      const validRows = importPreview.results.filter((r: any) => r.valid).map((r: any) => r.data);
      const res = await api.bulkImport(validRows, true);
      alert(`Imported ${res.inserted_count} questions into DRAFT status for review.`);
      setCsvText('');
      setImportPreview(null);
      loadAllAdminData();
    } catch (err: any) {
      alert('Import failed: ' + err.message);
    } finally {
      setImporting(false);
    }
  };

  const downloadSampleCsv = () => {
    const header = 'subject_id,question_en,question_mr,option_a_en,option_b_en,option_c_en,option_d_en,correct_option,explanation_en,difficulty,exam_name,exam_year\n';
    const sample = 'subj-fon,"What is the normal therapeutic serum level of Digoxin?","डिगॉक्सिनचे सामान्य उपचारात्मक प्रमाण किती आहे?","0.1 - 0.4 ng/mL","0.5 - 2.0 ng/mL","2.5 - 4.0 ng/mL","5.0 - 8.0 ng/mL",B,"The therapeutic serum level of Digoxin is 0.5 to 2.0 ng/mL. Levels >2.0 ng/mL represent clinical toxicity.",medium,AIIMS NORCET,2024\n';
    const blob = new Blob([header + sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nursing_questions_template.csv';
    a.click();
  };

  const handleGenerateAiQuestion = async () => {
    setAiGenerating(true);
    setAiGeneratedQuestion(null);
    try {
      const res = await api.aiGenerateQuestion({
        subject_id: aiSubject,
        topic: aiTopic,
        difficulty: aiDifficulty,
        is_clinical_case: aiIsClinical
      });
      if (res.success && res.draft) {
        setAiGeneratedQuestion(res.draft);
        loadAllAdminData();
      } else {
        alert(res.error || 'Failed to generate question');
      }
    } catch (err: any) {
      alert(err.message || 'Error generating question');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleResolveReport = async (reportId: string, status: 'resolved' | 'rejected') => {
    const notes = prompt('Enter resolution comments / verification notes:');
    if (notes === null) return;
    try {
      await api.resolveReport(reportId, status, notes);
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    try {
      await api.updateSettings(settings);
      alert('System settings updated successfully!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (filterStatus !== 'all' && q.status !== filterStatus) return false;
    if (filterSubject !== 'all' && q.subject_id !== filterSubject) return false;
    if (searchQuery && !q.question_en.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-teal-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>INC Standard Question Bank Management Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">Nursing Officer Exam Admin CMS</h1>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as <strong className="text-white capitalize">{currentUser?.name}</strong> ({currentUser?.role.replace('_', ' ')})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('new_question')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Single Question</span>
          </button>

          <button
            onClick={() => setActiveTab('bulk_import')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition cursor-pointer"
          >
            <Upload className="w-4 h-4 text-sky-400" />
            <span>Bulk CSV Import</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {[
          { id: 'analytics', label: 'Dashboard & Quality KPIs' },
          { id: 'questions', label: `Question Bank (${questions.length})` },
          { id: 'new_question', label: 'Manual Entry Form' },
          { id: 'bulk_import', label: 'Bulk CSV / JSON Import' },
          { id: 'ai_generator', label: 'AI Question Generator' },
          { id: 'reports', label: `Student Error Reports (${reports.filter(r => r.status === 'pending').length})` },
          { id: 'audit', label: 'Audit Trail Logs' },
          { id: 'settings', label: 'System Configuration' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: KPI OVERVIEW */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-semibold mb-1">Total Question Items</div>
              <div className="text-2xl font-extrabold text-slate-900">{stats?.totalQuestions || 0}</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">
                {stats?.publishedQuestions || 0} Published & Live
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-semibold mb-1">Quality Workflow Queue</div>
              <div className="text-2xl font-extrabold text-amber-600">
                {(stats?.draftQuestions || 0) + (stats?.inReviewQuestions || 0)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {stats?.draftQuestions || 0} Drafts • {stats?.inReviewQuestions || 0} In Review
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-semibold mb-1">Total Student Attempts</div>
              <div className="text-2xl font-extrabold text-teal-700">{stats?.totalAttempts || 0}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                Across {stats?.totalMockTests || 0} Mock Test Series
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-semibold mb-1">Pending Quality Reports</div>
              <div className="text-2xl font-extrabold text-rose-600">{stats?.pendingReports || 0}</div>
              <div className="text-[11px] text-slate-500 mt-1">Candidate-flagged issues</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">INC Standard Editorial Workflow</h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800 mb-1">1. DRAFT</div>
                <p className="text-slate-500 text-[11px]">Author / AI drafting phase. Not visible to students.</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="font-bold text-blue-900 mb-1">2. IN REVIEW</div>
                <p className="text-blue-800 text-[11px]">Assigned to senior nursing educator for fact-checking.</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <div className="font-bold text-purple-900 mb-1">3. APPROVED</div>
                <p className="text-purple-800 text-[11px]">Validated against standard textbooks & official keys.</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="font-bold text-emerald-900 mb-1">4. PUBLISHED</div>
                <p className="text-emerald-800 text-[11px]">Active in practice quizzes, mocks, and student search.</p>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                <div className="font-bold text-rose-900 mb-1">5. ARCHIVED</div>
                <p className="text-rose-800 text-[11px]">Retired due to protocol changes or superseded guidelines.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUESTION MANAGEMENT */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search question text..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs w-60"
                />
              </div>

              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
              >
                <option value="all">All Workflow Statuses</option>
                <option value="draft">Draft</option>
                <option value="in_review">In Review</option>
                <option value="approved">Approved</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={filterSubject}
                onChange={e => setFilterSubject(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
              >
                <option value="all">All Subjects</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name_en}</option>
                ))}
              </select>
            </div>

            <span className="text-xs text-slate-500 font-semibold">
              Showing {filteredQuestions.length} of {questions.length} items
            </span>
          </div>

          {/* Questions Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-3.5">ID / Stem</th>
                    <th className="p-3.5">Subject</th>
                    <th className="p-3.5">Correct Opt</th>
                    <th className="p-3.5">Difficulty</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Workflow Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredQuestions.map(q => {
                    const sub = subjects.find(s => s.id === q.subject_id);

                    return (
                      <tr key={q.id} className="hover:bg-slate-50/50">
                        <td className="p-3.5 max-w-md">
                          <div className="font-semibold text-slate-900 line-clamp-2">
                            {q.question_en}
                          </div>
                          {q.is_verified_pyq && (
                            <span className="text-[10px] text-emerald-700 font-bold">
                              PYQ: {q.exam_name} {q.exam_year}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 whitespace-nowrap text-slate-600">
                          {sub?.name_en || q.subject_id}
                        </td>
                        <td className="p-3.5 font-bold text-teal-700">
                          Option {q.correct_option}
                        </td>
                        <td className="p-3.5 capitalize text-slate-600">
                          {q.difficulty}
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            q.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : q.status === 'in_review'
                              ? 'bg-blue-100 text-blue-800'
                              : q.status === 'approved'
                              ? 'bg-purple-100 text-purple-800'
                              : q.status === 'archived'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {q.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3.5 whitespace-nowrap text-right space-x-1.5">
                          {q.status === 'draft' && (
                            <button
                              onClick={() => handleUpdateStatus(q.id, 'in_review')}
                              className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[11px] font-semibold cursor-pointer"
                            >
                              Submit for Review
                            </button>
                          )}
                          {(q.status === 'in_review' || q.status === 'draft') && hasRole(['reviewer', 'admin', 'super_admin']) && (
                            <button
                              onClick={() => handleUpdateStatus(q.id, 'published')}
                              className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[11px] font-bold cursor-pointer"
                            >
                              Publish Live
                            </button>
                          )}
                          {q.status === 'published' && hasRole(['admin', 'super_admin']) && (
                            <button
                              onClick={() => handleUpdateStatus(q.id, 'archived')}
                              className="px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-[11px] font-semibold cursor-pointer"
                            >
                              Archive
                            </button>
                          )}
                          {hasRole(['admin', 'super_admin']) && (
                            <button
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                              title="Delete Question"
                            >
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MANUAL QUESTION ENTRY */}
      {activeTab === 'new_question' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Manual Nursing Question Authoring</h2>
            <p className="text-xs text-slate-500">Provide all 4 options, bilingual translations, and official rationale.</p>
          </div>

          {formMsg && (
            <div className={`p-4 rounded-xl text-xs font-semibold ${
              formMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {formMsg.text}
            </div>
          )}

          <form onSubmit={handleCreateQuestion} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
                <select
                  value={formData.subject_id}
                  onChange={e => setFormData({ ...formData, subject_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name_en}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty *</label>
                <select
                  value={formData.difficulty}
                  onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard (NORCET Level)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Question Type *</label>
                <select
                  value={formData.question_type}
                  onChange={e => setFormData({ ...formData, question_type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="single_best">Single Best Answer (MCQ)</option>
                  <option value="clinical_case">Clinical Case Study Item</option>
                  <option value="pyq">Previous Year Exam Paper</option>
                </select>
              </div>
            </div>

            {/* Question Stem in EN & MR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Question Stem (English) *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.question_en}
                  onChange={e => setFormData({ ...formData, question_en: e.target.value })}
                  placeholder="Enter the primary clinical question stem in English..."
                  className="w-full p-3 border border-slate-300 rounded-lg text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Question Stem (मराठी अनुवाद)</label>
                <textarea
                  rows={3}
                  value={formData.question_mr}
                  onChange={e => setFormData({ ...formData, question_mr: e.target.value })}
                  placeholder="मराठी मध्ये प्रश्न प्रविष्ट करा..."
                  className="w-full p-3 border border-slate-300 rounded-lg text-xs"
                ></textarea>
              </div>
            </div>

            {/* Options A, B, C, D */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                Options & Correct Answer Selection
              </span>
              {(['A', 'B', 'C', 'D'] as const).map(opt => {
                const enKey = `option_${opt.toLowerCase()}_en` as keyof typeof formData;
                const mrKey = `option_${opt.toLowerCase()}_mr` as keyof typeof formData;

                return (
                  <div key={opt} className="grid grid-cols-12 gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="col-span-1 text-center font-bold text-slate-700">
                      Option {opt}
                    </div>
                    <div className="col-span-6">
                      <input
                        type="text"
                        required
                        placeholder={`Option ${opt} (English) *`}
                        value={formData[enKey] as string}
                        onChange={e => setFormData({ ...formData, [enKey]: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        type="text"
                        placeholder={`Option ${opt} (मराठी)`}
                        value={formData[mrKey] as string}
                        onChange={e => setFormData({ ...formData, [mrKey]: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      <label className="flex items-center justify-center gap-1 cursor-pointer text-xs font-semibold">
                        <input
                          type="radio"
                          name="correct_option"
                          checked={formData.correct_option === opt}
                          onChange={() => setFormData({ ...formData, correct_option: opt })}
                          className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Medical Rationale (English) *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.explanation_en}
                  onChange={e => setFormData({ ...formData, explanation_en: e.target.value })}
                  placeholder="Explain why the correct option is right and others are wrong based on standard nursing textbooks..."
                  className="w-full p-3 border border-slate-300 rounded-lg text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Medical Rationale (मराठी स्पष्टीकरण)</label>
                <textarea
                  rows={3}
                  value={formData.explanation_mr}
                  onChange={e => setFormData({ ...formData, explanation_mr: e.target.value })}
                  placeholder="मराठी वैद्यकीय स्पष्टीकरण..."
                  className="w-full p-3 border border-slate-300 rounded-lg text-xs"
                ></textarea>
              </div>
            </div>

            {/* PYQ Metadata & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_verified_pyq}
                    onChange={e => setFormData({ ...formData, is_verified_pyq: e.target.checked })}
                    className="w-4 h-4 rounded text-teal-600"
                  />
                  <span>Is Official PYQ?</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Exam Name</label>
                <input
                  type="text"
                  value={formData.exam_name}
                  onChange={e => setFormData({ ...formData, exam_name: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Exam Year</label>
                <input
                  type="text"
                  value={formData.exam_year}
                  onChange={e => setFormData({ ...formData, exam_year: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Initial Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="draft">Draft</option>
                  <option value="in_review">In Review</option>
                  {hasRole(['reviewer', 'admin', 'super_admin']) && <option value="published">Publish Directly</option>}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                Save Question
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: BULK CSV IMPORT */}
      {activeTab === 'bulk_import' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Bulk CSV / JSON Question Importer</h2>
              <p className="text-xs text-slate-500">
                Upload or paste comma-separated questions. All imported questions enter <strong>DRAFT</strong> status.
              </p>
            </div>

            <button
              onClick={downloadSampleCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer self-start"
            >
              <Download className="w-3.5 h-3.5 text-teal-700" />
              <span>Download CSV Template</span>
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Paste Raw CSV Text</label>
            <textarea
              rows={8}
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              placeholder="subject_id,question_en,question_mr,option_a_en,option_b_en,option_c_en,option_d_en,correct_option,explanation_en,difficulty,exam_name,exam_year..."
              className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl"
            ></textarea>
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={importing || !csvText.trim()}
              onClick={handleValidateCsv}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
            >
              {importing ? 'Validating...' : 'Validate & Preview CSV'}
            </button>
          </div>

          {/* Preview Results */}
          {importPreview && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="text-xs">
                  <span className="font-bold text-slate-900">Validation Summary: </span>
                  <span className="text-emerald-700 font-bold">{importPreview.valid_count} Valid Rows</span>
                  {' • '}
                  <span className="text-rose-700 font-bold">{importPreview.error_count} Errors</span>
                </div>

                {importPreview.valid_count > 0 && (
                  <button
                    disabled={importing}
                    onClick={handleExecuteImport}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Import {importPreview.valid_count} Valid Questions
                  </button>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="p-2.5">Row</th>
                      <th className="p-2.5">Question Stem</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Validation Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {importPreview.results.map((res: any) => (
                      <tr key={res.row_number} className={res.valid ? 'bg-white' : 'bg-rose-50/50'}>
                        <td className="p-2.5 font-mono">{res.row_number}</td>
                        <td className="p-2.5 truncate max-w-xs">{res.data.question_en}</td>
                        <td className="p-2.5">
                          {res.valid ? (
                            <span className="text-emerald-600 font-bold">✓ Ready</span>
                          ) : (
                            <span className="text-rose-600 font-bold">✗ Error</span>
                          )}
                        </td>
                        <td className="p-2.5 text-slate-500">
                          {res.errors.length > 0 ? res.errors.join(', ') : 'All mandatory fields validated'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: AI QUESTION GENERATOR (ADMIN ONLY) */}
      {activeTab === 'ai_generator' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Admin-Only AI Assistant • Gemini 3.8 Flash</span>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">Clinical Question Generator (Draft Output)</h2>
            <p className="text-xs text-slate-500">
              Generates high-yield bilingual questions with full medical rationales. The generated questions are strictly committed in <strong>DRAFT</strong> status and require human reviewer sign-off.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Subject</label>
              <select
                value={aiSubject}
                onChange={e => setAiSubject(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name_en}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
              <select
                value={aiDifficulty}
                onChange={e => setAiDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard (NORCET Clinical Priority)</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={aiIsClinical}
                  onChange={e => setAiIsClinical(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600"
                />
                <span>Generate Clinical Scenario</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Topic / Core Concept</label>
            <input
              type="text"
              value={aiTopic}
              onChange={e => setAiTopic(e.target.value)}
              placeholder="e.g. Ventilator Bundle (VAP) Prevention, Blood Transfusion Reaction Priority..."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs"
            />
          </div>

          <button
            disabled={aiGenerating}
            onClick={handleGenerateAiQuestion}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
          >
            {aiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Generate & Save Draft Question</span>
          </button>

          {/* Generated Question Preview */}
          {aiGeneratedQuestion && (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                <span>✓ Successfully Created Draft (ID: {aiGeneratedQuestion.id.slice(0, 8)})</span>
                <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full uppercase text-[10px]">
                  Requires Reviewer Approval
                </span>
              </div>

              <div className="text-sm font-bold text-slate-900">{aiGeneratedQuestion.question_en}</div>
              {aiGeneratedQuestion.question_mr && (
                <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                  {aiGeneratedQuestion.question_mr}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['A', 'B', 'C', 'D'] as const).map(opt => (
                  <div
                    key={opt}
                    className={`p-2.5 rounded-lg border ${
                      aiGeneratedQuestion.correct_option === opt
                        ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-950'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    {opt}: {aiGeneratedQuestion[`option_${opt.toLowerCase()}_en`]}
                  </div>
                ))}
              </div>

              <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                <strong className="block text-slate-900 mb-1">Medical Rationale:</strong>
                {aiGeneratedQuestion.explanation_en}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: QUESTION ERROR REPORTS */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Student Issue Reports Queue</h2>

          {reports.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">No issue reports logged.</div>
          ) : (
            <div className="space-y-4">
              {reports.map((r: any) => (
                <div key={r.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 capitalize">
                      {r.reason.replace('_', ' ')}
                    </span>
                    <span className="text-slate-400 text-[11px]">{new Date(r.created_at).toLocaleString()}</span>
                  </div>

                  {r.question && (
                    <div className="font-semibold text-slate-800">
                      Question Stem: "{r.question.question_en}"
                    </div>
                  )}

                  <div className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-700">Candidate Observation: </span>
                    {r.details || 'No additional note provided.'}
                  </div>

                  {r.status === 'pending' ? (
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => handleResolveReport(r.id, 'rejected')}
                        className="px-3 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                      >
                        Reject Issue
                      </button>
                      <button
                        onClick={() => handleResolveReport(r.id, 'resolved')}
                        className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                      >
                        Resolve & Correct
                      </button>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500 font-semibold">
                      Status: <strong className="capitalize text-slate-800">{r.status}</strong> • Notes: {r.resolution_notes || 'None'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 7: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">System Audit Trail & Operations Log</h2>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Target Entity</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td className="p-3 font-mono text-[11px] text-slate-500">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{log.user_name}</td>
                    <td className="p-3 font-bold text-teal-700 capitalize">{log.action.replace('_', ' ')}</td>
                    <td className="p-3 text-slate-600">{log.entity_type} ({log.entity_id.slice(0, 8)})</td>
                    <td className="p-3 text-slate-500 max-w-xs truncate">{JSON.stringify(log.details)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: SETTINGS */}
      {activeTab === 'settings' && settings && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 max-w-2xl">
          <h2 className="text-base font-bold text-slate-900">Global Examination Rules & Scoring Config</h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Standard Negative Marking Rate</label>
              <select
                value={settings.negative_marking_default}
                onChange={e => setSettings({ ...settings, negative_marking_default: parseFloat(e.target.value) })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-semibold"
              >
                <option value={0.33}>-1/3 (0.33 Mark) — AIIMS NORCET Standard</option>
                <option value={0.25}>-1/4 (0.25 Mark) — State DMER Standard</option>
                <option value={0}>0.00 — Practice No Penalty Mode</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Qualifying Cut-off Threshold (%)</label>
              <input
                type="number"
                value={settings.passing_percentage}
                onChange={e => setSettings({ ...settings, passing_percentage: parseInt(e.target.value) })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Default UI Language</label>
              <select
                value={settings.default_language}
                onChange={e => setSettings({ ...settings, default_language: e.target.value as any })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-semibold"
              >
                <option value="en">English (Primary)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>

            <button
              onClick={handleSaveSettings}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold cursor-pointer transition shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
