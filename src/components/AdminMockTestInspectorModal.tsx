import React, { useState, useEffect, useMemo } from 'react';
import { MockTest, Question, Subject } from '../types';
import { api } from '../lib/api';
import { AdminMockTestDownloadModal } from './AdminMockTestDownloadModal';
import {
  FileCheck2,
  Search,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Plus,
  Layers,
  HelpCircle,
  Clock,
  Award,
  AlertTriangle,
  X,
  Check,
  Sparkles,
  Eye,
  Printer,
  List,
  LayoutGrid,
  FileText,
  Loader2
} from 'lucide-react';

interface AdminMockTestInspectorModalProps {
  test: MockTest;
  allQuestions: Question[];
  subjects: Subject[];
  isOpen: boolean;
  onClose: () => void;
  onSaveUpdatedTest: (updatedTest: MockTest, newQuestionIds: string[]) => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminMockTestInspectorModal: React.FC<AdminMockTestInspectorModalProps> = ({
  test,
  allQuestions,
  subjects,
  isOpen,
  onClose,
  onSaveUpdatedTest,
  showToast
}) => {
  if (!isOpen) return null;

  // Active question IDs in this test (working copy)
  const [workingQIds, setWorkingQIds] = useState<string[]>(test.question_ids || []);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Local question store including fetched questions
  const [loadedQuestions, setLoadedQuestions] = useState<Question[]>(() => {
    return [...allQuestions, ...((test as any).questions || [])];
  });

  // View Mode: 'detailed' | 'paper' | 'table'
  const [viewMode, setViewMode] = useState<'detailed' | 'paper' | 'table'>('detailed');

  // Filters inside the inspector
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubjectId, setFilterSubjectId] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Replace modal / Add questions drawer state
  const [swappingQuestionId, setSwappingQuestionId] = useState<string | null>(null);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [addDrawerSubjectId, setAddDrawerSubjectId] = useState<string>('all');
  const [addDrawerSearch, setAddDrawerSearch] = useState<string>('');
  const [selectedToAddQIds, setSelectedToAddQIds] = useState<string[]>([]);

  // Fetch complete test questions and full question bank on mount
  useEffect(() => {
    let isMounted = true;
    const fetchAllTestData = async () => {
      setLoadingQuestions(true);
      try {
        const [fullTestRes, allBankRes] = await Promise.all([
          api.getMockTest(test.id).catch(() => null),
          api.getQuestions().catch(() => [])
        ]);

        if (isMounted) {
          const map = new Map<string, Question>();
          // 1. Initial props
          allQuestions.forEach(q => map.set(q.id, q));
          // 2. Full bank
          (allBankRes || []).forEach(q => map.set(q.id, q));
          // 3. Hydrated test questions
          if (fullTestRes && (fullTestRes as any).questions) {
            ((fullTestRes as any).questions as Question[]).forEach(q => map.set(q.id, q));
          }

          setLoadedQuestions(Array.from(map.values()));

          if (fullTestRes && fullTestRes.question_ids && fullTestRes.question_ids.length > 0) {
            setWorkingQIds(fullTestRes.question_ids);
          }
        }
      } catch (err) {
        console.error('Failed to load full mock test questions:', err);
      } finally {
        if (isMounted) setLoadingQuestions(false);
      }
    };

    fetchAllTestData();
    return () => {
      isMounted = false;
    };
  }, [test.id]);

  // Map of question lookup
  const questionMap = useMemo(() => {
    const map = new Map<string, Question>();
    loadedQuestions.forEach(q => map.set(q.id, q));
    return map;
  }, [loadedQuestions]);

  // Map of subject lookup
  const subjectMap = useMemo(() => {
    const map = new Map<string, Subject>();
    subjects.forEach(s => map.set(s.id, s));
    return map;
  }, [subjects]);

  // Current questions in this test (with robust fallback if object not found yet)
  const currentTestQuestions: Question[] = useMemo(() => {
    return workingQIds.map((id, index) => {
      const found = questionMap.get(id);
      if (found) return found;

      // Fallback object to ensure question is NEVER invisible
      return {
        id,
        subject_id: 'subj-fon',
        question_en: `Question ${index + 1} (${id})`,
        question_mr: `प्रश्न क्र. ${index + 1} (${id})`,
        option_a_en: 'Option A',
        option_a_mr: 'पर्याय A',
        option_b_en: 'Option B',
        option_b_mr: 'पर्याय B',
        option_c_en: 'Option C',
        option_c_mr: 'पर्याय C',
        option_d_en: 'Option D',
        option_d_mr: 'पर्याय D',
        correct_option: 'A' as const,
        explanation_en: 'Correct clinical rationale for this standard nursing MCQ.',
        explanation_mr: 'या नर्सिंग प्रश्नाचे अचूक क्लिनिकल स्पष्टीकरण.',
        difficulty: 'medium' as const,
        question_type: 'single_best' as const,
        status: 'published' as const
      };
    });
  }, [workingQIds, questionMap]);

  // Subject-wise distribution calculation
  const subjectDistribution = useMemo(() => {
    const counts: Record<string, { count: number; name_mr: string; name_en: string }> = {};
    currentTestQuestions.forEach(q => {
      const sub = subjectMap.get(q.subject_id);
      const subId = q.subject_id || 'other';
      const name_mr = sub?.name_mr || 'इतर विषय';
      const name_en = sub?.name_en || 'Other';
      if (!counts[subId]) {
        counts[subId] = { count: 0, name_mr, name_en };
      }
      counts[subId].count += 1;
    });
    return Object.entries(counts).sort((a, b) => b[1].count - a[1].count);
  }, [currentTestQuestions, subjectMap]);

  // Filtered view of questions in this test
  const filteredQuestions = useMemo(() => {
    return currentTestQuestions.filter(q => {
      if (filterSubjectId !== 'all' && q.subject_id !== filterSubjectId) return false;
      if (filterDifficulty !== 'all' && q.difficulty !== filterDifficulty) return false;
      if (filterType === 'pyq' && !q.is_verified_pyq && !q.is_pyq) return false;
      if (filterType === 'image' && !q.image_url) return false;
      if (filterType === 'clinical' && q.question_type !== 'clinical_scenario' && q.question_type !== 'clinical_case') return false;

      if (searchQuery.trim()) {
        const s = searchQuery.toLowerCase();
        const matchEn = q.question_en?.toLowerCase().includes(s);
        const matchMr = q.question_mr?.toLowerCase().includes(s);
        const matchExp = (q.explanation_mr || q.explanation_en || '').toLowerCase().includes(s);
        return matchEn || matchMr || matchExp;
      }
      return true;
    });
  }, [currentTestQuestions, filterSubjectId, filterDifficulty, filterType, searchQuery]);

  const hasUnsavedChanges = useMemo(() => {
    if (workingQIds.length !== test.question_ids.length) return true;
    return workingQIds.some((id, idx) => id !== test.question_ids[idx]);
  }, [workingQIds, test.question_ids]);

  // Handle Remove Question
  const handleRemoveQuestion = (idToRemove: string) => {
    setWorkingQIds(prev => prev.filter(id => id !== idToRemove));
    showToast('प्रश्न चाचणीतून काढला (बदल सेव्ह करण्यासाठी खालील सेव्ह बटण दाबा)', 'success');
  };

  // Handle Swap / Replace Question
  const handleSwapQuestion = (oldId: string, newId: string) => {
    setWorkingQIds(prev => prev.map(id => id === oldId ? newId : id));
    setSwappingQuestionId(null);
    showToast('प्रश्न यशस्वीपणे बदलला!', 'success');
  };

  // Handle Add Selected Questions from Drawer
  const handleConfirmAddQuestions = () => {
    if (selectedToAddQIds.length === 0) {
      showToast('कृपया जोडण्यासाठी किमान १ प्रश्न निवडा', 'error');
      return;
    }
    const newUnique = selectedToAddQIds.filter(id => !workingQIds.includes(id));
    setWorkingQIds(prev => [...prev, ...newUnique]);
    setSelectedToAddQIds([]);
    setShowAddDrawer(false);
    showToast(`${newUnique.length} नवीन प्रश्न चाचणीत जोडले!`, 'success');
  };

  // Re-shuffle random questions for this test
  const handleReshuffleRandom = () => {
    if (!window.confirm(`तुम्हाला खरोखर या चाचणीतील सर्व ${workingQIds.length} प्रश्न नव्याने रँडम रि-शफल करायचे आहेत का?`)) return;
    const count = workingQIds.length || 50;
    const shuffled = [...loadedQuestions].sort(() => 0.5 - Math.random());
    const newIds = shuffled.slice(0, count).map(q => q.id);
    setWorkingQIds(newIds);
    showToast('नवीन रँडम प्रश्न निवडले गेले! कृपया खालील "बदल सेव्ह करा" बटण दाबा.', 'success');
  };

  // Print Question Paper Function
  const handlePrintPaper = () => {
    setShowDownloadModal(true);
  };

  // Save changes to backend
  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      const isMah = test.exam_name.includes('Maharashtra');
      const updatedTotalMarks = workingQIds.length * (isMah ? 2 : 1);
      
      const updatedTest: MockTest = {
        ...test,
        question_ids: workingQIds,
        total_marks: updatedTotalMarks
      };

      await onSaveUpdatedTest(updatedTest, workingQIds);
      showToast('चाचणीतील सर्व प्रश्न व बदल यशस्वीपणे सेव्ह झाले!', 'success');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Replacement candidate questions
  const swappingCurrentQ = swappingQuestionId ? questionMap.get(swappingQuestionId) : null;
  const replacementCandidates = useMemo(() => {
    if (!swappingQuestionId) return [];
    return loadedQuestions
      .filter(q => !workingQIds.includes(q.id))
      .filter(q => {
        if (swappingCurrentQ?.subject_id) {
          return q.subject_id === swappingCurrentQ.subject_id;
        }
        return true;
      })
      .slice(0, 40);
  }, [loadedQuestions, workingQIds, swappingQuestionId, swappingCurrentQ]);

  // Add Drawer candidate questions
  const addCandidates = useMemo(() => {
    return loadedQuestions
      .filter(q => !workingQIds.includes(q.id))
      .filter(q => {
        if (addDrawerSubjectId !== 'all' && q.subject_id !== addDrawerSubjectId) return false;
        if (addDrawerSearch.trim()) {
          const s = addDrawerSearch.toLowerCase();
          const matchEn = q.question_en?.toLowerCase().includes(s);
          const matchMr = q.question_mr?.toLowerCase().includes(s);
          return matchEn || matchMr;
        }
        return true;
      });
  }, [loadedQuestions, workingQIds, addDrawerSubjectId, addDrawerSearch]);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[95vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 shrink-0 relative">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-400 text-slate-950 uppercase tracking-wider">
                  ADMIN TEST INSPECTOR
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-200">
                  {test.exam_name}
                </span>
                {test.is_active !== false ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    🟢 चाचणी चालू (Active)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    🔴 चाचणी बंद (Inactive)
                  </span>
                )}
              </div>

              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-teal-400" />
                <span>{test.title_mr || test.title_en}</span>
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                {test.title_en} • एकूण प्रश्न: <strong className="text-teal-300 font-bold">{workingQIds.length} MCQs</strong> • वेळ: <strong className="text-teal-300">{test.duration_minutes} Mins</strong> • एकूण गुण: <strong className="text-teal-300">{workingQIds.length * (test.exam_name.includes('Maharashtra') ? 2 : 1)} Marks</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrintPaper}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="प्रिंट किंवा पीडीएफ पहा (Print Paper)"
              >
                <Printer className="w-3.5 h-3.5 text-teal-300" />
                <span className="hidden sm:inline">प्रिंट / PDF</span>
              </button>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                title="बंद करा (Close)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* VIEW MODE TOGGLE & SUMMARY */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            {/* View Modes Switcher */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('detailed')}
                className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'detailed'
                    ? 'bg-teal-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>१. सविस्तर प्रश्न व उत्तरे (Cards)</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('paper')}
                className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'paper'
                    ? 'bg-teal-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>२. परीक्षा पेपर दृश्य (Student CBT)</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-teal-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>३. संक्षिप्त यादी (Table)</span>
              </button>
            </div>

            {/* Quick Summary Pill */}
            <div className="text-xs text-slate-300 font-semibold flex items-center gap-2">
              <span className="bg-teal-500/20 text-teal-300 px-2.5 py-1 rounded-lg border border-teal-500/30">
                उपलब्ध प्रश्न: <strong>{currentTestQuestions.length}</strong>
              </span>
            </div>
          </div>

          {/* SUBJECT WISE DISTRIBUTION BADGES */}
          <div className="mt-3 pt-2 border-t border-white/5 flex flex-wrap items-center gap-1.5 overflow-x-auto max-h-16 py-1 scrollbar-thin">
            <span className="text-[11px] font-bold text-teal-300 flex items-center gap-1 mr-1 shrink-0">
              <Layers className="w-3 h-3" />
              <span>विषयानुसार वर्गीकरण:</span>
            </span>
            {subjectDistribution.map(([subId, data]) => (
              <button
                key={subId}
                type="button"
                onClick={() => setFilterSubjectId(filterSubjectId === subId ? 'all' : subId)}
                className={`px-2.5 py-0.5 rounded-xl text-[10px] font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  filterSubjectId === subId
                    ? 'bg-teal-400 text-slate-950 ring-2 ring-teal-200'
                    : 'bg-slate-800/90 text-slate-200 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <span>{data.name_mr || data.name_en}</span>
                <span className="px-1.5 py-0.2 bg-black/30 rounded-md font-mono text-[9.5px]">
                  {data.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH, FILTER & ACTION BUTTONS */}
        <div className="bg-slate-100 p-3.5 border-b border-slate-200 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {/* Search & Subject Filters */}
          <div className="flex flex-wrap items-center gap-2 grow">
            <div className="relative min-w-[200px] grow sm:grow-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="या टेस्ट मधील प्रश्न शोधा..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 font-bold text-[11px]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Subject dropdown */}
            <select
              value={filterSubjectId}
              onChange={e => setFilterSubjectId(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 max-w-[160px] truncate"
            >
              <option value="all">सर्व विषय ({currentTestQuestions.length})</option>
              {subjects.map(s => {
                const c = subjectDistribution.find(([id]) => id === s.id)?.[1]?.count || 0;
                if (c === 0) return null;
                return (
                  <option key={s.id} value={s.id}>
                    {s.name_mr || s.name_en} ({c})
                  </option>
                );
              })}
            </select>

            {/* Difficulty dropdown */}
            <select
              value={filterDifficulty}
              onChange={e => setFilterDifficulty(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-700"
            >
              <option value="all">सर्व काठिण्य पातळी</option>
              <option value="easy">Easy (सोपे)</option>
              <option value="medium">Medium (मध्यम)</option>
              <option value="hard">Hard (कठीण)</option>
            </select>

            {/* Type dropdown */}
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-700"
            >
              <option value="all">सर्व प्रकार</option>
              <option value="pyq">🏆 PYQs Only</option>
              <option value="image">🖼️ Image Questions</option>
              <option value="clinical">🩺 Clinical Scenarios</option>
            </select>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowAddDrawer(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>आणखी प्रश्न जोडा</span>
            </button>

            <button
              type="button"
              onClick={handleReshuffleRandom}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              title="सर्व प्रश्न रँडम रि-शफल करा"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
              <span>रि-शफल (Re-roll)</span>
            </button>
          </div>
        </div>

        {/* QUESTIONS CONTAINER (SCROLLABLE) */}
        <div className="grow overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/60">
          {loadingQuestions ? (
            <div className="text-center py-16 text-slate-500 space-y-3">
              <Loader2 className="w-10 h-10 animate-spin mx-auto text-teal-600" />
              <p className="font-bold text-slate-700 text-sm">सर्व प्रश्न डेटा लोड होत आहे...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-3">
              <HelpCircle className="w-12 h-12 mx-auto opacity-40 text-slate-400" />
              <p className="font-bold text-slate-600 text-sm">या फिल्टरनुसार कोणतेही प्रश्न सापडले नाहीत.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterSubjectId('all');
                  setFilterDifficulty('all');
                  setFilterType('all');
                }}
                className="px-4 py-1.5 bg-slate-200 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-300 cursor-pointer"
              >
                सर्व फिल्टर्स रीसेट करा
              </button>
            </div>
          ) : viewMode === 'detailed' ? (
            /* 1. DETAILED CARD VIEW */
            filteredQuestions.map((q, index) => {
              const originalIndex = currentTestQuestions.findIndex(item => item.id === q.id);
              const qNumber = originalIndex !== -1 ? originalIndex + 1 : index + 1;
              const sub = subjectMap.get(q.subject_id);

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs hover:shadow-xs transition space-y-3 relative group"
                >
                  {/* QUESTION TOP BAR */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shadow-2xs">
                        Q.{qNumber}
                      </span>

                      <span className="px-2.5 py-0.5 rounded-lg text-[10.5px] font-bold bg-teal-50 text-teal-900 border border-teal-200">
                        {sub?.name_mr || sub?.name_en || 'Nursing Subject'}
                      </span>

                      {q.difficulty && (
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          q.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-800' :
                          q.difficulty === 'hard' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {q.difficulty}
                        </span>
                      )}

                      {q.is_verified_pyq && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-700" />
                          <span>PYQ ({q.exam_name || 'Govt Exam'})</span>
                        </span>
                      )}

                      {q.image_url && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">
                          🖼️ इमेज प्रश्न
                        </span>
                      )}
                    </div>

                    {/* Question Action Buttons: Replace & Remove */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSwappingQuestionId(q.id)}
                        className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 rounded-lg transition flex items-center gap-1 border border-slate-200 cursor-pointer"
                        title="हा प्रश्न दुसऱ्या प्रश्नाने बदला (Replace)"
                      >
                        <RefreshCw className="w-3 h-3 text-teal-600" />
                        <span>बदला</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(q.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition border border-transparent hover:border-rose-200 cursor-pointer"
                        title="हा प्रश्न या टेस्ट मधून काढून टाका (Remove)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* QUESTION TEXT (MARATHI & ENGLISH) */}
                  <div className="space-y-1 pt-1">
                    {q.question_mr && (
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                        {q.question_mr}
                      </h4>
                    )}
                    {q.question_en && (
                      <p className="text-xs text-slate-600 font-medium">
                        {q.question_en}
                      </p>
                    )}
                  </div>

                  {/* CLINICAL IMAGE PREVIEW IF ANY */}
                  {q.image_url && (
                    <div className="pt-2">
                      <img
                        src={q.image_url}
                        alt="Question Reference"
                        className="max-h-48 rounded-xl border border-slate-200 object-contain bg-slate-100"
                      />
                    </div>
                  )}

                  {/* OPTIONS LIST (HIGHLIGHTING CORRECT ANSWER IN GREEN) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    {(['A', 'B', 'C', 'D'] as const).map(optKey => {
                      const isCorrect = q.correct_option === optKey;
                      const textMr = (q as any)[`option_${optKey.toLowerCase()}_mr`];
                      const textEn = (q as any)[`option_${optKey.toLowerCase()}_en`];
                      const displayText = textMr || textEn || `Option ${optKey}`;

                      return (
                        <div
                          key={optKey}
                          className={`p-2.5 rounded-xl border flex items-start gap-2 transition ${
                            isCorrect
                              ? 'bg-emerald-50/95 border-emerald-400 ring-2 ring-emerald-300 text-emerald-950 font-bold shadow-2xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {optKey}
                          </span>
                          <div className="grow">
                            <span>{displayText}</span>
                            {textEn && textMr && textEn !== textMr && (
                              <span className="block text-[10.5px] text-slate-500 font-normal mt-0.5">
                                {textEn}
                              </span>
                            )}
                          </div>
                          {isCorrect && (
                            <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[9.5px] font-black shrink-0 flex items-center gap-0.5">
                              <Check className="w-3 h-3" />
                              <span>अचूक उत्तर (Answer)</span>
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* EXPLANATION / RATIONALE */}
                  {(q.explanation_mr || q.explanation_en) && (
                    <div className="bg-amber-50/75 p-3 rounded-xl border border-amber-200/90 text-[11.5px] space-y-1">
                      <div className="font-bold text-amber-900 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>सविस्तर मराठी स्पष्टीकरण (Rationale):</span>
                      </div>
                      <p className="text-amber-950 font-medium leading-relaxed">
                        {q.explanation_mr || q.explanation_en}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : viewMode === 'paper' ? (
            /* 2. REALISTIC STUDENT EXAM PAPER VIEW */
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-xs">
              <div className="text-center pb-6 border-b border-slate-200 space-y-1">
                <h2 className="text-xl font-black text-slate-900">{test.title_mr || test.title_en}</h2>
                <p className="text-sm font-bold text-teal-800">{test.exam_name} • अधिकृत मॉक टेस्ट पेपर</p>
                <div className="flex justify-center gap-6 text-xs text-slate-500 pt-2 font-semibold">
                  <span>एकूण प्रश्न: <strong>{workingQIds.length}</strong></span>
                  <span>वेळ: <strong>{test.duration_minutes} मिनिटे</strong></span>
                  <span>एकूण गुण: <strong>{workingQIds.length * (test.exam_name.includes('Maharashtra') ? 2 : 1)}</strong></span>
                </div>
              </div>

              <div className="space-y-6">
                {filteredQuestions.map((q, index) => {
                  const originalIndex = currentTestQuestions.findIndex(item => item.id === q.id);
                  const qNumber = originalIndex !== -1 ? originalIndex + 1 : index + 1;
                  const sub = subjectMap.get(q.subject_id);

                  return (
                    <div key={q.id} className="pb-6 border-b border-slate-100 space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="font-black text-slate-900 text-sm sm:text-base shrink-0">
                          {qNumber}.
                        </span>
                        <div className="grow space-y-1">
                          <div className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                            {q.question_mr || q.question_en}
                          </div>
                          {q.question_mr && q.question_en && (
                            <div className="text-xs text-slate-600">
                              {q.question_en}
                            </div>
                          )}
                          <div className="flex items-center gap-2 pt-1 text-[10px]">
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-bold">
                              {sub?.name_mr || sub?.name_en || 'Nursing'}
                            </span>
                            {q.difficulty && (
                              <span className="text-slate-500 capitalize">काठिण्य: {q.difficulty}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {q.image_url && (
                        <div className="pl-6 pt-1">
                          <img src={q.image_url} alt="Question" className="max-h-40 rounded-lg border border-slate-200" />
                        </div>
                      )}

                      {/* Paper Options (A, B, C, D) */}
                      <div className="pl-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {(['A', 'B', 'C', 'D'] as const).map(optKey => {
                          const isCorrect = q.correct_option === optKey;
                          const textMr = (q as any)[`option_${optKey.toLowerCase()}_mr`];
                          const textEn = (q as any)[`option_${optKey.toLowerCase()}_en`];
                          const displayText = textMr || textEn || `Option ${optKey}`;

                          return (
                            <div
                              key={optKey}
                              className={`p-2 rounded-lg border flex items-center gap-2 ${
                                isCorrect
                                  ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-950'
                                  : 'border-slate-200 text-slate-700'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                              }`}>
                                {optKey}
                              </span>
                              <span className="grow">{displayText}</span>
                              {isCorrect && (
                                <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-black shrink-0">
                                  ✓ बरोबर उत्तर
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Rationale in Paper View */}
                      {(q.explanation_mr || q.explanation_en) && (
                        <div className="pl-6 pt-1 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                          <strong className="text-slate-800">स्पष्टीकरण:</strong> {q.explanation_mr || q.explanation_en}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* 3. COMPACT SUMMARY TABLE VIEW */
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10.5px] border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-12 text-center">क्र.</th>
                    <th className="p-3 w-40">विषय (Subject)</th>
                    <th className="p-3">प्रश्न मजकूर (Question Text)</th>
                    <th className="p-3 w-28 text-center">बरोबर उत्तर</th>
                    <th className="p-3 w-24 text-center">काठिण्य</th>
                    <th className="p-3 w-28 text-right">क्रिया</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredQuestions.map((q, index) => {
                    const originalIndex = currentTestQuestions.findIndex(item => item.id === q.id);
                    const qNumber = originalIndex !== -1 ? originalIndex + 1 : index + 1;
                    const sub = subjectMap.get(q.subject_id);

                    return (
                      <tr key={q.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-center text-slate-900 bg-slate-50/50">
                          {qNumber}
                        </td>
                        <td className="p-3 font-bold text-teal-900">
                          <span className="px-2 py-0.5 bg-teal-50 border border-teal-200 rounded-md block truncate">
                            {sub?.name_mr || sub?.name_en || 'Nursing'}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900 line-clamp-1">{q.question_mr || q.question_en}</div>
                          {q.question_mr && q.question_en && (
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{q.question_en}</div>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-black rounded-lg border border-emerald-300">
                            Option {q.correct_option}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            q.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-800' :
                            q.difficulty === 'hard' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {q.difficulty}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setSwappingQuestionId(q.id)}
                              className="p-1.5 text-teal-700 hover:bg-teal-50 rounded-lg transition"
                              title="बदला (Swap)"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveQuestion(q.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="काढून टाका (Remove)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL FOOTER WITH SAVE STATUS */}
        <div className="bg-white p-4 border-t border-slate-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="text-xs text-slate-600 flex items-center gap-2">
            {hasUnsavedChanges ? (
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-bold rounded-lg flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                <span>असेव्ह केलेले बदल आहेत! (Unsaved Changes)</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-bold rounded-lg flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>सर्व प्रश्न सेव्ह आहेत.</span>
              </span>
            )}
            <span className="font-semibold text-slate-500">
              एकूण {workingQIds.length} प्रश्न चाचणीत समाविष्ट आहेत.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer grow sm:grow-0"
            >
              रद्द करा (Close)
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving}
              className="px-6 py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-300 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer grow sm:grow-0"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>सेव्ह होत आहे...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>💾 बदल सेव्ह करा (Save Test Paper)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SWAP QUESTION MODAL (REPLACE WITH ANOTHER QUESTION) */}
      {swappingQuestionId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-60 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">पर्यायी प्रश्न निवडा (Replace Question)</h4>
                <p className="text-[11px] text-slate-300">
                  याच विषयातील उपलब्ध प्रश्नांपैकी एक प्रश्न निवडा.
                </p>
              </div>
              <button
                onClick={() => setSwappingQuestionId(null)}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grow overflow-y-auto p-4 space-y-2.5">
              {replacementCandidates.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold">या विषयातील इतर पर्यायी प्रश्न प्रश्नसंचात शिल्लक नाहीत.</p>
                </div>
              ) : (
                replacementCandidates.map(cand => (
                  <div
                    key={cand.id}
                    className="p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/30 transition flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 grow">
                      <div className="font-bold text-slate-900">{cand.question_mr || cand.question_en}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{cand.question_en}</div>
                      <div className="text-[10px] text-teal-800 font-bold">
                        बरोबर उत्तर: Option {cand.correct_option}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSwapQuestion(swappingQuestionId, cand.id)}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-[11px] shrink-0 cursor-pointer shadow-2xs"
                    >
                      हा प्रश्न घ्या (Select)
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD QUESTIONS DRAWER MODAL */}
      {showAddDrawer && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-60 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">प्रश्नसंचातून नवीन प्रश्न जोडा (Add Questions from Bank)</h4>
                <p className="text-[11px] text-slate-300">
                  विषय निवडून हवे ते प्रश्न चाचणीत समाविष्ट करा.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddDrawer(false);
                  setSelectedToAddQIds([]);
                }}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Bar in Add Drawer */}
            <div className="p-3 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs">
              <input
                type="text"
                placeholder="प्रश्न शोधा..."
                value={addDrawerSearch}
                onChange={e => setAddDrawerSearch(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl grow font-medium"
              />
              <select
                value={addDrawerSubjectId}
                onChange={e => setAddDrawerSubjectId(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold max-w-[200px]"
              >
                <option value="all">सर्व विषय</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name_mr || s.name_en}</option>
                ))}
              </select>
            </div>

            {/* Candidate List */}
            <div className="grow overflow-y-auto p-4 space-y-2">
              {addCandidates.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="font-bold text-xs">जोडण्यासाठी नवीन प्रश्न उपलब्ध नाहीत.</p>
                </div>
              ) : (
                addCandidates.map(cand => {
                  const isChecked = selectedToAddQIds.includes(cand.id);
                  const sub = subjectMap.get(cand.subject_id);

                  return (
                    <label
                      key={cand.id}
                      className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition text-xs ${
                        isChecked ? 'bg-teal-50 border-teal-400 ring-1 ring-teal-300' : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedToAddQIds(prev => [...prev, cand.id]);
                          } else {
                            setSelectedToAddQIds(prev => prev.filter(id => id !== cand.id));
                          }
                        }}
                        className="mt-1 rounded text-teal-600 focus:ring-teal-500"
                      />
                      <div className="grow space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {sub?.name_mr || sub?.name_en || 'Nursing'}
                          </span>
                          <span className="text-[10px] text-slate-400">ID: {cand.id}</span>
                        </div>
                        <div className="font-bold text-slate-900">{cand.question_mr || cand.question_en}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{cand.question_en}</div>
                      </div>
                    </label>
                  );
                })
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">
                {selectedToAddQIds.length} प्रश्न निवडले आहेत
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddDrawer(false);
                    setSelectedToAddQIds([]);
                  }}
                  className="px-3 py-1.5 bg-slate-200 text-slate-800 font-bold rounded-xl"
                >
                  रद्द करा
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAddQuestions}
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-black rounded-xl shadow-xs"
                >
                  निवडलेले प्रश्न जोडा (+ {selectedToAddQIds.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Bilingual Paper & Explanation Download Modal */}
      {showDownloadModal && (
        <AdminMockTestDownloadModal
          test={{
            ...test,
            question_ids: workingQIds
          }}
          questions={loadedQuestions}
          isOpen={showDownloadModal}
          onClose={() => setShowDownloadModal(false)}
        />
      )}
    </div>
  );
};
