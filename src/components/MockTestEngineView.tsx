import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { MockTest, Question, TestAttempt } from '../types';
import { TestResultView } from './TestResultView';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Check,
  Award,
  Play
} from 'lucide-react';

interface MockTestEngineViewProps {
  onGoToMistakes: () => void;
  onBackToDashboard: () => void;
}

export const MockTestEngineView: React.FC<MockTestEngineViewProps> = ({
  onGoToMistakes,
  onBackToDashboard
}) => {
  const { language, t } = useLanguage();
  const { currentUser } = useAuth();

  const [availableTests, setAvailableTests] = useState<MockTest[]>([]);
  const [activeTest, setActiveTest] = useState<(MockTest & { questions: Question[] }) | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Attempt State
  const [answers, setAnswers] = useState<Record<string, {
    selected_option: 'A' | 'B' | 'C' | 'D' | null;
    is_marked_for_review: boolean;
    time_spent_seconds: number;
    visited: boolean;
  }>>({});

  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [startedAt, setStartedAt] = useState<string>('');
  const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [completedAttempt, setCompletedAttempt] = useState<TestAttempt | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Timer reference
  const timerRef = useRef<any>(null);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      const tests = await api.getMockTests();
      setAvailableTests(tests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startTest = async (testId: string) => {
    try {
      setLoading(true);
      const fullTest = await api.getMockTest(testId);
      setActiveTest(fullTest);
      setCurrentQIndex(0);
      setCompletedAttempt(null);
      setStartedAt(new Date().toISOString());

      // Initialize answer states
      const initAnswers: typeof answers = {};
      fullTest.questions.forEach((q, idx) => {
        initAnswers[q.id] = {
          selected_option: null,
          is_marked_for_review: false,
          time_spent_seconds: 0,
          visited: idx === 0 // first question is visited
        };
      });
      setAnswers(initAnswers);

      const totalSec = fullTest.duration_minutes * 60;
      setSecondsRemaining(totalSec);
      setTotalTimeSpent(0);
    } catch (err) {
      console.error('Failed to start test', err);
    } finally {
      setLoading(false);
    }
  };

  // Live Timer Countdown
  useEffect(() => {
    if (!activeTest || completedAttempt) return;

    timerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
      setTotalTimeSpent(prev => prev + 1);

      // increment time on current question
      if (activeTest.questions[currentQIndex]) {
        const qId = activeTest.questions[currentQIndex].id;
        setAnswers(prev => ({
          ...prev,
          [qId]: {
            ...prev[qId],
            time_spent_seconds: (prev[qId]?.time_spent_seconds || 0) + 1
          }
        }));
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [activeTest, currentQIndex, completedAttempt]);

  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    if (!activeTest) return;
    const qId = activeTest.questions[currentQIndex].id;
    setAnswers(prev => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        selected_option: prev[qId]?.selected_option === opt ? null : opt,
        visited: true
      }
    }));
  };

  const clearResponse = () => {
    if (!activeTest) return;
    const qId = activeTest.questions[currentQIndex].id;
    setAnswers(prev => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        selected_option: null
      }
    }));
  };

  const toggleMarkForReview = () => {
    if (!activeTest) return;
    const qId = activeTest.questions[currentQIndex].id;
    setAnswers(prev => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        is_marked_for_review: !prev[qId]?.is_marked_for_review
      }
    }));
  };

  const jumpToQuestion = (index: number) => {
    if (!activeTest || !activeTest.questions[index]) return;
    setCurrentQIndex(index);
    const targetQId = activeTest.questions[index].id;
    setAnswers(prev => ({
      ...prev,
      [targetQId]: {
        ...prev[targetQId],
        visited: true
      }
    }));
  };

  const handleNext = () => {
    if (!activeTest) return;
    if (currentQIndex < activeTest.questions.length - 1) {
      jumpToQuestion(currentQIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQIndex > 0) {
      jumpToQuestion(currentQIndex - 1);
    }
  };

  const submitTest = async () => {
    if (!activeTest || isSubmitting) return;
    try {
      setIsSubmitting(true);
      if (timerRef.current) clearInterval(timerRef.current);

      const formattedAnswers = activeTest.questions.map(q => {
        const state = answers[q.id];
        return {
          question_id: q.id,
          selected_option: state?.selected_option || null,
          time_spent_seconds: state?.time_spent_seconds || 0,
          is_marked_for_review: !!state?.is_marked_for_review
        };
      });

      const attempt = await api.submitMockTest(activeTest.id, {
        answers: formattedAnswers,
        started_at: startedAt,
        time_spent_seconds: totalTimeSpent
      });

      setCompletedAttempt(attempt);
      setShowSubmitModal(false);
    } catch (err) {
      console.error('Failed to submit test', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoSubmit = () => {
    alert('Time has expired! Submitting your exam responses automatically.');
    submitTest();
  };

  // Palette status calculator
  const getPaletteStatus = (qId: string) => {
    const s = answers[qId];
    if (!s || !s.visited) return 'not_visited';
    if (s.is_marked_for_review) return 'marked';
    if (s.selected_option !== null) return 'answered';
    return 'not_answered';
  };

  // Counts for modal and stats
  const answerList = Object.values(answers) as { selected_option: string | null; is_marked_for_review: boolean }[];
  const answeredCount = answerList.filter(a => a.selected_option !== null).length;
  const markedCount = answerList.filter(a => a.is_marked_for_review).length;
  const unattemptedCount = (activeTest?.questions.length || 0) - answeredCount;

  // Render Result View if finished
  if (completedAttempt && activeTest) {
    return (
      <TestResultView
        attempt={completedAttempt}
        questions={activeTest.questions}
        onRetest={() => startTest(activeTest.id)}
        onGoToMistakes={onGoToMistakes}
        onBackToDashboard={() => {
          setActiveTest(null);
          setCompletedAttempt(null);
          onBackToDashboard();
        }}
      />
    );
  }

  // 1. Available Tests Selection Screen
  if (!activeTest) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {language === 'mr' ? 'AIIMS NORCET व नर्सिंग मॉक टेस्ट्स' : 'Nursing Officer Mock Test Series'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
            {language === 'mr'
              ? 'प्रत्यक्ष परीक्षेसारखा अनुभव. १/३ निगेटिव्ह मार्किंग, टाइमर, प्रश्न पॅलेट आणि तपशीलवार अचूकता विश्लेषण.'
              : 'Simulate high-stakes computer-based tests with real exam timers, 1/3 negative marking, official question palette navigation, and instant scorecards.'}
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500 text-sm">Loading mock tests...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTests.map(test => (
              <div
                key={test.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      {test.exam_pattern}
                    </span>
                    <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      -{(test.negative_marking_rate * 100).toFixed(0)}% Negative Mark
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {language === 'mr' ? test.title_mr : test.title_en}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    {language === 'mr' ? test.description_mr : test.description_en}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-slate-100 mb-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{test.duration_minutes} Minutes</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span>{test.total_marks} Total Marks</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => startTest(test.id)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{t('startTest')}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 2. Active Timed Mock Exam Engine
  const currentQ = activeTest.questions[currentQIndex];
  const qState = answers[currentQ?.id] || {
    selected_option: null,
    is_marked_for_review: false,
    visited: true
  };

  const minutesLeft = Math.floor(secondsRemaining / 60);
  const secsLeft = secondsRemaining % 60;
  const isUrgentTimer = secondsRemaining < 300; // < 5 mins

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-100 flex flex-col">
      {/* Exam Header Bar */}
      <div className="bg-slate-900 text-white px-4 sm:px-8 py-3 flex items-center justify-between shadow-md">
        <div>
          <div className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
            {activeTest.exam_pattern} Simulation
          </div>
          <div className="text-sm sm:text-base font-bold truncate max-w-md">
            {language === 'mr' ? activeTest.title_mr : activeTest.title_en}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Countdown Clock */}
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-sm font-mono font-bold ${
            isUrgentTimer
              ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse'
              : 'bg-slate-800 border-slate-700 text-emerald-400'
          }`}>
            <Clock className="w-4 h-4" />
            <span>
              {String(minutesLeft).padStart(2, '0')}:{String(secsLeft).padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Main Examination Canvas */}
      <div className="grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Columns: Active Question Area */}
        <div className="lg:col-span-3 flex flex-col justify-between bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="space-y-6">
            {/* Question Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-900">
                  Question {currentQIndex + 1}
                </span>
                <span className="text-xs text-slate-400">of {activeTest.questions.length}</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  +1.00 Mark
                </span>
                <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  -0.33 Mark
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {currentQ.question_en}
              </div>
              {currentQ.question_mr &&
                currentQ.question_mr.trim().toLowerCase() !== currentQ.question_en.trim().toLowerCase() && (
                  <div className="text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                    {currentQ.question_mr}
                  </div>
                )}
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {(['A', 'B', 'C', 'D'] as const).map(optKey => {
                const optEn = currentQ[`option_${optKey.toLowerCase()}_en` as keyof Question] as string;
                const optMr = currentQ[`option_${optKey.toLowerCase()}_mr` as keyof Question] as string;
                const isSelected = qState.selected_option === optKey;

                return (
                  <button
                    key={optKey}
                    onClick={() => handleSelectOption(optKey)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold shadow-xs'
                        : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isSelected ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 text-slate-600'
                    }`}>
                      {optKey}
                    </div>
                    <div className="grow space-y-0.5">
                      <div className="text-sm font-medium">{optEn}</div>
                      {optMr && optMr.trim().toLowerCase() !== optEn.trim().toLowerCase() && (
                        <div className="text-xs text-slate-500">{optMr}</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Controls */}
          <div className="pt-6 mt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMarkForReview}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                  qState.is_marked_for_review
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{qState.is_marked_for_review ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>

              <button
                onClick={clearResponse}
                disabled={!qState.selected_option}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Clear Response
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentQIndex === 0}
                onClick={handlePrevious}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={currentQIndex >= activeTest.questions.length - 1}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                Save & Next
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Question Palette */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Question Palette ({activeTest.questions.length})
            </h3>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500 shrink-0"></span>
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-rose-500 shrink-0"></span>
                <span>Not Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-purple-500 shrink-0"></span>
                <span>Review ({markedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-slate-200 shrink-0"></span>
                <span>Not Visited</span>
              </div>
            </div>

            {/* Palette Grid */}
            <div className="grid grid-cols-5 gap-2 max-h-[360px] overflow-y-auto p-1">
              {activeTest.questions.map((q, idx) => {
                const status = getPaletteStatus(q.id);
                const isCurrent = currentQIndex === idx;

                let btnBg = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
                if (status === 'answered') {
                  btnBg = 'bg-emerald-500 text-white font-bold';
                } else if (status === 'marked') {
                  btnBg = 'bg-purple-600 text-white font-bold';
                } else if (status === 'not_answered') {
                  btnBg = 'bg-rose-500 text-white font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => jumpToQuestion(idx)}
                    className={`h-9 rounded-lg text-xs flex items-center justify-center transition cursor-pointer ${btnBg} ${
                      isCurrent ? 'ring-2 ring-slate-900 ring-offset-2' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
            >
              Submit Examination
            </button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold">Submit Test Verification</h3>
                <p className="text-xs text-slate-500">Are you sure you want to finish your attempt?</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Questions:</span>
                <span className="font-bold text-slate-900">{activeTest.questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700 font-semibold">Answered:</span>
                <span className="font-bold text-emerald-700">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rose-700 font-semibold">Unattempted:</span>
                <span className="font-bold text-rose-700">{unattemptedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700 font-semibold">Marked for Review:</span>
                <span className="font-bold text-purple-700">{markedCount}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">Time Remaining:</span>
                <span className="font-mono font-bold text-slate-900">
                  {minutesLeft}m {secsLeft}s
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Return to Test
              </button>
              <button
                disabled={isSubmitting}
                onClick={submitTest}
                className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Evaluating...' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
