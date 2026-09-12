import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { Question } from '../types';
import {
  History,
  CheckCircle2,
  Calendar,
  Filter,
  ArrowRight,
  BookOpen,
  Award
} from 'lucide-react';

export const PyqView: React.FC = () => {
  const { language } = useLanguage();
  const [pyqs, setPyqs] = useState<Question[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPyqs();
  }, []);

  const loadPyqs = async () => {
    try {
      setLoading(true);
      const data = await api.getQuestions({ is_verified_pyq: true, status: 'published' });
      setPyqs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPyqs = pyqs.filter(q => {
    if (selectedExam !== 'all' && q.exam_name !== selectedExam) return false;
    if (selectedYear !== 'all' && String(q.exam_year) !== selectedYear) return false;
    return true;
  });

  const exams = Array.from(new Set(pyqs.map(q => q.exam_name).filter(Boolean)));
  const years = Array.from(new Set(pyqs.map(q => q.exam_year).filter(Boolean)));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
            <History className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Verified Official Answer Keys</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            {language === 'mr' ? 'मागील वर्षांचे प्रश्न (PYQs)' : 'Previous Year Questions (PYQ) Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Official questions from AIIMS NORCET, ESIC, and State Nursing recruitment examinations.
          </p>
        </div>

        {/* Filter dropdowns */}
        <div className="flex items-center gap-3">
          <select
            value={selectedExam}
            onChange={e => setSelectedExam(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="all">All Examinations</option>
            {exams.map(ex => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="all">All Years</option>
            {years.map(yr => (
              <option key={yr} value={String(yr)}>{yr}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">Loading verified PYQ archive...</div>
      ) : filteredPyqs.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
          No questions found matching your filter selection.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPyqs.map(q => {
            const isExpanded = expandedId === q.id;

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-emerald-300 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {q.exam_name} {q.exam_year}
                    </span>
                    {q.shift && (
                      <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Shift {q.shift}
                      </span>
                    )}
                    <span className="text-slate-400 capitalize">{q.difficulty}</span>
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    className="text-xs font-bold text-teal-700 hover:text-teal-800 cursor-pointer"
                  >
                    {isExpanded ? 'Hide Answer & Rationale' : 'View Official Rationale'}
                  </button>
                </div>

                <div className="text-sm font-bold text-slate-900 leading-relaxed">
                  {q.question_en}
                </div>
                {q.question_mr && (
                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                    {q.question_mr}
                  </div>
                )}

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(['A', 'B', 'C', 'D'] as const).map(optKey => {
                    const optEn = q[`option_${optKey.toLowerCase()}_en` as keyof Question] as string;
                    const isCorrect = q.correct_option === optKey;

                    return (
                      <div
                        key={optKey}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          isExpanded && isCorrect
                            ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-950'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded border flex items-center justify-center font-bold text-[11px]">
                            {optKey}
                          </span>
                          <span>{optEn}</span>
                        </div>
                        {isExpanded && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {isExpanded && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                      <span>Official Medical Rationale & Textbook Reference</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{q.explanation_en}</p>
                    {q.explanation_mr && (
                      <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                        {q.explanation_mr}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
