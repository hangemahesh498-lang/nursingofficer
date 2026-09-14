import React, { useState, useEffect } from 'react';
import { MockTest, Question, ProctoringSnapshot, UserProfile } from '../types';
import { api } from '../lib/api';
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
  ExternalLink
} from 'lucide-react';

interface AdminMockTestsTabProps {
  mockTests: MockTest[];
  questions: Question[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminMockTestsTab: React.FC<AdminMockTestsTabProps> = ({
  mockTests,
  questions,
  onRefresh,
  showToast
}) => {
  const [adminTab, setAdminTab] = useState<'tests' | 'proctoring' | 'star_students'>('tests');

  const [selectedPattern, setSelectedPattern] = useState<'maharashtra' | 'aiims'>('maharashtra');
  const [testCount, setTestCount] = useState<number>(5);
  const [questionsPerTest, setQuestionsPerTest] = useState<number>(100);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [filterPattern, setFilterPattern] = useState<'all' | 'maharashtra' | 'aiims'>('all');

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

  // Edit Test Modal State
  const [editingTest, setEditingTest] = useState<MockTest | null>(null);
  const [editPrice, setEditPrice] = useState<number>(29);
  const [editYoutubeUrl, setEditYoutubeUrl] = useState<string>('');
  const [editEnableYoutube, setEditEnableYoutube] = useState<boolean>(false);
  const [editIsFree, setEditIsFree] = useState<boolean>(false);
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

  // Question Selection mode: 'random' | 'select' | 'new'
  const [qSourceTab, setQSourceTab] = useState<'random' | 'select' | 'new'>('random');
  const [randomCount, setRandomCount] = useState<number>(25);
  const [selectedQIds, setSelectedQIds] = useState<string[]>([]);
  const [qSearchQuery, setQSearchQuery] = useState('');

  // New question form state
  const [newQTextEn, setNewQTextEn] = useState('');
  const [newQTextMr, setNewQTextMr] = useState('');
  const [newOptA, setNewOptA] = useState('');
  const [newOptB, setNewOptB] = useState('');
  const [newOptC, setNewOptC] = useState('');
  const [newOptD, setNewOptD] = useState('');
  const [newCorrectOpt, setNewCorrectOpt] = useState<number>(0);
  const [newExpMr, setNewExpMr] = useState('');
  const [createdQuestions, setCreatedQuestions] = useState<Partial<Question>[]>([]);

  const [isSavingCustomTest, setIsSavingCustomTest] = useState(false);

  const handleOpenCustomModal = () => {
    const nextNum = mockTests.length + 1;
    setCustomTestNumber(nextNum);
    setCustomTitleEn(`Test Series Paper ${nextNum}`);
    setCustomTitleMr(`विशेष टेस्ट सिरीज पेपर ${nextNum}`);
    setCustomYoutubeUrl('');
    setCustomEnableYoutube(true);
    setSelectedQIds([]);
    setCreatedQuestions([]);
    setShowCustomModal(true);
  };

  const handleOpenEditModal = (test: MockTest) => {
    setEditingTest(test);
    setEditYoutubeUrl(test.youtube_url || '');
    setEditEnableYoutube(test.enable_youtube_video ?? false);
    setEditIsFree(test.is_free ?? false);
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
      subject_id: 'sub_1',
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

      if (qSourceTab === 'random') {
        const shuffled = [...questions].sort(() => 0.5 - Math.random());
        finalQIds = shuffled.slice(0, randomCount).map(q => q.id);
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
        showToast('या चाचणीसाठी कोणतेही प्रश्न निवडले नाहीत!', 'error');
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
        description: `${examName} अंतर्गत ${finalQIds.length} गुणांची अचूक सराव टेस्ट चाचणी.`,
        question_ids: finalQIds
      };

      await api.createMockTest(newTestPayload);
      showToast('नवीन टेस्ट सिरीज पेपर यशस्वीपणे सेव्ह झाला!', 'success');
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

  const filteredTests = mockTests.filter(t => {
    if (filterPattern === 'maharashtra') return t.exam_name.includes('Maharashtra');
    if (filterPattern === 'aiims') return t.exam_name.includes('AIIMS');
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
            <span>टेस्ट सिरीज & ON/OFF स्विच ({mockTests.length})</span>
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
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-extrabold transition cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>सानुकूल टेस्ट जोडा</span>
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
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 border border-teal-500/30">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">⚡ Bulk Auto-Generate Mock Tests (100 Qs Pattern)</h3>
                  <p className="text-xs text-slate-300">
                    महाराष्ट्र शासन (DMER/DHS/ZP) व AIIMS NORCET पॅटर्ननुसार एकाच क्लिकवर स्वयंचलित टेस्ट सिरीज तयार करा.
                  </p>
                </div>
              </div>

              <form onSubmit={handleBulkGenerate} className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">परीक्षा पॅटर्न निवडा</label>
                  <select
                    value={selectedPattern}
                    onChange={(e) => setSelectedPattern(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-400"
                  >
                    <option value="maharashtra">🇮🇳 महाराष्ट्र शासन (DMER / DHS / ZP / NHM) - 100 Qs</option>
                    <option value="aiims">🏥 AIIMS (NORCET) National CBT Pattern - 100 Qs</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {selectedPattern === 'maharashtra' ? '90 mins • 0.25 negative marking • Bilingual' : '180 mins • 0.33 negative marking • Advanced Clinical'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">बनवायच्या टेस्ट्सची संख्या</label>
                  <select
                    value={testCount}
                    onChange={(e) => setTestCount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-400"
                  >
                    <option value={1}>1 Test (Test 1)</option>
                    <option value={3}>3 Tests (Test 1 to 3)</option>
                    <option value={5}>5 Tests (Test 1 to 5)</option>
                    <option value={10}>10 Tests (Test 1 to 10)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">प्रश्नांची संख्या</label>
                  <select
                    value={questionsPerTest}
                    onChange={(e) => setQuestionsPerTest(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-400"
                  >
                    <option value={25}>25 MCQs (Rapid Test)</option>
                    <option value={50}>50 MCQs (Standard Test)</option>
                    <option value={100}>100 MCQs (Full Govt Mock Paper)</option>
                    <option value={200}>200 MCQs (NORCET Mega Test)</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">Available in bank: {questions.length} questions.</p>
                </div>

                <div className="sm:col-span-3 flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isGenerating || questions.length === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-700 text-slate-950 font-bold rounded-xl transition cursor-pointer shadow-md text-xs"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>{isGenerating ? 'Generating Tests...' : `⚡ Bulk Generate ${testCount} Mock Tests Now`}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Tests List & Individual ON/OFF Toggle Switches */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">सर्व टेस्ट सिरीज यादी ({filteredTests.length})</h3>
                <p className="text-xs text-slate-500 mt-0.5">प्रत्येक टेस्ट समोरील बटणाने टेस्ट ON किंवा OFF करा.</p>
              </div>

              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setFilterPattern('all')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${filterPattern === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                >
                  All
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
              <div className="text-center py-12 text-slate-400">
                <FileCheck2 className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="font-semibold text-slate-600">कोणतीही टेस्ट सापडली नाही.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTests.map((test) => {
                  const isMah = test.exam_name.includes('Maharashtra');
                  const hasYoutube = test.enable_youtube_video && test.youtube_url;
                  const isActive = test.is_active !== false;

                  return (
                    <div
                      key={test.id}
                      className={`border rounded-2xl p-5 transition space-y-3 relative ${
                        isActive
                          ? 'border-slate-200 bg-white hover:border-teal-500 shadow-xs'
                          : 'border-slate-300 bg-slate-100/90 opacity-75'
                      }`}
                    >
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

                            {test.strict_timing_enabled && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 flex items-center gap-0.5">
                                <Clock className="w-3 h-3 text-purple-600" />
                                <span>Window</span>
                              </span>
                            )}

                            {hasYoutube && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                                📺 YouTube
                              </span>
                            )}

                            {test.is_free && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                FREE Paper 1
                              </span>
                            )}
                          </div>

                          <h4 className="font-bold text-slate-900 text-sm">{test.title_en}</h4>
                          <p className="text-xs text-teal-700 font-medium mt-0.5">{test.title_mr}</p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleOpenEditModal(test)}
                            className="px-2.5 py-1 text-xs font-bold bg-slate-200 hover:bg-teal-100 text-slate-800 hover:text-teal-900 rounded-lg transition cursor-pointer flex items-center gap-1"
                            title="Edit settings, video & timing"
                          >
                            <Play className="w-3.5 h-3.5 text-rose-600" />
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

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-xs text-slate-600">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Questions</span>
                          <span className="font-bold text-slate-900">{test.question_ids.length} MCQs</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Duration</span>
                          <span className="font-bold text-slate-900">{test.duration_minutes} Mins</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Negative Mark</span>
                          <span className="font-bold text-rose-600">-{test.negative_marking_rate}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
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
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={editIsActive}
                    onChange={e => setEditIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* YouTube Video Explanation Settings */}
              <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 space-y-3">
                <label className="block font-bold text-rose-950 text-xs">
                  २. युट्युब स्पष्टीकरण व्हिडिओ लिंक (YouTube URL):
                </label>
                <input
                  type="url"
                  value={editYoutubeUrl}
                  onChange={e => setEditYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-2.5 bg-white border border-rose-300 rounded-xl text-xs font-mono"
                />

                <div className="pt-1 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-rose-900 text-xs">
                    <input
                      type="checkbox"
                      checked={editEnableYoutube}
                      onChange={e => setEditEnableYoutube(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                    />
                    <span>युट्युब स्पष्टीकरण व्हिडिओ विद्यार्थ्यांना दाखवा (Enable Link)</span>
                  </label>
                  <span className={`font-bold ${editEnableYoutube ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {editEnableYoutube ? '🟢 चालू' : '🔴 बंद'}
                  </span>
                </div>
              </div>

              {/* Free Test Setting */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 text-xs">
                  <input
                    type="checkbox"
                    checked={editIsFree}
                    onChange={e => setEditIsFree(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <span>३. पहिली मोफत चाचणी बनवा (Mark as 100% Free Test)</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  या पर्यायाने सर्व विद्यार्थ्यांना टेस्ट सीरिज पास नसतानाही ही पहिली टेस्ट मोफत सोडवता येईल.
                </p>
              </div>

              {/* Proctoring & Anti-cheating setting */}
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-950 text-xs">
                  <input
                    type="checkbox"
                    checked={editProctoring}
                    onChange={e => setEditProctoring(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                  />
                  <Camera className="w-4 h-4 text-amber-700" />
                  <span>४. कॅमेरा प्रोक्टरिंग & कॉपी-प्रतिबंध (Camera Proctoring Enabled)</span>
                </label>
                <p className="text-[11px] text-amber-800">
                  दर २-३ मिनिटांनी समोरच्या कॅमेऱ्याने फोटो घेतला जाईल आणि ३-स्ट्राइक स्क्रीन स्विचेस केल्यास ऑटो-सबमिट होईल.
                </p>
              </div>

              {/* Scheduled Timed Window */}
              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-purple-950 text-xs">
                  <input
                    type="checkbox"
                    checked={editStrictTiming}
                    onChange={e => setEditStrictTiming(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <Clock className="w-4 h-4 text-purple-700" />
                  <span>५. ठराविक वेळ विंडो प्रवेश (Strict Scheduled Window Access)</span>
                </label>

                {editStrictTiming && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-purple-900 mb-1">शुरू होण्याची वेळ (Start Window):</label>
                      <input
                        type="datetime-local"
                        value={editStartWindowTime}
                        onChange={e => setEditStartWindowTime(e.target.value)}
                        className="w-full p-2 bg-white border border-purple-300 rounded-xl text-xs font-mono text-purple-950"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-purple-900 mb-1">शेवटची वेळ (End Window):</label>
                      <input
                        type="datetime-local"
                        value={editEndWindowTime}
                        onChange={e => setEditEndWindowTime(e.target.value)}
                        className="w-full p-2 bg-white border border-purple-300 rounded-xl text-xs font-mono text-purple-950"
                      />
                    </div>
                  </div>
                )}
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
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  {isUpdatingTest ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>सेटिंग्ज सेव्ह करा</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Test Series Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Award className="w-5 h-5 text-teal-600" />
                  <span>सानुकूल टेस्ट सिरीज पेपर तयार करा (Create Test Series)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  नवीन टेस्ट पेपर तयार करा, प्रश्न निवडा आणि रिलीजची तारीख व वेळ शेड्यूल करा.
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">पेपरचे नाव (English Title)</label>
                  <input
                    type="text"
                    required
                    value={customTitleEn}
                    onChange={e => setCustomTitleEn(e.target.value)}
                    placeholder="e.g. Test Series 1 - Community Health Nursing"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">पेपरचे नाव (मराठी)</label>
                  <input
                    type="text"
                    required
                    value={customTitleMr}
                    onChange={e => setCustomTitleMr(e.target.value)}
                    placeholder="उदा. टेस्ट सिरीज पेपर १ - समुदाय आरोग्य नर्सिंग"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
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
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs"
                  >
                    <option value="maharashtra">DHS/DMER</option>
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

              {/* YouTube Video Explanation Section */}
              <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-200 space-y-2">
                <label className="block font-bold text-rose-900 flex items-center gap-1.5">
                  <span className="text-base">▶️</span>
                  <span>युट्युब स्पष्टीकरण लिंक (YouTube Explanation Video URL)</span>
                </label>
                <input
                  type="url"
                  value={customYoutubeUrl}
                  onChange={e => setCustomYoutubeUrl(e.target.value)}
                  placeholder="उदा. https://www.youtube.com/watch?v=VIDEO_ID किंवा https://youtu.be/..."
                  className="w-full p-2.5 bg-white border border-rose-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                />

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-rose-950 text-xs">
                    <input
                      type="checkbox"
                      checked={customEnableYoutube}
                      onChange={e => setCustomEnableYoutube(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                    />
                    <span>युट्युब स्पष्टीकरण व्हिडिओ विद्यार्थ्याना दाखवा (Enable YouTube Link)</span>
                  </label>

                  <span className="text-[11px] text-rose-700 font-medium">
                    {customEnableYoutube ? '🟢 विद्यार्थ्याना व्हिडिओ दिसेल' : '🔴 व्हिडिओ लपवला जाईल'}
                  </span>
                </div>
              </div>

              {/* Question Selection Source Tabs */}
              <div className="space-y-3 pt-2">
                <label className="block font-bold text-slate-900 text-sm">प्रश्नांची निवड कशी करायची?</label>
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <button
                    type="button"
                    onClick={() => setQSourceTab('random')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                      qSourceTab === 'random' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    🎲 रँडम प्रश्न निवडा
                  </button>
                  <button
                    type="button"
                    onClick={() => setQSourceTab('select')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                      qSourceTab === 'select' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    📋 प्रश्नसंचातील निवडा ({selectedQIds.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setQSourceTab('new')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                      qSourceTab === 'new' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    ✍️ नवीन प्रश्न लिहा ({createdQuestions.length})
                  </button>
                </div>

                {qSourceTab === 'random' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <label className="block font-bold text-slate-700">रँडम निवडायचे प्रश्न संख्या:</label>
                    <input
                      type="number"
                      min={5}
                      max={questions.length || 200}
                      value={randomCount}
                      onChange={e => setRandomCount(Number(e.target.value))}
                      className="w-32 p-2 bg-white border border-slate-200 rounded-xl font-bold"
                    />
                    <p className="text-[11px] text-slate-500">उपलब्ध एकूण प्रश्न बँक: {questions.length} MCQs</p>
                  </div>
                )}

                {qSourceTab === 'select' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={qSearchQuery}
                        onChange={e => setQSearchQuery(e.target.value)}
                        placeholder="प्रश्न शोधा (Search by keyword)..."
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                      {questions
                        .filter(q => (q.question_mr || q.question_en).toLowerCase().includes(qSearchQuery.toLowerCase()))
                        .slice(0, 30)
                        .map(q => {
                          const isSelected = selectedQIds.includes(q.id);
                          return (
                            <label
                              key={q.id}
                              className={`flex items-start gap-2 p-2 rounded-xl border cursor-pointer transition ${
                                isSelected ? 'bg-teal-50 border-teal-300' : 'bg-white border-slate-200'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {
                                  if (isSelected) {
                                    setSelectedQIds(selectedQIds.filter(id => id !== q.id));
                                  } else {
                                    setSelectedQIds([...selectedQIds, q.id]);
                                  }
                                }}
                                className="mt-0.5 rounded text-teal-600"
                              />
                              <div className="text-xs">
                                <span className="font-bold text-slate-900 line-clamp-1">{q.question_mr || q.question_en}</span>
                                <span className="text-[10px] text-teal-700 block">{q.subject} • {q.chapter}</span>
                              </div>
                            </label>
                          );
                        })}
                    </div>
                  </div>
                )}

                {qSourceTab === 'new' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h5 className="font-bold text-slate-900 text-xs">नवीन प्रश्न जोडा (Add New MCQ):</h5>
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
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
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
