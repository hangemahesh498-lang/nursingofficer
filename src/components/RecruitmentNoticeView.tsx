import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
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
  FileCheck
} from 'lucide-react';

export const RecruitmentNoticeView: React.FC = () => {
  const { language } = useLanguage();
  const [notices, setNotices] = useState<RecruitmentNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    async function loadNotices() {
      try {
        setLoading(true);
        const data = await api.getRecruitmentNotices();
        setNotices(data);
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
      n.eligibility_summary.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch = statusFilter === 'all' || n.status === statusFilter;
    return textMatch && statusMatch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {language === 'mr' ? 'अर्ज सुरू (Active)' : 'Applications Open'}
          </span>
        );
      case 'upcoming':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300 flex items-center gap-1.5">
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm mb-1">
          <Bell className="w-4 h-4" />
          <span>{language === 'mr' ? 'अधिकृत भरती व पात्रता तपशील' : 'Official Recruitment & Exam Pattern Portal'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {language === 'mr' ? 'नर्सिंग ऑफिसर भरती व अभ्यासक्रम' : 'Nursing Officer Vacancies & Exam Patterns'}
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-3xl">
          {language === 'mr'
            ? 'AIIMS NORCET, ESIC, RRB आणि राज्य आरोग्य सेवा (DMER/DHS) भरतीच्या अधिकृत तारखा, पात्रता निकष, वयोमर्यादा व परीक्षा पद्धती.'
            : 'Track official vacancy notifications, eligibility criteria, age limits, syllabus breakdowns, and exam dates across central and state nursing boards.'}
        </p>

        {/* Search & Filter */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={language === 'mr' ? 'संस्था किंवा पदाचे नाव शोधा...' : 'Search organization, post, or exam...'}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:bg-white"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:bg-white"
            >
              <option value="all">{language === 'mr' ? 'सर्व भरती सूचना (All Status)' : 'All Recruitment Status'}</option>
              <option value="active">{language === 'mr' ? 'अर्ज सुरू असलेल्या भरती (Active)' : 'Active Applications'}</option>
              <option value="upcoming">{language === 'mr' ? 'आगामी भरती (Upcoming)' : 'Upcoming Vacancies'}</option>
              <option value="closed">{language === 'mr' ? 'मुदत संपलेल्या भरती (Closed)' : 'Closed'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notices List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-medium">
          {language === 'mr' ? 'भरती माहिती लोड होत आहे...' : 'Loading recruitment notices...'}
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-500">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-slate-700">
            {language === 'mr' ? 'कोणतीही भरती सूचना सापडली नाही' : 'No recruitment notifications found'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredNotices.map(notice => (
            <div
              key={notice.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 hover:border-teal-300 transition shadow-xs"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    {getStatusBadge(notice.status)}
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                      {notice.year} Session
                    </span>
                    {notice.total_vacancies && (
                      <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                        {notice.total_vacancies.toLocaleString()} {language === 'mr' ? 'जागा' : 'Vacancies'}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {notice.post_name}
                  </h2>
                  <p className="text-sm font-semibold text-teal-800 flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-4 h-4" />
                    <span>{notice.organization}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {notice.official_website && (
                    <a
                      href={notice.official_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition flex items-center gap-1.5"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    <GraduationCap className="w-4 h-4 text-teal-600" />
                    <span>{language === 'mr' ? 'शैक्षणिक पात्रता' : 'Essential Eligibility'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {notice.eligibility_summary}
                  </p>
                </div>

                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <span>{language === 'mr' ? 'महत्त्वाच्या तारखा' : 'Important Timeline'}</span>
                  </div>
                  <div className="text-xs text-slate-700 space-y-1.5 font-medium">
                    <div>
                      <span className="text-slate-500">Apply Start:</span> {notice.application_start_date || 'TBA'}
                    </div>
                    <div>
                      <span className="text-slate-500">Last Date:</span>{' '}
                      <span className="font-bold text-rose-700">{notice.application_end_date || 'TBA'}</span>
                    </div>
                    {notice.age_limit && (
                      <div>
                        <span className="text-slate-500">Age Limit:</span> {notice.age_limit}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 md:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    <FileCheck className="w-4 h-4 text-teal-600" />
                    <span>{language === 'mr' ? 'परीक्षा पद्धत' : 'Exam Pattern'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {notice.exam_pattern_summary || 'Standard 100/200 MCQs pattern.'}
                  </p>
                </div>
              </div>

              {/* Disclaimer */}
              {notice.source_disclaimer && (
                <div className="mt-4 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{notice.source_disclaimer}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
