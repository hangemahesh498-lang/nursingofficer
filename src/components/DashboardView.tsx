import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { Subject, TestAttempt, SystemSettings } from '../types';
import {
  Target,
  CheckCircle2,
  AlertCircle,
  Clock,
  Flame,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  RotateCcw,
  Zap,
  FileText,
  Bell,
  CreditCard,
  ShieldCheck,
  User,
  Film,
  LogOut,
  UserPlus,
  X,
  BookOpen,
  Send
} from 'lucide-react';
import { PromoVideoPlayer } from './PromoVideoPlayer';
import { SuccessStoriesSection } from './SuccessStoriesSection';
import { YouTubeLecturesSection } from './YouTubeLecturesSection';
import { ComplianceFooter } from './ComplianceFooter';

interface DashboardViewProps {
  onNavigate: (tab: string, filter?: any) => void;
  openLoginModal?: (tab: 'member' | 'admin', registerMode?: boolean) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, openLoginModal }) => {
  const { currentUser, signOut } = useAuth();
  const { language, t } = useLanguage();
  const [stats, setStats] = useState<any>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthChoiceModal, setShowAuthChoiceModal] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, [currentUser]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [sData, subs, setts] = await Promise.all([
        api.getStudentStats(),
        api.getSubjects(),
        api.getSettings().catch(() => null)
      ]);
      setStats(sData);
      setSubjects(subs);
      setSettings(setts);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPracticeClick = () => {
    if (!currentUser) {
      setShowAuthChoiceModal(true);
    } else {
      onNavigate('practice');
    }
  };

  const handleStartMockTestClick = () => {
    if (!currentUser) {
      setShowAuthChoiceModal(true);
    } else {
      onNavigate('mock-tests');
    }
  };

  const getSubjectName = (id: string) => {
    const s = subjects.find(item => item.id === id);
    if (!s) return id;
    return language === 'mr' ? s.name_mr : s.name_en;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mr-3"></div>
        <span>Loading preparation analytics...</span>
      </div>
    );
  }

  const dailyTarget = currentUser?.dailyTarget || 20;
  const questionsSolvedToday = stats?.totalQuestionsSolved || 0;
  const targetProgress = Math.min(100, Math.round((questionsSolvedToday / dailyTarget) * 100));

  const telegramUsername = settings?.telegram_username?.replace(/^@/, '') || 'NursingOfficerSupport';
  const telegramContactUrl = settings?.telegram_contact_url || `https://t.me/${telegramUsername}`;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4 sm:space-y-6 pb-24 sm:pb-12">
      {/* Welcome & Target Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-lg sm:text-2xl font-black text-slate-900">
              {currentUser
                ? (language === 'mr' ? `स्वागत आहे, ${currentUser.name}` : `Welcome back, ${currentUser.name}`)
                : (language === 'mr' ? 'नर्सिंग भरती परीक्षा सराव पोर्टलवर आपले स्वागत आहे!' : 'Welcome to Nursing Officer Exam Portal!')}
            </h1>
            <span className="bg-blue-50 text-blue-800 text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-full border border-blue-200">
              {currentUser?.targetExam || (language === 'mr' ? 'AIIMS NORCET + महा स्टाफ नर्स' : 'NORCET & Maha Staff Nurse')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'mr'
              ? 'AIIMS NORCET, ESIC व महा स्टाफ नर्स भरतीसाठी दर्जेदार MCQs आणि मॉक टेस्ट्स.'
              : 'High-yield MCQs and mock tests for AIIMS NORCET, ESIC & Maha Staff Nurse exams.'}
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {currentUser && ['admin', 'super_admin', 'reviewer', 'content_editor'].includes(currentUser.role) && (
            <button
              id="dashboard-admin-cms-btn"
              onClick={() => onNavigate('admin-cms')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === 'mr' ? 'अ‍ॅडमिन पोर्टल' : 'Admin CMS'}</span>
            </button>
          )}

          {/* Quick Sign Out button if logged in */}
          {currentUser && (
            <button
              id="dashboard-signout-btn"
              onClick={() => signOut()}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer shadow-2xs"
              title="Sign Out of Account"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>{language === 'mr' ? 'बाहेर पडा' : 'Sign Out'}</span>
            </button>
          )}

          {/* If Guest (Not Logged in), show direct Register and Login CTA buttons */}
          {!currentUser && openLoginModal && (
            <>
              <button
                onClick={() => openLoginModal('member', true)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs sm:text-sm font-black transition cursor-pointer shadow-sm"
              >
                <UserPlus className="w-4 h-4 text-yellow-300" />
                <span>{language === 'mr' ? 'नोंदणी करा (Register)' : 'Register'}</span>
              </button>

              <button
                onClick={() => openLoginModal('member', false)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs sm:text-sm font-bold transition cursor-pointer shadow-2xs"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span>{language === 'mr' ? 'लॉगिन करा (Login)' : 'Login'}</span>
              </button>
            </>
          )}

          {/* Telegram Contact Admin Button (Compact & neat) */}
          <a
            id="dashboard-telegram-contact-btn"
            href={telegramContactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs sm:text-sm font-bold transition cursor-pointer shadow-xs active:scale-98"
            title={language === 'mr' ? 'टेलिग्रामवर आमच्याशी संपर्क साधा' : 'Contact Us on Telegram'}
          >
            <Send className="w-3.5 h-3.5 text-sky-100 shrink-0" />
            <span>{language === 'mr' ? 'टेलिग्राम संपर्क' : 'Telegram Support'}</span>
          </a>

          <button
            onClick={handleStartPracticeClick}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition cursor-pointer shadow-md"
          >
            <Zap className="w-4 h-4" />
            <span>{t('startPractice')}</span>
          </button>

          <button
            onClick={handleStartMockTestClick}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition cursor-pointer shadow-md"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{t('startTest')}</span>
          </button>
        </div>
      </div>

      {/* Auth Prompt Modal on Click of Start Practice / Test for unauthenticated guests */}
      {showAuthChoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              onClick={() => setShowAuthChoiceModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-md">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {language === 'mr' ? 'सराव सुरू करा' : 'Start Preparation Practice'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {language === 'mr'
                  ? 'सराव सुरू करण्यासाठी आणि तुमची उत्तरे सुरक्षित सेव्ह करण्यासाठी कृपया नवीन खात्याची नोंदणी करा किंवा लॉगिन करा.'
                  : 'To track your solved questions, accuracy, and save progress, please Register or Login.'}
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {/* Option 1: Register */}
              <button
                onClick={() => {
                  setShowAuthChoiceModal(false);
                  if (openLoginModal) openLoginModal('member', true);
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-yellow-300" />
                <span>{language === 'mr' ? 'नवीन नोंदणी करा (Register Now)' : 'Register New Account'}</span>
              </button>

              {/* Option 2: Login */}
              <button
                onClick={() => {
                  setShowAuthChoiceModal(false);
                  if (openLoginModal) openLoginModal('member', false);
                }}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>{language === 'mr' ? 'खात्यामध्ये लॉगिन करा (Login)' : 'Login to Existing Account'}</span>
              </button>

              {/* Option 3: Continue as Guest Demo */}
              <button
                onClick={() => {
                  setShowAuthChoiceModal(false);
                  onNavigate('practice');
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === 'mr' ? '५ विनामूल्य प्रश्न डेमो सुरू करा (Guest Trial)' : 'Continue with 5 Free Demo Questions'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Interactive Blue Banner: Chapter-wise MCQ Question Bank & Practice */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-blue-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-blue-300 text-xs font-black uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{language === 'mr' ? 'विषयनिहाय एमसीक्यू सराव व प्रश्नपेढी' : 'Chapter-wise MCQ Question Bank'}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              {language === 'mr' ? 'सर्व विषयांच्या एमसीक्यू (MCQs) चा सराव सुरू करा' : 'Start Practice MCQs Across All Nursing Subjects'}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              {language === 'mr'
                ? 'AIIMS NORCET, ESIC, DMER व आरोग्य भरतीनुसार १८ विषय, मागील प्रश्न आणि सविस्तर स्पष्टीकरणांसह सराव करा.'
                : 'Practice 18+ Nursing core subjects with authentic negative marking, instant explanations, and bookmarks.'}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleStartPracticeClick}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-2 active:scale-98"
            >
              <Zap className="w-4.5 h-4.5 text-yellow-300" />
              <span>{language === 'mr' ? 'एमसीक्यू सराव सुरू करा' : 'Start MCQ Practice'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Subject Chips inside the Blue Banner */}
        {subjects.length > 0 && (
          <div className="mt-4 pt-4 border-t border-blue-800/80 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {subjects.slice(0, 6).map((sub) => (
              <button
                key={sub.id}
                onClick={() => onNavigate('practice', { subject_id: sub.id })}
                className="px-3 py-2 rounded-xl bg-blue-950/80 hover:bg-blue-800/90 text-blue-100 hover:text-white text-xs font-bold border border-blue-700/60 transition cursor-pointer text-left truncate flex items-center justify-between group"
              >
                <span className="truncate">{language === 'mr' ? sub.name_mr : sub.name_en}</span>
                <ArrowRight className="w-3 h-3 text-blue-400 group-hover:translate-x-0.5 transition shrink-0 ml-1" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Daily Target Card */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-500 mb-1.5">
            <span>{t('dailyTarget')}</span>
            <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-1.5 mb-1.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900">{questionsSolvedToday}</span>
            <span className="text-[11px] text-slate-400">/ {dailyTarget} Qs</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${targetProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Overall Accuracy */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-500 mb-1.5">
            <span>{t('overallAccuracy')}</span>
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900">{stats?.overallAccuracy || 0}%</span>
            <span className="text-[10px] text-slate-400">{stats?.totalQuestionsSolved || 0} Qs</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
            {stats?.overallAccuracy >= 75 ? 'Excellent accuracy' : 'Aim for > 70%'}
          </p>
        </div>

        {/* Mistake Notebook & Spaced Repetition */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-500 mb-1.5">
            <span>{t('dueForRevision')}</span>
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-xl sm:text-2xl font-black text-amber-600">{stats?.dueForRevisionCount || 0}</span>
            <span className="text-[10px] text-slate-400">of {stats?.totalMistakes || 0}</span>
          </div>
          <button
            onClick={() => onNavigate('mistakes')}
            className="text-[10px] sm:text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Review Mistakes</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Streak & Points */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-500 mb-1.5">
            <span>{t('streak')}</span>
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 fill-orange-400" />
          </div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900">{currentUser?.streakDays || 1}</span>
            <span className="text-[10px] text-slate-400">Days</span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 flex items-center gap-1 truncate">
            <Award className="w-3 h-3 text-blue-600 shrink-0" />
            <span>{currentUser?.points || 0} XP</span>
          </div>
        </div>
      </div>

      {/* Smart Weakness Engine Alert */}
      {stats?.weakSubjects && stats.weakSubjects.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-amber-900 mb-1">
                  {t('weakSubjects')} ({stats.weakSubjects.length})
                </h3>
                <p className="text-[11px] sm:text-xs text-amber-800 mb-2">
                  Our algorithm detected accuracy below 65% in these subjects based on your recent answers:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {stats.weakSubjects.map((w: any) => (
                    <span
                      key={w.subject_id}
                      className="px-2 py-0.5 bg-white border border-amber-300 rounded-lg text-[11px] font-bold text-amber-900 shadow-2xs"
                    >
                      {getSubjectName(w.subject_id)} ({w.accuracy}%)
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('practice', { subject_id: stats.weakSubjects[0].subject_id })}
              className="self-start sm:self-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs shrink-0"
            >
              {language === 'mr' ? 'कमकुवत विषयांचा सराव करा' : 'Practice Weak Topics'}
            </button>
          </div>
        </div>
      )}

      {/* Quick Resource Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
        <div
          onClick={() => onNavigate('materials')}
          className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 hover:border-blue-400 transition cursor-pointer shadow-2xs flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">
                {language === 'mr' ? 'अभ्यास साहित्य व सूत्रे' : 'Study Notes & Charts'}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500">
                {language === 'mr' ? 'पार्कलँड, GCS व लसीकरण' : 'High-Yield PDFs & Reference'}
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition shrink-0" />
        </div>

        <div
          onClick={() => onNavigate('recruitment')}
          className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 hover:border-blue-400 transition cursor-pointer shadow-2xs flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">
                {language === 'mr' ? 'भरती सूचना व पात्रता' : 'Recruitment Alerts'}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500">
                {language === 'mr' ? 'NORCET, ESIC व राज्य भरती' : 'AIIMS, ESIC, State Vacancies'}
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition shrink-0" />
        </div>

        <div
          onClick={() => onNavigate('upgrade-pro')}
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-3.5 sm:p-5 rounded-2xl font-bold transition cursor-pointer shadow-2xs flex items-center justify-between group hover:opacity-95"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-950/10 text-slate-950 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-slate-950 text-xs sm:text-sm font-black">
                {language === 'mr' ? 'PRO अनलॉक करा' : 'Upgrade to PRO'}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-900/80 font-semibold">
                {language === 'mr' ? 'अमर्यादित मॉक व सर्व नोट्स' : 'Full Simulator & VIP Support'}
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition shrink-0" />
        </div>
      </div>

      {/* High-Yield Nursing Pearl of the Day */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 text-blue-300 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'mr' ? 'आजचे महत्त्वाचे क्लिनिकल सूत्र (High Yield Exam Pearl)' : 'Daily High-Yield NORCET Pearl'}</span>
        </div>
        <h3 className="text-sm sm:text-base font-bold mb-1.5">
          {language === 'mr'
            ? 'पार्कलँड बर्न फॉर्म्युला (Parkland Formula for Fluid Resuscitation)'
            : 'Parkland Formula for 24-Hour Fluid Resuscitation in Severe Burns'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3 font-medium">
          {language === 'mr'
            ? 'सूत्र: ४ मिली × शरीराचे वजन (किलो) × एकूण भाजलेली टक्केवारी (% TBSA). पहिल्या ८ तासांत ५०% फ्लूइड (Ringer Lactate) दिले जाते, आणि उर्वरित ५०% पुढील १६ तासांत दिले जाते.'
            : 'Formula: 4 mL × Body Weight (kg) × % Total Body Surface Area (TBSA) burned. Administer 50% of the total calculated Ringer Lactate in the first 8 hours from time of burn injury, and the remaining 50% over the next 16 hours.'}
        </p>
        <button
          onClick={() => onNavigate('ai-coach', { topic: 'Parkland Burns Formula' })}
          className="text-xs font-bold text-blue-300 hover:text-blue-200 flex items-center gap-1 cursor-pointer"
        >
          <span>{language === 'mr' ? 'अभ्यास मार्गदर्शक नोट्स पहा' : 'View Concept Study Guide'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Launch Subjects & Recent Attempts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Core Subjects Grid */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-black text-slate-900">
              {language === 'mr' ? 'अभ्यासक्रम विषय' : 'Nursing Core Subjects'}
            </h2>
            <button
              onClick={() => onNavigate('subjects')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({subjects.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {subjects.slice(0, 6).map(sub => (
              <div
                key={sub.id}
                onClick={() => onNavigate('practice', { subject_id: sub.id })}
                className="bg-white p-3.5 rounded-xl border border-slate-200/90 hover:border-blue-400 hover:shadow-2xs transition cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 mb-0.5">
                    {language === 'mr' ? sub.name_mr : sub.name_en}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500">
                    {sub.totalQuestions} Questions Available
                  </div>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:text-blue-600">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Test Attempts */}
        <div className="space-y-3">
          <h2 className="text-sm sm:text-base font-black text-slate-900">
            {language === 'mr' ? 'अलीकडील चाचण्या' : 'Recent Mock Attempts'}
          </h2>

          {stats?.recentAttempts && stats.recentAttempts.length > 0 ? (
            <div className="space-y-2">
              {stats.recentAttempts.map((att: TestAttempt) => (
                <div key={att.id} className="bg-white p-3 rounded-xl border border-slate-200/90 text-xs shadow-2xs">
                  <div className="font-bold text-slate-900 truncate mb-1">{att.test_title}</div>
                  <div className="flex items-center justify-between text-slate-500 text-[10px] sm:text-[11px]">
                    <span>Score: <strong className="text-blue-600 font-bold">{att.score}</strong> / {att.total_marks}</span>
                    <span>Acc: <strong className="text-slate-800 font-bold">{att.accuracy_percentage}%</strong></span>
                    <span>{new Date(att.completed_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-5 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500 space-y-1">
              <Clock className="w-5 h-5 mx-auto text-slate-400 mb-1" />
              <p className="font-bold text-slate-800">No mock tests attempted yet</p>
              <p className="text-[11px]">Test your readiness with official 1/3 negative marking simulation.</p>
              <button
                onClick={() => onNavigate('mock-tests')}
                className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-xs cursor-pointer hover:bg-slate-800"
              >
                Browse Mock Tests
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Video Lectures & Strategy Promo Video Player */}
      <PromoVideoPlayer screen="dashboard" onNavigateTab={onNavigate} />

      {/* Hall of Fame - Successful Students */}
      <SuccessStoriesSection />

      {/* Admin Controlled YouTube Lectures & Masterclasses */}
      <YouTubeLecturesSection />
    </div>
  );
};
