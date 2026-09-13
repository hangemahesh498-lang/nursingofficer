import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { Subject } from '../types';
import {
  BookOpen,
  ArrowRight,
  Search,
  Zap,
  Flame,
  Sparkles,
  HeartPulse,
  Stethoscope,
  Pill,
  Baby,
  Smile,
  Users,
  Activity,
  ShieldAlert,
  Brain,
  Layers
} from 'lucide-react';

interface SubjectsViewProps {
  onSelectSubject: (subjectId: string) => void;
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({ onSelectSubject }) => {
  const { language } = useLanguage();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const data = await api.getSubjects();
      setSubjects(data);
    } catch (err) {
      console.error('Failed to load subjects', err);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-white" />;
      case 'Stethoscope': return <Stethoscope className="w-5 h-5 text-white" />;
      case 'Pill': return <Pill className="w-5 h-5 text-white" />;
      case 'Baby': return <Baby className="w-5 h-5 text-white" />;
      case 'Smile': return <Smile className="w-5 h-5 text-white" />;
      case 'Users': return <Users className="w-5 h-5 text-white" />;
      case 'Activity': return <Activity className="w-5 h-5 text-white" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-white" />;
      case 'Brain': return <Brain className="w-5 h-5 text-white" />;
      case 'Layers': return <Layers className="w-5 h-5 text-white" />;
      default: return <Zap className="w-5 h-5 text-white" />;
    }
  };

  const totalMCQs = subjects.reduce((sum, s) => sum + (s.totalQuestions || 280), 0);

  const categories = [
    { id: 'all', label_en: 'All Chapters', label_mr: 'सर्व प्रकरणे' },
    { id: 'core_nursing', label_en: 'Core Nursing', label_mr: 'मुख्य नर्सिंग' },
    { id: 'allied_health', label_en: 'Allied Medical', label_mr: 'संबंधित वैद्यकीय' },
    { id: 'aptitude_gk', label_en: 'GK & Language', label_mr: 'सामान्य ज्ञान व भाषा' }
  ];

  const filteredSubjects = subjects.filter(s => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() ||
      s.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name_mr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description_mr && s.description_mr.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-3 sm:py-5 pb-24 space-y-4">
      {/* 1. COMPACT MASTER PRACTICE HERO (Clean, sleek, non-intrusive) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-4 sm:p-5 shadow-sm">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-amber-300 text-[10px] sm:text-xs font-black tracking-wider uppercase border border-white/20">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Master Practice Mode</span>
              </span>
              <span className="text-[11px] text-blue-100 font-semibold">
                {totalMCQs || 4791}+ प्रश्न
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              Start Practice MCQ Bank (सर्व प्रकरणे एकत्र)
            </h2>
            <p className="text-xs text-blue-100/90 leading-relaxed max-w-md">
              सर्व प्रकरणांमधील सर्व प्रश्न एकाच ठिकाणी एका लाईनने सोडवण्यासाठी सराव सुरू करा.
            </p>
          </div>

          <button
            onClick={() => onSelectSubject('all')}
            className="self-start sm:self-center inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-extrabold text-xs sm:text-sm shadow-md transition cursor-pointer shrink-0"
          >
            <span>सराव सुरू करा</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. SEARCH & CHAPTERS FILTER */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>प्रकरणे निवडा (Chapters List)</span>
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {filteredSubjects.length} प्रकरणे
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="प्रश्न किंवा प्रकरण सर्च करा..."
            className="w-full pl-10 pr-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {language === 'mr' ? cat.label_mr : cat.label_en}
            </button>
          ))}
        </div>
      </div>

      {/* 3. CHAPTERS LIST */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 text-sm">प्रकरणे लोड होत आहेत...</div>
      ) : filteredSubjects.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-700">कोणतेही प्रकरण सापडले नाही</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="text-xs text-blue-600 font-bold hover:underline"
          >
            फिल्टर पूर्ववत करा
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSubjects.map((sub, index) => {
            const chapterNum = index + 1;
            const mcqCount = sub.totalQuestions || 308;
            return (
              <div
                key={sub.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:border-blue-300 hover:shadow-xs transition space-y-2.5"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-3">
                    {/* Chapter Icon */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-xs">
                      {getSubjectIcon(sub.icon)}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          CHAPTER #{chapterNum}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.2 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                          {sub.name_en}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                        {sub.name_en}
                      </h4>
                    </div>
                  </div>

                  <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                    {mcqCount} MCQs
                  </span>
                </div>

                {/* Subtitle / Marathi Chapter Details */}
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800">
                    प्रकरण {chapterNum}: {sub.name_mr} ({sub.name_en})
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {sub.description_mr || sub.description_en}
                  </p>
                </div>

                {/* Footer Progress & Start Button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-medium text-slate-500">
                    उपलब्ध प्रश्न: {mcqCount}
                  </span>

                  <button
                    onClick={() => onSelectSubject(sub.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-xl transition cursor-pointer"
                  >
                    <span>सराव सुरू करा</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
