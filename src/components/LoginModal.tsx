import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { MAHARASHTRA_DISTRICTS } from '../data/districts';
import {
  ShieldCheck,
  User,
  Lock,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'member' | 'admin';
  initialRegisterMode?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'member',
  initialRegisterMode = false
}) => {
  const { allUsers, currentUser, switchUser, signInWithGoogle, registerUser, loginWithCredentials } = useAuth();
  const { language } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<'member' | 'admin'>(defaultTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  // Member Form
  const [memberEmail, setMemberEmail] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberMobile, setMemberMobile] = useState('');
  const [memberDistrict, setMemberDistrict] = useState('');
  const [memberPass, setMemberPass] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(initialRegisterMode);
  
  // Admin Form - Empty by default for strict security
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Status & loading
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Handle Quick Switch from modal
  const handleQuickSwitch = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await switchUser(userId);
      setSuccess(language === 'mr' ? 'यशस्वीरित्या लॉगिन झाले!' : 'Logged in successfully!');
      setTimeout(() => {
        onClose();
      }, 400);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Member Login / Register
  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isRegisterMode) {
        if (!memberName.trim() || !memberEmail.trim()) {
          throw new Error(language === 'mr' ? 'कृपया नाव आणि ईमेल टाका' : 'Please enter name and email');
        }
        if (!memberMobile || memberMobile.trim().length < 10) {
          throw new Error(language === 'mr' ? 'कृपया १० अंकी मोबाईल नंबर टाका' : 'Please enter a valid 10-digit mobile number');
        }
        if (!memberDistrict) {
          throw new Error(language === 'mr' ? 'कृपया तुमचा जिल्हा निवडा' : 'Please select your district from Maharashtra');
        }
        if (!memberPass || memberPass.length < 4) {
          throw new Error(language === 'mr' ? 'किमान ४ अक्षरांचा पासवर्ड द्या' : 'Please set a password (min 4 characters)');
        }
        await registerUser({
          name: memberName.trim(),
          email: memberEmail.trim(),
          mobile: memberMobile.trim(),
          district: memberDistrict,
          password: memberPass,
          role: 'student',
          targetExam: 'AIIMS NORCET + महाराष्ट्र स्टाफ नर्स (सर्व एकत्र)'
        });
        setSuccess(language === 'mr' ? 'नवीन विद्यार्थी खाते तयार झाले!' : 'Student account created & logged in!');
      } else {
        if (!memberEmail.trim()) {
          throw new Error(language === 'mr' ? 'कृपया ईमेल टाका' : 'Please enter email');
        }
        if (!memberPass) {
          throw new Error(language === 'mr' ? 'कृपया पासवर्ड टाका' : 'Please enter your password');
        }
        const user = await loginWithCredentials(memberEmail.trim(), memberPass);
        setSuccess(language === 'mr' ? `स्वागत आहे, ${user.name}!` : `Welcome, ${user.name}!`);
      }
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Admin Login
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (!adminEmail.trim()) {
        throw new Error(language === 'mr' ? 'कृपया अ‍ॅडमिन ईमेल टाका' : 'Please enter admin email');
      }
      const user = await loginWithCredentials(adminEmail.trim(), adminPassword);
      if (user.role !== 'admin' && user.role !== 'super_admin' && user.role !== 'reviewer' && user.role !== 'content_editor') {
        throw new Error(language === 'mr' ? 'या खात्याला अ‍ॅडमिन अधिकार नाहीत!' : 'This account does not have admin permissions!');
      }
      setSuccess(language === 'mr' ? `अ‍ॅडमिन पोर्टल अनलॉक झाले: ${user.name}` : `Admin portal unlocked: ${user.name}`);
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Admin authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-in
  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      setSuccess(language === 'mr' ? 'गुगल खात्यासह यशस्वी लॉगिन!' : 'Google sign-in successful!');
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user')
      ) {
        return;
      }
      setError(err.message || 'Google sign-in error');
    } finally {
      setLoading(false);
    }
  };

  const adminUsers = allUsers.filter(u => ['admin', 'super_admin', 'reviewer', 'content_editor'].includes(u.role));
  const studentUsers = allUsers.filter(u => u.role === 'student');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-5 text-white flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/30 border border-teal-500/30 flex items-center justify-center overflow-hidden">
              <img src="/pwa-192x192.png" alt="Logo" className="w-8 h-8 object-cover" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                <span>Nursing Officer</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {activeTab === 'admin' ? 'Admin Portal' : 'Member Portal'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'mr' ? 'सुरक्षित प्रवेश आणि प्रोफाइल व्यवस्थापन' : 'Secure Login & Profile Access'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (Member vs Admin) */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200">
          <button
            id="tab-member-login"
            onClick={() => {
              setActiveTab('member');
              setError(null);
              setSuccess(null);
            }}
            className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'member'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-teal-600" />
            <span>{language === 'mr' ? 'विद्यार्थी / Member लॉगिन' : 'Student / Member'}</span>
          </button>

          <button
            id="tab-admin-login"
            onClick={() => {
              setActiveTab('admin');
              setError(null);
              setSuccess(null);
            }}
            className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-white text-amber-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>{language === 'mr' ? 'अ‍ॅडमिन (Admin) लॉगिन' : 'Admin / Staff'}</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Notifications */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {/* Current Logged In Status Banner */}
          {currentUser && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
                  {language === 'mr' ? 'सध्याचे लॉगिन:' : 'Currently Active:'}
                </span>
                <span className="font-bold text-slate-800">{currentUser.name}</span>
                <span className="text-slate-500 text-[11px] block">({currentUser.email})</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                currentUser.role === 'admin' || currentUser.role === 'super_admin'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-teal-100 text-teal-800'
              }`}>
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
          )}

          {/* MEMBER TAB CONTENT */}
          {activeTab === 'member' && (
            <div className="space-y-4">
              {/* Google Sign In Quick Button */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{language === 'mr' ? 'गुगल (Google) खात्याने लॉगिन करा' : 'Continue with Google Account'}</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-semibold">
                  {language === 'mr' ? 'किंवा ईमेल द्वारे' : 'or with email'}
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleMemberSubmit} className="space-y-3">
                {isRegisterMode && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {language === 'mr' ? 'पूर्ण नाव *' : 'Full Name *'}
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={memberName}
                          onChange={e => setMemberName(e.target.value)}
                          placeholder={language === 'mr' ? 'तुमचे नाव प्रविष्ट करा' : 'Enter your full name'}
                          required
                          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {language === 'mr' ? 'मोबाईल नंबर (10 अंकी) *' : 'Mobile Number (10 Digits) *'}
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          maxLength={10}
                          value={memberMobile}
                          onChange={e => setMemberMobile(e.target.value.replace(/\D/g, ''))}
                          placeholder="9876543210"
                          required
                          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {language === 'mr' ? 'जिल्हा (Maharashtra District) *' : 'District (36 Maharashtra Districts) *'}
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        <select
                          value={memberDistrict}
                          onChange={e => setMemberDistrict(e.target.value)}
                          required
                          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden bg-white"
                        >
                          <option value="">{language === 'mr' ? '-- तुमचा जिल्हा निवडा --' : '-- Select District --'}</option>
                          {MAHARASHTRA_DISTRICTS.map((dist, i) => (
                            <option key={i} value={dist}>{dist}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'mr' ? 'ईमेल पत्ता' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={memberEmail}
                      onChange={e => setMemberEmail(e.target.value)}
                      placeholder="e.g. student@gmail.com"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'mr' ? 'पासवर्ड' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={memberPass}
                      onChange={e => setMemberPass(e.target.value)}
                      placeholder="******"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <span>
                    {isRegisterMode
                      ? language === 'mr' ? 'खाते तयार करा' : 'Create Account'
                      : language === 'mr' ? 'लॉगिन करा' : 'Sign In as Member'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                  className="text-xs text-teal-700 hover:text-teal-800 font-semibold underline cursor-pointer"
                >
                  {isRegisterMode
                    ? language === 'mr' ? 'आधीच खाते आहे? लॉगिन करा' : 'Already have an account? Sign In'
                    : language === 'mr' ? 'नवीन विद्यार्थी आहात? येथे नोंदणी करा' : "Don't have an account? Register free"}
                </button>
              </div>
            </div>
          )}

          {/* ADMIN TAB CONTENT */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">
                    {language === 'mr' ? 'अधिकृत अ‍ॅडमिन लॉगिन (Admin Portal)' : 'Official Admin & Faculty Portal'}
                  </span>
                  <span className="text-[11px] text-amber-800">
                    {language === 'mr'
                      ? 'फक्त अधिकृत अ‍ॅडमिनिस्ट्रेटर येथे ईमेल व गुप्त पासवर्ड टाकून प्रवेश करू शकतात.'
                      : 'Only authorized administrators can log in with their email and password.'}
                  </span>
                </div>
              </div>

              {/* Admin Form */}
              <form onSubmit={handleAdminSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'mr' ? 'अ‍ॅडमिन ईमेल आयडी' : 'Admin Email ID'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={e => setAdminEmail(e.target.value)}
                      required
                      placeholder="admin@example.com"
                      autoComplete="username"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-hidden font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'mr' ? 'अ‍ॅडमिन पासवर्ड' : 'Admin Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={e => setAdminPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-hidden font-sans"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{language === 'mr' ? 'अ‍ॅडमिन म्हणून प्रवेश करा' : 'Sign In to Admin CMS'}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
