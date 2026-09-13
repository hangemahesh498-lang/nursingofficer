import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  GraduationCap
} from 'lucide-react';

interface PracticeEngineViewProps {
  initialSubjectId?: string;
  onAskAiCoach?: (doubt: string, context: string) => void;
  onBack?: () => void;
}

export const PracticeEngineView: React.FC<PracticeEngineViewProps> = ({
  initialSubjectId,
  onAskAiCoach,
  onBack
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
  const [showExplanation, setShowExplanation] = useState(false);
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(false);
  const [explanationDrawerOpen, setExplanationDrawerOpen] = useState(false);
  const [displayLang, setDisplayLang] = useState<'dual' | 'mr' | 'en'>('dual');
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Modals
  const [showJumpModal, setShowJumpModal] = useState(false);
  const [jumpInput, setJumpInput] = useState('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Report issue modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('wrong_answer');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const explanationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSubjectsAndBookmarks();
  }, []);

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
      setShowExplanation(false);
      setIsExplanationExpanded(false);
    } catch (err) {
      console.error('Failed to load questions', err);
    } finally {
      setLoading(false);
    }
  };

  const currentQ = questions[currentIndex];
  const currentSubjectObj = subjects.find(s => s.id === (currentQ?.subject_id || selectedSubject));
  const progressPct = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;
  const isAnswered = currentQ ? !!userAnswers[currentQ.id] : false;
  const selectedOpt = currentQ ? userAnswers[currentQ.id] : null;

  const handleSelectOption = useCallback(async (option: 'A' | 'B' | 'C' | 'D') => {
    if (!currentQ) return;
    if (userAnswers[currentQ.id] && mode === 'instant_feedback') return;

    setUserAnswers(prev => ({ ...prev, [currentQ.id]: option }));
    if (mode === 'instant_feedback') {
      setShowExplanation(true);
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
    if (!currentQ) return;
    try {
      const res = await api.toggleBookmark(currentQ.id);
      setBookmarkedMap(prev => ({ ...prev, [currentQ.id]: res.isBookmarked }));
    } catch (err) {
      console.error('Bookmark toggle failed', err);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setShowExplanation(!!userAnswers[questions[nextIdx]?.id]);
      setIsExplanationExpanded(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setShowExplanation(!!userAnswers[questions[prevIdx]?.id]);
      setIsExplanationExpanded(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToQuestion = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const num = parseInt(jumpInput, 10);
    if (!isNaN(num) && num >= 1 && num <= questions.length) {
      const targetIdx = num - 1;
      setCurrentIndex(targetIdx);
      setShowExplanation(!!userAnswers[questions[targetIdx]?.id]);
      setIsExplanationExpanded(false);
      setJumpInput('');
      setShowJumpModal(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitReport = async () => {
    if (!currentQ) return;
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
    <div className="w-full max-w-2xl mx-auto px-2.5 sm:px-4 pt-1.5 sm:pt-3 pb-28 space-y-2.5 antialiased">
      {/* 1. COMPACT QUESTION HEADER (Zero wasted vertical space) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 px-3 py-2 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Back button & Subject Badge */}
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              onClick={() => (onBack ? onBack() : setSelectedSubject('all'))}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition shrink-0 cursor-pointer"
              title="Back to Chapters"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex flex-col min-w-0">
              <span className="text-[11px] sm:text-xs font-black text-slate-800 truncate leading-tight">
                {subjectDisplayName}
              </span>
              {currentQ?.topic_id && (
                <span className="text-[10px] text-slate-400 truncate leading-tight">
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
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-[11px] sm:text-xs border border-blue-200 transition cursor-pointer"
                title="प्रश्न क्रमांकावर जा (Jump to Question #)"
              >
                <span>Q {currentIndex + 1}/{questions.length}</span>
              </button>
            )}

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`p-1.5 rounded-full border transition cursor-pointer ${
                showFilterDrawer || selectedDifficulty !== 'all' || pyqOnly
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
              title="Filters & Mode"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            {/* Bookmark */}
            {currentQ && (
              <button
                onClick={toggleBookmark}
                className={`p-1.5 rounded-full border transition cursor-pointer ${
                  bookmarkedMap[currentQ.id]
                    ? 'bg-amber-50 border-amber-300 text-amber-600'
                    : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
                }`}
                title="Bookmark Question"
              >
                <Bookmark
                  className="w-3.5 h-3.5"
                  fill={bookmarkedMap[currentQ.id] ? 'currentColor' : 'none'}
                />
              </button>
            )}

            {/* Report */}
            {currentQ && (
              <button
                onClick={() => setReportModalOpen(true)}
                className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition cursor-pointer"
                title="Report Issue"
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Sleek Progress Indicator */}
        {questions.length > 0 && (
          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
      </div>

      {/* COMPACT FILTER DRAWER / SETTINGS (Expandable when user wants to filter) */}
      {showFilterDrawer && (
        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-3 shadow-xs animate-in fade-in zoom-in-95 duration-150 text-xs">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>Practice Filters & Settings</span>
            </span>
            <button
              onClick={() => setShowFilterDrawer(false)}
              className="text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Mode Switch */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Mode
              </label>
              <div className="flex bg-slate-100 p-0.5 rounded-xl">
                <button
                  onClick={() => setMode('instant_feedback')}
                  className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition ${
                    mode === 'instant_feedback' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Instant
                </button>
                <button
                  onClick={() => setMode('exam_mode')}
                  className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition ${
                    mode === 'exam_mode' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Exam
                </button>
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value)}
                className="w-full p-1.5 rounded-xl border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-800"
              >
                <option value="all">All Levels</option>
                <option value="easy">Easy (सोपे)</option>
                <option value="medium">Medium (मध्यम)</option>
                <option value="hard">Hard (कठीण)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
            <button
              onClick={() => setPyqOnly(!pyqOnly)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                pyqOnly ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              ★ PYQ Verified Only
            </button>
            <button
              onClick={() => setFreeOnly(!freeOnly)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                freeOnly ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              Free MCQs
            </button>
          </div>
        </div>
      )}

      {/* 2. MAIN QUESTION CARD (Mobile-First No-Scroll Design) */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center space-y-2 shadow-2xs">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">प्रश्न लोड होत आहेत...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3 shadow-2xs">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">कोणतेही प्रश्न उपलब्ध नाहीत</h3>
          <p className="text-xs text-slate-500">निवडलेल्या फिल्टरनुसार प्रश्न सापडले नाहीत.</p>
          <button
            onClick={() => { setSelectedSubject('all'); setSelectedDifficulty('all'); setPyqOnly(false); setFreeOnly(false); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
          >
            सर्व प्रश्न रीसेट करा
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4.5 shadow-2xs space-y-2.5">
            {/* Meta Tags & Language Display Mode Bar */}
            <div className="flex items-center justify-between gap-1.5 pb-1 border-b border-slate-100/80">
              <div className="flex flex-wrap items-center gap-1">
                {currentQ.is_pyq && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 text-[9px] sm:text-[10px] font-black border border-amber-200">
                    {currentQ.exam_name ? `${currentQ.exam_name} ${currentQ.exam_year || ''}` : 'AIIMS PYQ'}
                  </span>
                )}
                {currentQ.difficulty && (
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold border ${
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
                  className={`px-1.5 sm:px-2 py-0.5 rounded-md transition cursor-pointer ${
                    displayLang === 'mr' ? 'bg-white text-blue-700 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="मराठी भाषा"
                >
                  मराठी
                </button>
                <button
                  onClick={() => setDisplayLang('en')}
                  className={`px-1.5 sm:px-2 py-0.5 rounded-md transition cursor-pointer ${
                    displayLang === 'en' ? 'bg-white text-blue-700 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="English only"
                >
                  EN
                </button>
                <button
                  onClick={() => setDisplayLang('dual')}
                  className={`px-1.5 sm:px-2 py-0.5 rounded-md transition cursor-pointer ${
                    displayLang === 'dual' ? 'bg-white text-blue-700 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="दोन्ही भाषा (Dual)"
                >
                  दोन्ही
                </button>
              </div>
            </div>

            {/* Question Stem */}
            <div className="space-y-2">
              {/* English Question */}
              {displayLang !== 'mr' && (
                <h1 className="text-[14px] sm:text-[16px] font-bold text-slate-900 leading-snug tracking-tight break-words">
                  {currentQ.question_en}
                </h1>
              )}

              {/* Marathi Question Translation - Full & Prominent */}
              {displayLang !== 'en' && currentQ.question_mr && currentQ.question_mr.trim().length > 0 && (
                <div className="rounded-xl border-l-4 border-l-blue-600 bg-blue-50/70 p-2.5 sm:p-3 space-y-1">
                  <div className="text-blue-800 font-black text-[10px] sm:text-[11px] tracking-wide flex items-center gap-1">
                    <span>मराठी भाषांतर (Marathi Translation):</span>
                  </div>
                  <p className="text-slate-900 font-semibold text-[13px] sm:text-[15px] leading-relaxed break-words">
                    {currentQ.question_mr}
                  </p>
                </div>
              )}

              {/* Fallback if Marathi chosen but question_mr empty */}
              {displayLang === 'mr' && (!currentQ.question_mr || currentQ.question_mr.trim().length === 0) && (
                <h1 className="text-[14px] sm:text-[16px] font-bold text-slate-900 leading-snug tracking-tight break-words">
                  {currentQ.question_en}
                </h1>
              )}
            </div>

            {/* QUESTION IMAGE (Responsive thumbnail, tap to zoom) */}
            {currentQ.image_url && (
              <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 w-full max-h-36 sm:max-h-52 flex items-center justify-center group cursor-pointer"
                   onClick={() => setZoomedImage(currentQ.image_url || null)}>
                <img
                  src={currentQ.image_url}
                  alt={currentQ.image_alt_text || 'Clinical Diagram'}
                  className="max-h-36 sm:max-h-52 w-auto object-contain mx-auto"
                />
                <div className="absolute bottom-1 right-1 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[9px] font-bold flex items-center gap-1 backdrop-blur-xs">
                  <ZoomIn className="w-2.5 h-2.5" />
                  <span>Zoom</span>
                </div>
              </div>
            )}

            {/* 3. OPTIONS (A, B, C, D) - Full Marathi text & English without cutting */}
            <div className="space-y-2 pt-0.5">
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
                    circleIcon = <Check className="w-3.5 h-3.5 stroke-[3]" />;
                    rightIcon = (
                      <span className="w-4.5 h-4.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    );
                  } else if (isSelected && !isCorrect) {
                    cardStyle = 'border-2 border-rose-400 bg-rose-50 text-rose-950 font-bold shadow-2xs';
                    circleBadgeStyle = 'bg-rose-600 text-white border-rose-600';
                    circleIcon = <X className="w-3.5 h-3.5 stroke-[3]" />;
                    rightIcon = (
                      <span className="w-4.5 h-4.5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
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
                    className={`w-full text-left px-3 py-2.5 rounded-xl border transition cursor-pointer flex items-start justify-between gap-2.5 min-h-[44px] ${cardStyle}`}
                  >
                    <div className="flex items-start gap-2.5 grow min-w-0">
                      {/* Option Label Badge */}
                      <div
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center font-black text-[11px] sm:text-xs shrink-0 transition mt-0.5 ${circleBadgeStyle}`}
                      >
                        {circleIcon}
                      </div>

                      {/* Option Text in English and Full Marathi */}
                      <div className="grow min-w-0 space-y-1">
                        {/* English option */}
                        {displayLang !== 'mr' && optEn && (
                          <div className="text-[13px] sm:text-[14px] font-semibold text-slate-900 leading-snug break-words">
                            {optEn}
                          </div>
                        )}

                        {/* Full Marathi option */}
                        {displayLang !== 'en' && optMr && (
                          <div className={`text-[12px] sm:text-[13px] leading-snug break-words ${
                            displayLang === 'mr'
                              ? 'text-slate-900 font-semibold'
                              : 'text-blue-950 font-medium bg-blue-50/60 p-1.5 rounded-lg border border-blue-100'
                          }`}>
                            {optMr}
                          </div>
                        )}
                      </div>
                    </div>

                    {rightIcon}
                  </button>
                );
              })}
            </div>

            {/* INSTANT FEEDBACK STATUS BAR (When Answered in Instant Mode) */}
            {mode === 'instant_feedback' && isAnswered && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/90 text-xs animate-in fade-in duration-150">
                <div className="flex items-center gap-1.5">
                  {selectedOpt === currentQ.correct_option ? (
                    <div className="flex items-center gap-1 text-emerald-800 font-black text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{language === 'mr' ? 'बरोबर उत्तर!' : 'Correct!'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-rose-800 font-black text-xs">
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{language === 'mr' ? `चूक! योग्य पर्याय: ${currentQ.correct_option}` : `Wrong! Correct: ${currentQ.correct_option}`}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setExplanationDrawerOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-[11px] border border-blue-200 transition cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>{language === 'mr' ? 'स्पष्टीकरण पहा' : 'View Rationale'}</span>
                </button>
              </div>
            )}

            {/* 4. PREVIOUS & NEXT CONTROLS (Immediately accessible on thumb without scrolling) */}
            <div className="pt-1.5 flex items-center justify-between gap-2 border-t border-slate-100">
              <button
                disabled={currentIndex === 0}
                onClick={handlePrev}
                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition min-h-[40px]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{language === 'mr' ? 'मागील' : 'Previous'}</span>
              </button>

              <button
                disabled={currentIndex >= questions.length - 1}
                onClick={handleNext}
                className="flex-1 inline-flex items-center justify-center gap-1 px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-md disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition min-h-[40px]"
              >
                <span>{currentIndex >= questions.length - 1 ? (language === 'mr' ? 'शेवटचा प्रश्न' : 'Last Question') : (language === 'mr' ? 'पुढील प्रश्न' : 'Next Question')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
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
                      setShowExplanation(!!userAnswers[questions[idx]?.id]);
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
