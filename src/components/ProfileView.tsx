import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { MAHARASHTRA_DISTRICTS } from '../data/districts';
import { api } from '../lib/api';
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
  Calendar,
  Camera,
  MapPin,
  Building,
  Home,
  Share2,
  Copy,
  Check,
  Users,
  Gift,
  Video,
  ExternalLink,
  X,
  Save
} from 'lucide-react';
import { LoginModal } from './LoginModal';

interface StudentProfileStats {
  totalQuestionsSolved?: number;
  overallAccuracy?: number;
  testsAttempted?: number;
  dueForRevisionCount?: number;
  accuracyPercentage?: number;
  streakDays?: number;
}

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
  const { currentUser, updateProfile, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [stats, setStats] = useState<StudentProfileStats | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Edit Profile Form State
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editDistrict, setEditDistrict] = useState('');
  const [editTaluka, setEditTaluka] = useState('');
  const [editVillageCity, setEditVillageCity] = useState('');
  const [editPincode, setEditPincode] = useState('');
  const [editFullAddress, setEditFullAddress] = useState('');
  const [editAvatar, setEditAvatar] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedReferral, setCopiedReferral] = useState(false);

  const [targetExam, setTargetExam] = useState<string>(
    currentUser?.targetExam || 'DHS / DMER महाराष्ट्र आरोग्य विभाग & AIIMS NORCET'
  );
  const [dailyGoal, setDailyGoal] = useState<number>(currentUser?.dailyTarget || 20);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    loadProfileStats();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditPhone(currentUser.phone || currentUser.mobile || '');
      setEditDistrict(currentUser.district || '');
      setEditTaluka(currentUser.taluka || '');
      setEditVillageCity(currentUser.village_city || '');
      setEditPincode(currentUser.pincode || '');
      setEditFullAddress(currentUser.fullAddress || currentUser.address || '');
      setEditAvatar(currentUser.avatar || currentUser.avatarUrl || '');
    }
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

  // Handle Photo Change
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(language === 'mr' ? 'कृपया वैध इमेज फाईल (JPG/PNG) निवडा' : 'Please select an image file (JPG/PNG)');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert(language === 'mr' ? 'फोटोचा आकार ३ MB पेक्षा कमी असावा' : 'Photo size should be under 3 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setEditAvatar(dataUrl);
      // Auto-save photo if not in modal
      if (!isEditingProfile && currentUser) {
        try {
          await updateProfile({ avatar: dataUrl, avatarUrl: dataUrl });
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2500);
        } catch (err) {
          console.error('Failed to save avatar', err);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Remove Photo
  const handleRemovePhoto = async () => {
    setEditAvatar('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (!isEditingProfile && currentUser) {
      try {
        await updateProfile({ avatar: '', avatarUrl: '' });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      } catch (err) {
        console.error('Failed to remove avatar', err);
      }
    }
  };

  // Handle Save Profile Form
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSaveError(null);
    setIsSaving(true);

    try {
      if (!editName.trim()) {
        throw new Error(language === 'mr' ? 'नाव प्रविष्ट करणे आवश्यक आहे' : 'Name is required');
      }
      if (editPincode && editPincode.trim().length !== 6) {
        throw new Error(language === 'mr' ? 'पिनकोड ६ अंकी असावा' : 'PIN code must be 6 digits');
      }

      await updateProfile({
        name: editName.trim(),
        phone: editPhone.trim(),
        mobile: editPhone.trim(),
        district: editDistrict,
        taluka: editTaluka.trim(),
        village_city: editVillageCity.trim(),
        pincode: editPincode.trim(),
        fullAddress: editFullAddress.trim(),
        address: editFullAddress.trim(),
        avatar: editAvatar || undefined,
        avatarUrl: editAvatar || undefined
      });

      setSaveSuccess(true);
      setIsEditingProfile(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Copy Referral Code
  const referralCode = currentUser?.referralCode || `NURSE${currentUser?.id?.slice(-4).toUpperCase() || 'PRO'}`;
  const referralCount = currentUser?.referralCount || 0;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🎯 नर्सिंग ऑफिसर भरती २०२५ ची परिपूर्ण तयारी!\n` +
      `Nursing Officer Prep App वरून सराव करा. सर्व १८ विषय, मॉक टेस्ट्स व स्पष्टीकरणे उपलब्ध.\n\n` +
      `माझा Referral Code वापरा: *${referralCode}*\n` +
      `आत्ताच नोंदणी करा: ${window.location.origin}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleResetProgress = async () => {
    try {
      localStorage.removeItem('user_practice_answers');
      setResetSuccess(true);
      setShowResetConfirm(false);
      setTimeout(() => setResetSuccess(false), 3000);
      loadProfileStats();
    } catch (err) {
      console.error('Reset failed', err);
    }
  };

  const avatarDisplay = editAvatar || currentUser?.avatar || currentUser?.avatarUrl;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-28 space-y-4">
      {/* 1. Profile Top Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-teal-800 via-teal-700 to-indigo-900" />

        <div className="relative pt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            {/* Avatar with Upload / Edit controls */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-1 shadow-lg border-2 border-white overflow-hidden">
                {avatarDisplay ? (
                  <img
                    src={avatarDisplay}
                    alt={currentUser?.name || 'Profile'}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-teal-600 to-indigo-700 text-white font-black text-3xl flex items-center justify-center shadow-inner">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>

              {/* Camera icon to change photo */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-md border-2 border-white transition cursor-pointer"
                title={language === 'mr' ? 'फोटो बदला / अपलोड करा' : 'Upload / Change Photo'}
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              {isPro && (
                <span className="absolute -top-1 -right-1 p-1 bg-amber-400 text-amber-950 rounded-full shadow-xs border border-white" title="PRO Member">
                  <Crown className="w-3.5 h-3.5 fill-current" />
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {currentUser?.name || 'परीक्षार्थी (Aspirant)'}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wide ${
                  isPro
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {isPro ? '★ PRO VIP' : 'FREE PLAN'}
                </span>
                {currentUser?.role === 'admin' || currentUser?.role === 'super_admin' ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                    ADMIN
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
                {currentUser?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentUser.email}</span>
                  </span>
                )}
                {(currentUser?.phone || currentUser?.mobile) && (
                  <span className="flex items-center gap-1 font-mono">
                    <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentUser.phone || currentUser.mobile}</span>
                  </span>
                )}
                {currentUser?.district && (
                  <span className="flex items-center gap-1 text-teal-700 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span>{currentUser.district}{currentUser.taluka ? `, ${currentUser.taluka}` : ''}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditingProfile ? (language === 'mr' ? 'फॉर्म बंद करा' : 'Close Edit') : (language === 'mr' ? 'प्रोफाइल संपादित करा' : 'Edit Profile')}</span>
            </button>

            <button
              type="button"
              onClick={() => setLoginModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              {currentUser ? (language === 'mr' ? 'खाते स्विच' : 'Switch') : (language === 'mr' ? 'लॉगिन' : 'Login')}
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold text-center flex items-center justify-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{language === 'mr' ? 'प्रोफाइल यशस्वीरित्या अपडेट करण्यात आली आहे!' : 'Profile updated successfully!'}</span>
          </div>
        )}

        {/* Target Exam Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Target className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="font-bold text-slate-800">{language === 'mr' ? 'लक्ष्य परीक्षा:' : 'Target Exam:'}</span>
            <span className="text-slate-600 truncate max-w-[220px] sm:max-w-md">{targetExam}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-black bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {language === 'mr' ? 'सक्रिय (Active)' : 'Active'}
          </span>
        </div>
      </div>

      {/* EDIT PROFILE DRAWER / FORM */}
      {isEditingProfile && (
        <div className="bg-white rounded-3xl border border-teal-200 p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-teal-100 text-teal-800 rounded-xl">
                <Edit2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {language === 'mr' ? 'विद्यार्थी तपशील संपादन (Edit Student Profile)' : 'Edit Student Profile & Address'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {language === 'mr' ? 'तुमची संपूर्ण माहिती आणि पत्ता अद्ययावत ठेवा' : 'Update your personal and address details'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEditingProfile(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {saveError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{saveError}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            {/* Photo Edit Row */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-teal-100 border border-teal-300 overflow-hidden flex items-center justify-center shrink-0">
                {editAvatar ? (
                  <img src={editAvatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-teal-700" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <span className="font-bold text-slate-800 block">
                  {language === 'mr' ? 'प्रोफाइल फोटो (ऐच्छिक)' : 'Profile Photo (Optional)'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-teal-600" />
                    <span>{editAvatar ? (language === 'mr' ? 'बदला' : 'Change') : (language === 'mr' ? 'अपलोड करा' : 'Upload')}</span>
                  </button>
                  {editAvatar && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      {language === 'mr' ? 'फोटो काढा' : 'Remove Photo'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'mr' ? 'पूर्ण नाव *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'mr' ? 'मोबाईल नंबर' : 'Mobile Number'}
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden font-mono"
                />
              </div>
            </div>

            {/* District & Taluka */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'mr' ? 'जिल्हा (Maharashtra District)' : 'District (Maharashtra)'}
                </label>
                <select
                  value={editDistrict}
                  onChange={e => setEditDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden bg-white"
                >
                  <option value="">{language === 'mr' ? '-- जिल्हा निवडा --' : '-- Select District --'}</option>
                  {MAHARASHTRA_DISTRICTS.map((dist, i) => (
                    <option key={i} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'mr' ? 'तालुका (Taluka)' : 'Taluka'}
                </label>
                <input
                  type="text"
                  value={editTaluka}
                  onChange={e => setEditTaluka(e.target.value)}
                  placeholder="उदा. हवेली, कराड"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden"
                />
              </div>
            </div>

            {/* Village / City & PIN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'mr' ? 'गाव / शहर (Village/City)' : 'Village / City'}
                </label>
                <input
                  type="text"
                  value={editVillageCity}
                  onChange={e => setEditVillageCity(e.target.value)}
                  placeholder="उदा. पुणे, नाशिक"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'mr' ? 'पिन कोड (PIN Code)' : 'PIN Code (6 digits)'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={editPincode}
                  onChange={e => setEditPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="411001"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden font-mono"
                />
              </div>
            </div>

            {/* Full Address */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {language === 'mr' ? 'संपूर्ण पत्ता (Full Address)' : 'Full Address'}
              </label>
              <input
                type="text"
                value={editFullAddress}
                onChange={e => setEditFullAddress(e.target.value)}
                placeholder="घर नं, गल्ली, लँडमार्क"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden"
              />
            </div>

            {/* Save Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
              >
                {language === 'mr' ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? (language === 'mr' ? 'जतन करत आहे...' : 'Saving...') : (language === 'mr' ? 'बदल जतन करा' : 'Save Profile')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Detailed Geographical Address Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl border border-teal-100">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900">
                {language === 'mr' ? 'पत्ता व निवासी माहिती' : 'Residential & Address Information'}
              </h3>
              <p className="text-[10px] text-slate-500">
                {language === 'mr' ? 'जिल्हा, तालुका आणि पिनकोड तपशील' : 'District, Taluka, Village and PIN details'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditingProfile(true)}
            className="text-xs text-teal-700 hover:text-teal-800 font-bold underline cursor-pointer"
          >
            {language === 'mr' ? 'बदला' : 'Edit'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">{language === 'mr' ? 'जिल्हा' : 'District'}</span>
            <span className="font-bold text-slate-800">{currentUser?.district || '-'}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">{language === 'mr' ? 'तालुका' : 'Taluka'}</span>
            <span className="font-bold text-slate-800">{currentUser?.taluka || '-'}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">{language === 'mr' ? 'गाव / शहर' : 'Village / City'}</span>
            <span className="font-bold text-slate-800">{currentUser?.village_city || '-'}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">{language === 'mr' ? 'पिन कोड' : 'PIN Code'}</span>
            <span className="font-mono font-bold text-slate-800">{currentUser?.pincode || '-'}</span>
          </div>
        </div>

        {currentUser?.fullAddress && (
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs flex items-start gap-2">
            <Home className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{language === 'mr' ? 'संपूर्ण पत्ता' : 'Complete Address'}</span>
              <span className="text-slate-800 font-medium">{currentUser.fullAddress}</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Subscription & Specific Product Entitlements Card */}
      {(() => {
        const featuredPlan = plans.find(p => p.popular) || plans[0] || { price: 199, name: 'PRO Master Plan' };
        const minPrice = plans.length > 0 ? Math.min(...plans.map(p => p.price)) : featuredPlan.price;
        const daysLeft = currentUser?.daysRemaining ?? (isPro ? 90 : 0);
        const planName = currentUser?.planName || (isPro ? 'PRO VIP All-Access Plan' : 'मोफत योजना (Free Access)');
        const paidAmount = (currentUser as any)?.planAmount || (isPro ? 499 : 0);
        const paymentMethod = (currentUser as any)?.paymentMethod || (isPro ? 'Online Verified (Razorpay/UPI)' : '-');

        // Product Entitlements breakdown
        const hasMcqAccess = isPro || currentUser?.role === 'pro_member';
        const hasTestSeriesAccess = isPro || currentUser?.hasTestSeriesAccess;
        const hasYouTubeAccess = isPro;
        const hasComboAccess = isPro;

        return (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-2xl ${isPro ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-700'}`}>
                  <Crown className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                    <span>{language === 'mr' ? 'प्लॅन, उत्पादन अधिकार व पेमेंट तपशील' : 'Plan, Entitlements & Payment Details'}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {language === 'mr' ? 'तुमच्या खात्यात सक्रिय असलेली उत्पादने आणि वैधता' : 'Active product entitlements and validity on your account'}
                  </p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-black border uppercase tracking-wider ${
                isPro
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {isPro ? (language === 'mr' ? 'सक्रिय (ACTIVE)' : 'ACTIVE') : 'FREE'}
              </span>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>{language === 'mr' ? 'शिल्लक दिवस (Days Left)' : 'Days Remaining'}</span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {isPro ? `${daysLeft} ${language === 'mr' ? 'दिवस' : 'Days'}` : '0'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {isPro ? (language === 'mr' ? 'सर्व सराव मोकळा' : 'Unlimited Practice Active') : (language === 'mr' ? 'अपग्रेड करा अमर्यादित सरावासाठी' : 'Upgrade for unlimited access')}
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'mr' ? 'भरलेली फी (Amount Paid)' : 'Amount Paid'}</span>
                </div>
                <div className="text-xl font-black text-emerald-700">
                  {isPro ? `₹${paidAmount}` : '₹0'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {isPro ? (language === 'mr' ? 'व्हेरिफाइड पेमेंट' : 'Verified Payment') : (language === 'mr' ? 'विनाशुल्क मोफत मोड' : 'Free Mode')}
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>{language === 'mr' ? 'सध्याचा प्लॅन (Active Plan)' : 'Current Plan'}</span>
                </div>
                <div className="text-sm font-black text-slate-900 truncate">
                  {planName}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {isPro ? (language === 'mr' ? '१८ विषय व टेस्ट सिरीज' : '18 Subjects & Tests') : (language === 'mr' ? 'मर्यादित प्रश्न' : 'Limited Questions')}
                </div>
              </div>
            </div>

            {/* Individual Product Entitlements Breakdown */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                {language === 'mr' ? 'उत्पादन अधिकार स्थिती (Product Entitlements):' : 'Product Entitlement Breakdown:'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {/* 1. MCQ Plan */}
                <div className={`p-3 rounded-2xl border flex flex-col justify-between ${hasMcqAccess ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span>MCQ Plan</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block text-center ${hasMcqAccess ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'}`}>
                    {hasMcqAccess ? (language === 'mr' ? 'सक्रिय' : 'Unlocked') : (language === 'mr' ? 'बंद' : 'Locked')}
                  </span>
                </div>

                {/* 2. Test Series Plan */}
                <div className={`p-3 rounded-2xl border flex flex-col justify-between ${hasTestSeriesAccess ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span>Test Series</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block text-center ${hasTestSeriesAccess ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'}`}>
                    {hasTestSeriesAccess ? (language === 'mr' ? 'सक्रिय' : 'Unlocked') : (language === 'mr' ? 'बंद' : 'Locked')}
                  </span>
                </div>

                {/* 3. YouTube Video Plan */}
                <div className={`p-3 rounded-2xl border flex flex-col justify-between ${hasYouTubeAccess ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Video className="w-3.5 h-3.5 shrink-0" />
                    <span>YouTube Video</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block text-center ${hasYouTubeAccess ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'}`}>
                    {hasYouTubeAccess ? (language === 'mr' ? 'सक्रिय' : 'Unlocked') : (language === 'mr' ? 'बंद' : 'Locked')}
                  </span>
                </div>

                {/* 4. Combo Plan */}
                <div className={`p-3 rounded-2xl border flex flex-col justify-between ${hasComboAccess ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Crown className="w-3.5 h-3.5 shrink-0" />
                    <span>Combo All-Access</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block text-center ${hasComboAccess ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'}`}>
                    {hasComboAccess ? (language === 'mr' ? 'सक्रिय' : 'Unlocked') : (language === 'mr' ? 'बंद' : 'Locked')}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onNavigateToUpgradePro}
                className="w-full py-2.5 bg-gradient-to-r from-teal-700 to-indigo-800 hover:from-teal-800 hover:to-indigo-900 text-white font-extrabold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>{isPro ? (language === 'mr' ? 'प्लॅन नूतनीकरण करा / नवीन प्लॅन जोडा' : 'Renew / Extend Membership') : (language === 'mr' ? `आता प्लॅन निवडा व अपग्रेड करा (₹${minPrice} पासून)` : `Upgrade to PRO (From ₹${minPrice})`)}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })()}

      {/* 4. Referral System & Rewards Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden space-y-4">
        <div className="flex items-center justify-between border-b border-indigo-800/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/40 border border-indigo-400/30 flex items-center justify-center text-amber-300">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black">
                {language === 'mr' ? 'रेफरल प्रोग्रॅम आणि मोफत रिवॉर्ड्स' : 'Referral Program & Free Rewards'}
              </h3>
              <p className="text-xs text-indigo-300">
                {language === 'mr' ? 'मित्रांना शेअर करा आणि मिळवा मोफत PRO दिवस' : 'Share with fellow nursing aspirants & earn free PRO access'}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase rounded-full">
            {language === 'mr' ? 'कायमस्वरूपी' : 'Permanent'}
          </span>
        </div>

        {/* Code & Share */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          <div className="bg-slate-900/60 border border-indigo-700/50 p-3.5 rounded-2xl space-y-1.5">
            <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
              {language === 'mr' ? 'तुमचा युनिक रेफरल कोड:' : 'Your Unique Referral Code:'}
            </span>
            <div className="flex items-center justify-between bg-black/40 px-3 py-2 rounded-xl border border-indigo-500/40 font-mono text-base font-black text-amber-300 tracking-wider">
              <span>{referralCode}</span>
              <button
                type="button"
                onClick={handleCopyReferral}
                className="p-1.5 hover:bg-indigo-700/50 rounded-lg text-indigo-200 transition cursor-pointer flex items-center gap-1 text-xs font-sans"
              >
                {copiedReferral ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedReferral ? (language === 'mr' ? 'कॉपी झाले!' : 'Copied!') : (language === 'mr' ? 'कॉपी' : 'Copy')}</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{language === 'mr' ? 'WhatsApp वर मित्रांना शेअर करा' : 'Share on WhatsApp'}</span>
            </button>
            <div className="text-[11px] text-indigo-300 text-center">
              {language === 'mr' ? 'नोंदणी केलेले विद्यार्थी तुमच्या खात्याशी कायमस्वरूपी जोडले जातात.' : 'Referred students remain permanently linked to your profile.'}
            </div>
          </div>
        </div>

        {/* Milestone Rewards Progress */}
        <div className="bg-indigo-950/70 border border-indigo-800/60 p-4 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold flex items-center gap-1.5 text-indigo-200">
              <Users className="w-4 h-4 text-amber-400" />
              <span>{language === 'mr' ? 'एकूण यशस्वी रेफरल्स:' : 'Total Successful Referrals:'}</span>
            </span>
            <span className="font-mono text-base font-black text-amber-300">{referralCount} विद्यार्थी</span>
          </div>

          {/* Reward Tiers Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className={`p-2.5 rounded-xl border text-center ${referralCount >= 3 ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200' : 'bg-slate-900/50 border-indigo-900 text-indigo-400'}`}>
              <div className="font-bold text-[11px]">३ रेफरल्स</div>
              <div className="text-amber-300 font-bold text-xs">+७ दिवस PRO</div>
              <div className="text-[9px] mt-0.5">{referralCount >= 3 ? '✓ अनलॉक' : `${3 - Math.min(referralCount, 3)} बाकी`}</div>
            </div>

            <div className={`p-2.5 rounded-xl border text-center ${referralCount >= 5 ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200' : 'bg-slate-900/50 border-indigo-900 text-indigo-400'}`}>
              <div className="font-bold text-[11px]">५ रेफरल्स</div>
              <div className="text-amber-300 font-bold text-xs">+१५ दिवस PRO</div>
              <div className="text-[9px] mt-0.5">{referralCount >= 5 ? '✓ अनलॉक' : `${5 - Math.min(referralCount, 5)} बाकी`}</div>
            </div>

            <div className={`p-2.5 rounded-xl border text-center ${referralCount >= 10 ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200' : 'bg-slate-900/50 border-indigo-900 text-indigo-400'}`}>
              <div className="font-bold text-[11px]">१० रेफरल्स</div>
              <div className="text-amber-300 font-bold text-xs">+३० दिवस PRO</div>
              <div className="text-[9px] mt-0.5">{referralCount >= 10 ? '✓ अनलॉक' : `${10 - Math.min(referralCount, 10)} बाकी`}</div>
            </div>

            <div className={`p-2.5 rounded-xl border text-center ${referralCount >= 25 ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200' : 'bg-slate-900/50 border-indigo-900 text-indigo-400'}`}>
              <div className="font-bold text-[11px]">२५ रेफरल्स</div>
              <div className="text-amber-300 font-bold text-xs">९० दिवस VIP</div>
              <div className="text-[9px] mt-0.5">{referralCount >= 25 ? '✓ अनलॉक' : `${25 - Math.min(referralCount, 25)} बाकी`}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Study Statistics Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 px-1">
          <Award className="w-3.5 h-3.5 text-teal-600" />
          <span>{language === 'mr' ? 'अभ्यास प्रगती व आकडेवारी' : 'Study Progress & Statistics'}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Total Questions Solved */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase">{language === 'mr' ? 'एकूण सोडवले' : 'Questions'}</span>
              <BookOpen className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900">
              {stats?.totalQuestionsSolved || 0}
            </div>
            <div className="text-[10px] text-slate-500">{language === 'mr' ? 'प्रश्नांचा सराव' : 'Solved'}</div>
          </div>

          {/* Accuracy */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase">{language === 'mr' ? 'अचूकता दर' : 'Accuracy'}</span>
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
            className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1 hover:border-teal-300 transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase">{language === 'mr' ? 'मॉक टेस्ट्स' : 'Mock Tests'}</span>
              <FileText className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900">
              {stats?.testsAttempted || 0}
            </div>
            <div className="text-[10px] text-slate-500">{language === 'mr' ? 'चाचण्या दिल्या ➔' : 'Tests Attempted ➔'}</div>
          </div>

          {/* Mistakes Due */}
          <div
            onClick={onNavigateToMistakes}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1 hover:border-amber-300 transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase">{language === 'mr' ? 'चूक वही' : 'Mistakes'}</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-amber-600">
              {stats?.dueForRevisionCount || 0}
            </div>
            <div className="text-[10px] text-slate-500">{language === 'mr' ? 'रिव्हिजन बाकी ➔' : 'Revisions Due ➔'}</div>
          </div>
        </div>
      </div>

      {/* 6. Settings & Preferences */}
      <div className="bg-white rounded-2xl border border-slate-200/90 divide-y divide-slate-100 shadow-2xs overflow-hidden text-xs">
        {/* Language Selection */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-slate-800">
            <Languages className="w-4 h-4 text-teal-600" />
            <div>
              <span className="font-bold">{language === 'mr' ? 'अ‍ॅप भाषा (Language)' : 'App Language'}</span>
              <p className="text-[10px] text-slate-500">{language === 'mr' ? 'मराठी किंवा इंग्रजीत प्रश्न व स्पष्टीकरणे' : 'Marathi / English questions & explanations'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLanguage(language === 'mr' ? 'en' : 'mr')}
            className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-teal-800 font-black transition cursor-pointer"
          >
            {language === 'mr' ? 'मराठी (बदला)' : 'English (Change)'}
          </button>
        </div>

        {/* Daily Target Setting */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-slate-800">
            <Flame className="w-4 h-4 text-amber-500" />
            <div>
              <span className="font-bold">{language === 'mr' ? 'दररोजचे उद्दिष्ट (Daily Goal)' : 'Daily Target'}</span>
              <p className="text-[10px] text-slate-500">{language === 'mr' ? 'रोज किती प्रश्नांचा सराव करायचा आहे' : 'Daily question practice goal'}</p>
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
                    ? 'bg-teal-700 text-white'
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
              <span className="font-bold">{language === 'mr' ? 'सराव डेटा रीसेट करा' : 'Reset Local Practice Data'}</span>
              <p className="text-[10px] text-slate-500">{language === 'mr' ? 'स्थानिक सराव उत्तरे साफ करून नव्याने सुरू करा' : 'Clear local responses and start fresh'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 transition cursor-pointer"
          >
            {language === 'mr' ? 'रीसेट' : 'Reset'}
          </button>
        </div>

        {/* Sign Out / Account */}
        {currentUser && (
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-800">
              <LogOut className="w-4 h-4 text-slate-400" />
              <div>
                <span className="font-bold">{language === 'mr' ? 'साइन आउट (Sign Out)' : 'Sign Out'}</span>
                <p className="text-[10px] text-slate-500">{language === 'mr' ? 'सध्याच्या खात्यातून सुरक्षित बाहेर पडा' : 'Sign out from this device'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={signOut}
              className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
            >
              {language === 'mr' ? 'लॉगआउट' : 'Sign Out'}
            </button>
          </div>
        )}
      </div>

      {resetSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold text-center animate-in fade-in">
          ✓ {language === 'mr' ? 'स्थानिक सराव प्रगती यशस्वीपणे रीसेट केली आहे!' : 'Practice progress reset successfully!'}
        </div>
      )}

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black text-slate-900">{language === 'mr' ? 'सराव डेटा नक्की रीसेट करायचा आहे का?' : 'Reset practice progress?'}</h4>
            <p className="text-xs text-slate-500">
              {language === 'mr' ? 'याने तुमचे स्थानिक सेव्ह केलेले उत्तरे साफ होतील आणि तुम्ही पहिल्या प्रश्नापासून पुन्हा सुरुवात करू शकाल.' : 'This will reset your local practice responses so you can attempt questions anew.'}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200"
              >
                {language === 'mr' ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleResetProgress}
                className="flex-1 py-2 bg-rose-600 text-white font-bold rounded-xl text-xs hover:bg-rose-700 shadow-xs"
              >
                {language === 'mr' ? 'होय, रीसेट करा' : 'Yes, Reset'}
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
