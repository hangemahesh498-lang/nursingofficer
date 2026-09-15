import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { CaseStudy, Question } from '../types';
import {
  Activity,
  User,
  Heart,
  FileText,
  CheckCircle2,
  XCircle,
  Stethoscope,
  Sparkles,
  ArrowRight,
  Layers,
  ChevronRight
} from 'lucide-react';

export const ClinicalCaseView: React.FC = () => {
  const { language } = useLanguage();
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [caseQuestions, setCaseQuestions] = useState<Question[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      setLoading(true);
      const data = await api.getCases();
      setCases(data);
      if (data.length > 0) {
        selectCase(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectCase = async (c: CaseStudy) => {
    setSelectedCase(c);
    setSelectedOptions({});
    try {
      const qs = await api.getQuestions({ case_id: c.id });
      setCaseQuestions(qs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (questionId: string, opt: 'A' | 'B' | 'C' | 'D') => {
    setSelectedOptions(prev => ({ ...prev, [questionId]: opt }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 mb-2">
          <Activity className="w-3.5 h-3.5" />
          <span>NORCET Stage II Clinical Vignette Scenarios</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          {language === 'mr' ? 'क्लिनिकल केस स्टडीज आणि निर्णय चाचणी' : 'Clinical Vignettes & Scenario Solver'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {language === 'mr'
            ? 'रुग्णांची वास्तविक लक्षणे, वाइटल सायन्स (BP, SpO2, HR, RR), आणि प्रयोगशाळा तपासणी अहवालांवर आधारित मल्टी-स्टेप नर्सिंग निर्णय.'
            : 'Evaluate clinical patient vignettes with real vital signs, lab investigations, and linked multi-step nursing priority decisions.'}
        </p>
      </div>

      {/* Case Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {cases.map(c => (
          <button
            key={c.id}
            onClick={() => selectCase(c)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
              selectedCase?.id === c.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c.title_en}
          </button>
        ))}
      </div>

      {selectedCase && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Sticky Clinical Vignette (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs lg:sticky lg:top-24 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-rose-600" />
                <span>Patient Vignette</span>
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {selectedCase.patient_age} Yrs / {selectedCase.patient_gender}
              </span>
            </div>

            {/* Case Scenario Narrative */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">
                {language === 'mr' ? selectedCase.title_mr : selectedCase.title_en}
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedCase.scenario_en}
              </p>
              {selectedCase.scenario_mr && (
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                  <strong className="block text-slate-800 font-bold mb-0.5">मराठी माहिती:</strong>
                  {selectedCase.scenario_mr}
                </p>
              )}
            </div>

            {/* Vital Signs Grid */}
            {selectedCase.vitals && Object.keys(selectedCase.vitals).length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Current Vital Signs & Monitor
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(selectedCase.vitals).map(([key, val]) => (
                    <div key={key} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="text-[10px] uppercase text-slate-400 font-bold">{key}</div>
                      <div className="text-xs font-extrabold text-slate-900">{String(val)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lab & Clinical Investigations */}
            {selectedCase.investigations && Object.keys(selectedCase.investigations).length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Diagnostic Reports & Labs
                </span>
                <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100 text-xs space-y-1">
                  {Object.entries(selectedCase.investigations).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-slate-600 capitalize font-medium">{key.replace('_', ' ')}:</span>
                      <span className="font-bold text-rose-900">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Linked Clinical MCQs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Linked Decision Questions ({caseQuestions.length})
              </h2>
              <span className="text-xs text-slate-500">Solve based on patient parameters</span>
            </div>

            {(caseQuestions || []).filter(q => Boolean(q && q.id)).map((q, idx) => {
              const selected = selectedOptions[q.id];
              const isAnswered = !!selected;
              const isCorrect = selected === q.correct_option;

              return (
                <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-teal-700 font-bold">Step {idx + 1} Assessment</span>
                    {isAnswered && (
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isCorrect ? 'Correct Decision' : 'Incorrect Choice'}
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-bold text-slate-900 leading-relaxed">
                    {q.question_en}
                  </div>
                  {q.question_mr && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                      {q.question_mr}
                    </div>
                  )}

                  {/* Options */}
                  <div className="space-y-2 pt-1">
                    {(['A', 'B', 'C', 'D'] as const).map(optKey => {
                      const optEn = q[`option_${optKey.toLowerCase()}_en` as keyof Question] as string;
                      const isOptionSelected = selected === optKey;
                      const isOptionCorrect = q.correct_option === optKey;

                      let style = 'bg-white border-slate-200 hover:border-slate-300';
                      if (isAnswered) {
                        if (isOptionCorrect) {
                          style = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                        } else if (isOptionSelected && !isOptionCorrect) {
                          style = 'bg-rose-50 border-rose-500 text-rose-950 font-semibold';
                        } else {
                          style = 'bg-slate-50 border-slate-100 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optKey}
                          onClick={() => handleSelect(q.id, optKey)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition cursor-pointer flex items-center justify-between ${style}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded border flex items-center justify-center font-bold text-[11px] shrink-0">
                              {optKey}
                            </span>
                            <span>{optEn}</span>
                          </div>
                          {isAnswered && isOptionCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                          {isAnswered && isOptionSelected && !isOptionCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Rationale displayed upon answer */}
                  {isAnswered && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="font-bold text-slate-900">Clinical Protocol & Rationale:</div>
                      <p className="text-slate-700 leading-relaxed">{q.explanation_en}</p>
                      {q.explanation_mr && (
                        <p className="text-slate-600 pt-1 text-[11px] border-t border-slate-200/60 mt-1">
                          {q.explanation_mr}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
