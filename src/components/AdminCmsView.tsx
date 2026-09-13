import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import {
  Subject,
  Chapter,
  Topic,
  Question,
  CaseStudy,
  MockTest,
  UserProfile,
  QuestionReport,
  AuditLogEntry,
  SystemSettings,
  SyllabusGapItem,
  Role,
  ExamTrack,
  StudyMaterial,
  RecruitmentNotice,
  PaymentPlan,
  PaymentRecord
} from '../types';
import {
  LayoutDashboard,
  Users,
  Database,
  PlusCircle,
  UploadCloud,
  Sparkles,
  CheckSquare,
  Award,
  Stethoscope,
  Image as ImageIcon,
  BookOpen,
  FolderTree,
  ListTree,
  Compass,
  FileCheck2,
  AlertTriangle,
  BarChart3,
  ShieldAlert,
  UserCog,
  Settings,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Download,
  Filter,
  Check,
  Save,
  Loader2,
  RefreshCw,
  Eye,
  ExternalLink,
  HelpCircle,
  Layers,
  ArrowRight,
  Copy,
  ChevronRight,
  CreditCard,
  Bell,
  FileText,
  DollarSign,
  AlertCircle,
  Film
} from 'lucide-react';

import { AdminStudyMaterialsTab } from './AdminStudyMaterialsTab';
import { AdminRecruitmentNoticesTab } from './AdminRecruitmentNoticesTab';
import { AdminPaymentsTab } from './AdminPaymentsTab';
import { AdminQuestionUploadTab } from './AdminQuestionUploadTab';
import { AdminPromoAdsTab } from './AdminPromoAdsTab';

export type AdminTab =
  | 'overview'
  | 'students'
  | 'questions'
  | 'new_question'
  | 'bulk_import'
  | 'ai_generator'
  | 'review_queue'
  | 'pyqs'
  | 'cases'
  | 'images'
  | 'promo_ads'
  | 'study_materials'
  | 'recruitment_notices'
  | 'payments'
  | 'subjects'
  | 'chapters'
  | 'topics'
  | 'exams'
  | 'mock_tests'
  | 'reports'
  | 'analytics'
  | 'audit'
  | 'users'
  | 'settings';

export const AdminCmsView: React.FC = () => {
  const { language } = useLanguage();
  const { currentUser, hasRole } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Core Data State
  const [stats, setStats] = useState<any>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [gaps, setGaps] = useState<SyllabusGapItem[]>([]);
  const [cloudinaryStatus, setCloudinaryStatus] = useState<any>(null);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [recruitmentNotices, setRecruitmentNotices] = useState<RecruitmentNotice[]>([]);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);

  // Filter & Search states
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterChapter, setFilterChapter] = useState<string>('all');
  const [filterExam, setFilterExam] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Edit Question Modal State
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Form State for Add/Edit Question
  const [formData, setFormData] = useState({
    id: '',
    subject_id: 'subj-fon',
    chapter_id: '',
    topic_id: '',
    exam_target: 'both' as ExamTrack,
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
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    question_type: 'single_best',
    exam_name: 'AIIMS NORCET',
    exam_year: '2024',
    shift: 'Morning Shift',
    is_verified_pyq: false,
    image_url: '',
    image_public_id: '',
    image_alt_text: '',
    status: 'draft'
  });
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Bulk Import State
  const [csvText, setCsvText] = useState('');
  const [importPreview, setImportPreview] = useState<any>(null);
  const [importing, setImporting] = useState(false);

  // AI Generator State
  const [aiSubject, setAiSubject] = useState('subj-fon');
  const [aiTopic, setAiTopic] = useState('Emergency Cardiac Triage');
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [aiIsClinical, setAiIsClinical] = useState(true);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Question Delete & Bulk Selection State
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<Question | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [deletingLoading, setDeletingLoading] = useState(false);

  // New Chapter / Topic / Subject State
  const [newSubject, setNewSubject] = useState({ id: '', name_en: '', name_mr: '', description_en: '', description_mr: '', icon: 'BookOpen', category: 'core_nursing' as any, exam_track: 'both' as any });
  const [newChapter, setNewChapter] = useState({ subject_id: 'subj-fon', name_en: '', name_mr: '', order_index: 1 });
  const [newTopic, setNewTopic] = useState({ subject_id: 'subj-fon', chapter_id: '', name_en: '', name_mr: '', order_index: 1 });

  // New Case Study State
  const [newCase, setNewCase] = useState({
    title_en: '',
    title_mr: '',
    patient_age: 45,
    patient_gender: 'Male' as any,
    chief_complaint_en: '',
    chief_complaint_mr: '',
    history_and_vitals_en: '',
    history_and_vitals_mr: '',
    clinical_investigations_en: '',
    clinical_investigations_mr: '',
    image_url: '',
    image_public_id: '',
    status: 'published' as any,
    question_ids: [] as string[]
  });

  // New Mock Test State
  const [newMockTest, setNewMockTest] = useState({
    title_en: '',
    title_mr: '',
    exam_name: 'AIIMS NORCET 2025',
    description: '',
    duration_minutes: 30,
    total_marks: 20,
    passing_marks: 10,
    negative_marking_rate: 0.33,
    question_ids: [] as string[],
    is_published: true,
    is_premium: false
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        statsData,
        subjs,
        chaps,
        tops,
        allQ,
        allCases,
        allTests,
        users,
        reps,
        logs,
        sets,
        gapList,
        cStatus,
        materials,
        notices,
        payments,
        plans
      ] = await Promise.all([
        api.getAdminStats(),
        api.getSubjects(),
        api.getChapters(),
        api.getTopics(),
        api.getQuestions(),
        api.getCases(),
        api.getMockTests(),
        api.getUsers(),
        api.getReports(),
        api.getAuditLogs(),
        api.getSettings(),
        api.getSyllabusGaps(),
        api.getCloudinaryStatus(),
        api.getStudyMaterials(),
        api.getRecruitmentNotices(),
        api.getAdminPayments(),
        api.getPaymentPlans()
      ]);

      setStats(statsData);
      setSubjects(subjs || []);
      setChapters(chaps || []);
      setTopics(tops || []);
      setQuestions(allQ || []);
      setCases(allCases || []);
      setMockTests(allTests || []);
      setUsersList(users || []);
      setReports(reps || []);
      setAuditLogs(logs || []);
      setSettings(sets);
      setGaps(gapList || []);
      setCloudinaryStatus(cStatus);
      setStudyMaterials(materials || []);
      setRecruitmentNotices(notices || []);
      setPaymentRecords(payments || []);
      setPaymentPlans(plans || []);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      setActionNotice({ type: 'error', message: 'Failed to synchronize admin database' });
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setActionNotice({ type, message });
    setTimeout(() => setActionNotice(null), 5000);
  };

  // Duplicate Check on Blur
  const handleCheckDuplicate = async (text: string) => {
    if (!text || text.trim().length < 10) {
      setDuplicateWarning(null);
      return;
    }
    try {
      const res = await api.checkDuplicate(text, formData.id);
      if (res.isDuplicate && res.matchedQuestion) {
        setDuplicateWarning(`Warning: Exact or very similar question already exists (ID: ${res.matchedQuestion.id.substring(0, 8)}...)`);
      } else {
        setDuplicateWarning(null);
      }
    } catch (e) {
      // Non-blocking
    }
  };

  // Image Upload to Cloudinary
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, folder = 'nursing-officer/questions') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size exceeds 5MB limit', 'error');
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await api.uploadCloudinaryImage(base64, {
          folder,
          alt_text: formData.image_alt_text || 'Clinical diagnostic visual reference'
        });

        setFormData(prev => ({
          ...prev,
          image_url: res.secure_url || res.url,
          image_public_id: res.public_id
        }));

        showToast(res.is_simulated ? 'Image stored locally (Live Cloudinary will CDN-optimize when keys are set)' : 'Image optimized and uploaded to Cloudinary CDN', 'success');
      } catch (err: any) {
        showToast(err.message || 'Image upload failed', 'error');
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = async () => {
    if (formData.image_public_id) {
      try {
        await api.deleteCloudinaryImage(formData.image_public_id);
      } catch (e) {
        console.warn('Image delete cleanup error', e);
      }
    }
    setFormData(prev => ({ ...prev, image_url: '', image_public_id: '' }));
    showToast('Image detached from question', 'info');
  };

  // Submit Question Form (Create / Update)
  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question_en || !formData.option_a_en || !formData.option_b_en || !formData.option_c_en || !formData.option_d_en || !formData.explanation_en) {
      showToast('Please fill all mandatory English question fields, 4 options, and explanation', 'error');
      return;
    }

    try {
      if (formData.id) {
        // Update
        await api.updateQuestion(formData.id, {
          subject_id: formData.subject_id,
          chapter_id: formData.chapter_id || undefined,
          topic_id: formData.topic_id || undefined,
          exam_target: formData.exam_target,
          question_en: formData.question_en,
          question_mr: formData.question_mr,
          option_a_en: formData.option_a_en,
          option_a_mr: formData.option_a_mr,
          option_b_en: formData.option_b_en,
          option_b_mr: formData.option_b_mr,
          option_c_en: formData.option_c_en,
          option_c_mr: formData.option_c_mr,
          option_d_en: formData.option_d_en,
          option_d_mr: formData.option_d_mr,
          correct_option: formData.correct_option,
          explanation_en: formData.explanation_en,
          explanation_mr: formData.explanation_mr,
          difficulty: formData.difficulty,
          question_type: formData.question_type as any,
          exam_name: formData.exam_name,
          exam_year: formData.exam_year ? parseInt(formData.exam_year) : undefined,
          shift: formData.shift,
          is_verified_pyq: formData.is_verified_pyq,
          image_url: formData.image_url || undefined,
          image_public_id: formData.image_public_id || undefined,
          image_alt_text: formData.image_alt_text || undefined,
          status: formData.status as any
        });
        showToast('Question updated successfully', 'success');
      } else {
        // Create
        await api.createQuestion({
          subject_id: formData.subject_id,
          chapter_id: formData.chapter_id || undefined,
          topic_id: formData.topic_id || undefined,
          exam_target: formData.exam_target,
          question_en: formData.question_en,
          question_mr: formData.question_mr,
          option_a_en: formData.option_a_en,
          option_a_mr: formData.option_a_mr,
          option_b_en: formData.option_b_en,
          option_b_mr: formData.option_b_mr,
          option_c_en: formData.option_c_en,
          option_c_mr: formData.option_c_mr,
          option_d_en: formData.option_d_en,
          option_d_mr: formData.option_d_mr,
          correct_option: formData.correct_option,
          explanation_en: formData.explanation_en,
          explanation_mr: formData.explanation_mr,
          difficulty: formData.difficulty,
          question_type: formData.question_type as any,
          exam_name: formData.exam_name,
          exam_year: formData.exam_year ? parseInt(formData.exam_year) : undefined,
          shift: formData.shift,
          is_verified_pyq: formData.is_verified_pyq,
          image_url: formData.image_url || undefined,
          image_public_id: formData.image_public_id || undefined,
          image_alt_text: formData.image_alt_text || undefined,
          status: formData.status as any
        });
        showToast('New question saved successfully to repository', 'success');
      }

      // Reset form and reload
      resetForm();
      loadAllData();
      setActiveTab('questions');
    } catch (err: any) {
      showToast(err.message || 'Failed to save question', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      subject_id: subjects[0]?.id || 'subj-fon',
      chapter_id: '',
      topic_id: '',
      exam_target: 'both',
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
      correct_option: 'A',
      explanation_en: '',
      explanation_mr: '',
      difficulty: 'medium',
      question_type: 'single_best',
      exam_name: 'AIIMS NORCET',
      exam_year: '2024',
      shift: 'Morning Shift',
      is_verified_pyq: false,
      image_url: '',
      image_public_id: '',
      image_alt_text: '',
      status: 'draft'
    });
    setDuplicateWarning(null);
  };

  const startEditQuestion = (q: Question) => {
    setFormData({
      id: q.id,
      subject_id: q.subject_id,
      chapter_id: q.chapter_id || '',
      topic_id: q.topic_id || '',
      exam_target: (q.exam_target as ExamTrack) || 'both',
      question_en: q.question_en,
      question_mr: q.question_mr || '',
      option_a_en: q.option_a_en,
      option_a_mr: q.option_a_mr || '',
      option_b_en: q.option_b_en,
      option_b_mr: q.option_b_mr || '',
      option_c_en: q.option_c_en,
      option_c_mr: q.option_c_mr || '',
      option_d_en: q.option_d_en,
      option_d_mr: q.option_d_mr || '',
      correct_option: q.correct_option,
      explanation_en: q.explanation_en,
      explanation_mr: q.explanation_mr || '',
      difficulty: q.difficulty,
      question_type: q.question_type,
      exam_name: q.exam_name || 'AIIMS NORCET',
      exam_year: q.exam_year ? String(q.exam_year) : '2024',
      shift: q.shift || 'Morning Shift',
      is_verified_pyq: !!q.is_verified_pyq,
      image_url: q.image_url || '',
      image_public_id: q.image_public_id || '',
      image_alt_text: q.image_alt_text || '',
      status: q.status
    });
    setActiveTab('new_question');
  };

  const handleUpdateStatus = async (qId: string, newStatus: string) => {
    try {
      await api.updateQuestion(qId, { status: newStatus as any });
      showToast(`Question status updated to ${newStatus}`, 'success');
      loadAllData();
    } catch (e: any) {
      showToast(e.message || 'Status update failed', 'error');
    }
  };

  const handleDeleteQuestion = (qId: string) => {
    const target = questions.find(q => q.id === qId);
    if (target) {
      setDeleteConfirmTarget(target);
    } else {
      // Fallback
      api.deleteQuestion(qId).then(() => {
        showToast('प्रश्न हटवला गेला', 'info');
        loadAllData();
      }).catch((e: any) => showToast(e.message || 'Delete failed', 'error'));
    }
  };

  const handleConfirmSingleDelete = async () => {
    if (!deleteConfirmTarget) return;
    setDeletingLoading(true);
    try {
      await api.deleteQuestion(deleteConfirmTarget.id);
      showToast('प्रश्न कायमचा हटवला गेला (Question deleted permanently)', 'info');
      setDeleteConfirmTarget(null);
      setSelectedQuestionIds(prev => prev.filter(id => id !== deleteConfirmTarget.id));
      loadAllData();
    } catch (e: any) {
      showToast(e.message || 'Delete failed', 'error');
    } finally {
      setDeletingLoading(false);
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedQuestionIds.length === 0) return;
    setDeletingLoading(true);
    try {
      const res = await api.bulkDeleteQuestions(selectedQuestionIds);
      showToast(`${res.count || selectedQuestionIds.length} प्रश्न कायमचे हटवले गेले (Bulk delete complete)`, 'info');
      setSelectedQuestionIds([]);
      setBulkDeleteConfirmOpen(false);
      loadAllData();
    } catch (e: any) {
      showToast(e.message || 'Bulk delete failed', 'error');
    } finally {
      setDeletingLoading(false);
    }
  };

  const handleToggleSelectQuestion = (qId: string) => {
    setSelectedQuestionIds(prev =>
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const handleToggleSelectAllQuestions = () => {
    const filteredIds = filteredQuestions.map(q => q.id);
    const allSelected = filteredIds.length > 0 && filteredIds.every(id => selectedQuestionIds.includes(id));
    if (allSelected) {
      setSelectedQuestionIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      const merged = Array.from(new Set([...selectedQuestionIds, ...filteredIds]));
      setSelectedQuestionIds(merged);
    }
  };

  // AI Generator
  const handleAiGenerate = async () => {
    setAiGenerating(true);
    try {
      const res = await api.aiGenerateQuestion({
        subject_id: aiSubject,
        topic: aiTopic,
        difficulty: aiDifficulty,
        is_clinical_case: aiIsClinical
      });

      if (res.success && res.draft) {
        showToast('AI drafted new question into Review Queue (Status: Draft)', 'success');
        loadAllData();
        setActiveTab('review_queue');
      } else {
        showToast('AI draft generation failed', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'AI generation error', 'error');
    } finally {
      setAiGenerating(false);
    }
  };

  // Bulk Import
  const handlePreviewCsv = async () => {
    if (!csvText.trim()) return;
    try {
      const rows: any[] = [];
      const lines = csvText.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const vals = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const rowObj: any = {};
        headers.forEach((h, idx) => {
          rowObj[h] = vals[idx] || '';
        });
        rows.push(rowObj);
      }

      const res = await api.bulkImport(rows, false);
      setImportPreview(res);
    } catch (e: any) {
      showToast('Failed to parse CSV format', 'error');
    }
  };

  const handleExecuteImport = async () => {
    if (!importPreview?.results) return;
    setImporting(true);
    try {
      const validRows = importPreview.results.filter((r: any) => r.valid).map((r: any) => r.data);
      const res = await api.bulkImport(validRows, true);
      showToast(`Successfully imported ${res.inserted_count} questions into repository (Draft status)`, 'success');
      setCsvText('');
      setImportPreview(null);
      loadAllData();
      setActiveTab('questions');
    } catch (e: any) {
      showToast('Bulk import insertion failed', 'error');
    } finally {
      setImporting(false);
    }
  };

  // Navigation Items
  const navSections = [
    {
      group: 'Core Operations',
      items: [
        { id: 'overview' as AdminTab, label: 'Overview & Health', icon: LayoutDashboard },
        { id: 'questions' as AdminTab, label: 'Question Bank', icon: Database, badge: questions.length },
        { id: 'bulk_import' as AdminTab, label: language === 'mr' ? 'प्रश्न अपलोड केंद्र (Upload)' : 'Question Upload Hub', icon: UploadCloud },
        { id: 'new_question' as AdminTab, label: formData.id ? 'Edit Question' : (language === 'mr' ? 'एकल प्रश्न (Single Form)' : 'Add Single Question'), icon: PlusCircle },
        { id: 'review_queue' as AdminTab, label: 'Review Queue', icon: CheckSquare, badge: questions.filter(q => q.status === 'draft' || q.status === 'in_review').length },
        { id: 'ai_generator' as AdminTab, label: 'AI Generator', icon: Sparkles }
      ]
    },
    {
      group: 'Content & Media',
      items: [
        { id: 'promo_ads' as AdminTab, label: language === 'mr' ? 'व्हिडिओ जाहिराती (9:16 / 16:9)' : 'Video Promo Ads (9:16 / 16:9)', icon: Film },
        { id: 'study_materials' as AdminTab, label: 'Study Materials Library', icon: FileText, badge: studyMaterials.length },
        { id: 'recruitment_notices' as AdminTab, label: 'Recruitment Notices', icon: Bell, badge: recruitmentNotices.length },
        { id: 'pyqs' as AdminTab, label: 'PYQ Hub', icon: Award, badge: questions.filter(q => q.is_verified_pyq).length },
        { id: 'cases' as AdminTab, label: 'Clinical Cases', icon: Stethoscope, badge: cases.length },
        { id: 'images' as AdminTab, label: 'Image CDN (Cloudinary)', icon: ImageIcon, badge: questions.filter(q => !!q.image_url).length },
        { id: 'mock_tests' as AdminTab, label: 'Mock Test Simulator', icon: FileCheck2, badge: mockTests.length }
      ]
    },
    {
      group: '5-Tier Syllabus & Curriculum',
      items: [
        { id: 'subjects' as AdminTab, label: 'Subjects (18)', icon: BookOpen, badge: subjects.length },
        { id: 'chapters' as AdminTab, label: 'Chapters', icon: FolderTree, badge: chapters.length },
        { id: 'topics' as AdminTab, label: 'Topics', icon: ListTree, badge: topics.length },
        { id: 'exams' as AdminTab, label: 'Exam Tracks', icon: Compass },
        { id: 'analytics' as AdminTab, label: 'Syllabus Gaps & Coverage', icon: BarChart3, badge: stats?.criticalGapsCount }
      ]
    },
    {
      group: 'Administration, Billing & Security',
      items: [
        { id: 'payments' as AdminTab, label: 'Payment Verifications (UTR)', icon: DollarSign, badge: paymentRecords.filter(p => p.status === 'PENDING').length },
        { id: 'students' as AdminTab, label: 'Students Directory', icon: Users, badge: usersList.filter(u => u.role === 'student').length },
        { id: 'users' as AdminTab, label: 'User Roles & RBAC', icon: UserCog, badge: usersList.length },
        { id: 'reports' as AdminTab, label: 'Flagged Reports', icon: AlertTriangle, badge: reports.filter(r => r.status === 'pending').length },
        { id: 'audit' as AdminTab, label: 'Audit Security Logs', icon: ShieldAlert, badge: auditLogs.length },
        { id: 'settings' as AdminTab, label: 'System Settings', icon: Settings }
      ]
    }
  ];

  // Filtered Questions
  const filteredQuestions = questions.filter(q => {
    if (filterStatus !== 'all' && q.status !== filterStatus) return false;
    if (filterSubject !== 'all' && q.subject_id !== filterSubject) return false;
    if (filterChapter !== 'all' && q.chapter_id !== filterChapter) return false;
    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      const matchEn = q.question_en.toLowerCase().includes(s);
      const matchMr = q.question_mr ? q.question_mr.toLowerCase().includes(s) : false;
      const matchExp = q.explanation_en.toLowerCase().includes(s);
      return matchEn || matchMr || matchExp;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800">
      {/* Toast Notice */}
      {actionNotice && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white font-medium transition-all ${
          actionNotice.type === 'success' ? 'bg-emerald-600' : actionNotice.type === 'error' ? 'bg-rose-600' : 'bg-blue-600'
        }`}>
          {actionNotice.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
          <span className="text-sm">{actionNotice.message}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-600 rounded-lg text-white font-bold shadow-md shadow-indigo-600/30">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-white tracking-tight leading-tight">Admin CMS</h1>
                <p className="text-xs text-slate-400">Nursing Officer Platform</p>
              </div>
            </div>
          </div>
          <button
            onClick={loadAllData}
            title="Refresh database state"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1.5">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                {sec.group}
              </h2>
              <div className="space-y-0.5">
                {sec.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm font-bold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Current User Session Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser?.name?.charAt(0) || 'A'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'Administrator'}</p>
              <p className="text-[10px] font-mono text-indigo-400 uppercase">{currentUser?.role || 'admin'}</p>
            </div>
          </div>
          <span className="px-2 py-0.5 text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-mono">
            LIVE
          </span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto p-4 md:p-8">
        {/* Section 1: Overview & Health */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">System Overview & Examination Health</h2>
              <p className="text-sm text-slate-500">Real-time status of questions, syllabus modules, media CDN, and database storage.</p>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold uppercase text-slate-400">Total Questions</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-slate-900">{stats?.totalQuestions || 0}</span>
                  <span className="text-xs text-emerald-600 font-bold">({stats?.publishedQuestions || 0} Live)</span>
                </div>
                <div className="mt-3 flex gap-1">
                  <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 rounded font-medium">{stats?.draftQuestions || 0} Draft</span>
                  <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">{stats?.inReviewQuestions || 0} In Review</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold uppercase text-slate-400">Verified PYQs</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-indigo-600">{stats?.verifiedPyqs || 0}</span>
                  <span className="text-xs text-slate-500">Official Papers</span>
                </div>
                <p className="mt-3 text-[11px] text-slate-500">AIIMS NORCET, Maharashtra DHS & DMER</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold uppercase text-slate-400">Clinical & Image Bank</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-teal-600">{stats?.imageQuestions || 0}</span>
                  <span className="text-xs text-teal-700 font-medium">({stats?.clinicalCases || 0} Cases)</span>
                </div>
                <p className="mt-3 text-[11px] text-slate-500">ECG, Instruments, Lab and Vignettes</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold uppercase text-slate-400">Syllabus Topics</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-purple-600">{stats?.topicsCount || 0}</span>
                  <span className="text-xs text-slate-500">in {stats?.chaptersCount || 0} Ch.</span>
                </div>
                <div className="mt-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    (stats?.criticalGapsCount || 0) > 0 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {stats?.criticalGapsCount || 0} Critical Content Gaps
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Hub */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Fast Operational Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('bulk_import')}
                  className="flex items-center gap-3 p-4 bg-teal-50 border border-teal-100 rounded-xl hover:bg-teal-100 transition-colors text-left"
                >
                  <UploadCloud className="w-6 h-6 text-teal-700 shrink-0" />
                  <div>
                    <h4 className="font-bold text-teal-950 text-sm">{language === 'mr' ? 'प्रश्न अपलोड केंद्र' : 'Question Upload Hub'}</h4>
                    <p className="text-xs text-teal-700">{language === 'mr' ? 'Excel, CSV किंवा Word नोट्स' : 'Bulk CSV, Word or Form upload'}</p>
                  </div>
                </button>

                <button
                  onClick={() => { resetForm(); setActiveTab('new_question'); }}
                  className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-colors text-left"
                >
                  <PlusCircle className="w-6 h-6 text-indigo-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-indigo-950 text-sm">Author New Question</h4>
                    <p className="text-xs text-indigo-700">Add bilingual clinical stem with rationale & media</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('review_queue')}
                  className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl hover:bg-amber-100 transition-colors text-left"
                >
                  <CheckSquare className="w-6 h-6 text-amber-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-amber-950 text-sm">Review Queue ({stats?.draftQuestions + stats?.inReviewQuestions || 0})</h4>
                    <p className="text-xs text-amber-700">Verify draft and AI-generated questions</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-colors text-left"
                >
                  <BarChart3 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-emerald-950 text-sm">Syllabus Gap Audit</h4>
                    <p className="text-xs text-emerald-700">Inspect zero-question chapters & topics</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Cloudinary Status Banner */}
            <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Cloudinary Image CDN System</h4>
                  <p className="text-xs text-slate-400">
                    {cloudinaryStatus?.configured
                      ? 'Connected & actively optimizing high-res ECG, instruments, and clinical visuals.'
                      : 'CDN fallback mode active. Set CLOUDINARY_CLOUD_NAME in .env for production CDN scaling.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('images')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors shrink-0"
              >
                Browse Image CDN
              </button>
            </div>
          </div>
        )}

        {/* Section 2: Question Bank */}
        {activeTab === 'questions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Question Bank Repository</h2>
                <p className="text-sm text-slate-500">Filter, search, audit, and modify questions across all 18 curriculum subjects.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('bulk_import')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{language === 'mr' ? 'प्रश्न अपलोड करा (CSV/Word)' : 'Upload Questions (CSV/Word)'}</span>
                </button>
                <button
                  onClick={() => { resetForm(); setActiveTab('new_question'); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{language === 'mr' ? 'नवीन प्रश्न जोडा' : 'Add Question'}</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="relative sm:col-span-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <select
                value={filterSubject}
                onChange={e => setFilterSubject(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Subjects (18)</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name_en}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published (Live to Students)</option>
                <option value="draft">Draft</option>
                <option value="in_review">In Review</option>
                <option value="approved">Approved</option>
                <option value="archived">Archived</option>
                <option value="rejected">Rejected</option>
              </select>

              <div className="py-2 px-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-800 flex items-center gap-1.5 whitespace-nowrap shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>सर्व नर्सिंग परीक्षा एकत्र (मिक्स संच)</span>
              </div>
            </div>

            {/* Questions Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-600">
                    Showing {filteredQuestions.length} of {questions.length} questions (All Unified)
                  </span>
                  {selectedQuestionIds.length > 0 && (
                    <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold">
                      {selectedQuestionIds.length} निवडले (Selected)
                    </span>
                  )}
                </div>

                {/* Bulk Actions Toolbar */}
                {selectedQuestionIds.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBulkDeleteConfirmOpen(true)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>निवडलेले प्रश्न हटवा ({selectedQuestionIds.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedQuestionIds([])}
                      className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3.5 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={filteredQuestions.length > 0 && filteredQuestions.every(q => selectedQuestionIds.includes(q.id))}
                          onChange={handleToggleSelectAllQuestions}
                          className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          title="Select all filtered questions"
                        />
                      </th>
                      <th className="p-3.5">Question Stem</th>
                      <th className="p-3.5">Subject & Topic</th>
                      <th className="p-3.5">Type & Level</th>
                      <th className="p-3.5">Exam Tag</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredQuestions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          No questions matching the selected filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredQuestions.map(q => {
                        const sub = subjects.find(s => s.id === q.subject_id);
                        const isSelected = selectedQuestionIds.includes(q.id);
                        return (
                          <tr key={q.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-indigo-50/40' : ''}`}>
                            <td className="p-3.5 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectQuestion(q.id)}
                                className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                              />
                            </td>
                            <td className="p-3.5 max-w-md">
                              <div className="font-medium text-slate-900 line-clamp-2">{q.question_en}</div>
                              {q.question_mr && <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{q.question_mr}</div>}
                              <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                                <span>ID: {q.id.substring(0, 10)}</span>
                                {q.is_free ? (
                                  <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5 border border-emerald-200">
                                    <Sparkles className="w-2.5 h-2.5" /> Free MCQ (5/topic)
                                  </span>
                                ) : (
                                  <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5 border border-amber-200">
                                    <Lock className="w-2.5 h-2.5" /> PRO Locked
                                  </span>
                                )}
                                {q.image_url && <span className="text-teal-600 font-semibold flex items-center gap-0.5"><ImageIcon className="w-3 h-3" /> Image</span>}
                                {q.is_verified_pyq && <span className="text-indigo-600 font-semibold flex items-center gap-0.5"><Award className="w-3 h-3" /> Verified PYQ</span>}
                              </div>
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <span className="font-semibold text-slate-800">{sub?.name_en || q.subject_id}</span>
                              <div className="text-[10px] text-slate-400">{q.topic_id || 'General'}</div>
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <span className="capitalize text-slate-700 font-medium">{q.question_type.replace('_', ' ')}</span>
                              <div className="text-[10px]">
                                <span className={`font-semibold capitalize ${
                                  q.difficulty === 'easy' ? 'text-emerald-600' : q.difficulty === 'hard' ? 'text-rose-600' : 'text-amber-600'
                                }`}>
                                  {q.difficulty}
                                </span>
                              </div>
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <span className="text-slate-700">{q.exam_name || 'Standard'}</span>
                              {q.exam_year && <span className="text-[10px] text-slate-400 block">{q.exam_year}</span>}
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                                q.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                                q.status === 'draft' ? 'bg-slate-100 text-slate-700' :
                                q.status === 'in_review' ? 'bg-amber-100 text-amber-800' :
                                q.status === 'approved' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {q.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => startEditQuestion(q)}
                                  title="Edit Question"
                                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                {q.status !== 'published' && (
                                  <button
                                    onClick={() => handleUpdateStatus(q.id, 'published')}
                                    title="Publish immediately"
                                    className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteQuestion(q.id)}
                                  title="Delete question permanently (कायमचा हटवा)"
                                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Add / Edit Question Form */}
        {activeTab === 'new_question' && (
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{formData.id ? 'Edit Question' : 'Author New Nursing Question'}</h2>
                <p className="text-sm text-slate-500">Add complete bilingual stem, options, evidence-based rationale, and optional clinical visual.</p>
              </div>
              <button
                onClick={() => { resetForm(); setActiveTab('questions'); }}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Back to List
              </button>
            </div>

            {duplicateWarning && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-800 text-xs font-medium">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>{duplicateWarning}</span>
              </div>
            )}

            <form onSubmit={handleSubmitQuestion} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              {/* Category, Syllabus, Exam Target */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
                  <select
                    value={formData.subject_id}
                    onChange={e => setFormData({ ...formData, subject_id: e.target.value, chapter_id: '', topic_id: '' })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name_en}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chapter</label>
                  <select
                    value={formData.chapter_id}
                    onChange={e => setFormData({ ...formData, chapter_id: e.target.value, topic_id: '' })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Optional Chapter --</option>
                    {chapters.filter(c => c.subject_id === formData.subject_id).map(c => (
                      <option key={c.id} value={c.id}>{c.name_en}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Topic</label>
                  <select
                    value={formData.topic_id}
                    onChange={e => setFormData({ ...formData, topic_id: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Optional Topic --</option>
                    {topics.filter(t => !formData.chapter_id || t.chapter_id === formData.chapter_id).map(t => (
                      <option key={t.id} value={t.id}>{t.name_en}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Exam Target (परीक्षा संच)</label>
                  <div className="w-full py-2.5 px-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-900 flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>सर्व नर्सिंग परीक्षा एकत्र (NORCET + महा स्टाफ नर्स मिक्स)</span>
                  </div>
                </div>
              </div>

              {/* Question Stem (English & Marathi) */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Question Stem (English) *</label>
                  <textarea
                    rows={3}
                    value={formData.question_en}
                    onChange={e => setFormData({ ...formData, question_en: e.target.value })}
                    onBlur={e => handleCheckDuplicate(e.target.value)}
                    placeholder="Enter full English clinical scenario or question stem..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Question Stem (Marathi translation - optional)</label>
                  <textarea
                    rows={2}
                    value={formData.question_mr}
                    onChange={e => setFormData({ ...formData, question_mr: e.target.value })}
                    placeholder="मराठी भाषांतर प्रविष्ट करा..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* 4 Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(['A', 'B', 'C', 'D'] as const).map(opt => (
                  <div key={opt} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Option {opt} *</span>
                      <label className="flex items-center gap-1.5 text-xs cursor-pointer font-bold text-indigo-700">
                        <input
                          type="radio"
                          name="correct_option"
                          checked={formData.correct_option === opt}
                          onChange={() => setFormData({ ...formData, correct_option: opt })}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Correct</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder={`Option ${opt} (English)`}
                      value={(formData as any)[`option_${opt.toLowerCase()}_en`]}
                      onChange={e => setFormData({ ...formData, [`option_${opt.toLowerCase()}_en`]: e.target.value })}
                      className="w-full py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder={`Option ${opt} (Marathi - optional)`}
                      value={(formData as any)[`option_${opt.toLowerCase()}_mr`]}
                      onChange={e => setFormData({ ...formData, [`option_${opt.toLowerCase()}_mr`]: e.target.value })}
                      className="w-full py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                ))}
              </div>

              {/* Rationale / Explanations */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Rationale & Concept (English) *</label>
                  <textarea
                    rows={3}
                    value={formData.explanation_en}
                    onChange={e => setFormData({ ...formData, explanation_en: e.target.value })}
                    placeholder="Provide evidence-based clinical reasoning and core concept explanation..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Rationale (Marathi - optional)</label>
                  <textarea
                    rows={2}
                    value={formData.explanation_mr}
                    onChange={e => setFormData({ ...formData, explanation_mr: e.target.value })}
                    placeholder="मराठी स्पष्टीकरण..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Cloudinary Image Attachment */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-xs font-bold text-slate-800">Clinical Visual / ECG / Instrument Image (Cloudinary)</h3>
                  </div>
                  {formData.image_url && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-xs text-rose-600 hover:underline font-semibold"
                    >
                      Remove Image
                    </button>
                  )}
                </div>

                {formData.image_url ? (
                  <div className="flex items-start gap-4 p-3 bg-white rounded-lg border border-slate-200">
                    <img
                      src={formData.image_url}
                      alt={formData.image_alt_text || 'Clinical Image'}
                      className="w-32 h-24 object-cover rounded-lg border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 space-y-2">
                      <p className="text-xs font-mono text-slate-600 truncate">{formData.image_url}</p>
                      <input
                        type="text"
                        placeholder="Alt text for accessibility (e.g. 12-lead ECG showing ST elevation)"
                        value={formData.image_alt_text}
                        onChange={e => setFormData({ ...formData, image_alt_text: e.target.value })}
                        className="w-full py-1 px-2 bg-slate-50 border border-slate-200 rounded text-xs"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-2 transition-colors">
                      <UploadCloud className="w-4 h-4 text-indigo-600" />
                      <span>{uploadingImage ? 'Optimizing & Uploading...' : 'Upload Image to Cloudinary'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageFileUpload(e, 'nursing-officer/questions')}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-slate-400">Supports JPG, PNG, WebP up to 5MB</span>
                  </div>
                )}
              </div>

              {/* Metadata, PYQ Tagging, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={e => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Question Type</label>
                  <select
                    value={formData.question_type}
                    onChange={e => setFormData({ ...formData, question_type: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="single_best">Single Best Answer</option>
                    <option value="multiple_response">Multiple Response</option>
                    <option value="clinical_scenario">Clinical Scenario</option>
                    <option value="image_based">Image / ECG Based</option>
                    <option value="instrument_id">Instrument Identification</option>
                    <option value="calculation">Drug Calculation</option>
                    <option value="statement_based">Statement Based</option>
                    <option value="assertion_reasoning">Assertion & Reasoning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Workflow</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  >
                    <option value="draft">Draft</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Approved</option>
                    <option value="published">Published (Live)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-indigo-900">
                    <input
                      type="checkbox"
                      checked={formData.is_verified_pyq}
                      onChange={e => setFormData({ ...formData, is_verified_pyq: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Verified Official PYQ</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  {formData.id && (
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(formData.id)}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Question (कायमचा हटवा)</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
                  >
                    {formData.id ? 'Save & Update Question' : 'Save Question to Bank'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Section 5: Question Upload Hub */}
        {activeTab === 'bulk_import' && (
          <AdminQuestionUploadTab
            subjects={subjects}
            chapters={chapters}
            topics={topics}
            questions={questions}
            onRefresh={loadAllData}
            showToast={showToast}
            onNavigateToBank={() => setActiveTab('questions')}
          />
        )}

        {/* Section 6: AI Question Generator */}
        {activeTab === 'ai_generator' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">AI Clinical Question Generator</h2>
              <p className="text-sm text-slate-500">Draft certified clinical scenarios and questions into the Review Queue for human editor verification.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={aiSubject}
                    onChange={e => setAiSubject(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
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
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="easy">Easy (Knowledge recall)</option>
                    <option value="medium">Medium (Clinical application)</option>
                    <option value="hard">Hard (Multi-step triage & critical values)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Concept / Topic</label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  placeholder="e.g. Magnesium Sulphate toxicity management in severe Pre-eclampsia"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={aiIsClinical}
                    onChange={e => setAiIsClinical(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Format as Clinical Scenario / Vignette</span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleAiGenerate}
                  disabled={aiGenerating}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                >
                  {aiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{aiGenerating ? 'Generating Draft...' : 'Generate AI Draft Question'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section 7: Review Queue */}
        {activeTab === 'review_queue' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Editor Review Queue</h2>
              <p className="text-sm text-slate-500">Triage and verify questions in Draft or In-Review status before publishing to students.</p>
            </div>

            {/* Questions pending review */}
            <div className="space-y-4">
              {questions.filter(q => q.status === 'draft' || q.status === 'in_review').length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <h3 className="font-bold text-slate-800">Review Queue is Clear</h3>
                  <p className="text-xs text-slate-500 mt-1">All authored and AI drafted questions have been reviewed and published.</p>
                </div>
              ) : (
                questions
                  .filter(q => q.status === 'draft' || q.status === 'in_review')
                  .map(q => (
                    <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 text-[10px] bg-amber-100 text-amber-800 rounded font-bold uppercase">{q.status}</span>
                            <span className="text-xs text-slate-400 font-mono">ID: {q.id}</span>
                            {q.source_reference && <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-medium">{q.source_reference}</span>}
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm">{q.question_en}</h4>
                          {q.question_mr && <p className="text-xs text-slate-600 mt-0.5">{q.question_mr}</p>}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleUpdateStatus(q.id, 'published')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve & Publish</span>
                          </button>
                          <button
                            onClick={() => startEditQuestion(q)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(q.id, 'rejected')}
                            className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            title="Delete Permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Options preview */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div><strong className={q.correct_option === 'A' ? 'text-emerald-700' : ''}>A:</strong> {q.option_a_en}</div>
                        <div><strong className={q.correct_option === 'B' ? 'text-emerald-700' : ''}>B:</strong> {q.option_b_en}</div>
                        <div><strong className={q.correct_option === 'C' ? 'text-emerald-700' : ''}>C:</strong> {q.option_c_en}</div>
                        <div><strong className={q.correct_option === 'D' ? 'text-emerald-700' : ''}>D:</strong> {q.option_d_en}</div>
                      </div>

                      {/* Rationale preview */}
                      <div className="text-xs text-slate-600 border-l-2 border-indigo-500 pl-3">
                        <span className="font-bold text-indigo-900 block mb-0.5">Clinical Rationale:</span>
                        {q.explanation_en}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* Section 10: Image Management (Cloudinary) */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Cloudinary Image Asset Explorer</h2>
                <p className="text-sm text-slate-500">Diagnostic ECGs, surgical instruments, anatomical charts, and lab reports stored across CDN folders.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {questions.filter(q => !!q.image_url).map(q => (
                <div key={q.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
                  <div className="h-44 bg-slate-100 relative overflow-hidden group">
                    <img
                      src={q.image_url}
                      alt={q.image_alt_text || 'Diagnostic image'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 text-white rounded text-[10px] font-mono backdrop-blur-sm">
                      WebP / Auto
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900 line-clamp-2">{q.question_en}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{q.image_alt_text || 'Diagnostic visual'}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">ID: {q.id.substring(0, 8)}</span>
                      <button
                        onClick={() => startEditQuestion(q)}
                        className="text-xs font-bold text-indigo-600 hover:underline"
                      >
                        Edit Attached Question
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 11: Subjects Management */}
        {activeTab === 'subjects' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Curriculum Subjects (18 Total)</h2>
              <p className="text-sm text-slate-500">Full 18 nursing and allied subjects for AIIMS NORCET and Maharashtra Government Staff Nurse exams.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {subjects.map(s => (
                <div key={s.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-indigo-50 text-indigo-700">
                      {s.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{s.totalQuestions || 0} Questions</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{s.name_en}</h3>
                  <p className="text-xs text-slate-600">{s.name_mr}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{s.description_en}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 12 & 13: Chapters & Topics */}
        {activeTab === 'chapters' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Syllabus Chapters</h2>
              <p className="text-sm text-slate-500">Tier-2 hierarchy mapped under each curriculum subject.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Chapter Title (English)</th>
                    <th className="p-3.5">Marathi Title</th>
                    <th className="p-3.5">Parent Subject</th>
                    <th className="p-3.5">Questions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {chapters.map(c => {
                    const sub = subjects.find(s => s.id === c.subject_id);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-900">{c.name_en}</td>
                        <td className="p-3.5 text-slate-600">{c.name_mr}</td>
                        <td className="p-3.5 font-semibold text-indigo-700">{sub?.name_en || c.subject_id}</td>
                        <td className="p-3.5">{c.totalQuestions || 0}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 17: Analytics & Syllabus Gaps */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Syllabus Coverage & Content Gap Matrix</h2>
              <p className="text-sm text-slate-500">Automated audit pinpointing topics needing new questions, verified PYQs, or clinical cases.</p>
            </div>

            {/* Gap List */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Audit of {gaps.length} Curriculum Modules</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5">Subject & Chapter</th>
                      <th className="p-3.5">Topic</th>
                      <th className="p-3.5">Live Count</th>
                      <th className="p-3.5">PYQ Included</th>
                      <th className="p-3.5">Image / Case Included</th>
                      <th className="p-3.5">Gap Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {gaps.map((g, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3.5">
                          <span className="font-bold text-slate-900">{g.subject_name}</span>
                          <span className="text-[10px] text-slate-400 block">{g.chapter_name}</span>
                        </td>
                        <td className="p-3.5 font-medium text-slate-800">{g.topic_name}</td>
                        <td className="p-3.5 font-bold text-slate-900">{g.total_questions}</td>
                        <td className="p-3.5">
                          {g.has_pyq ? (
                            <span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Yes</span>
                          ) : (
                            <span className="text-slate-400">None</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          {g.has_image_question ? (
                            <span className="text-teal-600 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Yes</span>
                          ) : (
                            <span className="text-slate-400">None</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase ${
                            g.gap_status === 'critical_zero' ? 'bg-rose-100 text-rose-800' :
                            g.gap_status === 'low_count' ? 'bg-amber-100 text-amber-800' :
                            g.gap_status === 'adequate' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {g.gap_status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Section 18: Audit Security Logs */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Immutable Audit Security Stream</h2>
              <p className="text-sm text-slate-500">Append-only log of administrative modifications, question status transitions, and user events.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors text-xs">
                    <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{log.action}</span>
                        <span className="text-[10px] text-slate-400">{new Date(log.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-600">{log.details}</p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400">
                        <span>Actor: {log.actor_name} ({log.actor_role})</span>
                        <span>Entity: {log.entity} #{log.entity_id.substring(0, 8)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section 19: User Management & Roles */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">User Management & RBAC Permissions</h2>
              <p className="text-sm text-slate-500">Manage user access across roles (Student, Content Editor, Reviewer, Admin, Super Admin).</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Target Exam</th>
                    <th className="p-3.5">Streak / Points</th>
                    <th className="p-3.5 text-right">Role Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">{u.name}</td>
                      <td className="p-3.5 text-slate-600">{u.email}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                          u.role === 'super_admin' || u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          u.role === 'reviewer' ? 'bg-blue-100 text-blue-800' :
                          u.role === 'content_editor' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600">{u.targetExam || 'NORCET'}</td>
                      <td className="p-3.5 text-slate-600">{u.streakDays}d / {u.points} pts</td>
                      <td className="p-3.5 text-right">
                        <select
                          value={u.role}
                          onChange={async e => {
                            try {
                              await api.updateUserRole(u.id, e.target.value);
                              showToast(`Role updated to ${e.target.value}`, 'success');
                              loadAllData();
                            } catch (err: any) {
                              showToast(err.message || 'Failed to update role', 'error');
                            }
                          }}
                          className="py-1 px-2 bg-slate-50 border border-slate-200 rounded text-xs font-semibold"
                        >
                          <option value="student">Student</option>
                          <option value="content_editor">Content Editor</option>
                          <option value="reviewer">Reviewer</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section: Flagged Reports & Student Queries / Doubts */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {language === 'mr' ? 'विद्यार्थी अडचणी, शंका व तक्रारी (Student Inquiries & Reports)' : 'Student Inquiries, Doubts & Reports'}
                </h2>
                <p className="text-sm text-slate-500">
                  {language === 'mr' 
                    ? 'अ‍ॅपमधून किंवा Telegram द्वारे आलेल्या शंका, प्रश्नातील चुका व तक्रारींचे निवारण करा.' 
                    : 'Manage questions reported for review, study doubts, and direct student inquiries.'}
                </p>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                {reports.filter(r => r.status === 'pending').length} Pending Inquiries
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {reports.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No reported issues or inquiries yet.</p>
                  <p className="text-xs text-slate-500 mt-0.5">All student doubts and question feedback will appear here.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {reports.map((rep: any) => (
                    <div key={rep.id} className="p-5 hover:bg-slate-50 transition-colors">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                            rep.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            rep.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {rep.status}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            Category: {rep.reason || 'General Query'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            • {new Date(rep.created_at || Date.now()).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {rep.question_id && rep.question_id !== 'general-inquiry' && (
                            <button
                              onClick={() => {
                                const found = questions.find(q => q.id === rep.question_id);
                                if (found) {
                                  startEditQuestion(found);
                                } else {
                                  showToast('Question ID not found in database', 'info');
                                }
                              }}
                              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>View / Edit Question #{rep.question_id.substring(0, 8)}</span>
                            </button>
                          )}

                          {rep.status === 'pending' && (
                            <button
                              onClick={async () => {
                                try {
                                  await api.resolveReport(rep.id, 'resolved', 'Resolved by Admin');
                                  showToast('Inquiry marked as Resolved', 'success');
                                  loadAllData();
                                } catch (e: any) {
                                  showToast(e.message || 'Failed to update report', 'error');
                                }
                              }}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Mark Resolved</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200 mt-2 whitespace-pre-wrap font-medium">
                        {rep.details}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                        <span>Submitted by: <strong>{rep.user_name || 'Student Aspirant'}</strong> ({rep.user_id})</span>
                        {rep.admin_notes && (
                          <span className="text-emerald-700 font-medium">Resolution: {rep.admin_notes}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section: Video Promo Ads (9:16 Reels & 16:9 Landscape) */}
        {activeTab === 'promo_ads' && (
          <AdminPromoAdsTab
            showToast={showToast}
          />
        )}

        {/* Section: Study Materials */}
        {activeTab === 'study_materials' && (
          <AdminStudyMaterialsTab
            materials={studyMaterials}
            subjects={subjects}
            onRefresh={loadAllData}
            showToast={showToast}
          />
        )}

        {/* Section: Recruitment Notices */}
        {activeTab === 'recruitment_notices' && (
          <AdminRecruitmentNoticesTab
            notices={recruitmentNotices}
            onRefresh={loadAllData}
            showToast={showToast}
          />
        )}

        {/* Section: Payment Verifications (Manual UTR) */}
        {activeTab === 'payments' && (
          <AdminPaymentsTab
            payments={paymentRecords}
            plans={paymentPlans}
            onRefresh={loadAllData}
            showToast={showToast}
          />
        )}

        {/* Section 20: System Settings */}
        {activeTab === 'settings' && settings && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {language === 'mr' ? 'प्लॅटफॉर्म व संपर्क सेटिंग्ज (System & Support Settings)' : 'Platform System & Support Configuration'}
              </h2>
              <p className="text-sm text-slate-500">
                {language === 'mr'
                  ? 'अ‍ॅपचे नाव, टेलिग्राम संपर्क यूजरनेम, चॅनल लिंक, निगेटिव्ह मार्किंग व सपोर्ट तपशील बदला.'
                  : 'Configure application name, Telegram contact usernames, discussion channels, support phone/email, and negative marking.'}
              </p>
            </div>

            {/* Telegram & Contact Support Card */}
            <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 p-6 rounded-2xl border border-sky-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0088cc] text-white flex items-center justify-center shadow-md shrink-0">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    {language === 'mr' ? 'टेलिग्राम व विद्यार्थी मदत केंद्र (Telegram & Support Desk)' : 'Telegram & Student Support Settings'}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {language === 'mr' 
                      ? 'येथे तुमचा टेलिग्राम यूजरनेम टाका जेणेकरून विद्यार्थी अडचणी किंवा शंका थेट तुम्हाला विचारू शकतील.' 
                      : 'Set your Telegram username and links so students can directly reach admin with doubts.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'mr' ? 'टेलिग्राम अ‍ॅडमिन यूजरनेम (Telegram Username) *' : 'Telegram Admin Username *'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">@</span>
                    <input
                      type="text"
                      value={settings.telegram_username ? settings.telegram_username.replace(/^@/, '') : ''}
                      onChange={e => {
                        const clean = e.target.value.replace(/^@/, '').trim();
                        setSettings({
                          ...settings,
                          telegram_username: clean,
                          telegram_contact_url: clean ? `https://t.me/${clean}` : settings.telegram_contact_url
                        });
                      }}
                      placeholder="e.g. NursingOfficerSupport"
                      className="w-full pl-7 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    विद्यार्थी या यूजरनेमवर थेट क्लिक करून चॅट करू शकतील.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'mr' ? 'थेट चॅट लिंक (Direct Telegram URL)' : 'Direct Telegram Contact URL'}
                  </label>
                  <input
                    type="text"
                    value={settings.telegram_contact_url || ''}
                    onChange={e => setSettings({ ...settings, telegram_contact_url: e.target.value })}
                    placeholder="https://t.me/yourusername"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'mr' ? 'अपडेट्स चॅनल लिंक (Telegram Channel)' : 'Telegram Channel URL'}
                  </label>
                  <input
                    type="text"
                    value={settings.telegram_channel_url || ''}
                    onChange={e => setSettings({ ...settings, telegram_channel_url: e.target.value })}
                    placeholder="https://t.me/NursingOfficerUpdates"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'mr' ? 'विद्यार्थी ग्रुप लिंक (Discussion Group)' : 'Telegram Discussion Group URL'}
                  </label>
                  <input
                    type="text"
                    value={settings.telegram_group_url || ''}
                    onChange={e => setSettings({ ...settings, telegram_group_url: e.target.value })}
                    placeholder="https://t.me/NursingOfficerDiscussion"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'mr' ? 'मदत संदेश / Welcome Message (Chat Window)' : 'Telegram Support Welcome Message'}
                </label>
                <textarea
                  rows={2}
                  value={settings.telegram_support_message || ''}
                  onChange={e => setSettings({ ...settings, telegram_support_message: e.target.value })}
                  placeholder="उदा. नमस्कार! नर्सिंग ऑफिसर परीक्षेबद्दल किंवा ॲपबद्दल कोणतीही अडचण असल्यास अ‍ॅडमिनशी थेट संपर्क साधा."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* General System & Payment Configuration */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Application Name</label>
                <input
                  type="text"
                  value={settings.app_name}
                  onChange={e => setSettings({ ...settings, app_name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Support Email</label>
                  <input
                    type="email"
                    value={settings.support_email || ''}
                    onChange={e => setSettings({ ...settings, support_email: e.target.value })}
                    placeholder="HANGEMAHESH498@gmail.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Support Phone / Helpline</label>
                  <input
                    type="text"
                    value={settings.support_phone || ''}
                    onChange={e => setSettings({ ...settings, support_phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Default Negative Marking Penalty</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.default_negative_marking}
                    onChange={e => setSettings({ ...settings, default_negative_marking: parseFloat(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">AI Rate Limit / Day / User</label>
                  <input
                    type="number"
                    value={settings.ai_rate_limit_per_user_per_day}
                    onChange={e => setSettings({ ...settings, ai_rate_limit_per_user_per_day: parseInt(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">UPI ID for Manual QR</label>
                  <input
                    type="text"
                    value={settings.upi_id || ''}
                    onChange={e => setSettings({ ...settings, upi_id: e.target.value })}
                    placeholder="e.g. mahesh@okhdfcbank"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Receiver Account / Merchant Name</label>
                  <input
                    type="text"
                    value={settings.receiver_name || ''}
                    onChange={e => setSettings({ ...settings, receiver_name: e.target.value })}
                    placeholder="e.g. Nursing Officer Prep Hub"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={async () => {
                    try {
                      await api.updateSettings(settings);
                      showToast('सर्व सेटिंग्ज व टेलिग्राम तपशील सेव्ह झाले (Settings saved successfully)', 'success');
                    } catch (e: any) {
                      showToast(e.message || 'Update failed', 'error');
                    }
                  }}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Save All Settings & Telegram Config
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* In-App Single Question Delete Confirmation Modal */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-extrabold text-base text-slate-900">
                {language === 'mr' ? 'हा प्रश्न कायमचा हटवायचा आहे का?' : 'Permanently Delete This Question?'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'mr'
                  ? 'हा प्रश्न डेटाबेसमधून पूर्णपणे काढून टाकला जाईल आणि ही कृती पूर्ववत करता येणार नाही.'
                  : 'This question and any associated images will be permanently removed from the repository.'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-800 line-clamp-2">{deleteConfirmTarget.question_en}</div>
              {deleteConfirmTarget.question_mr && (
                <div className="text-slate-500 line-clamp-1">{deleteConfirmTarget.question_mr}</div>
              )}
              <div className="text-[10px] text-slate-400 pt-1">ID: {deleteConfirmTarget.id}</div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                disabled={deletingLoading}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {language === 'mr' ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmSingleDelete}
                disabled={deletingLoading}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                {deletingLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>{deletingLoading ? 'हटवत आहे...' : (language === 'mr' ? 'कायमचे हटवा' : 'Yes, Delete')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Bulk Questions Delete Confirmation Modal */}
      {bulkDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-extrabold text-base text-slate-900">
                {language === 'mr' 
                  ? `निवडलेले ${selectedQuestionIds.length} प्रश्न कायमचे हटवायचे आहेत का?`
                  : `Permanently Delete ${selectedQuestionIds.length} Selected Questions?`}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'mr'
                  ? `तुम्ही निवडलेले सर्व ${selectedQuestionIds.length} प्रश्न डेटाबेसमधून कायमचे हटवले जातील.`
                  : `All ${selectedQuestionIds.length} selected questions will be permanently erased.`}
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{language === 'mr' ? 'ही कृती पूर्ववत करता येणार नाही!' : 'This bulk delete operation cannot be undone!'}</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBulkDeleteConfirmOpen(false)}
                disabled={deletingLoading}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {language === 'mr' ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkDelete}
                disabled={deletingLoading}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                {deletingLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>{deletingLoading ? 'हटवत आहे...' : (language === 'mr' ? `होय, ${selectedQuestionIds.length} प्रश्न हटवा` : `Delete ${selectedQuestionIds.length} Questions`)}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
