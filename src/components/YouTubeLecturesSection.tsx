import React, { useEffect, useState } from 'react';
import {
  Play,
  Tv,
  Clock,
  User,
  X,
  Lock,
  Unlock,
  Shield,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Search,
  Filter
} from 'lucide-react';
import { YouTubeLecture, SystemSettings } from '../types';
import { api } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { SecureVideoPlayer } from './SecureVideoPlayer';

interface YouTubeLecturesSectionProps {
  onNavigateToPro?: () => void;
}

export const YouTubeLecturesSection: React.FC<YouTubeLecturesSectionProps> = ({ onNavigateToPro }) => {
  const { language } = useLanguage();
  const { currentUser, refreshUsers } = useAuth();

  const [lectures, setLectures] = useState<YouTubeLecture[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Active playing video (Only if user has access)
  const [selectedVideo, setSelectedVideo] = useState<YouTubeLecture | null>(null);

  // Unlock / Paywall modal for locked videos
  const [unlockingVideo, setUnlockingVideo] = useState<YouTubeLecture | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [unlockSuccess, setUnlockSuccess] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const fetchData = async () => {
    try {
      const [lectList, sysSettings] = await Promise.all([
        api.getYouTubeLectures(true),
        api.getSettings()
      ]);
      setLectures(lectList);
      setSettings(sysSettings);
    } catch (err) {
      console.error('Failed to load YouTube lectures:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper: check if user has access to a lecture
  const checkHasAccess = (lec: YouTubeLecture): boolean => {
    // 1. Free lecture
    if (!lec.is_paid) return true;

    // 2. Admin or Super Admin
    if (currentUser?.role === 'admin' || currentUser?.role === 'super_admin') return true;

    // 3. Pro or Test Series user has all-access
    if (currentUser?.hasYoutubeAccess) return true;

    // 4. User specifically purchased / unlocked this lecture
    if (currentUser?.unlocked_lecture_ids?.includes(lec.id)) return true;
    if (lec.unlocked_by?.includes(currentUser?.id || '')) return true;

    return false;
  };

  const handleCardClick = (lec: YouTubeLecture) => {
    const hasAccess = checkHasAccess(lec);
    if (hasAccess) {
      setSelectedVideo(lec);
    } else {
      setUnlockError(null);
      setUnlockSuccess(false);
      setUnlockingVideo(lec);
    }
  };

  // Process single lecture purchase / unlock
  const handleUnlockLecture = async (lec: YouTubeLecture) => {
    if (!currentUser) {
      setUnlockError('कृपया प्रथम लॉगिन करा (Please login first)');
      return;
    }

    try {
      setIsProcessingPayment(true);
      setUnlockError(null);

      const price = lec.price || 49;

      // Check if Razorpay script is available & configured
      const win = window as any;
      if (!win.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      if (win.Razorpay && settings?.razorpay_key_id && settings?.razorpay_enabled) {
        // 1. Create order on backend
        const orderData = await api.createLectureRazorpayOrder(lec.id);

        const options = {
          key: settings.razorpay_key_id,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: settings.app_name || 'Nursing Officer Prep Hub',
          description: `Lecture Unlock: ${lec.title_en || lec.title_mr}`,
          order_id: orderData.order_id,
          prefill: {
            name: currentUser.name || '',
            email: currentUser.email || '',
            contact: currentUser.mobile || ''
          },
          theme: {
            color: '#dc2626'
          },
          handler: async function (response: any) {
            try {
              await api.verifyLectureRazorpayPayment(
                lec.id,
                response.razorpay_payment_id,
                response.razorpay_order_id || orderData.order_id,
                response.razorpay_signature
              );
              setUnlockSuccess(true);
              if (refreshUsers) await refreshUsers();
              await fetchData();
              setTimeout(() => {
                setUnlockingVideo(null);
                setSelectedVideo(lec);
              }, 1500);
            } catch (err: any) {
              setUnlockError(err.message || 'Payment verification failed');
            }
          }
        };

        const rzp = new win.Razorpay(options);
        rzp.open();
      } else {
        // Direct unlock simulation / fallback if Razorpay gateway is not configured
        await api.unlockYouTubeLecture(lec.id);
        setUnlockSuccess(true);
        if (refreshUsers) await refreshUsers();
        await fetchData();
        setTimeout(() => {
          setUnlockingVideo(null);
          setSelectedVideo(lec);
        }, 1500);
      }
    } catch (err: any) {
      setUnlockError(err.message || 'Unlock request failed');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // If section disabled by Admin CMS or loading or empty, don't show
  if (!loading && settings && settings.show_youtube_lectures_section === false) {
    return null;
  }

  if (!loading && lectures.length === 0) {
    return null;
  }

  // Filter out hidden lectures for normal students
  const visibleLectures = lectures.filter(lec => {
    if (lec.is_hidden && currentUser?.role !== 'admin' && currentUser?.role !== 'super_admin') {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (lec.title_mr || '').toLowerCase().includes(q) || (lec.title_en || '').toLowerCase().includes(q);
      const matchSub = (lec.subject_name || '').toLowerCase().includes(q);
      const matchInst = (lec.instructor_name || '').toLowerCase().includes(q);
      if (!matchTitle && !matchSub && !matchInst) return false;
    }
    // Subject filter
    if (selectedSubject !== 'all') {
      if (lec.subject_name !== selectedSubject) return false;
    }
    return true;
  });

  // Unique subjects
  const subjectsList = Array.from(new Set(lectures.map(l => l.subject_name).filter(Boolean))) as string[];

  return (
    <div id="youtube-lectures-section" className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-4 sm:p-7 text-white shadow-xl border border-slate-700/60 mt-6 sm:mt-8 relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10 border-b border-slate-700/80 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-red-900/40 ring-2 ring-red-400/30 shrink-0">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                {language === 'mr' ? '📺 नर्सिंग ऑफिसर व्हिडिओ व्याख्याने व मास्टरक्लास' : '📺 Nursing Officer Video Lectures & Masterclasses'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse">
                🔴 LIVE MASTERCLASS
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              {language === 'mr'
                ? 'नर्सिंग अधिकारी व आरोग्य विभाग भरती परीक्षांसाठी विषयनिहाय संकल्पनांचे संपूर्ण स्पष्टीकरण'
                : 'High-Yield Topic-wise Lectures & Step-by-Step Concepts for Nursing Officer Aspirants'}
            </p>
          </div>
        </div>

        {/* Security & Access Guarantee Tag */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>सुरक्षित ॲप-ओन्ली प्लेअर</span>
          </div>
        </div>
      </div>

      {/* Search & Subject Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-5 relative z-10">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'mr' ? 'विषय किंवा व्याख्यान शोधा...' : 'Search lectures or topics...'}
            className="w-full pl-9 pr-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Subject Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
              selectedSubject === 'all'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {language === 'mr' ? 'सर्व विषय' : 'All Topics'}
          </button>
          {subjectsList.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Video Cards Grid */}
      {visibleLectures.length === 0 ? (
        <div className="p-8 text-center bg-slate-800/50 rounded-2xl border border-slate-700/60 text-slate-400 text-xs">
          कोणतेही व्हिडिओ व्याख्यान उपलब्ध नाही किंवा शोध निकषांशी जुळत नाही.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 relative z-10">
          {visibleLectures.map((lec) => {
            const ytVideoId = lec.youtube_video_id || 'dQw4w9WgXcQ';
            const thumbUrl = lec.thumbnail_url || `https://img.youtube.com/vi/${ytVideoId}/hqdefault.jpg`;
            const hasAccess = checkHasAccess(lec);
            const isLocked = Boolean(lec.is_paid && !hasAccess);

            return (
              <div
                key={lec.id}
                onClick={() => handleCardClick(lec)}
                className={`group bg-slate-800/90 rounded-2xl overflow-hidden border transition cursor-pointer flex flex-col justify-between shadow-md hover:shadow-xl ${
                  isLocked
                    ? 'border-purple-500/40 hover:border-purple-400 hover:shadow-purple-950/30'
                    : 'border-slate-700 hover:border-red-500/60 hover:shadow-red-950/30'
                }`}
              >
                {/* Thumbnail Container */}
                <div>
                  <div className="relative aspect-video bg-slate-950 overflow-hidden">
                    <img
                      src={thumbUrl}
                      alt={language === 'mr' ? lec.title_mr : lec.title_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90 group-hover:opacity-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-90" />

                    {/* Duration Badge */}
                    {lec.duration_label && (
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-slate-900/90 text-slate-200 text-[10px] font-bold flex items-center gap-1 backdrop-blur-xs border border-slate-700">
                        <Clock className="w-3 h-3 text-red-400" />
                        <span>{lec.duration_label}</span>
                      </div>
                    )}

                    {/* Subject Badge */}
                    {lec.subject_name && (
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-black shadow-xs">
                        {lec.subject_name}
                      </div>
                    )}

                    {/* Paid / Free Badge */}
                    {lec.is_paid ? (
                      <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-purple-600/90 text-white text-[10px] font-black shadow-xs flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>PAID (₹{lec.price || 49})</span>
                      </div>
                    ) : (
                      <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-emerald-600/90 text-white text-[10px] font-black shadow-xs flex items-center gap-1">
                        <Unlock className="w-2.5 h-2.5" />
                        <span>FREE</span>
                      </div>
                    )}

                    {/* Center Icon: Play OR Lock */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isLocked ? (
                        <div className="w-13 h-13 rounded-2xl bg-purple-600/90 text-white flex flex-col items-center justify-center shadow-xl shadow-purple-900/60 ring-4 ring-white/20 group-hover:scale-105 transition">
                          <Lock className="w-6 h-6" />
                          <span className="text-[9px] font-black mt-0.5">UNLOCK</span>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-red-600/90 group-hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-900/50 group-hover:scale-110 transition duration-200 ring-4 ring-white/20">
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-red-300 transition line-clamp-2 leading-snug mb-1.5">
                      {language === 'mr' ? (lec.title_mr || lec.title_en) : (lec.title_en || lec.title_mr)}
                    </h3>
                    {(lec.description_mr || lec.description_en) && (
                      <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                        {language === 'mr' ? (lec.description_mr || lec.description_en) : (lec.description_en || lec.description_mr)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Bottom Row */}
                <div className="px-4 pb-3.5 pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-700/50">
                  <div className="flex items-center gap-1 font-medium text-slate-300 truncate">
                    <User className="w-3 h-3 text-red-400 shrink-0" />
                    <span className="truncate">{lec.instructor_name || 'MH Sir (Nursing Officer)'}</span>
                  </div>

                  {isLocked ? (
                    <span className="text-purple-300 font-extrabold flex items-center gap-1 shrink-0 bg-purple-900/60 px-2 py-0.5 rounded-md border border-purple-500/40">
                      <Lock className="w-3 h-3" />
                      <span>अनलॉक करा</span>
                    </span>
                  ) : (
                    <span className="text-red-400 font-bold group-hover:underline flex items-center gap-1 shrink-0">
                      {language === 'mr' ? 'पहा' : 'Watch'}
                      <Play className="w-3 h-3 fill-current" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 1. SECURE VIDEO PLAYER MODAL (For Unlocked Videos) */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn select-none"
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="bg-slate-900 rounded-3xl border border-slate-700 max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[94vh]">
            {/* Modal Header */}
            <div className="px-4 sm:px-5 py-3.5 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md shadow-red-900/40">
                  <Tv className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-white truncate">
                    {language === 'mr' ? selectedVideo.title_mr : selectedVideo.title_en}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate">
                    {selectedVideo.subject_name || 'Nursing Masterclass'} • मार्गदर्शक: {selectedVideo.instructor_name || 'MH Sir'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-300 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-700/50">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span>सुरक्षित प्रवाह</span>
                </span>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer transition border border-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded Secure Video Player Frame */}
            <div className="p-3 sm:p-4 bg-slate-950">
              <SecureVideoPlayer
                youtubeVideoId={selectedVideo.youtube_video_id || 'dQw4w9WgXcQ'}
                title={selectedVideo.title_en || selectedVideo.title_mr}
                currentUser={currentUser}
                onClose={() => setSelectedVideo(null)}
              />
            </div>

            {/* Modal Footer Description */}
            <div className="px-5 py-3.5 bg-slate-900 text-xs text-slate-300 space-y-2 border-t border-slate-800 overflow-y-auto">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 font-extrabold text-[11px] border border-red-500/30">
                    {selectedVideo.subject_name || 'Nursing Lecture'}
                  </span>
                  <span className="text-slate-400 font-medium text-[11px]">
                    मार्गदर्शक: {selectedVideo.instructor_name || 'MH Sir'}
                  </span>
                </div>
                {selectedVideo.duration_label && (
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-red-400" />
                    {selectedVideo.duration_label}
                  </span>
                )}
              </div>

              {(selectedVideo.description_mr || selectedVideo.description_en) && (
                <p className="text-slate-300 text-xs leading-relaxed pt-1">
                  {language === 'mr' ? selectedVideo.description_mr : selectedVideo.description_en}
                </p>
              )}

              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span>🔒 सुरक्षा सूचना: हा व्हिडिओ केवळ नर्सिंग ऑफिसर ॲपमध्ये पाहण्यासाठी सुरक्षित करण्यात आला आहे.</span>
                <span>स्क्रीन रेकॉर्डिंग / शेअरिंग प्रतिबंधित</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PAID LECTURE UNLOCK MODAL (When Locked) */}
      {unlockingVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-5 relative">
            <button
              onClick={() => setUnlockingVideo(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lock Badge */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center ring-4 ring-purple-500/20 shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase text-purple-400 tracking-wider">
                  सशुल्क व्हिडिओ व्याख्यान
                </span>
                <h3 className="font-extrabold text-base text-white leading-snug">
                  {language === 'mr' ? unlockingVideo.title_mr : unlockingVideo.title_en}
                </h3>
              </div>
            </div>

            {/* Details Box */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>विषय (Topic):</span>
                <span className="font-bold text-white">{unlockingVideo.subject_name || 'Nursing'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>कालावधी (Duration):</span>
                <span className="font-bold text-white">{unlockingVideo.duration_label || '45 Min'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>मार्गदर्शक (Faculty):</span>
                <span className="font-bold text-white">{unlockingVideo.instructor_name || 'MH Sir'}</span>
              </div>
              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                <span className="font-bold text-purple-300">अनलॉक फी (Access Fee):</span>
                <span className="text-lg font-black text-white">₹{unlockingVideo.price || 49}</span>
              </div>
            </div>

            {/* Guaranteed Benefits */}
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>अमर्यादित वेळा ॲपमध्ये सुरक्षित एचडी व्हिडिओ पाहण्याची सुविधा</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>परीक्षेसाठी अत्यंत महत्त्वाच्या मुद्द्यांचे सविस्तर विश्लेषण</span>
              </div>
            </div>

            {/* Status alerts */}
            {unlockError && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{unlockError}</span>
              </div>
            )}

            {unlockSuccess && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>व्हिडिओ यशस्वीरित्या अनलॉक झाला! उघडत आहे...</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                disabled={isProcessingPayment || unlockSuccess}
                onClick={() => handleUnlockLecture(unlockingVideo)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 cursor-pointer transition disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <span>प्रक्रिया सुरू आहे...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>हा व्हिडिओ अनलॉक करा (₹{unlockingVideo.price || 49})</span>
                  </>
                )}
              </button>

              {onNavigateToPro && (
                <button
                  type="button"
                  onClick={() => {
                    setUnlockingVideo(null);
                    onNavigateToPro();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-slate-700"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>किंवा सर्व टेस्ट सिरीज व सर्व व्हिडिओ पास मिळवा</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
