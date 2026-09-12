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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-2">
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span>Spaced Repetition Engine (1, 3, 7, 15, 30 Days)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            {language === 'mr' ? 'चूक वही आणि उजळणी डायरी' : 'Smart Mistake Notebook & Spaced Revision'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            {language === 'mr'
              ? 'सोडवताना चुकलेले सर्व प्रश्न येथे स्वयंचलितपणे जमा होतात. शास्त्रीय वेळेनुसार पुन्हा उजळणी करून चुकांवर प्रभुत्व मिळवा.'
              : 'Every incorrectly answered question is automatically collected here and scheduled using scientific spaced repetition intervals to eliminate recurring errors.'}
          </p>
        </div>

        {dueItems.length > 0 && (
          <button
            onClick={() => onStartRetest(dueItems.map(d => d.question_id))}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retest Today's Due ({dueItems.length})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter('due')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filter === 'due'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Due For Revision ({dueItems.length})
        </button>

        <button
          onClick={() => setFilter('unmastered')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filter === 'unmastered'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Unmastered ({unmasteredItems.length})
        </button>

        <button
          onClick={() => setFilter('mastered')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filter === 'mastered'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Mastered ({masteredItems.length})
        </button>

        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Mistakes ({mistakes.length})
        </button>
      </div>

      {/* List of Mistake Cards */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">Loading mistake notebook records...</div>
      ) : displayedList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">
            {filter === 'due' ? 'No mistakes currently due for revision!' : 'Mistake notebook is clean!'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Great work! Keep attempting practice questions and mock tests to strengthen your retention.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedList.map(item => {
            const q = item.question;
            const isDue = new Date(item.next_revision_at) <= now;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-amber-300 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Wrong {item.mistake_count}x times
                    </span>
                    <span className="text-slate-500">
                      Stage: Level {item.interval_days} Day Interval
                    </span>
                    {isDue && !item.is_mastered && (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold animate-pulse">
                        Due Today
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[11px]">
                      Next Review: {new Date(item.next_revision_at).toLocaleDateString()}
                    </span>

                    <button
                      onClick={() => toggleMastery(q.id, item.is_mastered)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        item.is_mastered
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{item.is_mastered ? 'Mastered ✓' : 'Mark Mastered'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-sm font-bold text-slate-900 leading-relaxed">
                  {q.question_en}
                </div>
                {q.question_mr && (
                  <div className="text-xs font-medium text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                    {q.question_mr}
                  </div>
                )}

                {/* Correct Answer & Rationale */}
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Correct Answer: Option {q.correct_option} — {q[`option_${q.correct_option.toLowerCase()}_en` as keyof Question] as string}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{q.explanation_en}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
