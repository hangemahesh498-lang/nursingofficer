import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { RecruitmentNotice } from '../types';
import {
  Bell,
  Building2,
  Calendar,
  GraduationCap,
  Briefcase,
  ExternalLink,
  Search,
  CheckCircle2,
  Info,
  Clock,
  FileCheck,
  Megaphone,
  Download,
  Sparkles,
  Users,
  IndianRupee,
  ChevronRight
} from 'lucide-react';

export const RecruitmentNoticeView: React.FC = () => {
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const [notices, setNotices] = useState<RecruitmentNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    async function loadNotices() {
      try {
        setLoading(true);
        const data = await api.getRecruitmentNotices();
        setNotices(data || []);
      } catch (err) {
        console.error('Failed to load recruitments:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNotices();
  }, []);

  const filteredNotices = notices.filter(n => {
    const textMatch =
      n.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.post_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.post_name_mr && n.post_name_mr.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (n.organization_mr && n.organization_mr.toLowerCase().includes(searchQuery.toLowerCase())) ||
      n.eligibility_summary.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch = statusFilter === 'all' || n.status === statusFilter;
    return textMatch && statusMatch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {language === 'mr' ? 'अर्ज सुरू (Active)' : 'Applications Open'}
          </span>
        );
      case 'upcoming':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300 flex items-center gap-1.5 shadow-2xs">
            <Clock className="w-3.5 h-3.5" />
            {language === 'mr' ? 'लवकरच येत आहे (Upcoming)' : 'Upcoming Notification'}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            {language === 'mr' ? 'मुदत संपली (Closed)' : 'Closed'}
          </span>
        );
    }
  };

  const getBannerGradient = (color?: string) => {
    switch (color) {
      case 'emerald':
        return 'from-emerald-800 via-teal-800 to-slate-900 border-emerald-500/40 text-white';
      case 'purple':
        return 'from-purple-900 via-indigo-900 to-slate-900 border-purple-500/40 text-white';
      case 'amber':
        return 'from-amber-800 via-orange-800 to-slate-900 border-amber-500/40 text-white';
      case 'rose':
        return 'from-rose-900 via-pink-900 to-slate-900 border-rose-500/40 text-white';
      case 'blue':
      default:
        return 'from-blue-900 via-indigo-950 to-slate-900 border-blue-500/40 text-white';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs sm:text-sm mb-1">
          <Megaphone className="w-4 h-4" />
          <span>{language === 'mr' ? 'अधिकृत भरती व नोकरी जाहिराती' : 'Official Recruitment & Vacancy Alerts'}</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {language === 'mr' ? 'नर्सिंग ऑफिसर अधिकृत जाहिराती' : 'Nursing Officer Recruitment Notifications'}
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
          {language === 'mr'
            ? 'महाराष्ट्र राज्य आरोग्य सेवा (DMER, DHS, ZP), केंद्र शासन (AIIMS NORCET, ESIC, RRB) च्या अधिकृत भरती जाहिराती, शैक्षणिक पात्रता, वयोमर्यादा व परीक्षा स्वरूप.'
            : 'Track official vacancy announcements, eligibility criteria, exam patterns, and direct apply links across central and state nursing directorates.'}
        </p>

        {/* Search & Filter */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={language === 'mr' ? 'जाहिरात किंवा पदाचे नाव शोधा...' : 'Search advertisement, post, or exam...'}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
            >
              <option value="all">{language === 'mr' ? 'सर्व जाहिराती (All Advertisements)' : 'All Advertisement Status'}</option>
              <option value="active">{language === 'mr' ? 'अर्ज सुरू असलेल्या जाहिराती (Active)' : 'Active Applications'}</option>
              <option value="upcoming">{language === 'mr' ? 'आगामी जाहिराती (Upcoming)' : 'Upcoming Vacancies'}</option>
              <option value="closed">{language === 'mr' ? 'मुदत संपलेल्या जाहिराती (Closed)' : 'Closed'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advertisements List or Empty State */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-medium">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          {language === 'mr' ? 'जाहिराती लोड होत आहेत...' : 'Loading recruitment notices...'}
        </div>
      ) : filteredNotices.length === 0 ? (
        /* USER REQUESTED EMPTY STATE: "सध्या जाहिराती उपलब्ध नाहीत" */
        <div className="p-8 sm:p-14 bg-white rounded-3xl border border-slate-200 text-center shadow-xs max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-2xs">
            <Megaphone className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'mr' ? 'सध्या जाहिराती उपलब्ध नाहीत' : 'Currently No Advertisements Available'}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-md mx-auto leading-relaxed">
              {language === 'mr'
                ? 'सध्या कोणतीही नवीन भरती जाहिरात किंवा अधिकृत अधिसूचना उपलब्ध नाही. DHS, DMER, AIIMS किंवा ESIC ची अधिकृत भरती जाहिरात प्रसिद्ध होताच येथे प्रसिद्ध केली जाईल.'
                : 'There are currently no active job advertisements or notifications. New vacancies will appear here as soon as official circulars are released.'}
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'mr' ? 'नवीन भरतीची सूचना लवकरच येईल' : 'New recruitment alerts soon'}</span>
            </span>
          </div>
        </div>
      ) : (
        /* ATTRACTIVE ADVERTISEMENT LISTING (आकर्षक जाहिरात) */
        <div className="space-y-6">
          {filteredNotices.map(notice => (
            <div
              key={notice.id}
              className="bg-white border-2 border-slate-200 hover:border-blue-300 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all"
            >
              {/* Eye-catching Banner Header */}
              <div className={`p-5 sm:p-7 bg-gradient-to-r ${getBannerGradient(notice.banner_color)} relative overflow-hidden`}>
                <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(notice.status)}
                      {notice.badge_text && (
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-amber-950 border border-amber-300 flex items-center gap-1 shadow-2xs">
                          <Sparkles className="w-3 h-3" />
                          <span>{notice.badge_text}</span>
                        </span>
                      )}
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-xs">
                        {notice.year} Session
                      </span>
                    </div>

                    <div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                        {notice.post_name_mr || notice.post_name}
                      </h2>
                      {notice.post_name_mr && notice.post_name && notice.post_name_mr !== notice.post_name && (
                        <p className="text-xs sm:text-sm font-semibold text-slate-300">
                          {notice.post_name}
                        </p>
                      )}
                      <p className="text-sm sm:text-base font-bold text-amber-300 flex items-center gap-1.5 mt-1">
                        <Building2 className="w-4 h-4 shrink-0" />
                        <span>{notice.organization_mr || notice.organization}</span>
                      </p>
                    </div>
                  </div>

                  {/* Top Right Action Buttons */}
                  <div className="flex flex-wrap md:flex-col items-stretch gap-2 shrink-0">
                    {notice.official_website && (
                      <a
                        href={notice.official_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <span>{language === 'mr' ? 'अधिकृत पोर्टल' : 'Official Portal'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {notice.pdf_url && isAdmin && (
                      <a
                        href={notice.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{language === 'mr' ? 'ॲडमिन: PDF जाहिरात डाऊनलोड' : 'Admin: Download PDF'}</span>
                      </a>
                    )}
                    {notice.pdf_url && !isAdmin && (
                      <a
                        href={notice.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{language === 'mr' ? 'जाहिरात ऑनलाईन पहा' : 'View Official Notice'}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Statistics Chips Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100 bg-slate-50 border-b border-slate-200">
                <div className="p-3.5 text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
                    <Users className="w-3 h-3 text-blue-600" />
                    <span>{language === 'mr' ? 'एकूण पदे' : 'Total Vacancies'}</span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-slate-900">
                    {notice.total_vacancies ? `${notice.total_vacancies.toLocaleString()} पदे` : 'अधिकृत जाहिरात पहा'}
                  </div>
                </div>

                <div className="p-3.5 text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
                    <IndianRupee className="w-3 h-3 text-emerald-600" />
                    <span>{language === 'mr' ? 'वेतनश्रेणी' : 'Salary / Pay Scale'}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {notice.salary_range_mr || notice.salary_range || 'Level-7 / नियमानुसार'}
                  </div>
                </div>

                <div className="p-3.5 text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
                    <Calendar className="w-3 h-3 text-rose-600" />
                    <span>{language === 'mr' ? 'शेवटची तारीख' : 'Last Date'}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-black text-rose-700">
                    {notice.application_end_date || 'लवकरच जाहीर होईल'}
                  </div>
                </div>

                <div className="p-3.5 text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
                    <GraduationCap className="w-3 h-3 text-indigo-600" />
                    <span>{language === 'mr' ? 'वयोमर्यादा' : 'Age Limit'}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {notice.age_limit || '18 ते 38 वर्षे'}
                  </div>
                </div>
              </div>

              {/* Highlights & Details Body */}
              <div className="p-5 sm:p-7 space-y-4">
                {/* Key Highlights Bullets */}
                {notice.highlights && notice.highlights.length > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                    <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{language === 'mr' ? 'जाहिरातीचे प्रमुख मुद्दे (Key Highlights)' : 'Notification Highlights'}</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {notice.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs font-semibold text-slate-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grid Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      <span>{language === 'mr' ? 'शैक्षणिक पात्रता' : 'Essential Eligibility'}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      {notice.eligibility_summary_mr || notice.eligibility_summary}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>{language === 'mr' ? 'महत्त्वाच्या तारखा' : 'Important Timeline'}</span>
                    </div>
                    <div className="text-xs text-slate-700 space-y-1.5 font-medium">
                      <div>
                        <span className="text-slate-500">{language === 'mr' ? 'अर्ज सुरुवात:' : 'Apply Start:'}</span>{' '}
                        <span className="font-semibold">{notice.application_start_date || 'TBA'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">{language === 'mr' ? 'अंतिम मुदत:' : 'Last Date:'}</span>{' '}
                        <span className="font-black text-rose-700">{notice.application_end_date || 'TBA'}</span>
                      </div>
                      {notice.age_limit && (
                        <div>
                          <span className="text-slate-500">{language === 'mr' ? 'वयोमर्यादा:' : 'Age Limit:'}</span>{' '}
                          <span>{notice.age_limit}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      <FileCheck className="w-4 h-4 text-blue-600" />
                      <span>{language === 'mr' ? 'परीक्षेचे स्वरूप' : 'Exam Pattern'}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      {notice.exam_pattern_summary_mr || notice.exam_pattern_summary || 'CBT परीक्षा: 100/200 बहुपर्यायी प्रश्न (MCQs).'}
                    </p>
                  </div>
                </div>

                {/* Disclaimer */}
                {notice.source_disclaimer && (
                  <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5 border-t border-slate-100">
                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{notice.source_disclaimer}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
