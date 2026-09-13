import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { Subject, TestAttempt } from '../types';
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
  CreditCard
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: string, filter?: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();
  const [stats, setStats] = useState<any>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [currentUser]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [sData, subs] = await Promise.all([
        api.getStudentStats(),
        api.getSubjects()
      ]);
      setStats(sData);
      setSubjects(subs);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Target Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {language === 'mr' ? `स्वागत आहे, ${currentUser?.name}` : `Welcome back, ${currentUser?.name}`}
            </h1>
            <span className="bg-teal-100 text-teal-800 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-teal-200">
              {currentUser?.targetExam || 'AIIMS NORCET'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'mr'
              ? 'आजचे ध्येय पूर्ण करा आणि तुमच्या कमकुवत विषयांवर लक्ष केंद्रित करा.'
              : 'Stay consistent. 20 focused questions a day builds unbeatable exam confidence.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('practice')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
          >
            <Zap className="w-4 h-4" />
            <span>{t('startPractice')}</span>
          </button>

          <button
            onClick={() => onNavigate('mock-tests')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{t('startTest')}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Target Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>{t('dailyTarget')}</span>
            <Target className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-extrabold text-slate-900">{questionsSolvedToday}</span>
            <span className="text-xs text-slate-500">/ {dailyTarget} Qs</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-teal-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${targetProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Overall Accuracy */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>{t('overallAccuracy')}</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-extrabold text-slate-900">{stats?.overallAccuracy || 0}%</span>
            <span className="text-xs text-slate-500">{stats?.totalQuestionsSolved || 0} attempts</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {stats?.overallAccuracy >= 75 ? 'Excellent accuracy (NORCET cut-off target)' : 'Aim for > 70% accuracy'}
          </p>
        </div>

        {/* Mistake Notebook & Spaced Repetition */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>{t('dueForRevision')}</span>
            <RotateCcw className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-extrabold text-amber-600">{stats?.dueForRevisionCount || 0}</span>
            <span className="text-xs text-slate-500">of {stats?.totalMistakes || 0} mistakes</span>
          </div>
          <button
            onClick={() => onNavigate('mistakes')}
            className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer mt-1"
          >
            <span>Review Mistakes</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Streak & Points */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>{t('streak')}</span>
            <Flame className="w-4 h-4 text-orange-500 fill-orange-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-extrabold text-slate-900">{currentUser?.streakDays || 1}</span>
            <span className="text-xs text-slate-500">Days Active</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-sky-600" />
            <span>Total: {currentUser?.points || 0} XP</span>
          </div>
        </div>
      </div>

      {/* Smart Weakness Engine Alert */}
      {stats?.weakSubjects && stats.weakSubjects.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-900 mb-1">
                  {t('weakSubjects')} ({stats.weakSubjects.length})
                </h3>
                <p className="text-xs text-amber-800 mb-2">
                  Our algorithm detected accuracy below 65% in these subjects based on your recent answers:
                </p>
                <div className="flex flex-wrap gap-2">
                  {stats.weakSubjects.map((w: any) => (
                    <span
                      key={w.subject_id}
                      className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-xs font-semibold text-amber-900 shadow-2xs"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('materials')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-400 transition cursor-pointer shadow-xs flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">
                {language === 'mr' ? 'अभ्यास साहित्य व सूत्रे' : 'Study Notes & Charts'}
              </div>
              <div className="text-[11px] text-slate-500">
                {language === 'mr' ? 'पार्कलँड, GCS व लसीकरण' : 'High-Yield PDFs & Reference'}
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition" />
        </div>

        <div
          onClick={() => onNavigate('recruitment')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-400 transition cursor-pointer shadow-xs flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">
                {language === 'mr' ? 'भरती सूचना व पात्रता' : 'Recruitment Alerts'}
              </div>
              <div className="text-[11px] text-slate-500">
                {language === 'mr' ? 'NORCET, ESIC व राज्य भरती' : 'AIIMS, ESIC, State Vacancies'}
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition" />
        </div>

        <div
          onClick={() => onNavigate('upgrade-pro')}
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-5 rounded-2xl font-bold transition cursor-pointer shadow-xs flex items-center justify-between group hover:opacity-95"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-950/10 text-slate-950 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-slate-950 text-sm">
                {language === 'mr' ? 'PRO अनलॉक करा' : 'Upgrade to PRO'}
              </div>
              <div className="text-[11px] text-slate-900/80 font-medium">
                {language === 'mr' ? 'अमर्यादित मॉक व सर्व नोट्स' : 'Full Simulator & VIP Support'}
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition" />
        </div>
      </div>

      {/* High-Yield Nursing Pearl of the Day */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>{language === 'mr' ? 'आजचे महत्त्वाचे क्लिनिकल सूत्र (High Yield Exam Pearl)' : 'Daily High-Yield NORCET Pearl'}</span>
        </div>
        <h3 className="text-base sm:text-lg font-bold mb-2">
          {language === 'mr'
            ? 'पार्कलँड बर्न फॉर्म्युला (Parkland Formula for Fluid Resuscitation)'
            : 'Parkland Formula for 24-Hour Fluid Resuscitation in Severe Burns'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
          {language === 'mr'
            ? 'सूत्र: ४ मिली × शरीराचे वजन (किलो) × एकूण भाजलेली टक्केवारी (% TBSA). पहिल्या ८ तासांत ५०% फ्लूइड (Ringer Lactate) दिले जाते, आणि उर्वरित ५०% पुढील १६ तासांत दिले जाते.'
            : 'Formula: 4 mL × Body Weight (kg) × % Total Body Surface Area (TBSA) burned. Administer 50% of the total calculated Ringer Lactate in the first 8 hours from time of burn injury, and the remaining 50% over the next 16 hours.'}
        </p>
        <button
          onClick={() => onNavigate('ai-coach', { topic: 'Parkland Burns Formula' })}
          className="text-xs font-semibold text-teal-300 hover:text-teal-200 flex items-center gap-1 cursor-pointer"
        >
          <span>{language === 'mr' ? 'एआय कोचला अधिक स्पष्टीकरण विचारा' : 'Ask AI Study Coach to simplify this concept'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Launch Subjects & Recent Attempts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core Subjects Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              {language === 'mr' ? 'अभ्यासक्रम विषय' : 'Nursing Core Subjects'}
            </h2>
            <button
              onClick={() => onNavigate('subjects')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({subjects.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subjects.slice(0, 6).map(sub => (
              <div
                key={sub.id}
                onClick={() => onNavigate('practice', { subject_id: sub.id })}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-xs transition cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 mb-0.5">
                    {language === 'mr' ? sub.name_mr : sub.name_en}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {sub.totalQuestions} Questions Available
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:text-teal-600">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Test Attempts */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            {language === 'mr' ? 'अलीकडील चाचण्या' : 'Recent Mock Attempts'}
          </h2>

          {stats?.recentAttempts && stats.recentAttempts.length > 0 ? (
            <div className="space-y-2.5">
              {stats.recentAttempts.map((att: TestAttempt) => (
                <div key={att.id} className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs shadow-xs">
                  <div className="font-bold text-slate-900 truncate mb-1">{att.test_title}</div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Score: <strong className="text-teal-700 font-bold">{att.score}</strong> / {att.total_marks}</span>
                    <span>Acc: <strong className="text-slate-800 font-bold">{att.accuracy_percentage}%</strong></span>
                    <span>{new Date(att.completed_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
              <Clock className="w-6 h-6 mx-auto mb-2 text-slate-400" />
              <p className="font-medium text-slate-700 mb-1">No mock tests attempted yet</p>
              <p className="mb-4">Test your readiness with official 1/3 negative marking simulation.</p>
              <button
                onClick={() => onNavigate('mock-tests')}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold text-xs cursor-pointer hover:bg-slate-800"
              >
                Browse Mock Tests
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
