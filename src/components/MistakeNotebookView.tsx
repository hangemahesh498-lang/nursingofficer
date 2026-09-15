import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { MistakeRecord, Question } from '../types';
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Calendar,
  BookOpen,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';

interface MistakeNotebookViewProps {
  onStartRetest: (questionIds: string[]) => void;
}

export const MistakeNotebookView: React.FC<MistakeNotebookViewProps> = ({ onStartRetest }) => {
  const { language, t } = useLanguage();
  const [mistakes, setMistakes] = useState<(MistakeRecord & { question: Question })[]>([]);
  const [filter, setFilter] = useState<'all' | 'due' | 'unmastered' | 'mastered'>('due');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMistakes();
  }, []);

  const loadMistakes = async () => {
    try {
      setLoading(true);
      const data = await api.getMistakes();
      setMistakes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMastery = async (qId: string, currentStatus: boolean) => {
    if (!qId) return;
    try {
      await api.updateMistakeMastery(qId, !currentStatus);
      setMistakes(prev =>
        prev.map(m =>
          m.question_id === qId ? { ...m, is_mastered: !currentStatus } : m
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const now = new Date();
  const dueItems = mistakes.filter(m => !m.is_mastered && new Date(m.next_revision_at) <= now);
  const unmasteredItems = mistakes.filter(m => !m.is_mastered);
  const masteredItems = mistakes.filter(m => m.is_mastered);

  const displayedList = (() => {
    switch (filter) {
      case 'due': return dueItems;
      case 'unmastered': return unmasteredItems;
      case 'mastered': return masteredItems;
      default: return mistakes;
    }
  })();

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-6 space-y-4 pb-24 sm:pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-black border border-amber-200">
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span>Spaced Repetition (1, 3, 7, 15, 30 Days)</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-black text-slate-900">
            {language === 'mr' ? 'चूक वही आणि उजळणी डायरी' : 'Smart Mistake Notebook & Spaced Revision'}
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            {language === 'mr'
              ? 'सोडवताना चुकलेले सर्व प्रश्न येथे स्वयंचलितपणे जमा होतात. शास्त्रीय वेळेनुसार पुन्हा उजळणी करून चुकांवर प्रभुत्व मिळवा.'
              : 'Every incorrectly answered question is automatically collected here and scheduled using scientific spaced repetition intervals to eliminate recurring errors.'}
          </p>
        </div>

        {dueItems.length > 0 && (
          <button
            onClick={() => onStartRetest(dueItems.map(d => d.question_id))}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retest Today's Due ({dueItems.length})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setFilter('due')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filter === 'due'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Due ({dueItems.length})
        </button>

        <button
          onClick={() => setFilter('unmastered')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filter === 'unmastered'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Unmastered ({unmasteredItems.length})
        </button>

        <button
          onClick={() => setFilter('mastered')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filter === 'mastered'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Mastered ({masteredItems.length})
        </button>

        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All ({mistakes.length})
        </button>
      </div>

      {/* List of Mistake Cards */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs font-medium">Loading mistake notebook records...</div>
      ) : displayedList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center space-y-2.5">
          <CheckCircle2 className="w-9 h-9 text-emerald-500 mx-auto" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            {filter === 'due' ? 'No mistakes currently due for revision!' : 'Mistake notebook is clean!'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Great work! Keep attempting practice questions and mock tests to strengthen your retention.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedList.filter(item => Boolean(item && item.id && item.question && item.question.id)).map(item => {
            const q = item.question;
            const isDue = new Date(item.next_revision_at) <= now;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3 hover:border-amber-300 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[10px]">
                      Wrong {item.mistake_count}x
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      Stage: {item.interval_days}d interval
                    </span>
                    {isDue && !item.is_mastered && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-black text-[10px] animate-pulse">
                        Due Today
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[10px]">
                      Next: {new Date(item.next_revision_at).toLocaleDateString()}
                    </span>

                    <button
                      onClick={() => toggleMastery(q.id, item.is_mastered)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                        item.is_mastered
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>{item.is_mastered ? 'Mastered ✓' : 'Master'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                  {q.question_en}
                </div>
                {q.question_mr && q.question_mr.trim().toLowerCase() !== q.question_en.trim().toLowerCase() && (
                  <div className="text-xs font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {q.question_mr}
                  </div>
                )}

                {/* Correct Answer & Rationale */}
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-1.5">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5 text-[11px] sm:text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Correct Option {q.correct_option}: {q[`option_${q.correct_option.toLowerCase()}_en` as keyof Question] as string}</span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">{q.explanation_en}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
