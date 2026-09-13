import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';

interface StudentProfileStats {
  totalQuestionsSolved?: number;
  overallAccuracy?: number;
  testsAttempted?: number;
  dueForRevisionCount?: number;
  accuracyPercentage?: number;
  streakDays?: number;
}
import {
  User,
  ShieldCheck,
  Crown,
  BookOpen,
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Languages,
  LogOut,
  ChevronRight,
  Flame,
  Target,
  Sparkles,
  FileText,
  RotateCcw,
  Zap,
  Lock,
  Smartphone,
  Mail,
  Edit2
} from 'lucide-react';
import { LoginModal } from './LoginModal';

interface ProfileViewProps {
  onNavigateToUpgradePro: () => void;
  onNavigateToMockTests: () => void;
  onNavigateToMistakes: () => void;
  onNavigateToSubjects: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onNavigateToUpgradePro,
  onNavigateToMockTests,
  onNavigateToMistakes,
  onNavigateToSubjects
}) => {
  const { currentUser, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [stats, setStats] = useState<StudentProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [targetExam, setTargetExam] = useState<string>(
    currentUser?.targetExam || 'DHS / DMER महाराष्ट्र आरोग्य विभाग & AIIMS NORCET'
  );
  const [dailyGoal, setDailyGoal] = useState<number>(currentUser?.dailyTarget || 20);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    loadProfileStats();
  }, [currentUser]);

  const loadProfileStats = async () => {
    try {
      setLoading(true);
      const data = await api.getStudentStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load profile stats', err);
    } finally {
      setLoading(false);
    }
  };

  const isPro = currentUser?.role === 'pro_member' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'super_admin' ||
    (currentUser as any)?.isProMember;

  const handleResetProgress = async () => {
    try {
      // Clear localStorage questions cache
      localStorage.removeItem('user_practice_answers');
      setResetSuccess(true);
      setShowResetConfirm(false);
      setTimeout(() => setResetSuccess(false), 3000);
      loadProfileStats();
    } catch (err) {
      console.error('Reset failed', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-28 space-y-4">
      {/* 1. Profile Top Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-xs relative overflow-hidden">
        {/* Background gradient banner */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800" />

        <div className="relative pt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1 shadow-md border-2 border-white">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-2xl flex items-center justify-center shadow-inner">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              {isPro && (
                <span className="absolute -bottom-1 -right-1 p-1 bg-amber-400 text-amber-950 rounded-full shadow-xs border border-white" title="PRO Member">
                  <Crown className="w-3.5 h-3.5 fill-current" />
                </span>
              )}
            </div>

            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {currentUser?.name || 'परीक्षार्थी (Aspirant)'}
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wide ${
                  isPro
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {isPro ? '★ PRO VIP' : 'FREE PLAN'}
                </span>
              </div>

              <div className="flex flex-col text-xs text-slate-500 font-medium">
                {currentUser?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{currentUser.email}</span>
                  </span>
                )}
                {currentUser?.phone && (
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-slate-400" />
                    <span>{currentUser.phone}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLoginModalOpen(true)}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            {currentUser ? (language === 'mr' ? 'खाते बदला / स्विच' : 'Switch Account') : (language === 'mr' ? 'लॉगिन करा' : 'Login')}
          </button>
        </div>

        {/* Target Exam Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Target className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-bold text-slate-800">लक्ष्य परीक्षा:</span>
            <span className="text-slate-600 truncate max-w-[200px] sm:max-w-sm">{targetExam}</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            सक्रिय (Active)
          </span>
        </div>
      </div>

      {/* 2. Premium VIP Lifetime Access Banner (Matching Image 8 from screenshots) */}
      {!isPro ? (
        <div className="rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-4 sm:p-5 text-slate-950 shadow-sm relative overflow-hidden space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/10 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                <Crown className="w-3 h-3 fill-current" />
                <span>NursingPrep Premium</span>
              </span>
              <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                Unlock Complete Nursing MCQ Bank & Mock Tests
              </h3>
              <p className="text-xs text-slate-900 font-medium">
                4000+ Questions, सर्व 18 विषय, सविस्तर स्पष्टीकरणे आणि अमर्यादित मॉक टेस्ट्स.
              </p>
            </div>

            <div className="bg-slate-950 text-white p-2.5 rounded-2xl text-center shrink-0 shadow-md">
              <span className="text-[9px] font-bold block text-amber-400">LIFETIME</span>
              <span className="text-lg font-black leading-none block">₹100</span>
              <span className="text-[8px] text-slate-400 block mt-0.5">एकदाच शुल्क</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToUpgradePro}
            className="w-full py-2.5 bg-slate-950 hover:bg-black text-amber-400 font-black rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-98"
          >
            <span>आता अपग्रेड करा (₹100 आजीवन प्रवेश)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-600 text-white rounded-xl">
              <Crown className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="text-xs font-black text-emerald-950">PRO VIP सदस्यत्व सक्रिय</div>
              <div className="text-[10px] text-emerald-700">सर्व 18 प्रकरणे, अमर्यादित मॉक टेस्ट्स व PDF डाऊनलोड सुरू आहेत.</div>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-lg">
            आजीवन (Lifetime)
          </span>
        </div>
      )}

      {/* 3. Study Statistics Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 px-1">
          <Award className="w-3.5 h-3.5 text-blue-600" />
          <span>{language === 'mr' ? 'अभ्यास प्रगती व आकडेवारी' : 'Study Progress & Statistics'}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Total Questions Solved */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase">एकूण सोडवले</span>
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900">
              {stats?.totalQuestionsSolved || 0}
            </div>
            <div className="text-[10px] text-slate-500">प्रश्नांचा सराव</div>
          </div>

          {/* Accuracy */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase">अचूकता दर</span>
              <Target className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-emerald-600">
              {stats?.overallAccuracy || 0}%
            </div>
            <div className="text-[10px] text-slate-500">Accuracy Rate</div>
          </div>

          {/* Mock Tests */}
          <div
            onClick={onNavigateToMockTests}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1 hover:border-blue-300 transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase">मॉक टेस्ट्स</span>
              <FileText className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900">
              {stats?.testsAttempted || 0}
            </div>
            <div className="text-[10px] text-slate-500">चाचण्या दिल्या ➔</div>
          </div>

          {/* Mistakes Due */}
          <div
            onClick={onNavigateToMistakes}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1 hover:border-amber-300 transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase">चूक वही</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-amber-600">
              {stats?.dueForRevisionCount || 0}
            </div>
            <div className="text-[10px] text-slate-500">रिव्हिजन बाकी ➔</div>
          </div>
        </div>
      </div>

      {/* 4. App Security & Anti-Leak Shield Status (User Requested Feature) */}
      <div className="bg-white rounded-2xl border border-blue-200/80 p-3.5 sm:p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                <span>अ‍ॅप स्क्रीनशॉट व कॉपी प्रतिबंध (Security Shield)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500">
                परीक्षेची अखंडता व अधिकृत प्रश्न सुरक्षिततेसाठी स्क्रीनशॉट बंदी पूर्णपणे सक्रिय आहे.
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200 shrink-0">
            PROTECTED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>स्क्रीनशॉट कीज (PrintScreen/Snipping) ब्लॉक</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>मजकूर कॉपी व उजवे क्लिक (Right Click) बंद</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>विंडो बाहेर जाताच ब्लर शील्ड (Blur Shield)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>डायनॅमिक वॉटरमार्क युझर ट्रॅकिंग सक्रिय</span>
          </div>
        </div>
      </div>

      {/* 5. Settings & Preferences */}
      <div className="bg-white rounded-2xl border border-slate-200/90 divide-y divide-slate-100 shadow-2xs overflow-hidden text-xs">
        {/* Language Selection */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-slate-800">
            <Languages className="w-4 h-4 text-blue-600" />
            <div>
              <span className="font-bold">अ‍ॅप भाषा (Language)</span>
              <p className="text-[10px] text-slate-500">मराठी किंवा इंग्रजीत प्रश्न व स्पष्टीकरणे</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLanguage(language === 'mr' ? 'en' : 'mr')}
            className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-blue-700 font-black transition cursor-pointer"
          >
            {language === 'mr' ? 'मराठी (बदला)' : 'English (Change)'}
          </button>
        </div>

        {/* Daily Target Setting */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-slate-800">
            <Flame className="w-4 h-4 text-amber-500" />
            <div>
              <span className="font-bold">दररोजचे उद्दिष्ट (Daily Goal)</span>
              <p className="text-[10px] text-slate-500">रोज किती प्रश्नांचा सराव करायचा आहे</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[20, 50, 100].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => setDailyGoal(val)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  dailyGoal === val
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Study Data Option */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-slate-800">
            <RotateCcw className="w-4 h-4 text-rose-500" />
            <div>
              <span className="font-bold">सराव डेटा रीसेट करा</span>
              <p className="text-[10px] text-slate-500">स्थानिक सराव उत्तरे साफ करून नव्याने सुरू करा</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 transition cursor-pointer"
          >
            रीसेट
          </button>
        </div>

        {/* Sign Out / Account */}
        {currentUser && (
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-800">
              <LogOut className="w-4 h-4 text-slate-400" />
              <div>
                <span className="font-bold">साइन आउट (Sign Out)</span>
                <p className="text-[10px] text-slate-500">सध्याच्या खात्यातून बाहेर पडा</p>
              </div>
            </div>
            <button
              type="button"
              onClick={signOut}
              className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
            >
              लॉगआउट
            </button>
          </div>
        )}
      </div>

      {resetSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold text-center animate-in fade-in">
          ✓ स्थानिक सराव प्रगती यशस्वीपणे रीसेट केली आहे!
        </div>
      )}

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black text-slate-900">सराव डेटा नक्की रीसेट करायचा आहे का?</h4>
            <p className="text-xs text-slate-500">
              याने तुमचे स्थानिक सेव्ह केलेले उत्तरे साफ होतील आणि तुम्ही पहिल्या प्रश्नापासून पुन्हा सुरुवात करू शकाल.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200"
              >
                रद्द करा
              </button>
              <button
                type="button"
                onClick={handleResetProgress}
                className="flex-1 py-2 bg-rose-600 text-white font-bold rounded-xl text-xs hover:bg-rose-700 shadow-xs"
              >
                होय, रीसेट करा
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Version Stamp */}
      <div className="text-center pt-2 text-[11px] text-slate-400 font-medium">
        Nursing Officer Preparation Platform • v1.5.0 Production • महाराष्ट्र आरोग्य विभाग
      </div>

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        defaultTab="member"
      />
    </div>
  );
};
