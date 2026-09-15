import React, { useState, useEffect, useMemo } from 'react';
import { MockTest, Question, ProctoringSnapshot, UserProfile, Subject, Topic } from '../types';
import { api } from '../lib/api';
import { AdminMockTestInspectorModal } from './AdminMockTestInspectorModal';
import { AdminMockTestDownloadModal } from './AdminMockTestDownloadModal';
import {
  FileCheck2,
  Zap,
  Trash2,
  Plus,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  BookOpen,
  Calendar,
  Search,
  Check,
  Clock,
  Loader2,
  PlusCircle,
  HelpCircle,
  Award,
  Camera,
  ShieldAlert,
  Star,
  Play,
  ToggleLeft,
  ToggleRight,
  Eye,
  Video,
  ExternalLink,
  Filter,
  Sliders,
  CheckSquare,
  Square,
  ChevronDown,
  Printer,
  Download,
  Target
} from 'lucide-react';

interface AdminMockTestsTabProps {
  mockTests: MockTest[];
  questions: Question[];
  subjects?: Subject[];
  topics?: Topic[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminMockTestsTab: React.FC<AdminMockTestsTabProps> = ({
  mockTests,
  questions,
  subjects = [],
  topics = [],
  onRefresh,
  showToast
}) => {
  const [adminTab, setAdminTab] = useState<'tests' | 'proctoring' | 'star_students'>('tests');

  const [selectedPattern, setSelectedPattern] = useState<'maharashtra' | 'aiims'>('maharashtra');
  const [testCount, setTestCount] = useState<number>(5);
  const [questionsPerTest, setQuestionsPerTest] = useState<number>(100);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [filterPattern, setFilterPattern] = useState<'all' | 'maharashtra' | 'aiims' | 'topic_tests'>('all');

  // Inspector Modal State
  const [inspectingTest, setInspectingTest] = useState<MockTest | null>(null);
  const [downloadingTest, setDownloadingTest] = useState<MockTest | null>(null);
  const [expandedInlineTestId, setExpandedInlineTestId] = useState<string | null>(null);

  // Custom Test Modal State
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTitleEn, setCustomTitleEn] = useState('');
  const [customTitleMr, setCustomTitleMr] = useState('');
  const [customTestNumber, setCustomTestNumber] = useState<number>(1);
  const [customPattern, setCustomPattern] = useState<'maharashtra' | 'aiims'>('maharashtra');
  const [customDuration, setCustomDuration] = useState<number>(90);
  const [customPrice, setCustomPrice] = useState<number>(29);
  const [customScheduledDate, setCustomScheduledDate] = useState<string>('');
  const [customRequiresPass, setCustomRequiresPass] = useState<boolean>(true);
  const [customYoutubeUrl, setCustomYoutubeUrl] = useState<string>('');
  const [customEnableYoutube, setCustomEnableYoutube] = useState<boolean>(true);
  const [customProctoring, setCustomProctoring] = useState<boolean>(false);
  const [customStrictTiming, setCustomStrictTiming] = useState<boolean>(false);
  const [customStartWindowTime, setCustomStartWindowTime] = useState<string>('');
  const [customEndWindowTime, setCustomEndWindowTime] = useState<string>('');

  // Edit Test Settings Modal State
  const [editingTest, setEditingTest] = useState<MockTest | null>(null);
  const [editPrice, setEditPrice] = useState<number>(29);
  const [editYoutubeUrl, setEditYoutubeUrl] = useState<string>('');
  const [editEnableYoutube, setEditEnableYoutube] = useState<boolean>(false);
  const [editIsFree, setEditIsFree] = useState<boolean>(false);
  const [editVideoAccessMode, setEditVideoAccessMode] = useState<'free' | 'paid_test_only' | 'pro_only'>('paid_test_only');
  const [editHideVideo, setEditHideVideo] = useState<boolean>(false);
  const [editProctoring, setEditProctoring] = useState<boolean>(false);
  const [editStrictTiming, setEditStrictTiming] = useState<boolean>(false);
  const [editStartWindowTime, setEditStartWindowTime] = useState<string>('');
  const [editEndWindowTime, setEditEndWindowTime] = useState<string>('');
  const [editIsActive, setEditIsActive] = useState<boolean>(true);
  const [isUpdatingTest, setIsUpdatingTest] = useState<boolean>(false);

  // Proctoring Snapshots state
  const [snapshots, setSnapshots] = useState<ProctoringSnapshot[]>([]);
  const [loadingSnapshots, setLoadingSnapshots] = useState(false);
  const [selectedSnapshotTestId, setSelectedSnapshotTestId] = useState<string>('');

  // Fallback subjects map
  const effectiveSubjects = useMemo(() => {
    if (subjects && subjects.length > 0) return subjects;
    // Derive unique subjects from questions
    const subMap = new Map<string, Subject>();
    questions.forEach(q => {
      if (q.subject_id && !subMap.has(q.subject_id)) {
        subMap.set(q.subject_id, {
          id: q.subject_id,
          name_en: q.subject_id,
          name_mr: q.subject_id,
          description_en: '',
          description_mr: '',
          icon: 'BookOpen',
          totalQuestions: 0,
          category: 'core_nursing'
        });
      }
    });
    return Array.from(subMap.values());
  }, [subjects, questions]);

  // Question counts per subject in bank
  const subjectQuestionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    questions.forEach(q => {
      counts[q.subject_id] = (counts[q.subject_id] || 0) + 1;
    });
    return counts;
  }, [questions]);

  // Question Selection Mode: 'topic_wise' | 'subject_quota' | 'random' | 'select' | 'new'
  const [qSourceTab, setQSourceTab] = useState<'topic_wise' | 'subject_quota' | 'random' | 'select' | 'new'>('topic_wise');

  // Topic-wise Test Builder State
  const [allTopics, setAllTopics] = useState<Topic[]>(topics || []);
  const [topicSubjectId, setTopicSubjectId] = useState<string>('subj-gk-mr');
  const [topicSelectedId, setTopicSelectedId] = useState<string>('');
  const [topicQuestionCount, setTopicQuestionCount] = useState<number>(20);
  const [topicSelectedQIds, setTopicSelectedQIds] = useState<string[]>([]);
  const [topicSearchQ, setTopicSearchQ] = useState<string>('');

  useEffect(() => {
    if (topics && topics.length > 0) {
      setAllTopics(topics);
    } else {
      api.getTopics().then(res => {
        if (Array.isArray(res)) setAllTopics(res);
      }).catch(console.error);
    }
  }, [topics]);

  // Topics for selected subject
  const filteredSubjectTopics = useMemo(() => {
    if (!topicSubjectId) return allTopics;
    return (allTopics || []).filter(t => Boolean(t && t.id)).filter(t => t.subject_id === topicSubjectId);
  }, [allTopics, topicSubjectId]);

  // Auto-pick first topic when subject changes
  useEffect(() => {
    if (filteredSubjectTopics.length > 0) {
      const match = filteredSubjectTopics.find(t => t?.id === topicSelectedId);
      if (!match && filteredSubjectTopics[0]?.id) {
        setTopicSelectedId(filteredSubjectTopics[0].id);
      }
    } else {
      setTopicSelectedId('');
    }
  }, [topicSubjectId, filteredSubjectTopics]);

  // Questions matching selected topic
  const topicMatchingQuestions = useMemo(() => {
    let pool = (questions || []).filter(q => Boolean(q && q.id)).filter(q => q.subject_id === topicSubjectId);
    if (topicSelectedId) {
      const topicMatches = pool.filter(q => q.topic_id === topicSelectedId);
      if (topicMatches.length > 0) pool = topicMatches;
    }
    if (topicSearchQ.trim()) {
      const qLower = topicSearchQ.toLowerCase();
      pool = pool.filter(q =>
        (q.question_mr && q.question_mr.toLowerCase().includes(qLower)) ||
        (q.question_en && q.question_en.toLowerCase().includes(qLower))
      );
    }
    return pool;
  }, [questions, topicSubjectId, topicSelectedId, topicSearchQ]);

  // Auto-select all matching questions when topic changes in topic_wise mode
  useEffect(() => {
    if (qSourceTab === 'topic_wise' && topicMatchingQuestions.length > 0) {
      setTopicSelectedQIds(topicMatchingQuestions.filter(q => Boolean(q && q.id)).map(q => q.id));
    }
  }, [topicSelectedId, topicSubjectId, topicMatchingQuestions.length, qSourceTab]);

  // Subject Quota State: { [subjectId: string]: number }
  const [subjectQuotas, setSubjectQuotas] = useState<Record<string, number>>({});

  // Single Subject Random filter
  const [randomSubjectFilter, setRandomSubjectFilter] = useState<string>('all');
  const [randomCount, setRandomCount] = useState<number>(50);

  // Manual Select Tab Filters
  const [selectedQIds, setSelectedQIds] = useState<string[]>([]);
  const [qSearchQuery, setQSearchQuery] = useState('');
  const [qFilterSubject, setQFilterSubject] = useState<string>('all');

  // New question form state
  const [newQTextEn, setNewQTextEn] = useState('');
  const [newQTextMr, setNewQTextMr] = useState('');
  const [newOptA, setNewOptA] = useState('');
  const [newOptB, setNewOptB] = useState('');
  const [newOptC, setNewOptC] = useState('');
  const [newOptD, setNewOptD] = useState('');
  const [newCorrectOpt, setNewCorrectOpt] = useState<number>(0);
  const [newExpMr, setNewExpMr] = useState('');
  const [newSubjectId, setNewSubjectId] = useState<string>('subj-fon');
  const [createdQuestions, setCreatedQuestions] = useState<Partial<Question>[]>([]);

  const [isSavingCustomTest, setIsSavingCustomTest] = useState(false);

  // Total questions from subject quotas
  const totalQuotaQuestions = useMemo(() => {
    return Object.values(subjectQuotas).reduce((sum: number, n) => sum + (Number(n) || 0), 0);
  }, [subjectQuotas]);

  const loadSnapshots = async () => {
    try {
      setLoadingSnapshots(true);
      const res = await api.getProctoringSnapshots(selectedSnapshotTestId || undefined);
      setSnapshots(res);
    } catch (err: any) {
      console.error('Error loading snapshots:', err);
    } finally {
      setLoadingSnapshots(false);
    }
  };

  useEffect(() => {
    if (adminTab === 'proctoring') {
      loadSnapshots();
    }
  }, [adminTab, selectedSnapshotTestId]);

  const handleDeleteSnapshot = async (id: string) => {
    if (!window.confirm('तुम्हाला खरोखर हा प्रोक्टरिंग फोटो डिलीट करायचा आहे का? (Manual Purge Action)')) return;
    try {
      await api.deleteProctoringSnapshot(id);
      showToast('फोटो यशस्वीपणे डिलीट करण्यात आला!', 'success');
      loadSnapshots();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const handleToggleTestActive = async (testId: string, currentActive: boolean) => {
    const nextState = !currentActive;
    try {
      await api.toggleMockTestActive(testId, nextState);
      showToast(nextState ? 'चाचणी चालू (ON) करण्यात आली!' : 'चाचणी बंद (OFF) करण्यात आली!', 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Toggle failed', 'error');
    }
  };

  const handleOpenCustomModal = () => {
    const nextNum = mockTests.length + 1;
    setCustomTestNumber(nextNum);
    setCustomTitleEn(`Test Series Paper ${nextNum}`);
    setCustomTitleMr(`विशेष टेस्ट सिरीज पेपर ${nextNum}`);
    setCustomYoutubeUrl('');
    setCustomEnableYoutube(true);
    setSelectedQIds([]);
    setCreatedQuestions([]);

    // Initialize Default Maharashtra Quota preset
    applyPresetQuota('maharashtra_std');
    setShowCustomModal(true);
  };

  // Apply Quick Subject Quota Presets
  const applyPresetQuota = (presetKey: 'maharashtra_std' | 'aiims_cbt' | 'equal' | 'clear') => {
    const newQuotas: Record<string, number> = {};
    if (presetKey === 'clear') {
      setSubjectQuotas({});
      return;
    }

    if (presetKey === 'maharashtra_std') {
      // 100 Qs Standard Pattern (80 Qs Nursing + 20 Qs Marathi/English/GK)
      (effectiveSubjects || []).filter(s => Boolean(s && s.id)).forEach(s => {
        const id = (s.id || '').toLowerCase();
        if (id.includes('fon')) newQuotas[s.id] = 20;
        else if (id.includes('msn')) newQuotas[s.id] = 20;
        else if (id.includes('obg')) newQuotas[s.id] = 15;
        else if (id.includes('chn')) newQuotas[s.id] = 15;
        else if (id.includes('ped')) newQuotas[s.id] = 10;
        else if (id.includes('marathi')) newQuotas[s.id] = 5;
        else if (id.includes('english')) newQuotas[s.id] = 5;
        else if (id.includes('gk')) newQuotas[s.id] = 5;
        else if (id.includes('math') || id.includes('apt')) newQuotas[s.id] = 5;
        else newQuotas[s.id] = 0;
      });
    } else if (presetKey === 'aiims_cbt') {
      // 100 Qs AIIMS Clinical Pattern
      (effectiveSubjects || []).filter(s => Boolean(s && s.id)).forEach(s => {
        const id = (s.id || '').toLowerCase();
        if (id.includes('fon')) newQuotas[s.id] = 25;
        else if (id.includes('msn')) newQuotas[s.id] = 25;
        else if (id.includes('obg')) newQuotas[s.id] = 20;
        else if (id.includes('ped')) newQuotas[s.id] = 15;
        else if (id.includes('pharm')) newQuotas[s.id] = 15;
        else newQuotas[s.id] = 0;
      });
    } else if (presetKey === 'equal') {
      const validSubs = (effectiveSubjects || []).filter(s => Boolean(s && s.id));
      const perSub = Math.max(1, Math.floor(100 / (validSubs.length || 1)));
      validSubs.forEach(s => {
        newQuotas[s.id] = perSub;
      });
    }
    setSubjectQuotas(newQuotas);
  };

  const handleOpenEditModal = (test: MockTest) => {
    setEditingTest(test);
    setEditYoutubeUrl(test.youtube_url || '');
    setEditEnableYoutube(test.enable_youtube_video ?? false);
    setEditIsFree(test.is_free ?? false);
    setEditVideoAccessMode(test.video_access_mode || (test.requires_test_series_pass || test.is_premium ? 'paid_test_only' : 'free'));
    setEditHideVideo(test.hide_video ?? false);
    setEditProctoring(test.proctoring_enabled ?? false);
    setEditStrictTiming(test.strict_timing_enabled ?? false);
    setEditStartWindowTime(test.start_window_time || '');
    setEditEndWindowTime(test.end_window_time || '');
    setEditIsActive(test.is_active ?? true);
  };

  const handleSaveEditTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest) return;
    try {
      setIsUpdatingTest(true);
      await api.updateMockTest(editingTest.id, {
        youtube_url: editYoutubeUrl.trim(),
        enable_youtube_video: editEnableYoutube,
        is_free: editIsFree,
        video_access_mode: editVideoAccessMode,
        hide_video: editHideVideo,
        proctoring_enabled: editProctoring,
        strict_timing_enabled: editStrictTiming,
        start_window_time: editStartWindowTime || undefined,
        end_window_time: editEndWindowTime || undefined,
        is_active: editIsActive
      });
      showToast('टेस्ट सेटिंग्ज यशस्वीपणे अपडेट झाली!', 'success');
      setEditingTest(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    } finally {
      setIsUpdatingTest(false);
    }
  };

  const handleAddNewQuestionToTest = () => {
    if (!newQTextMr.trim() && !newQTextEn.trim()) {
      showToast('कृपया प्रश्नाचा मजकूर टाका', 'error');
      return;
    }
    if (!newOptA || !newOptB) {
      showToast('कृपया किमान पर्याय A आणि B टाका', 'error');
      return;
    }
    const correctOpts: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
    const newQ: Partial<Question> = {
      id: `custom_q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      question_en: newQTextEn || newQTextMr,
      question_mr: newQTextMr || newQTextEn,
      option_a_en: newOptA,
      option_b_en: newOptB,
      option_c_en: newOptC || 'None',
      option_d_en: newOptD || 'None',
      option_a_mr: newOptA,
      option_b_mr: newOptB,
      option_c_mr: newOptC || 'None',
      option_d_mr: newOptD || 'None',
      correct_option: correctOpts[newCorrectOpt] || 'A',
      explanation_mr: newExpMr || 'सविस्तर विश्लेषण उपलब्ध आहे.',
      subject_id: newSubjectId || 'subj-fon',
      difficulty: 'medium',
      question_type: 'single_best'
    };
    setCreatedQuestions([...createdQuestions, newQ]);
    setNewQTextEn('');
    setNewQTextMr('');
    setNewOptA('');
    setNewOptB('');
    setNewOptC('');
    setNewOptD('');
    setNewExpMr('');
    showToast('नवीन प्रश्न जोडला!', 'success');
  };

  const handleSaveCustomTest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingCustomTest(true);
      let finalQIds: string[] = [];
      let savedTestType: 'full_mock' | 'topic_test' | 'subject_test' = 'full_mock';
      let savedSubjectId: string | undefined = undefined;
      let savedTopicId: string | undefined = undefined;
      let savedTopicNameMr: string | undefined = undefined;
      let savedTopicNameEn: string | undefined = undefined;

      if (qSourceTab === 'topic_wise') {
        savedTestType = 'topic_test';
        savedSubjectId = topicSubjectId;
        savedTopicId = topicSelectedId;
        const curTopic = (allTopics || []).find(t => t?.id === topicSelectedId);
        savedTopicNameMr = curTopic?.name_mr;
        savedTopicNameEn = curTopic?.name_en;
        finalQIds = [...topicSelectedQIds];
      } else if (qSourceTab === 'subject_quota') {
        // Collect questions according to the specified subject quotas
        for (const [subId, quotaCount] of Object.entries(subjectQuotas)) {
          const count = Number(quotaCount) || 0;
          if (count > 0) {
            const subQuestions = (questions || []).filter(q => Boolean(q && q.id)).filter(q => q.subject_id === subId);
            const shuffled = [...subQuestions].sort(() => 0.5 - Math.random());
            const picked = shuffled.slice(0, count).filter(q => Boolean(q && q.id)).map(q => q.id);
            finalQIds.push(...picked);
          }
        }
      } else if (qSourceTab === 'random') {
        let pool = (questions || []).filter(q => Boolean(q && q.id));
        if (randomSubjectFilter !== 'all') {
          pool = pool.filter(q => q.subject_id === randomSubjectFilter);
        }
        const shuffled = pool.sort(() => 0.5 - Math.random());
        finalQIds = shuffled.slice(0, randomCount).filter(q => Boolean(q && q.id)).map(q => q.id);
      } else if (qSourceTab === 'select') {
        finalQIds = [...selectedQIds];
      } else if (qSourceTab === 'new') {
        if (createdQuestions.length === 0) {
          showToast('कृपया किमान १ नवीन प्रश्न जोडा', 'error');
          setIsSavingCustomTest(false);
          return;
        }
        for (const q of createdQuestions) {
          const saved = await api.createQuestion(q);
          if (saved && saved.id) {
            finalQIds.push(saved.id);
          }
        }
      }

      if (finalQIds.length === 0) {
        showToast('या चाचणीसाठी कोणतेही प्रश्न निवडले नाहीत! कृपया विषयानुसार किंवा संचातून प्रश्न निवडा.', 'error');
        setIsSavingCustomTest(false);
        return;
      }

      const examName = customPattern === 'maharashtra'
        ? 'DHS / DMER / ZP महाराष्ट्र आरोग्य विभाग'
        : 'AIIMS NORCET CBT National Pattern';

      const newTestPayload = {
        title_en: customTitleEn || `Test Series ${customTestNumber}`,
        title_mr: customTitleMr || `टेस्ट सिरीज पेपर ${customTestNumber}`,
        exam_name: examName,
        test_type: savedTestType,
        subject_id: savedSubjectId,
        topic_id: savedTopicId,
        topic_name_mr: savedTopicNameMr,
        topic_name_en: savedTopicNameEn,
        duration_minutes: Number(customDuration),
        total_marks: finalQIds.length * (customPattern === 'maharashtra' ? 2 : 1),
        negative_marking_rate: customPattern === 'maharashtra' ? 0.25 : 0.33,
        test_number: Number(customTestNumber),
        scheduled_date: customScheduledDate || undefined,
        scheduled_label: customScheduledDate ? new Date(customScheduledDate).toLocaleDateString('mr-IN') : undefined,
        requires_test_series_pass: customRequiresPass,
        price: Number(customPrice),
        is_purchasable_singly: true,
        youtube_url: customYoutubeUrl.trim() || undefined,
        enable_youtube_video: customEnableYoutube,
        description: savedTopicNameMr
          ? `${examName} अंतर्गत घटक चाचणी: ${savedTopicNameMr} (${savedTopicNameEn || ''}) वरील ${finalQIds.length} प्रश्नांची सराव टेस्ट.`
          : `${examName} अंतर्गत ${finalQIds.length} प्रश्नांची अचूक सराव टेस्ट चाचणी.`,
        question_ids: finalQIds
      };

      await api.createMockTest(newTestPayload);
      showToast('नवीन टेस्ट सिरीज पेपर यशस्वीपणे तयार झाला!', 'success');
      setShowCustomModal(false);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Test creation failed', 'error');
    } finally {
      setIsSavingCustomTest(false);
    }
  };

  const handleBulkGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (questions.length === 0) {
      showToast('No questions in question bank! Please import questions first.', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await api.bulkGenerateMockTests({
        pattern: selectedPattern,
        count: Number(testCount),
        questionsPerTest: Number(questionsPerTest)
      });
      if (res.success) {
        showToast(`Successfully bulk generated ${res.createdCount} mock tests!`, 'success');
        onRefresh();
      } else {
        showToast('Failed to bulk generate mock tests', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Bulk generation error', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mock test?')) return;
    try {
      await api.deleteMockTest(id);
      showToast('Mock test deleted successfully', 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Deletion failed', 'error');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('WARNING: This will delete ALL mock tests. Are you sure?')) return;
    try {
      await api.clearAllMockTests();
      showToast('All mock tests cleared', 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Clear failed', 'error');
    }
  };

  // Save updated test from Inspector modal
  const handleSaveUpdatedTestFromInspector = async (updatedTest: MockTest, newQuestionIds: string[]) => {
    await api.updateMockTest(updatedTest.id, {
      question_ids: newQuestionIds,
      total_marks: updatedTest.total_marks
    });
    onRefresh();
  };

  const filteredTests = (mockTests || []).filter(t => Boolean(t && t.id)).filter(t => {
    if (filterPattern === 'topic_tests') return t.test_type === 'topic_test';
    if (filterPattern === 'maharashtra') return (t.exam_name || '').includes('Maharashtra') || (t.exam_pattern || '').includes('Maharashtra');
    if (filterPattern === 'aiims') return (t.exam_name || '').includes('AIIMS') || (t.exam_pattern || '').includes('AIIMS');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Admin Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl text-white shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminTab('tests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              adminTab === 'tests'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>सर्व टेस्ट सिरीज ({mockTests.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('proctoring')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              adminTab === 'proctoring'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>प्रोक्टरिंग फोटो गॅलरी</span>
            {snapshots.length > 0 && (
              <span className="px-2 py-0.5 bg-white text-rose-700 text-[10px] rounded-full font-black">
                {snapshots.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenCustomModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-extrabold transition cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ नवीन टेस्ट सिरीज बनवा (विषयानुसार)</span>
          </button>

          {mockTests.length > 0 && (
            <button
              onClick={handleClearAll}
              className="p-2 bg-rose-900/50 hover:bg-rose-800 text-rose-200 rounded-xl transition cursor-pointer"
              title="Clear All Tests"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {adminTab === 'proctoring' ? (
        /* PROCTORING SNAPSHOT GALLERY TAB */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-rose-600" />
                <span>लाइव्ह प्रोक्टरिंग फोटो गॅलरी (Live Camera Snapshots)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                विद्यार्थ्यांनी परीक्षा सोडवताना कॅमेऱ्याने घेतलेले नमुनेदार फोटो. ॲडमिन मॅन्युअली फोटो डिलीट करू शकतात.
              </p>
            </div>

            <button
              onClick={loadSnapshots}
              disabled={loadingSnapshots}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition"
            >
              <Loader2 className={`w-3.5 h-3.5 ${loadingSnapshots ? 'animate-spin' : ''}`} />
              <span>रिफ्रेश गॅलरी</span>
            </button>
          </div>

          {loadingSnapshots ? (
            <div className="text-center py-12 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-rose-500" />
              <p className="text-xs font-medium">प्रोक्टरिंग फोटो लोड होत आहेत...</p>
            </div>
          ) : snapshots.length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <Camera className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="font-bold text-slate-600 text-sm">कोणतेही प्रोक्टरिंग फोटो सापडले नाहीत.</p>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                जेव्हा विद्यार्थी कॅमेरा प्रोक्टरिंग चालू असलेल्या टेस्ट सोडवतील, तेव्हा दर २-३ मिनिटांनी घेतलेले फोटो येथे जमा होतील.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {snapshots.map((snap) => (
                <div key={snap.id} className="bg-slate-900 rounded-2xl p-4 text-white space-y-3 shadow-md border border-slate-800 relative group">
                  <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-800">
                    <img
                      src={snap.secure_url}
                      alt="Proctoring Snapshot"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] text-rose-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      <span>PROCTOR SNAP</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-slate-100 truncate">{snap.user_name}</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{new Date(snap.captured_at).toLocaleString('mr-IN')}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-mono truncate max-w-[120px]">ID: {snap.cloudinary_public_id}</span>
                    <button
                      onClick={() => handleDeleteSnapshot(snap.id)}
                      className="px-2.5 py-1 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg transition text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>फोटो डिलीट</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* REGULAR TEST MANAGEMENT & LIST */
        <>
          {/* Bulk Generator Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden border border-slate-800">
            <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-400 border border-teal-500/30">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">⚡ ऑटोमॅटिक टेस्ट सिरीज जनरेटर (Bulk Auto-Generate)</h3>
                  <p className="text-xs text-slate-300">
                    महाराष्ट्र शासन (DMER/DHS/ZP) किंवा AIIMS NORCET पॅटर्ननुसार एकाच क्लिकवर ५ ते १० फुल मॉक पेपर्स तयार करा.
                  </p>
                </div>
              </div>

              <form onSubmit={handleBulkGenerate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">परीक्षेचा पॅटर्न निवडा</label>
                  <select
                    value={selectedPattern}
                    onChange={(e) => setSelectedPattern(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-400 font-semibold"
                  >
                    <option value="maharashtra">🇮🇳 महाराष्ट्र शासन (DMER / DHS / ZP) - 100 Qs</option>
                    <option value="aiims">🏥 AIIMS NORCET National CBT - 100 Qs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">तयार करायचे पेपर्स</label>
                  <select
                    value={testCount}
                    onChange={(e) => setTestCount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-400 font-semibold"
                  >
                    <option value={1}>1 Test Paper</option>
                    <option value={3}>3 Test Papers</option>
                    <option value={5}>5 Test Papers (Recommended)</option>
                    <option value={10}>10 Test Papers (Full Series)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">प्रत्येक पेपर मधील प्रश्न</label>
                  <select
                    value={questionsPerTest}
                    onChange={(e) => setQuestionsPerTest(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-400 font-semibold"
                  >
                    <option value={25}>25 MCQs (Rapid Test)</option>
                    <option value={50}>50 MCQs (Standard Test)</option>
                    <option value={100}>100 MCQs (Full Govt Mock Paper)</option>
                    <option value={200}>200 MCQs (NORCET Mega Test)</option>
                  </select>
                </div>

                <div className="sm:col-span-3 flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isGenerating || questions.length === 0}
                    className="flex items-center gap-2 px-5 py-2.5 bg-teal-400 hover:bg-teal-300 disabled:bg-slate-700 text-slate-950 font-black rounded-xl transition cursor-pointer shadow-md text-xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isGenerating ? 'Generating Tests...' : `⚡ Bulk Generate ${testCount} Mock Tests Now`}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Tests List & Inspector Cards */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">सर्व टेस्ट सिरीज यादी ({filteredTests.length})</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  कोणत्या टेस्टमध्ये कोणते प्रश्न आहेत ते पाहण्यासाठी व बदलण्यासाठी <strong>"प्रश्न पहा व तपासा (Inspect)"</strong> वर क्लिक करा.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setFilterPattern('all')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${filterPattern === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                >
                  All ({mockTests.length})
                </button>
                <button
                  onClick={() => setFilterPattern('topic_tests')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${filterPattern === 'topic_tests' ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-600'}`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>🎯 घटक चाचण्या (Topic Tests)</span>
                </button>
                <button
                  onClick={() => setFilterPattern('maharashtra')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${filterPattern === 'maharashtra' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600'}`}
                >
                  Maharashtra
                </button>
                <button
                  onClick={() => setFilterPattern('aiims')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${filterPattern === 'aiims' ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-600'}`}
                >
                  AIIMS NORCET
                </button>
              </div>
            </div>

            {filteredTests.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-3">
                <FileCheck2 className="w-12 h-12 mx-auto opacity-40" />
                <p className="font-semibold text-slate-600">कोणतीही टेस्ट सापडली नाही.</p>
                <button
                  onClick={handleOpenCustomModal}
                  className="px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl hover:bg-teal-700 cursor-pointer"
                >
                  + पहिली टेस्ट सिरीज तयार करा
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(filteredTests || []).filter(test => Boolean(test && test.id)).map((test) => {
                  const isMah = (test.exam_name || '').includes('Maharashtra');
                  const hasYoutube = test.enable_youtube_video && test.youtube_url;
                  const isActive = test.is_active !== false;

                  return (
                    <div
                      key={test.id}
                      className={`border rounded-2xl p-5 transition space-y-3 relative flex flex-col justify-between ${
                        isActive
                          ? 'border-slate-200 bg-white hover:border-teal-500 shadow-2xs'
                          : 'border-slate-300 bg-slate-100/90 opacity-80'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                              {/* Individual Test ON / OFF Button Switch */}
                              <button
                                type="button"
                                onClick={() => handleToggleTestActive(test.id, isActive)}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black cursor-pointer transition flex items-center gap-1 ${
                                  isActive
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                  }`}
                                title="Click to toggle Test ON/OFF"
                              >
                                <span>{isActive ? '🟢 TEST ON (चालू)' : '🔴 TEST OFF (बंद)'}</span>
                              </button>

                              {test.test_type === 'topic_test' && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1 shadow-2xs">
                                  <Target className="w-3 h-3 text-purple-700" />
                                  <span>🎯 घटक चाचणी: {test.topic_name_mr || test.topic_name_en || 'Topic Test'}</span>
                                </span>
                              )}

                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                isMah ? 'bg-teal-100 text-teal-800' : 'bg-indigo-100 text-indigo-800'
                              }`}>
                                {test.exam_name}
                              </span>

                              {test.proctoring_enabled && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-0.5">
                                  <Camera className="w-3 h-3 text-amber-600" />
                                  <span>Camera</span>
                                </span>
                              )}

                              {hasYoutube && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                                  📺 Video
                                </span>
                              )}

                              {test.is_free && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  FREE
                                </span>
                              )}
                            </div>

                            <h4 className="font-extrabold text-slate-900 text-sm">{test.title_mr || test.title_en}</h4>
                            <p className="text-xs text-slate-500 font-medium">{test.title_en}</p>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleOpenEditModal(test)}
                              className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition cursor-pointer flex items-center gap-1"
                              title="Edit settings, video & timing"
                            >
                              <span>सेटिंग्ज</span>
                            </button>

                            <button
                              onClick={() => handleDelete(test.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Delete test"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2">{test.description}</p>

                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Questions</span>
                            <span className="font-bold text-slate-900">{test.question_ids?.length || 0} MCQs</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Duration</span>
                            <span className="font-bold text-slate-900">{test.duration_minutes} Mins</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Marks</span>
                            <span className="font-bold text-teal-700">{test.total_marks || (test.question_ids?.length || 0) * (isMah ? 2 : 1)} Marks</span>
                          </div>
                        </div>
                      </div>

                      {/* PROMINENT TEST INSPECTOR & QUICK PREVIEW BUTTONS */}
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setInspectingTest(test)}
                            className="grow py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>👁️ पूर्ण प्रश्न इन्स्पेक्टर (View)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDownloadingTest(test)}
                            className="py-2.5 px-3 bg-slate-900 hover:bg-black text-white font-black text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                            title="मराठी/इंग्रजी प्रश्नपत्रिका व संपूर्ण स्पष्टीकरण शीट डाउनलोड करा / प्रिंट करा"
                          >
                            <Printer className="w-3.5 h-3.5 text-teal-300" />
                            <span>📥 डाऊनलोड</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setExpandedInlineTestId(expandedInlineTestId === test.id ? null : test.id)}
                            className="py-2.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1 border border-slate-200 cursor-pointer"
                            title="याच पानावर खाली सर्व प्रश्न उघडा"
                          >
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedInlineTestId === test.id ? 'rotate-180 text-teal-600' : ''}`} />
                          </button>
                        </div>

                        {/* INLINE EXPANDED QUESTIONS LIST */}
                        {expandedInlineTestId === test.id && (
                          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 max-h-96 overflow-y-auto space-y-2 text-xs">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                              <span className="font-extrabold text-slate-900">
                                📋 समाविष्ट प्रश्न ({test.question_ids?.length || 0} MCQs):
                              </span>
                              <span className="text-[11px] text-teal-700 font-bold">
                                {test.exam_name}
                              </span>
                            </div>

                            {(!test.question_ids || test.question_ids.length === 0) ? (
                              <p className="text-slate-400 py-3 text-center">या चाचणीत प्रश्न नाहीत.</p>
                            ) : (
                              test.question_ids.map((qid, qIdx) => {
                                const qObj = (questions || []).find(q => q?.id === qid) || ((test as any).questions || [])?.find((q: any) => q?.id === qid);
                                const qSub = qObj ? (effectiveSubjects || []).find(s => s?.id === qObj.subject_id) : null;

                                return (
                                  <div key={qid} className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-black text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                                          Q.{qIdx + 1}
                                        </span>
                                        <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded">
                                          {qSub?.name_mr || qSub?.name_en || 'Nursing'}
                                        </span>
                                      </div>
                                      {qObj?.correct_option && (
                                        <span className="text-[10px] font-black bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded border border-emerald-300">
                                          उत्तर: Option {qObj.correct_option}
                                        </span>
                                      )}
                                    </div>
                                    <div className="font-bold text-slate-900 leading-snug">
                                      {qObj?.question_mr || qObj?.question_en || `प्रश्न ID: ${qid}`}
                                    </div>
                                    {qObj?.question_en && qObj?.question_mr && (
                                      <div className="text-[11px] text-slate-500">
                                        {qObj.question_en}
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ADMIN TEST INSPECTOR MODAL */}
      {inspectingTest && (
        <AdminMockTestInspectorModal
          test={inspectingTest}
          allQuestions={questions}
          subjects={effectiveSubjects}
          isOpen={Boolean(inspectingTest)}
          onClose={() => setInspectingTest(null)}
          onSaveUpdatedTest={handleSaveUpdatedTestFromInspector}
          showToast={showToast}
        />
      )}

      {/* ADMIN TEST DOWNLOAD & PRINT MODAL */}
      {downloadingTest && (
        <AdminMockTestDownloadModal
          test={downloadingTest}
          questions={questions}
          isOpen={Boolean(downloadingTest)}
          onClose={() => setDownloadingTest(null)}
        />
      )}

      {/* Quick Edit YouTube Link & Settings Modal */}
      {editingTest && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Play className="w-5 h-5 text-rose-600 fill-current" />
                  <span>युट्युब स्पष्टीकरण & चाचणी सेटिंग्ज</span>
                </h3>
                <p className="text-xs text-slate-500 truncate max-w-xs">{editingTest.title_mr || editingTest.title_en}</p>
              </div>
              <button
                onClick={() => setEditingTest(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditTest} className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
              {/* Test Active Status Toggle */}
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <label className="font-bold text-emerald-950 text-xs block">
                    १. टेस्ट ऑन/ऑफ स्थिती (Test Active Status):
                  </label>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    जर बंद (OFF) केले तर ही टेस्ट विद्यार्थ्यांच्या ॲपमधून लपवली जाईल.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={editIsActive}
                  onChange={e => setEditIsActive(e.target.checked)}
                  className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              {/* Free Test Checkbox */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <label className="font-bold text-slate-800 text-xs block">
                    २. मोफत डेमो पेपर (FREE Practice Paper):
                  </label>
                  <p className="text-[11px] text-slate-500">
                    सर्व विद्यार्थ्यांना विनामूल्य सोडवता येईल.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={editIsFree}
                  onChange={e => setEditIsFree(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
              </div>

              {/* YouTube Video Explanation */}
              <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-200 space-y-2">
                <label className="font-bold text-rose-950 text-xs flex items-center gap-1.5">
                  <Play className="w-4 h-4 text-rose-600" />
                  <span>युट्यूब स्पष्टीकरण व्हिडिओ (YouTube Lecture URL):</span>
                </label>
                <input
                  type="url"
                  value={editYoutubeUrl}
                  onChange={e => setEditYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-2.5 bg-white border border-rose-300 rounded-xl text-xs font-mono"
                />

                <label className="flex items-center gap-2 cursor-pointer pt-1 font-bold text-rose-900">
                  <input
                    type="checkbox"
                    checked={editEnableYoutube}
                    onChange={e => setEditEnableYoutube(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span>विद्यार्थ्यांना व्हिडिओ दाखवा (Enable Video)</span>
                </label>

                {editEnableYoutube && (
                  <div className="pt-2 border-t border-rose-200/70 space-y-2 mt-2">
                    <label className="font-extrabold text-rose-950 text-[11px] block">
                      व्हिडिओ कोणाला दिसेल? (Video Access Control):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                        editVideoAccessMode === 'paid_test_only'
                          ? 'bg-rose-100 border-rose-400 text-rose-950 font-bold'
                          : 'bg-white border-rose-200 text-slate-700'
                      }`}>
                        <input
                          type="radio"
                          name="edit_video_mode"
                          checked={editVideoAccessMode === 'paid_test_only'}
                          onChange={() => setEditVideoAccessMode('paid_test_only')}
                          className="text-rose-600"
                        />
                        <span className="text-[11px]">🔒 फक्त पेड सदस्यांना (Paid Only)</span>
                      </label>

                      <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                        editVideoAccessMode === 'free'
                          ? 'bg-rose-100 border-rose-400 text-rose-950 font-bold'
                          : 'bg-white border-rose-200 text-slate-700'
                      }`}>
                        <input
                          type="radio"
                          name="edit_video_mode"
                          checked={editVideoAccessMode === 'free'}
                          onChange={() => setEditVideoAccessMode('free')}
                          className="text-rose-600"
                        />
                        <span className="text-[11px]">🌐 सर्व विद्यार्थ्यांना मोफत (Free)</span>
                      </label>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-1 text-[11px] font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={editHideVideo}
                        onChange={e => setEditHideVideo(e.target.checked)}
                        className="w-4 h-4 text-rose-600 rounded"
                      />
                      <span>व्हिडिओ तात्पुरता पूर्णपणे लपवा (Hide Video from Students)</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Camera Proctoring */}
              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 space-y-2">
                <label className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-amber-600" />
                  <span>कॅमेरा प्रोक्टरिंग (Live Camera Proctoring):</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-900">
                  <input
                    type="checkbox"
                    checked={editProctoring}
                    onChange={e => setEditProctoring(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>कॅमेरा पडताळणी अनिवार्य करा (Take Proctoring Snaps)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTest(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingTest}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  {isUpdatingTest ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>सेटिंग्ज सेव्ह करा</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Test Series Modal WITH SUBJECT-WISE DISTRIBUTION BUILDER */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-teal-600" />
                  <span>नवीन टेस्ट सिरीज पेपर तयार करा (विषयानुसार किंवा रँडम)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  विषयानुसार प्रश्नांची संख्या ठरवून अचूक टेस्ट सिरीज पेपर बनवा.
                </p>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomTest} className="space-y-4 text-xs">
              {/* Paper Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">पेपरचे नाव (मराठी शीर्षक) *</label>
                  <input
                    type="text"
                    required
                    value={customTitleMr}
                    onChange={e => setCustomTitleMr(e.target.value)}
                    placeholder="उदा. टेस्ट सिरीज पेपर १ - सर्व विषयांचा सराव"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">पेपरचे नाव (English Title)</label>
                  <input
                    type="text"
                    required
                    value={customTitleEn}
                    onChange={e => setCustomTitleEn(e.target.value)}
                    placeholder="e.g. Test Series 1 - Full Mock Paper"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              {/* Number, Pattern, Duration, Price */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">पेपर क्र.</label>
                  <input
                    type="number"
                    min={1}
                    value={customTestNumber}
                    onChange={e => setCustomTestNumber(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">परीक्षेचा पॅटर्न</label>
                  <select
                    value={customPattern}
                    onChange={e => setCustomPattern(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                  >
                    <option value="maharashtra">DHS / DMER / ZP</option>
                    <option value="aiims">AIIMS NORCET</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">वेळ (मिनिटे)</label>
                  <input
                    type="number"
                    value={customDuration}
                    onChange={e => setCustomDuration(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">किंमत (₹ Single)</label>
                  <input
                    type="number"
                    value={customPrice}
                    onChange={e => setCustomPrice(Number(e.target.value))}
                    placeholder="29"
                    className="w-full p-2.5 bg-amber-50 border border-amber-300 rounded-xl font-black text-amber-900"
                  />
                </div>
              </div>

              {/* SCHEDULE & PASS LOCK */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    <span>शेड्युल रिलीज तारीख (Scheduled Date)</span>
                  </label>
                  <input
                    type="date"
                    value={customScheduledDate}
                    onChange={e => setCustomScheduledDate(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">रिकामे ठेवल्यास पेपर लगेचच उपलब्ध होईल.</p>
                </div>

                <div className="flex items-center pt-4">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={customRequiresPass}
                      onChange={e => setCustomRequiresPass(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <span>केवळ Test Series पास असलेल्या विद्यार्थ्यांनाच दाखवा</span>
                  </label>
                </div>
              </div>

              {/* QUESTION SELECTION SOURCE TABS */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block font-extrabold text-slate-900 text-sm">
                    प्रश्नांची निवड कशी करायची?
                  </label>
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                    {qSourceTab === 'topic_wise' && `🎯 टॉपिकचे निवडलेले: ${topicSelectedQIds.length} प्रश्न`}
                    {qSourceTab === 'subject_quota' && `एकूण निवडलेले प्रश्न: ${totalQuotaQuestions}`}
                    {qSourceTab === 'random' && `रँडम निवड: ${randomCount} प्रश्न`}
                    {qSourceTab === 'select' && `निवडलेले: ${selectedQIds.length} प्रश्न`}
                    {qSourceTab === 'new' && `नवीन जोडलेले: ${createdQuestions.length} प्रश्न`}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
                  <button
                    type="button"
                    onClick={() => setQSourceTab('topic_wise')}
                    className={`px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      qSourceTab === 'topic_wise' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>🎯 टॉपिकनुसार बनवा (Topic-wise)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQSourceTab('subject_quota')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      qSourceTab === 'subject_quota' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>📚 विषयानुसार निवडा (Subject Quotas)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQSourceTab('random')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      qSourceTab === 'random' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>🎲 रँडम निवडा (Quick Random)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQSourceTab('select')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      qSourceTab === 'select' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>📋 प्रश्नसंचातील निवडा ({selectedQIds.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQSourceTab('new')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      qSourceTab === 'new' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>✍️ नवीन प्रश्न लिहा ({createdQuestions.length})</span>
                  </button>
                </div>

                {/* TAB 0: TOPIC-WISE TEST GENERATOR */}
                {qSourceTab === 'topic_wise' && (
                  <div className="p-4 bg-indigo-50/40 rounded-2xl border border-indigo-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-indigo-100">
                      <div>
                        <h5 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                          <Target className="w-4 h-4 text-indigo-600" />
                          <span>टॉपिक निवडून त्वरित घटक चाचणी (Topic Test) तयार करा:</span>
                        </h5>
                        <p className="text-[11px] text-slate-500">
                          मराठी, गणित व बुद्धिमत्ता किंवा नर्सिंग विषयातील विशिष्ट टॉपिकचे प्रश्न निवडून स्वतंत्र चाचणी पेपर बनवा.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Subject dropdown */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          १. विषय निवडा (Select Subject):
                        </label>
                        <select
                          value={topicSubjectId}
                          onChange={e => setTopicSubjectId(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                        >
                          {(effectiveSubjects || []).filter(sub => Boolean(sub && sub.id)).map(sub => {
                            const count = (questions || []).filter(q => q?.subject_id === sub.id).length;
                            return (
                              <option key={sub.id} value={sub.id}>
                                {sub.name_mr} ({sub.name_en}) — {count} प्रश्न
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* Topic dropdown */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          २. टॉपिक / घटक निवडा (Select Topic):
                        </label>
                        <select
                          value={topicSelectedId}
                          onChange={e => {
                            const newTopicId = e.target.value;
                            setTopicSelectedId(newTopicId);
                            const t = (allTopics || []).find(x => x?.id === newTopicId);
                            if (t) {
                              const sub = (effectiveSubjects || []).find(s => s?.id === topicSubjectId);
                              const subMr = sub ? sub.name_mr : '';
                              const subEn = sub ? sub.name_en : '';
                              setCustomTitleMr(`${subMr}: ${t.name_mr} घटक चाचणी`);
                              setCustomTitleEn(`${subEn}: ${t.name_en} Topic Test`);
                              const matchCount = (questions || []).filter(q => q?.topic_id === newTopicId || q?.subject_id === topicSubjectId).length;
                              setCustomDuration(Math.max(15, Math.min(120, Math.ceil(matchCount * 1.5))));
                            }
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                        >
                          {filteredSubjectTopics.length === 0 ? (
                            <option value="">या विषयासाठी टॉपिक उपलब्ध नाहीत</option>
                          ) : (
                            filteredSubjectTopics.filter(t => Boolean(t && t.id)).map(t => {
                              const qCount = (questions || []).filter(q => q?.topic_id === t.id).length;
                              return (
                                <option key={t.id} value={t.id}>
                                  {t.name_mr} ({t.name_en}) — {qCount} प्रश्न
                                </option>
                              );
                            })
                          )}
                        </select>
                      </div>
                    </div>

                    {/* Quick selection actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-xl border border-indigo-200">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">
                          या टॉपिकमध्ये <strong>{topicMatchingQuestions.length}</strong> प्रश्न उपलब्ध आहेत.
                        </span>
                        <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                          {topicSelectedQIds.length} निवडले
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setTopicSelectedQIds((topicMatchingQuestions || []).filter(q => Boolean(q && q.id)).map(q => q.id))}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer transition shadow-2xs"
                        >
                          सर्व निवडा ({topicMatchingQuestions.length})
                        </button>

                        <button
                          type="button"
                          onClick={() => setTopicSelectedQIds((topicMatchingQuestions || []).filter(q => Boolean(q && q.id)).slice(0, 10).map(q => q.id))}
                          className="px-2.5 py-1 bg-slate-50 hover:bg-indigo-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold cursor-pointer transition"
                        >
                          १० प्रश्न
                        </button>

                        <button
                          type="button"
                          onClick={() => setTopicSelectedQIds((topicMatchingQuestions || []).filter(q => Boolean(q && q.id)).slice(0, 20).map(q => q.id))}
                          className="px-2.5 py-1 bg-slate-50 hover:bg-indigo-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold cursor-pointer transition"
                        >
                          २० प्रश्न
                        </button>

                        <button
                          type="button"
                          onClick={() => setTopicSelectedQIds([])}
                          className="px-2 py-1 text-slate-500 hover:text-slate-800 text-xs font-medium cursor-pointer"
                        >
                          सर्व काढा (Clear)
                        </button>
                      </div>
                    </div>

                    {/* Questions Preview & Selection List */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">
                          प्रश्नांची सूची ({topicMatchingQuestions.length} पैकी {topicSelectedQIds.length} निवडले):
                        </span>
                        <input
                          type="text"
                          placeholder="या टॉपिकच्या प्रश्नांमध्ये शोधा..."
                          value={topicSearchQ}
                          onChange={e => setTopicSearchQ(e.target.value)}
                          className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white w-48 sm:w-64"
                        />
                      </div>

                      <div className="max-h-60 overflow-y-auto space-y-2 border border-slate-200 rounded-xl p-2 bg-white">
                        {topicMatchingQuestions.length === 0 ? (
                          <div className="text-center py-6 text-slate-400 text-xs">
                            या टॉपिकसाठी प्रश्न सापडले नाहीत. कृपया मॅन्युअल जोडा किंवा इम्पोर्ट करा.
                          </div>
                        ) : (
                          topicMatchingQuestions.filter(q => Boolean(q && q.id)).map((q, idx) => {
                            const isSelected = topicSelectedQIds.includes(q.id);
                            return (
                              <label
                                key={q.id}
                                className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                                  isSelected
                                    ? 'bg-indigo-50/60 border-indigo-300 text-indigo-950 font-medium'
                                    : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {
                                    if (isSelected) {
                                      setTopicSelectedQIds(prev => (prev || []).filter(id => id !== q.id));
                                    } else {
                                      setTopicSelectedQIds(prev => [...(prev || []), q.id]);
                                    }
                                  }}
                                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                                />
                                <div className="grow space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-slate-400">Q{idx + 1}.</span>
                                    <span className="line-clamp-2 text-slate-900 font-semibold">{q.question_mr || q.question_en}</span>
                                  </div>
                                  {q.question_en && q.question_mr && (
                                    <p className="text-[11px] text-slate-500 line-clamp-1">{q.question_en}</p>
                                  )}
                                </div>
                              </label>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 1: SUBJECT QUOTA DISTRIBUTION BUILDER */}
                {qSourceTab === 'subject_quota' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                      <div>
                        <h5 className="font-bold text-slate-900 text-xs">विषयानुसार प्रश्नांची संख्या निश्चित करा:</h5>
                        <p className="text-[11px] text-slate-500">प्रत्येक विषयातील किती प्रश्न या टेस्ट सिरीज पेपरमध्ये टाकायचे ते ठरवा.</p>
                      </div>

                      {/* Quick Preset Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => applyPresetQuota('maharashtra_std')}
                          className="px-2.5 py-1 bg-white hover:bg-teal-50 border border-slate-300 text-teal-900 rounded-lg text-[10.5px] font-bold cursor-pointer"
                        >
                          🏛️ DHS 100 Qs Preset
                        </button>
                        <button
                          type="button"
                          onClick={() => applyPresetQuota('aiims_cbt')}
                          className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-300 text-indigo-900 rounded-lg text-[10.5px] font-bold cursor-pointer"
                        >
                          🏥 AIIMS 100 Qs Preset
                        </button>
                        <button
                          type="button"
                          onClick={() => applyPresetQuota('clear')}
                          className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>

                    {/* Subjects Grid with Question Steppers */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                      {(effectiveSubjects || []).filter(sub => Boolean(sub && sub.id)).map(sub => {
                        const available = subjectQuestionCounts[sub.id] || 0;
                        const currentQuota = subjectQuotas[sub.id] || 0;

                        return (
                          <div
                            key={sub.id}
                            className={`p-2.5 rounded-xl border flex items-center justify-between transition ${
                              currentQuota > 0
                                ? 'bg-teal-50/80 border-teal-300 shadow-2xs'
                                : 'bg-white border-slate-200 opacity-90'
                            }`}
                          >
                            <div className="grow pr-2">
                              <span className="font-bold text-slate-900 text-xs block truncate">
                                {sub.name_mr || sub.name_en}
                              </span>
                              <span className="text-[10px] text-slate-500 block">
                                बँकेत उपलब्ध: <strong>{available} प्रश्न</strong>
                              </span>
                            </div>

                            {/* Stepper / Input */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setSubjectQuotas(prev => ({
                                    ...prev,
                                    [sub.id]: Math.max(0, (prev[sub.id] || 0) - 5)
                                  }));
                                }}
                                className="w-6 h-6 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold flex items-center justify-center text-xs cursor-pointer"
                              >
                                -
                              </button>

                              <input
                                type="number"
                                min={0}
                                max={available || 200}
                                value={currentQuota}
                                onChange={e => {
                                  const val = Math.max(0, parseInt(e.target.value) || 0);
                                  setSubjectQuotas(prev => ({ ...prev, [sub.id]: val }));
                                }}
                                className="w-14 p-1 text-center bg-white border border-slate-300 rounded-lg font-bold text-xs"
                              />

                              <button
                                type="button"
                                onClick={() => {
                                  setSubjectQuotas(prev => ({
                                    ...prev,
                                    [sub.id]: (prev[sub.id] || 0) + 5
                                  }));
                                }}
                                className="w-6 h-6 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold flex items-center justify-center text-xs cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3 bg-teal-900 text-white rounded-xl flex items-center justify-between text-xs font-bold">
                      <span>निवडलेल्या विषयांचे एकूण प्रश्न:</span>
                      <span className="text-base text-teal-300 font-black">{totalQuotaQuestions} MCQs</span>
                    </div>
                  </div>
                )}

                {/* TAB 2: QUICK RANDOM SELECTION */}
                {qSourceTab === 'random' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">कोणत्या विषयातून रँडम निवडायचे?</label>
                        <select
                          value={randomSubjectFilter}
                          onChange={e => setRandomSubjectFilter(e.target.value)}
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-xs"
                        >
                          <option value="all">सर्व विषय एकत्रित (All Bank - {questions.length} Qs)</option>
                          {effectiveSubjects.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.name_mr || s.name_en} ({subjectQuestionCounts[s.id] || 0} Qs)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">रँडम निवडायचे प्रश्न संख्या:</label>
                        <input
                          type="number"
                          min={5}
                          max={questions.length || 200}
                          value={randomCount}
                          onChange={e => setRandomCount(Number(e.target.value))}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: PICK FROM QUESTION BANK WITH SUBJECT FILTER */}
                {qSourceTab === 'select' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <select
                        value={qFilterSubject}
                        onChange={e => setQFilterSubject(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                      >
                        <option value="all">सर्व विषय ({questions.length})</option>
                        {effectiveSubjects.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.name_mr || s.name_en} ({subjectQuestionCounts[s.id] || 0})
                          </option>
                        ))}
                      </select>

                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          value={qSearchQuery}
                          onChange={e => setQSearchQuery(e.target.value)}
                          placeholder="प्रश्न शोधा (Search by keyword)..."
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                      {(questions || [])
                        .filter(q => Boolean(q && q.id))
                        .filter(q => {
                          if (qFilterSubject !== 'all' && q.subject_id !== qFilterSubject) return false;
                          if (qSearchQuery.trim()) {
                            const s = qSearchQuery.toLowerCase();
                            return (q.question_mr || '').toLowerCase().includes(s) || (q.question_en || '').toLowerCase().includes(s);
                          }
                          return true;
                        })
                        .slice(0, 50)
                        .map(q => {
                          const isSelected = selectedQIds.includes(q.id);
                          return (
                            <label
                              key={q.id}
                              className={`flex items-start gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                                isSelected ? 'bg-teal-50 border-teal-400' : 'bg-white border-slate-200'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {
                                  if (isSelected) {
                                    setSelectedQIds((selectedQIds || []).filter(id => id !== q.id));
                                  } else {
                                    setSelectedQIds([...(selectedQIds || []), q.id]);
                                  }
                                }}
                                className="mt-0.5 rounded text-teal-600"
                              />
                              <div className="text-xs grow">
                                <span className="font-bold text-slate-900 line-clamp-1">{q.question_mr || q.question_en}</span>
                                <span className="text-[10.5px] text-teal-700 block">
                                  {(effectiveSubjects || []).find(s => s?.id === q.subject_id)?.name_mr || 'Nursing'}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* TAB 4: WRITE NEW QUESTION */}
                {qSourceTab === 'new' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <select
                        value={newSubjectId}
                        onChange={e => setNewSubjectId(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                      >
                        {effectiveSubjects.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.name_mr || s.name_en}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={newQTextMr}
                        onChange={e => setNewQTextMr(e.target.value)}
                        placeholder="प्रश्नाचा मजकूर (मराठी) - उदा. मानवी शरीरात एकूण किती हाडे असतात?"
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl mb-2"
                      />
                      <input
                        type="text"
                        value={newQTextEn}
                        onChange={e => setNewQTextEn(e.target.value)}
                        placeholder="Question Text (English) - Optional"
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newOptA}
                        onChange={e => setNewOptA(e.target.value)}
                        placeholder="पर्याय A"
                        className="p-2 bg-white border border-slate-200 rounded-xl"
                      />
                      <input
                        type="text"
                        value={newOptB}
                        onChange={e => setNewOptB(e.target.value)}
                        placeholder="पर्याय B"
                        className="p-2 bg-white border border-slate-200 rounded-xl"
                      />
                      <input
                        type="text"
                        value={newOptC}
                        onChange={e => setNewOptC(e.target.value)}
                        placeholder="पर्याय C"
                        className="p-2 bg-white border border-slate-200 rounded-xl"
                      />
                      <input
                        type="text"
                        value={newOptD}
                        onChange={e => setNewOptD(e.target.value)}
                        placeholder="पर्याय D"
                        className="p-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-700">बरोबर उत्तर पर्याय:</span>
                      <select
                        value={newCorrectOpt}
                        onChange={e => setNewCorrectOpt(Number(e.target.value))}
                        className="p-1.5 bg-white border border-slate-200 rounded-xl font-bold"
                      >
                        <option value={0}>A (पर्याय A)</option>
                        <option value={1}>B (पर्याय B)</option>
                        <option value={2}>C (पर्याय C)</option>
                        <option value={3}>D (पर्याय D)</option>
                      </select>
                    </div>

                    <input
                      type="text"
                      value={newExpMr}
                      onChange={e => setNewExpMr(e.target.value)}
                      placeholder="सविस्तर स्पष्टीकरण (मराठी)"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                    />

                    <button
                      type="button"
                      onClick={handleAddNewQuestionToTest}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition cursor-pointer"
                    >
                      + हा प्रश्न चाचणीत जोडा
                    </button>

                    {createdQuestions.length > 0 && (
                      <div className="pt-2">
                        <span className="font-bold text-teal-800">जोडलेले प्रश्न ({createdQuestions.length}):</span>
                        <ul className="list-disc pl-4 text-[11px] text-slate-600 mt-1">
                          {createdQuestions.map((cq, idx) => (
                            <li key={idx} className="line-clamp-1">{cq.question_mr}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SAVE MODAL FOOTER */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={isSavingCustomTest}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
                >
                  {isSavingCustomTest ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>टेस्ट सेव्ह व प्रसिद्ध करा</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
