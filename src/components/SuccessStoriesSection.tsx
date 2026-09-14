import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { SuccessfulStudent, SystemSettings } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Award, CheckCircle2, Building2, MapPin, Quote, Sparkles, GraduationCap } from 'lucide-react';

export const SuccessStoriesSection: React.FC = () => {
  const { language } = useLanguage();
  const [students, setStudents] = useState<SuccessfulStudent[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [list, sysSettings] = await Promise.all([
        api.getSuccessfulStudents(false),
        api.getSettings()
      ]);
      setStudents(list.filter(s => s.is_active !== false));
      setSettings(sysSettings);
    } catch (err) {
      console.error('Failed to load successful students:', err);
    } finally {
      setLoading(false);
    }
  };

  // Hide if master toggle is OFF or if no students available
  if (loading || (settings && settings.show_successful_students_section === false) || students.length === 0) {
    return null;
  }

  return (
    <section id="successful-students-section" className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl p-4 sm:p-6 shadow-md border border-slate-800 my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-[11px] sm:text-xs font-black uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{language === 'mr' ? 'यशस्वी विद्यार्थी व अधिकारी' : 'Wall of Achievement'}</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
            <span>🏆 {language === 'mr' ? 'आमचे यशस्वी विद्यार्थी (Hall of Fame)' : 'Our Successful Aspirants'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            {language === 'mr'
              ? 'मराठीतील विशेष टेस्ट सिरीज व सराव संच वापरून शासकीय सेवेत रुजू झालेले नर्सिंग अधिकारी'
              : 'Nursing Officers successfully appointed in Maharashtra DHS, DMER, and AIIMS NORCET'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{language === 'mr' ? '१००% प्रमाणित निवडी' : '100% Certified Appointments'}</span>
        </div>
      </div>

      {/* Grid of Student Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <div
            key={student.id}
            className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 rounded-xl p-4 transition duration-200 shadow-sm flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start gap-3.5 mb-3">
                <div className="relative shrink-0">
                  <img
                    src={student.photo_url || 'https://images.unsplash.com/photo-1594824813571-28a77885097a?auto=format&fit=crop&q=80&w=300'}
                    alt={student.student_name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-amber-400/80 shadow-xs group-hover:scale-105 transition"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full shadow-2xs" title="Verified Selection">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-amber-400 text-slate-950" />
                  </span>
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="font-black text-sm sm:text-base text-white truncate group-hover:text-amber-300 transition">
                    {student.student_name}
                  </h3>

                  <div className="inline-flex items-center gap-1 bg-blue-900/60 text-blue-200 border border-blue-700/50 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md max-w-full truncate">
                    <GraduationCap className="w-3 h-3 text-blue-400 shrink-0" />
                    <span className="truncate">{student.selected_post}</span>
                  </div>

                  {student.marks_or_rank && (
                    <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{student.marks_or_rank}</span>
                    </div>
                  )}

                  {student.exam_batch && (
                    <div className="text-[10px] text-slate-400 font-medium">
                      बैच: {student.exam_batch}
                    </div>
                  )}
                </div>
              </div>

              {/* Posting Location */}
              <div className="bg-slate-900/80 border border-slate-700/60 rounded-lg p-2.5 mb-3 flex items-start gap-2 text-xs text-slate-300">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="font-semibold text-slate-200 line-clamp-2">{student.posting_location}</span>
              </div>

              {/* Testimonial */}
              {student.testimonial_mr && (
                <div className="relative bg-slate-950/50 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 italic leading-relaxed">
                  <Quote className="w-3.5 h-3.5 text-slate-600 inline mr-1" />
                  "{student.testimonial_mr}"
                </div>
              )}
            </div>

            <div className="mt-3 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[10px] text-slate-400">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                शासकीय सेवेत सेवारत
              </span>
              <span>नर्सिंग ऑफिसर प्लॅटफॉर्म विद्यार्थी</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
