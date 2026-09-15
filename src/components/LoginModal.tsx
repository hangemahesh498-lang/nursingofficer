import React, { useState, useEffect, useRef } from 'react';
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
  ArrowRight,
  GraduationCap,
  Camera,
  Home,
  Building,
  KeyRound
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
  const { allUsers, currentUser, registerUser, loginWithCredentials } = useAuth();
  const { language } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<'member' | 'admin'>(defaultTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  // Member Registration & Login State
  const [memberEmail, setMemberEmail] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberMobile, setMemberMobile] = useState('');
  const [memberDistrict, setMemberDistrict] = useState('');
  const [memberTaluka, setMemberTaluka] = useState('');
  const [memberVillageCity, setMemberVillageCity] = useState('');
  const [memberPincode, setMemberPincode] = useState('');
  const [memberFullAddress, setMemberFullAddress] = useState('');
  const [memberAvatar, setMemberAvatar] = useState<string>('');
  const [memberReferralCode, setMemberReferralCode] = useState('');
  const [memberPass, setMemberPass] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(initialRegisterMode);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Admin Form - Empty by default for strict security
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Status & loading
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Handle Photo Upload (OPTIONAL)
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(language === 'mr' ? 'कृपया वैध इमेज फाईल (JPG/PNG) निवडा' : 'Please select a valid image file (JPG/PNG)');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError(language === 'mr' ? 'फोटोचा आकार ३ MB पेक्षा कमी असावा' : 'Photo size should be under 3 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setMemberAvatar(result);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setMemberAvatar('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
        if (memberPincode && memberPincode.trim().length !== 6) {
          throw new Error(language === 'mr' ? 'कृपया ६ अंकी वैध पिनकोड प्रविष्ट करा' : 'Please enter a valid 6-digit PIN code');
        }
        if (!memberPass || memberPass.length < 4) {
          throw new Error(language === 'mr' ? 'किमान ४ अक्षरांचा पासवर्ड द्या' : 'Please set a password (min 4 characters)');
        }

        await registerUser({
          name: memberName.trim(),
          email: memberEmail.trim(),
          mobile: memberMobile.trim(),
          phone: memberMobile.trim(),
          district: memberDistrict,
          taluka: memberTaluka.trim(),
          village_city: memberVillageCity.trim(),
          pincode: memberPincode.trim(),
          fullAddress: memberFullAddress.trim(),
          address: memberFullAddress.trim(),
          avatar: memberAvatar || undefined,
          avatarUrl: memberAvatar || undefined,
          referredByCode: memberReferralCode.trim() || undefined,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-5 text-white flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600/30 border border-teal-500/30 flex items-center justify-center overflow-hidden shrink-0">
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
                {language === 'mr' ? 'सुरक्षित प्रवेश आणि विद्यार्थी नोंदणी' : 'Secure Login & Student Registration'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
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
            <span>{language === 'mr' ? 'विद्यार्थी / Member' : 'Student / Member'}</span>
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
            <span>{language === 'mr' ? 'अ‍ॅडमिन लॉगिन' : 'Admin / Staff'}</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
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
              <form onSubmit={handleMemberSubmit} className="space-y-3">
                {isRegisterMode && (
                  <>
                    {/* Profile Photo (OPTIONAL) */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
                      <div className="relative shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-teal-100 border border-teal-300 flex items-center justify-center overflow-hidden text-teal-800 font-bold text-xl">
                          {memberAvatar ? (
                            <img src={memberAvatar} alt="Profile preview" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-8 h-8 text-teal-600" />
                          )}
                        </div>
                        {memberAvatar && (
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="absolute -top-1.5 -right-1.5 p-1 bg-rose-600 text-white rounded-full shadow-xs hover:bg-rose-700"
                            title="Remove Photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-1 flex-1">
                        <label className="text-xs font-bold text-slate-800 block">
                          {language === 'mr' ? 'प्रोफाइल फोटो (ऐच्छिक / Optional)' : 'Profile Photo (Optional)'}
                        </label>
                        <p className="text-[11px] text-slate-500">
                          {language === 'mr' ? 'तुम्ही फोटो नंतर प्रोफाइलमधूनही जोडू शकता.' : 'You can also upload or change this later from your Profile.'}
                        </p>
                        <div className="flex items-center gap-2 pt-0.5">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5 text-teal-600" />
                            <span>{memberAvatar ? (language === 'mr' ? 'फोटो बदला' : 'Change Photo') : (language === 'mr' ? 'फोटो निवडा' : 'Upload Photo')}</span>
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {language === 'mr' ? 'पूर्ण नाव (Full Name) *' : 'Full Name *'}
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={memberName}
                          onChange={e => setMemberName(e.target.value)}
                          placeholder={language === 'mr' ? 'तुमचे पूर्ण नाव' : 'e.g. Snehal Patil'}
                          required
                          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Mobile Number */}
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

                    {/* District & Taluka Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {language === 'mr' ? 'जिल्हा (District) *' : 'District (Maharashtra) *'}
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                          <select
                            value={memberDistrict}
                            onChange={e => setMemberDistrict(e.target.value)}
                            required
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden bg-white"
                          >
                            <option value="">{language === 'mr' ? '-- जिल्हा निवडा --' : '-- Select District --'}</option>
                            {MAHARASHTRA_DISTRICTS.map((dist, i) => (
                              <option key={i} value={dist}>{dist}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {language === 'mr' ? 'तालुका (Taluka)' : 'Taluka'}
                        </label>
                        <input
                          type="text"
                          value={memberTaluka}
                          onChange={e => setMemberTaluka(e.target.value)}
                          placeholder={language === 'mr' ? 'उदा. हवेली, बारामती' : 'e.g. Haveli'}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Village/City & PIN Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {language === 'mr' ? 'गाव / शहर (Village/City)' : 'Village / City'}
                        </label>
                        <div className="relative">
                          <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            value={memberVillageCity}
                            onChange={e => setMemberVillageCity(e.target.value)}
                            placeholder={language === 'mr' ? 'उदा. पुणे, सातारा' : 'e.g. Pune, Satara'}
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {language === 'mr' ? 'पिन कोड (PIN Code)' : 'PIN Code (6 digits)'}
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={memberPincode}
                          onChange={e => setMemberPincode(e.target.value.replace(/\D/g, ''))}
                          placeholder="411001"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden font-mono"
                        />
                      </div>
                    </div>

                    {/* Full Address */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {language === 'mr' ? 'संपूर्ण पत्ता (Full Address)' : 'Full Address'}
                      </label>
                      <div className="relative">
                        <Home className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={memberFullAddress}
                          onChange={e => setMemberFullAddress(e.target.value)}
                          placeholder={language === 'mr' ? 'घर नं, गल्ली, परिसर' : 'House/Flat No, Landmark, Area'}
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Referral Code (Optional) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {language === 'mr' ? 'Referral Code (ऐच्छिक / Optional)' : 'Referral Code (Optional)'}
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={memberReferralCode}
                          onChange={e => setMemberReferralCode(e.target.value.toUpperCase())}
                          placeholder="उदा. NURSE1234"
                          className="w-full pl-9 pr-3 py-2 text-xs uppercase font-mono rounded-xl border border-slate-300 focus:border-indigo-600 outline-hidden"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'mr' ? 'ईमेल पत्ता (Email Address) *' : 'Email Address *'}
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

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {language === 'mr' ? 'पासवर्ड (Password) *' : 'Password *'}
                    </label>
                    {!isRegisterMode && (
                      <button
                        type="button"
                        onClick={() => alert(language === 'mr' ? 'पासवर्ड रीसेट करण्यासाठी कृपया ॲडमिनशी संपर्क साधावा. ॲडमिन तुमच्या ॲडमिन पॅनलवरून १-क्लिकमध्ये पासवर्ड रीसेट करू शकतात.' : 'To reset your password, please contact the Admin or Helpline. Admin can instantly reset your password.')}
                        className="text-[11px] text-teal-700 hover:text-teal-800 font-bold underline cursor-pointer"
                      >
                        {language === 'mr' ? 'पासवर्ड विसरलात?' : 'Forgot Password?'}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={memberPass}
                      onChange={e => setMemberPass(e.target.value)}
                      placeholder="****** (किमान ४ अक्षरे)"
                      required
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
                      ? language === 'mr' ? 'विद्यार्थी नोंदणी पूर्ण करा' : 'Complete Registration'
                      : language === 'mr' ? 'लॉगिन करा' : 'Sign In as Member'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode);
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-xs text-teal-800 font-bold hover:underline cursor-pointer"
                >
                  {isRegisterMode
                    ? (language === 'mr' ? 'आधीच खाते आहे? लॉगिन करा' : 'Already have an account? Sign In')
                    : (language === 'mr' ? 'नवीन विद्यार्थी? नवीन खाते तयार करा' : 'New student? Register Now')}
                </button>
              </div>
            </div>
          )}

          {/* ADMIN TAB CONTENT */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <form onSubmit={handleAdminSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'mr' ? 'अ‍ॅडमिन ईमेल पत्ता' : 'Admin Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={e => setAdminEmail(e.target.value)}
                      placeholder="admin@nursingofficer.com"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-hidden"
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
                      placeholder="******"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{language === 'mr' ? 'सुरक्षित अ‍ॅडमिन लॉगिन' : 'Admin Sign In'}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
