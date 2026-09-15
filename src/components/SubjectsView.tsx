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
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    loadSubjects();
    api.getSettings().then(setSettings).catch(() => {});
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

  const colorGradients = [
    'from-amber-500 to-orange-600',
    'from-teal-500 to-emerald-600',
    'from-purple-500 to-indigo-600',
    'from-blue-600 to-cyan-600',
    'from-rose-500 to-pink-600',
    'from-indigo-600 to-blue-700'
  ];

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-3 sm:py-5 pb-24 space-y-4">
      {/* Top Live Announcement Ticker (Inspired by Screenshot 1) */}
      <div className="overflow-hidden rounded-xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-1.5 px-3 flex items-center gap-2 shadow-2xs">
        <span className="shrink-0 px-1.5 py-0.5 rounded bg-rose-600 text-[10px] font-black uppercase tracking-wider animate-pulse">
          LIVE
        </span>
        <div className="text-[11px] font-medium text-slate-200 truncate flex items-center gap-4">
          <span>
            {language === 'mr'
              ? (settings?.chapter_banner_text_mr || '📢 DHS / DMER महाराष्ट्र आरोग्य भरती परीक्षा सराव उपलब्ध')
              : (settings?.chapter_banner_text_en || '📢 DHS / DMER Maharashtra Health Exam Practice Available')}
          </span>
          <span className="text-amber-300">•</span>
          <span>📢 सर्व 18 प्रकरणांमधील 4000+ बहुपर्यायी प्रश्न (MCQs) समाविष्ट</span>
          <span className="text-amber-300">•</span>
          <span>📢 मोफत मॉक टेस्ट #1 सुरू करा</span>
        </div>
      </div>

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
            const gradient = colorGradients[index % colorGradients.length];

            return (
              <div
                key={sub.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:border-blue-300 hover:shadow-xs transition space-y-3"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-3">
                    {/* Colorful Chapter Icon Matching Screenshot 1 & 2 */}
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${gradient} flex items-center justify-center shrink-0 shadow-xs`}>
                      {getSubjectIcon(sub.icon)}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          CHAPTER #{chapterNum}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                          {sub.category.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                        {sub.name_en}
                      </h4>
                    </div>
                  </div>

                  <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-black border border-slate-200">
                    {mcqCount} MCQs
                  </span>
                </div>

                {/* Subtitle / Marathi Chapter Details */}
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-800">
                    प्रकरण {chapterNum}: {sub.name_mr} ({sub.name_en})
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {sub.description_mr || sub.description_en}
                  </p>
                </div>

                {/* Progress Bar (Matching Screenshot 1 & 2) */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                    <span>प्रगती (Progress)</span>
                    <span className="font-bold text-slate-700">0 / {mcqCount} सोडवले (0%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full w-0" />
                  </div>
                </div>

                {/* Footer Progress & Start Button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-medium text-slate-400">
                    INC अभ्यासक्रमानुसार प्रमाणित
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
