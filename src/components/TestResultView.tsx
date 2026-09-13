import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TestAttempt, Question } from '../types';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  Share2
} from 'lucide-react';

interface TestResultViewProps {
  attempt: TestAttempt;
  questions: Question[];
  onRetest: () => void;
  onGoToMistakes: () => void;
  onBackToDashboard: () => void;
}

export const TestResultView: React.FC<TestResultViewProps> = ({
  attempt,
  questions,
  onRetest,
  onGoToMistakes,
  onBackToDashboard
}) => {
  const { language } = useLanguage();
  const [filterType, setFilterType] = useState<'all' | 'wrong' | 'correct' | 'unattempted'>('all');

  const questionMap = new Map<string, Question>();
  questions.forEach(q => questionMap.set(q.id, q));

  const answersWithQuestions = attempt.answers.map(ans => ({
    ...ans,
    question: questionMap.get(ans.question_id)
  })).filter(a => !!a.question);

  const filteredAnswers = answersWithQuestions.filter(a => {
    if (filterType === 'wrong') return !a.is_correct && a.selected_option !== null;
    if (filterType === 'correct') return a.is_correct;
    if (filterType === 'unattempted') return a.selected_option === null;
    return true;
  });

  const percentage = Math.round((attempt.score / attempt.total_marks) * 100);
  const isQualified = percentage >= 50; // standard qualifying bench

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Result Card Hero */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isQualified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isQualified ? 'NORCET Qualified Range' : 'Remediation Recommended'}
              </span>
              <span className="text-xs text-slate-400">ID: {attempt.id.slice(0, 8)}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{attempt.test_title}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Completed on {new Date(attempt.completed_at).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRetest}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Test</span>
            </button>

            {attempt.wrong_count > 0 && (
              <button
                onClick={onGoToMistakes}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Open Mistake Notebook ({attempt.wrong_count})</span>
              </button>
            )}
          </div>
        </div>

        {/* Score Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 font-semibold mb-1">Final Score</div>
            <div className="text-2xl font-extrabold text-teal-700">
              {attempt.score} <span className="text-xs font-normal text-slate-400">/ {attempt.total_marks}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Includes -0.33 negative mark</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 font-semibold mb-1">Accuracy</div>
            <div className="text-2xl font-extrabold text-slate-900">{attempt.accuracy_percentage}%</div>
            <div className="text-[11px] text-slate-500 mt-1">
              {attempt.correct_count} of {attempt.correct_count + attempt.wrong_count} attempted
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 font-semibold mb-1">Time Invested</div>
            <div className="text-2xl font-extrabold text-slate-900">
              {Math.floor(attempt.time_spent_seconds / 60)}m {attempt.time_spent_seconds % 60}s
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              ~{Math.round(attempt.time_spent_seconds / (attempt.answers.length || 1))}s per question
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 font-semibold mb-1">Score Breakdown</div>
            <div className="flex items-center gap-2 text-xs font-bold mt-2">
              <span className="text-emerald-600">✓ {attempt.correct_count}</span>
              <span className="text-rose-600">✗ {attempt.wrong_count}</span>
              <span className="text-slate-400">○ {attempt.unattempted_count}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Question by Question Review Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900">
            Question-by-Question Clinical Review
          </h2>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All ({answersWithQuestions.length})
            </button>
            <button
              onClick={() => setFilterType('wrong')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterType === 'wrong' ? 'bg-rose-500 text-white shadow-xs' : 'text-rose-700'
              }`}
            >
              Incorrect ({attempt.wrong_count})
            </button>
            <button
              onClick={() => setFilterType('correct')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterType === 'correct' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700'
              }`}
            >
              Correct ({attempt.correct_count})
            </button>
            <button
              onClick={() => setFilterType('unattempted')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterType === 'unattempted' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Skipped ({attempt.unattempted_count})
            </button>
          </div>
        </div>

        {/* Questions Detailed Review List */}
        <div className="space-y-4">
          {filteredAnswers.map((item, idx) => {
            const q = item.question!;
            const isAnswered = item.selected_option !== null;
            const isCorrect = item.is_correct;

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl border p-6 shadow-xs space-y-4 ${
                  !isAnswered
                    ? 'border-slate-200'
                    : isCorrect
                    ? 'border-emerald-200 bg-emerald-50/10'
                    : 'border-rose-200 bg-rose-50/10'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Item #{idx + 1}</span>
                  <div className="flex items-center gap-2">
                    {!isAnswered ? (
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                        Unattempted
                      </span>
                    ) : isCorrect ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+1.00)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect (-0.33)
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-sm font-bold text-slate-900 leading-relaxed">
                  {q.question_en}
                </div>
                {q.question_mr && q.question_mr.trim().toLowerCase() !== q.question_en.trim().toLowerCase() && (
                  <div className="text-xs font-medium text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                    {q.question_mr}
                  </div>
                )}

                {/* Options Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(['A', 'B', 'C', 'D'] as const).map(optKey => {
                    const optEn = q[`option_${optKey.toLowerCase()}_en` as keyof Question] as string;
                    const isUserChoice = item.selected_option === optKey;
                    const isCorrectChoice = q.correct_option === optKey;

                    let optStyle = 'border-slate-200 bg-white text-slate-700';
                    if (isCorrectChoice) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                    } else if (isUserChoice && !isCorrectChoice) {
                      optStyle = 'border-rose-500 bg-rose-50 text-rose-950 font-semibold';
                    }

                    return (
                      <div
                        key={optKey}
                        className={`p-3 rounded-xl border flex items-center justify-between ${optStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md border flex items-center justify-center font-bold text-[11px]">
                            {optKey}
                          </span>
                          <span>{optEn}</span>
                        </div>
                        {isCorrectChoice && <span className="text-emerald-700 text-[11px] font-bold">Correct</span>}
                        {isUserChoice && !isCorrectChoice && <span className="text-rose-700 text-[11px] font-bold">Your Choice</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Rationale */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                    <span>Clinical Rationale / स्पष्टीकरण:</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{q.explanation_en}</p>
                  {q.explanation_mr && (
                    <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                      {q.explanation_mr}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 flex justify-center">
        <button
          onClick={onBackToDashboard}
          className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};
