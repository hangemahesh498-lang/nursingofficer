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
  Edit2,
  CreditCard,
  Calendar
} from 'lucide-react';
import { LoginModal } from './LoginModal';
import { CompliancePoliciesModal, PolicyTab } from './CompliancePoliciesModal';

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
  const [plans, setPlans] = useState<any[]>([]);
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
      const [data, fetchedPlans] = await Promise.all([
        api.getStudentStats().catch(() => null),
        api.getPaymentPlans().catch(() => [])
      ]);
      setStats(data);
      setPlans(fetchedPlans.filter(p => p.is_active));
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

      {/* 2. Subscription Plan & Payment Details Card */}
      {(() => {
        const featuredPlan = plans.find(p => p.popular) || plans[0] || { price: 199, duration_label_mr: 'महिना प्रवेश', name: 'PRO Master Plan' };
        const minPrice = plans.length > 0 ? Math.min(...plans.map(p => p.price)) : featuredPlan.price;
        const daysLeft = currentUser?.daysRemaining ?? (isPro ? 90 : 0);
        const planName = currentUser?.planName || (isPro ? 'PRO VIP All-Access Pass' : 'मोफत योजना (Free Access)');
        const paidAmount = (currentUser as any)?.planAmount || (isPro ? 499 : 0);
        const paymentMethod = (currentUser as any)?.paymentMethod || (isPro ? 'Manual QR (PhonePe/GPay UPI UTR)' : '-');

        return (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-2xl ${isPro ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-700'}`}>
                  <Crown className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                    <span>सदस्यत्व व भरलेली फी सविस्तर माहिती</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    तुमचा सध्याचा प्लॅन, शिल्लक दिवस आणि पेमेंट तपशील
                  </p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-black border uppercase tracking-wider ${
                isPro
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {isPro ? 'सक्रिय (ACTIVE)' : 'FREE PLAN'}
              </span>
            </div>

            {/* Main Stats Summary Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Days Remaining */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>शिल्लक दिवस (Duration Remaining)</span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {isPro ? `${daysLeft} दिवस` : '0 दिवस'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {isPro ? 'अनलिमिटेड MCQ व टेस्ट्स चालू' : 'अपग्रेड करा अमर्यादित प्रवेशासाठी'}
                </div>
              </div>

              {/* Amount Paid */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>भरलेली फी (Amount Paid)</span>
                </div>
                <div className="text-xl font-black text-emerald-700">
                  {isPro ? `₹${paidAmount}` : '₹0 (Free)'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {isPro ? 'यशस्वीरीत्या प्राप्त व व्हेरिफाइड' : 'विनाशुल्क मर्यादित सराव'}
                </div>
              </div>

              {/* Plan Name */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>सध्याचा प्लॅन (Current Plan)</span>
                </div>
                <div className="text-sm font-black text-slate-900 truncate">
                  {planName}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {isPro ? 'सर्व 18 विषयांचे PDF व टेस्ट सिरीज' : 'मोफत सराव मोड'}
                </div>
              </div>
            </div>

            {/* Payment Mode & Reference Details (If Paid) */}
            {isPro && (
              <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/80 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900">पेमेंट प्रकार / UTR संदर्भ: </span>
                    <span className="font-mono text-slate-800 bg-white px-2 py-0.5 rounded border border-blue-200">{paymentMethod}</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  मान्य वैधता: सर्व 18 विषय मोकळे
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-1 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={onNavigateToUpgradePro}
                className="w-full py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-extrabold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>{isPro ? 'प्लॅन नूतनीकरण करा / नवीन प्लॅन पहा' : `आता प्लॅन निवडा व अपग्रेड करा (₹${minPrice} पासून)`}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })()}

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
