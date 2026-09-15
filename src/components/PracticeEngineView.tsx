import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Question, Subject, Topic } from '../types';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Bookmark,
  Flag,
  Sparkles,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Hash,
  RotateCcw,
  SlidersHorizontal,
  ZoomIn,
  ChevronDown,
  ChevronUp,
  Layers,
  GraduationCap,
  BookOpen,
  Lock,
  Crown,
  UserPlus,
  Languages,
  Loader2
} from 'lucide-react';

interface PracticeEngineViewProps {
  initialSubjectId?: string;
  onAskAiCoach?: (doubt: string, context: string) => void;
  onBack?: () => void;
  openLoginModal?: (tab: 'member' | 'admin', registerMode?: boolean) => void;
  onNavigateToUpgradePro?: () => void;
}

export const PracticeEngineView: React.FC<PracticeEngineViewProps> = ({
  initialSubjectId,
  onAskAiCoach,
  onBack,
  openLoginModal,
  onNavigateToUpgradePro
}) => {
  const { language } = useLanguage();
  const { currentUser } = useAuth();

  // Filter States
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubjectId || 'all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [pyqOnly, setPyqOnly] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);
  const [mode, setMode] = useState<'instant_feedback' | 'exam_mode'>('instant_feedback');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Question & Navigation State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [showMarathiExplanation, setShowMarathiExplanation] = useState(false);
  const [showEnglishExplanation, setShowEnglishExplanation] = useState(false);
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(false);
  const [explanationDrawerOpen, setExplanationDrawerOpen] = useState(false);
  const [displayLang, setDisplayLang] = useState<'dual' | 'mr' | 'en'>('dual');
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Limit & Paywall Modals
  const [showGuestLimitModal, setShowGuestLimitModal] = useState(false);
  const [showProUpgradeLimitModal, setShowProUpgradeLimitModal] = useState(false);

  // Modals
  const [showJumpModal, setShowJumpModal] = useState(false);
  const [jumpInput, setJumpInput] = useState('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Report issue modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('wrong_answer');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  // On-demand AI Marathi translation state
  const [isTranslatingCurrentQ, setIsTranslatingCurrentQ] = useState(false);
  const [translationNotice, setTranslationNotice] = useState<string | null>(null);

  const explanationRef = useRef<HTMLDivElement>(null);

  // Plan & Limit Calculations according to user rules:
  // 1. All Chapters ("सर्व प्रकरणे एकत्र"):
  //    - Guest (!currentUser): 5 free MCQs
  //    - Free Logged-In User (currentUser && !isPro): 10 free MCQs (5 more)
  //    - PRO: Unlimited
  // 2. Subject-wise ("सेपरेट विषयानुसार"):
  //    - Guest (!currentUser): 2 free MCQs per subject
  //    - Free Logged-In User (currentUser && !isPro): 4 free MCQs per subject (2 more)
  //    - PRO: Unlimited
  const isPro = currentUser?.role === 'pro_member' || currentUser?.role === 'admin' || currentUser?.role === 'super_admin' || Boolean(currentUser?.hasMcqAccess) || Boolean((currentUser as any)?.isProMember) || Boolean((currentUser as any)?.hasActiveSubscription);

  const isAllChapters = selectedSubject === 'all' || !selectedSubject;
  const guestLimit = isAllChapters ? 5 : 2;
  const freeUserLimit = isAllChapters ? 10 : 4;
  const currentLimit = isPro ? Infinity : (!currentUser ? guestLimit : freeUserLimit);
  const isGated = !isPro && currentIndex >= currentLimit;

  useEffect(() => {
    loadSubjectsAndBookmarks();
  }, []);

  useEffect(() => {
    if (initialSubjectId && initialSubjectId !== selectedSubject) {
      setSelectedSubject(initialSubjectId);
      setSelectedTopic('all');
      setSelectedDifficulty('all');
      setPyqOnly(false);
      setFreeOnly(false);
    }
  }, [initialSubjectId]);

  useEffect(() => {
    loadTopics();
  }, [selectedSubject]);

  useEffect(() => {
    loadQuestions();
  }, [selectedSubject, selectedTopic, selectedDifficulty, pyqOnly, freeOnly]);

  const loadSubjectsAndBookmarks = async () => {
    try {
      const [subs, bms] = await Promise.all([
        api.getSubjects(),
        api.getBookmarks()
      ]);
      setSubjects(subs);
      const bMap: Record<string, boolean> = {};
      bms.forEach(b => { bMap[b.question_id] = true; });
      setBookmarkedMap(bMap);
    } catch (err) {
      console.error('Failed to load subjects or bookmarks', err);
    }
  };

  const loadTopics = async () => {
    try {
      const topList = await api.getTopics({
        subject_id: selectedSubject !== 'all' ? selectedSubject : undefined
      });
      setTopics(topList);
      setSelectedTopic('all');
    } catch (err) {
      console.error('Failed to load topics', err);
    }
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const data = await api.getQuestions({
        subject_id: selectedSubject !== 'all' ? selectedSubject : undefined,
        topic_id: selectedTopic !== 'all' ? selectedTopic : undefined,
        difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
        is_verified_pyq: pyqOnly ? true : undefined,
        is_free: freeOnly ? true : undefined,
        status: 'published'
      });
      setQuestions(data);
      setCurrentIndex(0);
      setUserAnswers({});
      setShowMarathiExplanation(false);
      setShowEnglishExplanation(false);
      setIsExplanationExpanded(false);
    } catch (err: any) {
      console.error('Failed to load questions', err);
      setLoadError(
        err?.message ||
        (language === 'mr'
          ? 'प्रश्नांचा डेटा लोड करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.'
          : 'Questions could not be loaded. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  const validQuestions = useMemo(() => (questions || []).filter(q => Boolean(q && q.id)), [questions]);
  const safeIndex = validQuestions.length > 0 ? Math.max(0, Math.min(currentIndex, validQuestions.length - 1)) : 0;
  const currentQ = validQuestions.length > 0 ? validQuestions[safeIndex] : undefined;
  const currentSubjectObj = (subjects || []).find(s => s?.id === (currentQ?.subject_id || selectedSubject));
  const progressPct = validQuestions.length > 0 ? Math.round(((safeIndex + 1) / validQuestions.length) * 100) : 0;
  const isAnswered = currentQ?.id ? !!userAnswers[currentQ.id] : false;
  const selectedOpt = currentQ?.id ? userAnswers[currentQ.id] : null;

  const handleSelectOption = useCallback(async (option: 'A' | 'B' | 'C' | 'D') => {
    if (!currentQ || !currentQ.id) return;
    if (userAnswers[currentQ.id] && mode === 'instant_feedback') return;

    setUserAnswers(prev => ({ ...prev, [currentQ.id]: option }));
    if (mode === 'instant_feedback') {
      setShowMarathiExplanation(false);
      setShowEnglishExplanation(false);
      setIsExplanationExpanded(false);
      const isCorrect = option === currentQ.correct_option;
      if (!isCorrect && currentUser) {
        await api.updateMistakeMastery(currentQ.id, false);
      }
      setTimeout(() => {
        explanationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 120);
    }
  }, [currentQ, userAnswers, mode, currentUser]);

  const toggleBookmark = async () => {
    if (!currentQ || !currentQ.id) return;
    try {
      const res = await api.toggleBookmark(currentQ.id);
      setBookmarkedMap(prev => ({ ...prev, [currentQ.id]: res.isBookmarked }));
    } catch (err) {
      console.error('Bookmark toggle failed', err);
    }
  };

  const handleTranslateCurrentQuestion = async () => {
    if (!currentQ || !currentQ.id || isTranslatingCurrentQ) return;
    setIsTranslatingCurrentQ(true);
    setTranslationNotice(null);
    try {
      const res = await api.translateQuestion({
        question_id: currentQ.id,
        question_en: currentQ.question_en,
        option_a_en: currentQ.option_a_en,
        option_b_en: currentQ.option_b_en,
        option_c_en: currentQ.option_c_en,
        option_d_en: currentQ.option_d_en,
        explanation_en: currentQ.explanation_en
      });
      if (res?.translation) {
        setQuestions(prev => (prev || []).map(q => {
          if (q?.id === currentQ.id) {
            return {
              ...q,
              question_mr: res.translation.question_mr,
              option_a_mr: res.translation.option_a_mr,
              option_b_mr: res.translation.option_b_mr,
              option_c_mr: res.translation.option_c_mr,
              option_d_mr: res.translation.option_d_mr,
              explanation_mr: res.translation.explanation_mr
            };
          }
          return q;
        }));
        setTranslationNotice('✨ मराठी भाषांतर यशस्वीरित्या जोडले गेले!');
        setTimeout(() => setTranslationNotice(null), 4000);
      }
    } catch (err) {
      console.error('Translation failed', err);
      setTranslationNotice('भाषांतर करताना समस्या आली. कृपया पुन्हा प्रयत्न करा.');
      setTimeout(() => setTranslationNotice(null), 4000);
    } finally {
      setIsTranslatingCurrentQ(false);
    }
  };

  const handleNext = () => {
    const nextIdx = currentIndex + 1;
    if (!isPro && nextIdx >= currentLimit) {
      if (!currentUser) {
        setShowGuestLimitModal(true);
      } else {
        setShowProUpgradeLimitModal(true);
      }
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(nextIdx);
      setShowMarathiExplanation(false);
      setShowEnglishExplanation(false);
      setIsExplanationExpanded(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setShowMarathiExplanation(false);
      setShowEnglishExplanation(false);
      setIsExplanationExpanded(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToQuestion = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const num = parseInt(jumpInput, 10);
    if (!isNaN(num) && num >= 1 && num <= questions.length) {
      const targetIdx = num - 1;
      if (!isPro && targetIdx >= currentLimit) {
        setShowJumpModal(false);
        setJumpInput('');
        if (!currentUser) {
          setShowGuestLimitModal(true);
        } else {
          setShowProUpgradeLimitModal(true);
        }
        return;
      }
      setCurrentIndex(targetIdx);
      setShowMarathiExplanation(false);
      setShowEnglishExplanation(false);
      setIsExplanationExpanded(false);
      setJumpInput('');
      setShowJumpModal(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitReport = async () => {
    if (!currentQ || !currentQ.id) return;
    try {
      await api.reportQuestion({
        question_id: currentQ.id,
        reason: reportReason,
        details: reportDetails
      });
      setReportSuccess(true);
      setTimeout(() => {
        setReportSuccess(false);
        setReportModalOpen(false);
        setReportDetails('');
      }, 1500);
    } catch (err) {
      console.error('Failed to report question', err);
    }
  };

  // Keyboard Navigation for Power Users / Desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;
      if (e.key === 'ArrowRight' || e.key === 'n') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'p') {
        handlePrev();
      } else if (['1', 'a', 'A'].includes(e.key)) {
        handleSelectOption('A');
      } else if (['2', 'b', 'B'].includes(e.key)) {
        handleSelectOption('B');
      } else if (['3', 'c', 'C'].includes(e.key)) {
        handleSelectOption('C');
      } else if (['4', 'd', 'D'].includes(e.key)) {
        handleSelectOption('D');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, questions.length, handleSelectOption]);

  const subjectDisplayName = currentSubjectObj
    ? language === 'mr' ? currentSubjectObj.name_mr : currentSubjectObj.name_en
    : language === 'mr' ? 'सर्व प्रकरणे (All Chapters)' : 'All Chapters';

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-3 pt-1 sm:pt-1.5 pb-16 sm:pb-20 space-y-1.5 antialiased">
      {/* 1. COMPACT QUESTION HEADER (Zero wasted vertical space) */}
      <div className="bg-white rounded-xl border border-slate-200/90 px-2.5 py-1.5 shadow-2xs">
        <div className="flex items-center justify-between gap-1.5">
          {/* Left: Back button & Subject Badge */}
          <div className="flex items-center gap-1 min-w-0">
            <button
              onClick={() => (onBack ? onBack() : setSelectedSubject('all'))}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition shrink-0 cursor-pointer"
              title="Back to Chapters"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>

            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-black text-slate-800 truncate leading-tight">
                {subjectDisplayName}
              </span>
              {currentQ?.topic_id && (
                <span className="text-[9px] text-slate-400 truncate leading-none">
                  {currentQ.topic_id}
                </span>
              )}
            </div>
          </div>

          {/* Right: Question Number Badge, Bookmark, Report, Filter Trigger */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Question Counter Pill (Tap to Jump) */}
            {questions.length > 0 && (
              <button
                onClick={() => setShowJumpModal(true)}
                className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-[10px] sm:text-[11px] border border-blue-200 transition cursor-pointer"
                title="प्रश्न क्रमांकावर जा (Jump to Question #)"
              >
                <span>Q {currentIndex + 1}/{questions.length}</span>
              </button>
            )}

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`p-1 rounded-full border transition cursor-pointer ${
                showFilterDrawer || selectedDifficulty !== 'all' || pyqOnly
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
              title="Filters & Mode"
            >
              <SlidersHorizontal className="w-3 h-3" />
            </button>

            {/* Bookmark */}
            {Boolean(currentQ?.id) && (
              <button
                onClick={toggleBookmark}
                className={`p-1 rounded-full border transition cursor-pointer ${
                  bookmarkedMap[currentQ!.id]
                    ? 'bg-amber-50 border-amber-300 text-amber-600'
                    : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
                }`}
                title="Bookmark Question"
              >
                <Bookmark
                  className="w-3 h-3"
                  fill={bookmarkedMap[currentQ!.id] ? 'currentColor' : 'none'}
                />
              </button>
            )}

            {/* Report */}
            {Boolean(currentQ?.id) && (
              <button
                onClick={() => setReportModalOpen(true)}
                className="p-1 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition cursor-pointer"
                title="Report Issue"
              >
                <Flag className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Sleek Progress Indicator */}
        {questions.length > 0 && (
          <div className="w-full bg-slate-100 h-0.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
      </div>

      {/* COMPACT FILTER DRAWER / SETTINGS (Expandable when user wants to filter) */}
      {showFilterDrawer && (
        <div className="bg-white rounded-xl border border-slate-200 p-2.5 space-y-2 shadow-xs animate-in fade-in zoom-in-95 duration-150 text-xs">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <span className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px]">
              <SlidersHorizontal className="w-3 h-3 text-blue-600" />
              <span>Practice Filters & Settings</span>
            </span>
            <button
              onClick={() => setShowFilterDrawer(false)}
              className="text-slate-400 hover:text-slate-600 font-bold text-xs"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Mode Switch */}
            <div>
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                Mode
              </label>
              <div className="flex bg-slate-100 p-0.5 rounded-lg">
                <button
                  onClick={() => setMode('instant_feedback')}
                  className={`flex-1 py-0.5 rounded-md text-[10px] font-bold transition ${
                    mode === 'instant_feedback' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Instant
                </button>
                <button
                  onClick={() => setMode('exam_mode')}
                  className={`flex-1 py-0.5 rounded-md text-[10px] font-bold transition ${
                    mode === 'exam_mode' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Exam
                </button>
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value)}
                className="w-full p-1 rounded-lg border border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-800"
              >
                <option value="all">All Levels</option>
                <option value="easy">Easy (सोपे)</option>
                <option value="medium">Medium (मध्यम)</option>
                <option value="hard">Hard (कठीण)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
            <button
              onClick={() => setPyqOnly(!pyqOnly)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition ${
                pyqOnly ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              ★ PYQ Verified
            </button>
            <button
              onClick={() => setFreeOnly(!freeOnly)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition ${
                freeOnly ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              Free MCQs
            </button>
          </div>
        </div>
      )}

      {/* 2. MAIN QUESTION CARD (Mobile-First Single-Screen No-Scroll Design) */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 text-center space-y-2 shadow-2xs">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">
            {language === 'mr' ? 'प्रश्न लोड होत आहेत...' : 'Loading questions...'}
          </p>
        </div>
      ) : loadError ? (
        <div className="bg-white p-6 rounded-xl border border-rose-200 text-center space-y-2.5 shadow-2xs">
          <AlertCircle className="w-6 h-6 text-rose-500 mx-auto" />
          <h3 className="text-xs font-bold text-rose-900">
            {language === 'mr' ? 'प्रश्नांचा डेटा लोड करताना त्रुटी आली' : 'Failed to Load Questions'}
          </h3>
          <p className="text-[11px] text-rose-600">{loadError}</p>
          <button
            onClick={() => loadQuestions()}
            className="px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition cursor-pointer"
          >
            {language === 'mr' ? 'पुन्हा प्रयत्न करा' : 'Retry'}
          </button>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center space-y-2.5 shadow-2xs">
          <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
          <h3 className="text-xs font-bold text-slate-900">
            {language === 'mr' ? 'कोणतेही प्रश्न उपलब्ध नाहीत' : 'No questions available.'}
          </h3>
          <p className="text-[11px] text-slate-500">
            {language === 'mr' ? 'निवडलेल्या फिल्टरनुसार प्रश्न सापडले नाहीत.' : 'No questions matched the active filters.'}
          </p>
          <button
            onClick={() => { setSelectedSubject('all'); setSelectedDifficulty('all'); setPyqOnly(false); setFreeOnly(false); }}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition"
          >
            {language === 'mr' ? 'सर्व प्रश्न रीसेट करा' : 'Reset All Filters'}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* TOP QUICK-ACTION NAVIGATION (Requested: Next question button directly on top!) */}
          <div className="flex items-center justify-between gap-2 bg-white rounded-xl border border-slate-200/90 px-3 py-2 shadow-2xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">
                {language === 'mr' ? 'प्रश्न:' : 'Q:'}
              </span>
              <button
                type="button"
                onClick={() => setShowJumpModal(true)}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs border border-blue-200 cursor-pointer transition"
                title={language === 'mr' ? 'प्रश्न क्रमांकावर जा' : 'Jump to question'}
              >
                <span>
                  Q {currentIndex + 1}
                  {!isPro ? ` (${Math.min(currentIndex + 1, currentLimit)}/${currentLimit} Free)` : ` / ${questions.length}`}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={handlePrev}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition active:scale-95"
                title={language === 'mr' ? 'मागील प्रश्न' : 'Previous Question'}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'mr' ? 'मागील' : 'Prev'}</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-xs cursor-pointer transition active:scale-95"
                title={language === 'mr' ? 'पुढील प्रश्न' : 'Next Question'}
              >
                <span>{currentIndex >= questions.length - 1 ? (language === 'mr' ? 'शेवटचा प्रश्न' : 'Last') : (language === 'mr' ? 'पुढील प्रश्न' : 'Next Question')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isGated ? (
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 sm:p-7 shadow-md text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              {!currentUser ? (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <UserPlus className="w-7 h-7" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isAllChapters ? '५ विनामूल्य प्रश्न पूर्ण झाले' : `${subjectDisplayName}: २ विनामूल्य प्रश्न पूर्ण`}</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {language === 'mr'
                        ? `पुढील ${isAllChapters ? '५' : '२'} मोफत प्रश्न सोडवण्यासाठी कृपया मोफत नोंदणी करा!`
                        : `Register for free to unlock the next ${isAllChapters ? '5' : '2'} free questions!`}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      {language === 'mr'
                        ? `तुम्ही विना-लॉगिन ${isAllChapters ? '५' : '२'} मोफत प्रश्न सोडवले आहेत. फक्त ३० सेकंदात मोफत नोंदणी किंवा लॉगिन करा आणि पुढील ${isAllChapters ? '५' : '२'} मोफत प्रश्न त्वरित अनलॉक करा.`
                        : `You have completed the initial ${isAllChapters ? '5' : '2'} guest demo questions. Please register or login for free to unlock the next ${isAllChapters ? '5' : '2'} free questions instantly.`}
                    </p>
                  </div>

                  <div className="pt-2 space-y-2 max-w-sm mx-auto">
                    <button
                      type="button"
                      onClick={() => {
                        if (openLoginModal) openLoginModal('member', true);
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>✨ मोफत नोंदणी करा (Register Free)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (openLoginModal) openLoginModal('member', false);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>🔐 आधीच खाते आहे? लॉगिन करा (Login)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentIndex(Math.max(0, currentLimit - 1));
                      }}
                      className="w-full py-1.5 text-center text-xs text-slate-500 hover:text-slate-700 font-medium cursor-pointer"
                    >
                      ← मागील सोडवलेले प्रश्न पहा (Review Solved MCQs)
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <Crown className="w-7 h-7" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black">
                      <Crown className="w-3.5 h-3.5" />
                      <span>{isAllChapters ? '१० मोफत प्रश्न पूर्ण झाले' : `${subjectDisplayName}: ४ मोफत प्रश्न पूर्ण`}</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {language === 'mr'
                        ? 'सर्व विषयांचे अमर्यादित प्रश्न अनलॉक करण्यासाठी PRO प्लॅन घ्या!'
                        : 'Upgrade to PRO to unlock Unlimited MCQs & Mock Tests!'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      {language === 'mr'
                        ? `तुमच्या खात्यावरील सर्व ${isAllChapters ? '१०' : '४'} मोफत प्रश्न पूर्ण झाले आहेत. आता संपूर्ण ॲपमधील सर्व प्रकरणे, सविस्तर वैद्यकीय स्पष्टीकरणे, मागील वर्षांच्या प्रश्नपत्रिका (PYQs) व टेस्ट सिरीजसाठी PRO सबस्क्रिप्शन प्लॅन निवडा.`
                        : `You have completed all ${isAllChapters ? '10' : '4'} free questions on your account. Upgrade to PRO to access unlimited questions across all subjects, full rationales, and mock test series.`}
                    </p>
                  </div>

                  <div className="pt-2 space-y-2 max-w-sm mx-auto">
                    <button
                      type="button"
                      onClick={() => {
                        if (onNavigateToUpgradePro) onNavigateToUpgradePro();
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                    >
                      <Crown className="w-4 h-4" />
                      <span>👑 PRO प्लॅन निवडा (Upgrade to PRO)</span>
                    </button>

                    {!isAllChapters ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubject('all');
                          setCurrentIndex(0);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs transition cursor-pointer border border-blue-200"
                      >
                        <span>🔄 सर्व प्रकरणे एकत्र सराव करा (Try All Chapters)</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (onBack) onBack();
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
                      >
                        <span>📚 इतर विषयांचे मोफत प्रश्न सोडवा</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentIndex(Math.max(0, currentLimit - 1));
                      }}
                      className="w-full py-1.5 text-center text-xs text-slate-500 hover:text-slate-700 font-medium cursor-pointer"
                    >
                      ← मागील मोफत प्रश्नांची उजळणी करा (Review Free MCQs)
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : !currentQ ? (
            <div className="bg-white rounded-xl border border-slate-200/90 p-6 text-center space-y-2 shadow-2xs">
              <p className="text-xs font-bold text-slate-500">प्रश्न लोड होत आहे किंवा उपलब्ध नाही...</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200/90 p-2.5 sm:p-3.5 shadow-2xs space-y-2">
            {/* Meta Tags & Language Display Mode Bar */}
            <div className="flex items-center justify-between gap-1 pb-1 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-1">
                {currentQ.is_pyq && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 text-[9px] font-black border border-amber-200">
                    {currentQ.exam_name ? `${currentQ.exam_name} ${currentQ.exam_year || ''}` : 'AIIMS PYQ'}
                  </span>
                )}
                {currentQ.difficulty && (
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                    currentQ.difficulty === 'hard'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : currentQ.difficulty === 'medium'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {currentQ.difficulty.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Language Selector Pill (Instantly fits question on mobile without scrolling) */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                <button
                  onClick={() => setDisplayLang('mr')}
                  className={`px-1.5 py-0.5 rounded-md transition cursor-pointer ${
                    displayLang === 'mr' ? 'bg-white text-blue-700 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="मराठी भाषा"
                >
                  मराठी
                </button>
                <button
                  onClick={() => setDisplayLang('en')}
                  className={`px-1.5 py-0.5 rounded-md transition cursor-pointer ${
                    displayLang === 'en' ? 'bg-white text-blue-700 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="English only"
                >
                  EN
                </button>
                <button
                  onClick={() => setDisplayLang('dual')}
                  className={`px-1.5 py-0.5 rounded-md transition cursor-pointer ${
                    displayLang === 'dual' ? 'bg-white text-blue-700 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="दोन्ही भाषा (Dual)"
                >
                  दोन्ही
                </button>
              </div>
            </div>

            {/* Question Stem */}
            <div className="space-y-1.5">
              {/* English Question */}
              {displayLang !== 'mr' && (
                <h1 className="text-[13.5px] sm:text-[15px] font-bold text-slate-900 leading-snug tracking-tight break-words">
                  {currentQ.question_en}
                </h1>
              )}

              {/* Marathi Question Translation - Clean & Tight */}
              {displayLang !== 'en' && currentQ.question_mr && currentQ.question_mr.trim().length > 0 && currentQ.question_mr.trim().toLowerCase() !== currentQ.question_en.trim().toLowerCase() && (
                <div className="rounded-lg border-l-3 border-l-blue-600 bg-blue-50/70 px-2.5 py-1.5 text-slate-900 font-medium text-[12.5px] sm:text-[14px] leading-snug break-words">
                  {currentQ.question_mr}
                </div>
              )}

              {/* Fallback & Instant AI Translation Banner if user wants Marathi or Dual, but Marathi translation is missing */}
              {displayLang !== 'en' && (!currentQ.question_mr || currentQ.question_mr.trim().length === 0 || currentQ.question_mr.trim().toLowerCase() === currentQ.question_en.trim().toLowerCase()) && (
                <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-blue-50/90 border border-blue-200 text-blue-950 text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Languages className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span className="font-medium text-[11.5px]">
                      या प्रश्नाचा मराठी अनुवाद उपलब्ध नाही.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleTranslateCurrentQuestion}
                    disabled={isTranslatingCurrentQ}
                    className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-[11px] flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {isTranslatingCurrentQ ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>अनुवाद होत आहे...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>✨ मराठीत अनुवाद करा</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Success Notification */}
              {translationNotice && (
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{translationNotice}</span>
                </div>
              )}
            </div>

            {/* QUESTION IMAGE (Responsive thumbnail, tap to zoom) */}
            {currentQ.image_url && (
              <div className="relative rounded-lg border border-slate-200 overflow-hidden bg-slate-50 w-full max-h-28 sm:max-h-40 flex items-center justify-center group cursor-pointer"
                   onClick={() => setZoomedImage(currentQ.image_url || null)}>
                <img
                  src={currentQ.image_url}
                  alt={currentQ.image_alt_text || 'Clinical Diagram'}
                  className="max-h-28 sm:max-h-40 w-auto object-contain mx-auto"
                />
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-slate-900/80 text-white text-[9px] font-bold flex items-center gap-1 backdrop-blur-xs">
                  <ZoomIn className="w-2.5 h-2.5" />
                  <span>Zoom</span>
                </div>
              </div>
            )}

            {/* 3. OPTIONS (A, B, C, D) - Ultra-tight spacing to fit on single screen */}
            <div className="space-y-1.5 pt-0.5">
              {(['A', 'B', 'C', 'D'] as const).map(optKey => {
                const optEn = currentQ[`option_${optKey.toLowerCase()}_en` as keyof Question] as string;
                const optMr = currentQ[`option_${optKey.toLowerCase()}_mr` as keyof Question] as string;
                if (!optEn && !optMr) return null;

                const isSelected = selectedOpt === optKey;
                const isCorrect = currentQ.correct_option === optKey;

                // Determine Card State
                let cardStyle = 'bg-slate-50/70 border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-white active:scale-[0.995]';
                let circleBadgeStyle = 'border border-slate-300 bg-white text-slate-700';
                let circleIcon = <span>{optKey}</span>;
                let rightIcon = null;

                if (mode === 'instant_feedback' && isAnswered) {
                  if (isCorrect) {
                    cardStyle = 'border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-2xs';
                    circleBadgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                    circleIcon = <Check className="w-3 h-3 stroke-[3]" />;
                    rightIcon = (
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    );
                  } else if (isSelected && !isCorrect) {
                    cardStyle = 'border-2 border-rose-400 bg-rose-50 text-rose-950 font-bold shadow-2xs';
                    circleBadgeStyle = 'bg-rose-600 text-white border-rose-600';
                    circleIcon = <X className="w-3 h-3 stroke-[3]" />;
                    rightIcon = (
                      <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                        <X className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    );
                  } else {
                    cardStyle = 'opacity-35 border-slate-200 bg-slate-50 text-slate-400 pointer-events-none';
                    circleBadgeStyle = 'border-slate-200 bg-slate-100 text-slate-400';
                  }
                } else if (isSelected) {
                  cardStyle = 'border-2 border-blue-600 bg-blue-50 text-blue-950 font-bold';
                  circleBadgeStyle = 'bg-blue-600 text-white border-blue-600';
                }

                return (
                  <button
                    key={optKey}
                    onClick={() => handleSelectOption(optKey)}
                    className={`w-full text-left px-2.5 py-1.5 sm:py-2 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 min-h-[38px] ${cardStyle}`}
                  >
                    <div className="flex items-center gap-2 grow min-w-0">
                      {/* Option Label Badge */}
                      <div
                        className={`w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center font-black text-[11px] shrink-0 transition ${circleBadgeStyle}`}
                      >
                        {circleIcon}
                      </div>

                      {/* Option Text in English and Marathi */}
                      <div className="grow min-w-0">
                        {/* English option */}
                        {displayLang !== 'mr' && optEn && (
                          <div className="text-[12.5px] sm:text-[13.5px] font-semibold text-slate-900 leading-snug break-words">
                            {optEn}
                          </div>
                        )}

                        {/* Marathi option */}
                        {displayLang !== 'en' && optMr && (
                          <div className={`text-[11.5px] sm:text-[12.5px] leading-snug break-words ${
                            displayLang === 'mr'
                              ? 'text-slate-900 font-semibold'
                              : 'text-blue-900 font-medium'
                          }`}>
                            {optMr}
                          </div>
                        )}

                        {/* Fallback if user selected Marathi but option has no Marathi translation yet */}
                        {displayLang === 'mr' && !optMr && optEn && (
                          <div className="text-[12.5px] sm:text-[13.5px] font-semibold text-slate-900 leading-snug break-words">
                            {optEn}
                          </div>
                        )}
                      </div>
                    </div>

                    {rightIcon}
                  </button>
                );
              })}
            </div>

            {/* INSTANT FEEDBACK & ON-DEMAND RATIONALE (Requested: Click to reveal Marathi / English explanation) */}
            {mode === 'instant_feedback' && isAnswered && (
              <div ref={explanationRef} className="space-y-2.5 animate-in fade-in duration-200 pt-1">
                {/* Result Feedback Bar */}
                <div
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                    selectedOpt === currentQ.correct_option
                      ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50/90 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {selectedOpt === currentQ.correct_option ? (
                      <div className="flex items-center gap-1.5 font-black text-xs sm:text-[13px] text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{language === 'mr' ? 'बरोबर उत्तर!' : 'Correct Answer!'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 font-black text-xs sm:text-[13px] text-rose-800">
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>
                          {language === 'mr'
                            ? `चूक! योग्य पर्याय: ${currentQ.correct_option}`
                            : `Wrong! Correct Option: ${currentQ.correct_option}`}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 border border-emerald-300/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <BookOpen className="w-2.5 h-2.5" />
                      <span>{language === 'mr' ? 'ऑफलाइन (0 API)' : 'Offline (0 API)'}</span>
                    </span>
                  </div>
                </div>

                {/* THE TWO BUTTONS REQUESTED BY USER: स्पष्टीकरण पहा & इंग्रजीत explanation पहा */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Button 1: स्पष्टीकरण पहा (मराठीत) */}
                  <button
                    type="button"
                    onClick={() => setShowMarathiExplanation(prev => !prev)}
                    className={`px-3 py-2 sm:py-2.5 rounded-xl text-xs font-black border flex items-center justify-between gap-2 transition cursor-pointer active:scale-[0.99] ${
                      showMarathiExplanation
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-blue-50/90 hover:bg-blue-100 text-blue-900 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>
                        {showMarathiExplanation
                          ? (language === 'mr' ? 'मराठी स्पष्टीकरण लपवा' : 'Hide Marathi Explanation')
                          : (language === 'mr' ? 'स्पष्टीकरण पहा (मराठीत)' : 'स्पष्टीकरण पहा (मराठीत)')}
                      </span>
                    </div>
                    {showMarathiExplanation ? (
                      <ChevronUp className="w-4 h-4 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 shrink-0" />
                    )}
                  </button>

                  {/* Button 2: इंग्रजीत Explanation पहा */}
                  <button
                    type="button"
                    onClick={() => setShowEnglishExplanation(prev => !prev)}
                    className={`px-3 py-2 sm:py-2.5 rounded-xl text-xs font-black border flex items-center justify-between gap-2 transition cursor-pointer active:scale-[0.99] ${
                      showEnglishExplanation
                        ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300/80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-slate-700 shrink-0" />
                      <span>
                        {showEnglishExplanation
                          ? (language === 'mr' ? 'इंग्रजी Explanation लपवा' : 'Hide English Explanation')
                          : (language === 'mr' ? 'इंग्रजीत Explanation पहा' : 'View English Explanation')}
                      </span>
                    </div>
                    {showEnglishExplanation ? (
                      <ChevronUp className="w-4 h-4 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 shrink-0" />
                    )}
                  </button>
                </div>

                {/* MARATHI EXPLANATION (Revealed on click) */}
                {showMarathiExplanation && (
                  <div className="rounded-2xl bg-gradient-to-b from-blue-50/90 to-blue-50/40 p-3.5 sm:p-4 border border-blue-200 shadow-xs space-y-2 animate-in fade-in zoom-in-98 duration-150">
                    <div className="flex items-center justify-between pb-1.5 border-b border-blue-200/60">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-blue-600 text-white font-black flex items-center justify-center text-[10px]">
                          {currentQ.correct_option}
                        </span>
                        <h4 className="text-xs font-black text-blue-950 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                          <span>मराठी क्लिनिकल स्पष्टीकरण व संदर्भ</span>
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowMarathiExplanation(false)}
                        className="text-[11px] text-blue-700 hover:text-blue-900 font-bold px-1.5 py-0.5 rounded cursor-pointer"
                      >
                        ✕ बंद करा
                      </button>
                    </div>

                    <p className="text-slate-900 leading-relaxed text-xs sm:text-[13px] font-normal pt-0.5">
                      {currentQ.explanation_mr && currentQ.explanation_mr.trim().length > 0 ? (
                        currentQ.explanation_mr
                      ) : (
                        <span className="text-slate-600 italic">
                          या प्रश्नाचे अधिकृत स्पष्टीकरण इंग्रजीत साठवलेले आहे. कृपया वरील 'इंग्रजीत Explanation पहा' बटणावर क्लिक करा.
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* ENGLISH EXPLANATION (Revealed on click) */}
                {showEnglishExplanation && (
                  <div className="rounded-2xl bg-white p-3.5 sm:p-4 border border-slate-200 shadow-xs space-y-2 animate-in fade-in zoom-in-98 duration-150">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-black flex items-center justify-center text-[10px]">
                          {currentQ.correct_option}
                        </span>
                        <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-slate-700" />
                          <span>English Clinical Rationale & Evidence</span>
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowEnglishExplanation(false)}
                        className="text-[11px] text-slate-500 hover:text-slate-800 font-bold px-1.5 py-0.5 rounded cursor-pointer"
                      >
                        ✕ Close
                      </button>
                    </div>

                    <p className="text-slate-800 leading-relaxed text-xs sm:text-[13px] pt-0.5">
                      {currentQ.explanation_en}
                    </p>
                  </div>
                )}

                {/* AI Coach Option & Drawer trigger */}
                {(showMarathiExplanation || showEnglishExplanation) && (
                  <div className="pt-1.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setExplanationDrawerOpen(true)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                      <span>{language === 'mr' ? 'मोठ्या पडद्यावर उघडा (Full Screen)' : 'Open Full Screen'}</span>
                    </button>

                    {onAskAiCoach && (
                      <button
                        type="button"
                        onClick={() => onAskAiCoach(currentQ.question_en, currentQ.explanation_en)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] sm:text-xs font-bold border border-indigo-200 transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{language === 'mr' ? 'AI कोचला विचारा' : 'Ask AI Coach'}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 4. PREVIOUS & NEXT CONTROLS (Immediately accessible on thumb without scrolling) */}
            <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-100">
              <button
                disabled={currentIndex === 0}
                onClick={handlePrev}
                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition min-h-[36px]"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{language === 'mr' ? 'मागील' : 'Previous'}</span>
              </button>

              <button
                disabled={currentIndex >= questions.length - 1}
                onClick={handleNext}
                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition min-h-[36px]"
              >
                <span>{currentIndex >= questions.length - 1 ? (language === 'mr' ? 'शेवटचा प्रश्न' : 'Last Question') : (language === 'mr' ? 'पुढील प्रश्न' : 'Next Question')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          )}
        </div>
      )}

      {/* EXPLANATION SLIDE-UP DRAWER (Clean Bottom Sheet) */}
      {explanationDrawerOpen && currentQ && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setExplanationDrawerOpen(false)}
          />

          <div className="relative bg-white rounded-t-3xl p-4 sm:p-5 max-h-[85vh] overflow-y-auto space-y-3.5 shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom duration-250">
            {/* Grab handle */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />

            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center text-xs">
                  {currentQ.correct_option}
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900">
                    {language === 'mr' ? 'क्लिनिकल स्पष्टीकरण व संदर्भ' : 'Clinical Rationale & Evidence'}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    {language === 'mr' ? 'योग्य उत्तराचे वैद्यकीय कारण' : 'Scientific concept explanation'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setExplanationDrawerOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Explanation Content */}
            <div className="space-y-2.5 text-xs text-slate-800 leading-relaxed font-medium">
              {/* English Explanation */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                  EXPLANATION (English):
                </span>
                <p>{currentQ.explanation_en}</p>
              </div>

              {/* Marathi Explanation */}
              {currentQ.explanation_mr && (
                <div className="bg-blue-50/60 p-3 rounded-2xl border border-blue-200/80">
                  <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider block mb-1">
                    मराठी स्पष्टीकरण:
                  </span>
                  <p className="text-slate-900">{currentQ.explanation_mr}</p>
                </div>
              )}
            </div>

            {/* Action Bar inside Drawer */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              {onAskAiCoach && (
                <button
                  onClick={() => {
                    setExplanationDrawerOpen(false);
                    onAskAiCoach(currentQ.question_en, currentQ.explanation_en);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{language === 'mr' ? 'AI कोचला शंका विचारा' : 'Ask AI Coach'}</span>
                </button>
              )}

              <button
                onClick={() => {
                  setExplanationDrawerOpen(false);
                  handleNext();
                }}
                disabled={currentIndex >= questions.length - 1}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition cursor-pointer disabled:opacity-40"
              >
                <span>{language === 'mr' ? 'पुढील प्रश्न →' : 'Next Question →'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JUMP TO QUESTION MODAL */}
      {showJumpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xs w-full p-4 space-y-3 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-blue-600" />
                <span>Jump to Question (प्रश्न निवडा)</span>
              </h3>
              <button
                onClick={() => setShowJumpModal(false)}
                className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleJumpToQuestion} className="space-y-2.5">
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <span className="text-slate-400 font-bold mr-2 text-xs">Q #</span>
                <input
                  type="number"
                  min={1}
                  max={questions.length}
                  value={jumpInput}
                  onChange={e => setJumpInput(e.target.value)}
                  placeholder={`1 - ${questions.length}`}
                  autoFocus
                  className="w-full outline-none text-slate-900 font-black text-sm bg-transparent"
                />
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex flex-wrap gap-1">
                {[1, 25, 50, 100, 200, 500].filter(n => n <= questions.length).map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      const idx = n - 1;
                      setCurrentIndex(idx);
                      setShowMarathiExplanation(false);
                      setShowEnglishExplanation(false);
                      setShowJumpModal(false);
                    }}
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-[10px] font-bold text-slate-600 transition"
                  >
                    #{n}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowJumpModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition shadow-2xs"
                >
                  Go
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REPORT ISSUE BOTTOM SHEET / MODAL */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 space-y-3 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Flag className="w-4 h-4 text-rose-600" />
                <span>Report Question Issue</span>
              </h3>
              <button
                onClick={() => setReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Issue Type</label>
                <select
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="wrong_answer">Wrong Answer Key (उत्तर चुकीचे आहे)</option>
                  <option value="translation_error">Marathi Translation Error (मराठी भाषांतर चूक)</option>
                  <option value="explanation_unclear">Explanation Unclear (स्पष्टीकरण अस्पष्ट)</option>
                  <option value="typo">Typing / Spelling Mistake (टायपिंग चूक)</option>
                  <option value="duplicate">Duplicate Question (पुनरावृत्ती)</option>
                  <option value="other">Other Issue (इतर)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Details / Clarification</label>
                <textarea
                  value={reportDetails}
                  onChange={e => setReportDetails(e.target.value)}
                  placeholder="Provide reference or correction..."
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white h-20 resize-none"
                />
              </div>
            </div>

            {reportSuccess ? (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold text-center">
                Report submitted. Thank you!
              </div>
            ) : (
              <div className="flex justify-end gap-1.5 pt-1">
                <button
                  onClick={() => setReportModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReport}
                  className="px-4 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-2xs"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GUEST LIMIT REACHED - REGISTRATION MODAL */}
      {showGuestLimitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
              <UserPlus className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-200">
                <Sparkles className="w-3 h-3" />
                <span>{isAllChapters ? '५ विनामूल्य प्रश्न पूर्ण' : '२ विनामूल्य प्रश्न पूर्ण'}</span>
              </span>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {language === 'mr' ? 'नोंदणी करा व पुढील मोफत प्रश्न मिळवा!' : 'Register to unlock more free questions!'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'mr'
                  ? `तुम्ही पहिले ${isAllChapters ? '५' : '२'} मोफत प्रश्न सोडवले आहेत. पुढील ${isAllChapters ? '५' : '२'} मोफत प्रश्न अनलॉक करण्यासाठी मोफत नोंदणी करा किंवा लॉगिन करा.`
                  : `You have completed the initial ${isAllChapters ? '5' : '2'} free questions. Register or login to unlock the next batch of free questions!`}
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowGuestLimitModal(false);
                  if (openLoginModal) openLoginModal('member', true);
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <UserPlus className="w-4 h-4" />
                <span>✨ मोफत नोंदणी करा (Register Free)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowGuestLimitModal(false);
                  if (openLoginModal) openLoginModal('member', false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🔐 आधीच खाते आहे? लॉगिन करा</span>
              </button>

              <button
                type="button"
                onClick={() => setShowGuestLimitModal(false)}
                className="w-full py-1.5 text-center text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
              >
                रद्द करा (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRO UPGRADE LIMIT REACHED MODAL */}
      {showProUpgradeLimitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mx-auto shadow-md">
              <Crown className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-black border border-amber-200">
                <Crown className="w-3 h-3" />
                <span>{isAllChapters ? '१० मोफत प्रश्न पूर्ण' : '४ मोफत प्रश्न पूर्ण'}</span>
              </span>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {language === 'mr' ? 'सर्व प्रश्न अनलॉक करण्यासाठी PRO प्लॅन घ्या!' : 'Upgrade to PRO for Unlimited Questions!'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'mr'
                  ? `मोफत खात्यावरील सर्व ${isAllChapters ? '१०' : '४'} प्रश्न पूर्ण झाले आहेत. अमर्यादित प्रश्न, स्पष्टीकरणे व मॉक टेस्टसाठी PRO सबस्क्रिप्शन निवडा.`
                  : `You have completed all ${isAllChapters ? '10' : '4'} free questions. Upgrade to PRO to unlock unlimited questions, explanations and mock tests.`}
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowProUpgradeLimitModal(false);
                  if (onNavigateToUpgradePro) onNavigateToUpgradePro();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <Crown className="w-4 h-4" />
                <span>👑 PRO प्लॅन निवडा (Upgrade to PRO)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowProUpgradeLimitModal(false)}
                className="w-full py-1.5 text-center text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
              >
                रद्द करा (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL IMAGE LIGHTBOX MODAL */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex flex-col items-center justify-center p-3"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-3xl w-full max-h-[85vh] flex flex-col items-center">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-2 right-2 px-3 py-1.5 rounded-full bg-white/20 text-white font-bold text-xs hover:bg-white/30 backdrop-blur-md"
            >
              Close ✕
            </button>
            <img
              src={zoomedImage}
              alt="Zoomed diagram"
              className="max-h-[80vh] w-auto max-w-full object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
