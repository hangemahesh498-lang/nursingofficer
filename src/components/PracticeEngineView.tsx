import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Question, Subject } from '../types';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Bookmark,
  Flag,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Languages,
  SlidersHorizontal,
  Check,
  Award
} from 'lucide-react';

interface PracticeEngineViewProps {
  initialSubjectId?: string;
  onAskAiCoach?: (doubt: string, context: string) => void;
}

export const PracticeEngineView: React.FC<PracticeEngineViewProps> = ({
  initialSubjectId,
  onAskAiCoach
}) => {
  const { language, t } = useLanguage();
  const { currentUser } = useAuth();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubjectId || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [pyqOnly, setPyqOnly] = useState(false);
  const [mode, setMode] = useState<'instant_feedback' | 'exam_mode'>('instant_feedback');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('wrong_answer');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [questionLang, setQuestionLang] = useState<'both' | 'en' | 'mr'>('both');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjectsAndBookmarks();
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [selectedSubject, selectedDifficulty, pyqOnly]);

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
      console.error(err);
    }
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await api.getQuestions({
        subject_id: selectedSubject !== 'all' ? selectedSubject : undefined,
        difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
        is_verified_pyq: pyqOnly ? true : undefined,
        status: 'published'
      });
      setQuestions(data);
      setCurrentIndex(0);
      setUserAnswers({});
      setShowExplanation(false);
    } catch (err) {
      console.error('Failed to load questions', err);
    } finally {
      setLoading(false);
    }
  };

  const currentQ = questions[currentIndex];

  const handleSelectOption = async (option: 'A' | 'B' | 'C' | 'D') => {
    if (!currentQ) return;
    if (userAnswers[currentQ.id] && mode === 'instant_feedback') return; // already answered in instant mode

    setUserAnswers(prev => ({ ...prev, [currentQ.id]: option }));
    if (mode === 'instant_feedback') {
      setShowExplanation(true);
      const isCorrect = option === currentQ.correct_option;
      if (!isCorrect && currentUser) {
        // Record mistake to notebook
        await api.updateMistakeMastery(currentQ.id, false);
      }
    }
  };

  const toggleBookmark = async () => {
    if (!currentQ) return;
    try {
      const res = await api.toggleBookmark(currentQ.id);
      setBookmarkedMap(prev => ({ ...prev, [currentQ.id]: res.isBookmarked }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReport = async () => {
    if (!currentQ) return;
    try {
      await api.submitReport({
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
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Quiz Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Subject selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
            >
              <option value="all">All Nursing Subjects</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {language === 'mr' ? s.name_mr : s.name_en}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard (NORCET Level)</option>
            </select>
          </div>

          {/* PYQ Toggle */}
          <div className="pt-4 flex items-center">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={pyqOnly}
                onChange={e => setPyqOnly(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Verified PYQs Only</span>
            </label>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('instant_feedback')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              mode === 'instant_feedback' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Instant Feedback Mode
          </button>
          <button
            onClick={() => setMode('exam_mode')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              mode === 'exam_mode' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Practice Exam Mode
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">Loading practice questions...</div>
      ) : questions.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No questions found matching your filter</h3>
          <p className="text-xs text-slate-500">Try resetting the difficulty or subject filter to practice.</p>
          <button
            onClick={() => { setSelectedSubject('all'); setSelectedDifficulty('all'); setPyqOnly(false); }}
            className="px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {currentQ.difficulty}
              </span>
              {currentQ.is_verified_pyq && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                  {currentQ.exam_name} {currentQ.exam_year}
                </span>
              )}
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Action Bar inside question */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              {/* Language display switcher for question */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setQuestionLang('both')}
                  className={`px-2 py-0.5 rounded ${questionLang === 'both' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600'}`}
                >
                  Both (EN + MR)
                </button>
                <button
                  onClick={() => setQuestionLang('en')}
                  className={`px-2 py-0.5 rounded ${questionLang === 'en' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600'}`}
                >
                  English
                </button>
                <button
                  onClick={() => setQuestionLang('mr')}
                  className={`px-2 py-0.5 rounded ${questionLang === 'mr' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600'}`}
                >
                  मराठी
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleBookmark}
                  className={`p-2 rounded-lg border transition cursor-pointer ${
                    bookmarkedMap[currentQ.id]
                      ? 'bg-amber-50 border-amber-300 text-amber-700'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                  title="Bookmark question"
                >
                  <Bookmark className="w-4 h-4" fill={bookmarkedMap[currentQ.id] ? 'currentColor' : 'none'} />
                </button>

                <button
                  onClick={() => setReportModalOpen(true)}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-slate-50 transition cursor-pointer"
                  title="Report question error"
                >
                  <Flag className="w-4 h-4" />
                </button>

                {onAskAiCoach && (
                  <button
                    onClick={() => onAskAiCoach(currentQ.question_en, currentQ.explanation_en)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold hover:bg-sky-100 transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    <span className="hidden sm:inline">Ask AI Coach</span>
                  </button>
                )}
              </div>
            </div>

            {/* Question Stem */}
            <div className="space-y-3">
              {(questionLang === 'both' || questionLang === 'en') && (
                <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                  {currentQ.question_en}
                </div>
              )}

              {(questionLang === 'both' || questionLang === 'mr') &&
                currentQ.question_mr &&
                currentQ.question_mr.trim().toLowerCase() !== currentQ.question_en.trim().toLowerCase() && (
                  <div className="text-sm sm:text-base font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                    {currentQ.question_mr}
                  </div>
                )}
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {(['A', 'B', 'C', 'D'] as const).map(optKey => {
                const optEn = currentQ[`option_${optKey.toLowerCase()}_en` as keyof Question] as string;
                const optMr = currentQ[`option_${optKey.toLowerCase()}_mr` as keyof Question] as string;
                const isSelected = userAnswers[currentQ.id] === optKey;
                const isCorrect = currentQ.correct_option === optKey;
                const isAnswered = !!userAnswers[currentQ.id];

                let optionStyle = 'bg-white border-slate-200 hover:border-teal-400 hover:bg-teal-50/30';
                if (mode === 'instant_feedback' && isAnswered) {
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-rose-50 border-rose-400 text-rose-950';
                  } else {
                    optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-teal-50 border-teal-600 text-teal-950 font-bold';
                }

                return (
                  <button
                    key={optKey}
                    onClick={() => handleSelectOption(optKey)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition cursor-pointer flex items-start gap-3.5 ${optionStyle}`}
                  >
                    <div className="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {optKey}
                    </div>
                    <div className="grow space-y-0.5">
                      <div className="text-sm font-medium text-slate-900">{optEn}</div>
                      {optMr &&
                        (questionLang === 'both' || questionLang === 'mr') &&
                        optMr.trim().toLowerCase() !== optEn.trim().toLowerCase() && (
                          <div className="text-xs text-slate-600">{optMr}</div>
                        )}
                    </div>
                    {mode === 'instant_feedback' && isAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    {mode === 'instant_feedback' && isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Box in Instant Mode */}
            {mode === 'instant_feedback' && showExplanation && (
              <div className="mt-6 pt-6 border-t border-slate-100 bg-emerald-50/50 rounded-xl p-5 border border-emerald-200/60 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    Correct Answer: Option {currentQ.correct_option} •{' '}
                    {currentQ.subject_id?.includes('gk') ||
                    currentQ.chapter_id?.includes('marathi') ||
                    currentQ.chapter_id?.includes('english')
                      ? 'Official Subject Reference & Rationale'
                      : 'Official Clinical Rationale'}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {currentQ.explanation_en}
                </div>

                {currentQ.explanation_mr && (
                  <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-emerald-100 leading-relaxed">
                    <strong className="block text-emerald-900 mb-0.5 font-bold">मराठी विश्लेषण:</strong>
                    {currentQ.explanation_mr}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <button
              disabled={currentIndex === 0}
              onClick={() => {
                setCurrentIndex(prev => prev - 1);
                setShowExplanation(!!userAnswers[questions[currentIndex - 1]?.id]);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              disabled={currentIndex >= questions.length - 1}
              onClick={() => {
                setCurrentIndex(prev => prev + 1);
                setShowExplanation(!!userAnswers[questions[currentIndex + 1]?.id]);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Report Question Issue</h3>
              <button onClick={() => setReportModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            {reportSuccess ? (
              <div className="py-6 text-center text-emerald-600 text-sm font-semibold">
                Report logged successfully! Our nursing reviewers will inspect this question.
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Issue Category</label>
                  <select
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="wrong_answer">Wrong Answer Key</option>
                    <option value="wrong_explanation">Inaccurate Medical Explanation</option>
                    <option value="translation_problem">Marathi Translation Discrepancy</option>
                    <option value="typographical_error">Typographical Error</option>
                    <option value="ambiguous">Ambiguous Clinical Question</option>
                    <option value="duplicate">Duplicate Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Details / Exam Key Discrepancy</label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={e => setReportDetails(e.target.value)}
                    placeholder="Describe why this option is incorrect or cite official exam syllabus/guidelines..."
                    className="w-full p-3 border border-slate-300 rounded-lg text-xs"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReport}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
                  >
                    Submit Report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
