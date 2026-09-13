import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { Subject } from '../types';
import {
  BookOpen,
  ArrowRight,
  Filter,
  CheckCircle,
  HelpCircle,
  Stethoscope,
  Activity,
  Pill,
  Baby,
  Smile,
  ShieldAlert,
  Brain,
  Layers,
  HeartPulse,
  Users,
  Sparkles
} from 'lucide-react';

interface SubjectsViewProps {
  onSelectSubject: (subjectId: string) => void;
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({ onSelectSubject }) => {
  const { language } = useLanguage();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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
      case 'HeartPulse': return <HeartPulse className="w-6 h-6 text-rose-600" />;
      case 'Stethoscope': return <Stethoscope className="w-6 h-6 text-teal-600" />;
      case 'Pill': return <Pill className="w-6 h-6 text-blue-600" />;
      case 'Baby': return <Baby className="w-6 h-6 text-pink-600" />;
      case 'Smile': return <Smile className="w-6 h-6 text-amber-600" />;
      case 'Users': return <Users className="w-6 h-6 text-emerald-600" />;
      case 'Activity': return <Activity className="w-6 h-6 text-red-600" />;
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6 text-orange-600" />;
      case 'Brain': return <Brain className="w-6 h-6 text-purple-600" />;
      case 'Layers': return <Layers className="w-6 h-6 text-indigo-600" />;
      default: return <BookOpen className="w-6 h-6 text-teal-600" />;
    }
  };

  const categories = [
    { id: 'all', label_en: 'All Subjects', label_mr: 'सर्व विषय' },
    { id: 'core_nursing', label_en: 'Core Nursing', label_mr: 'मुख्य नर्सिंग' },
    { id: 'allied_health', label_en: 'Allied & Clinical Science', label_mr: 'संबंधित वैद्यकीय शास्त्र' },
    { id: 'aptitude_gk', label_en: 'GK & Language / Aptitude', label_mr: 'सामान्य ज्ञान व मराठी' }
  ];

  const filteredSubjects = selectedCategory === 'all'
    ? subjects
    : subjects.filter(s => s.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {language === 'mr' ? 'नर्सिंग अधिकारी परीक्षा अभ्यासक्रम व विषय' : 'Nursing Officer Syllabus & Subject Bank'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
            {language === 'mr'
              ? 'भारतीय नर्सिंग कौन्सिल (INC) आणि AIIMS NORCET मानकांनुसार वर्गीकृत केलेले सर्व आवश्यक विषय. प्रत्येक विषयातील महत्त्वाच्या संकल्पनांचा सराव करा.'
              : 'Structured strictly according to Indian Nursing Council (INC) syllabus standards. Choose any subject to begin focused MCQs, rationales, and clinical diagrams.'}
          </p>
        </div>

        {/* 5 Free MCQs Per Topic Highlight Card */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                <span>{language === 'mr' ? 'प्रत्येक टॉपिकचे ५ प्रश्न पूर्ण मोफत' : '5 Free MCQs Per Topic For All Students'}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-extrabold">
                  FREE
                </span>
              </h4>
              <p className="text-xs text-emerald-800">
                {language === 'mr'
                  ? 'सर्व विद्यार्थ्यांसाठी कोणत्याही विषयातील प्रत्येक टॉपिकचे ५ प्रश्न मोफत सोडवता येतात.'
                  : 'Start practicing without restrictions. Every topic includes 5 certified high-yield MCQs completely free.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {language === 'mr' ? cat.label_mr : cat.label_en}
          </button>
        ))}
      </div>

      {/* Subjects Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">Loading syllabus modules...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map(sub => (
            <div
              key={sub.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    {getSubjectIcon(sub.icon)}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      🆓 5 Free / Topic
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {sub.totalQuestions} Total MCQs
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {language === 'mr' ? sub.name_mr : sub.name_en}
                </h3>
                {language === 'mr' && (
                  <div className="text-xs text-slate-400 mb-2">{sub.name_en}</div>
                )}

                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {language === 'mr' ? sub.description_mr : sub.description_en}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400 capitalize">
                  {sub.category.replace('_', ' ')}
                </span>
                <button
                  onClick={() => onSelectSubject(sub.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-700 hover:text-white text-xs font-bold transition cursor-pointer"
                >
                  <span>{language === 'mr' ? 'सराव करा' : 'Start Practice'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
