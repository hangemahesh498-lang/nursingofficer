import React, { useState, useEffect, useRef } from 'react';
import { PromoAd } from '../types';
import { api } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ExternalLink,
  Sparkles,
  Smartphone,
  Tv,
  X,
  ChevronRight,
  ChevronLeft,
  Flame,
  Film,
  Sparkle,
  Award
} from 'lucide-react';

interface PromoVideoPlayerProps {
  screen?: 'dashboard' | 'practice' | 'mock_tests' | 'study_materials';
  onNavigateTab?: (tab: string) => void;
}

export const PromoVideoPlayer: React.FC<PromoVideoPlayerProps> = ({ screen = 'dashboard', onNavigateTab }) => {
  const { language } = useLanguage();
  const [ads, setAds] = useState<PromoAd[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPipFloating, setIsPipFloating] = useState(false);
  const [isPipDismissed, setIsPipDismissed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  const mainCardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pipVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setVideoError(false);
    setIsPlaying(false);
  }, [currentIndex]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const list = await api.getPromoAds({ is_active: true, target_screen: screen });
        if (list.length > 0) {
          setAds(list);
        } else {
          // Default backup promo videos for All Exams
          setAds([
            {
              id: 'ad-all-exam-masterclass',
              title_en: 'All Nursing Officer Exams Master Strategy & High-Yield Preparation (DMER, DHS, RRB, ESIC, NORCET)',
              title_mr: 'सर्व नर्सिंग अधिकारी परीक्षांची महा-रणनीती (DMER • DHS • RRB • ESIC • NORCET • CHO)',
              description_en: 'Comprehensive scoring roadmap for all Central and Maharashtra state nursing recruitment exams. Master High-Yield MCQs, Technical syllabus, Non-nursing subjects & negative marking tips.',
              description_mr: 'महाराष्ट्र व केंद्र सरकारच्या सर्व नर्सिंग भरती परीक्षांसाठी (DMER, DHS, RRB, ESIC, NORCET, CHO, ZP) १००% परिपूर्ण रणनीती, तांत्रिक घटक, मराठी/इंग्रजी/जीके व निगेटिव्ह मार्किंग टाळण्याच्या युक्त्या.',
              aspect_ratio: '16:9',
              media_type: 'video',
              video_url: 'https://res.cloudinary.com/demo/video/upload/c_scale,w_854/sea_turtle.mp4',
              thumbnail_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
              cta_text_en: 'Enroll in All-Exam Pro Batch ₹199',
              cta_text_mr: 'सर्व परीक्षांसाठी PRO बॅच (फक्त ₹१९९)',
              cta_link: 'upgrade-pro',
              target_screen: 'all',
              is_active: true,
              enable_sticky_pip: true,
              order_index: 1,
              badge_text_en: 'All Nursing Exams Strategy',
              badge_text_mr: 'सर्व नर्सिंग परीक्षांसाठी विशेष',
              sponsor_tag: 'All Nursing Exams Academy',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: 'ad-parkland-reel-short',
              title_en: '1-Minute Parkland Burn & Pediatric Drug Dose Calculation (All Nursing Exams)',
              title_mr: '१ मिनिटात शिका: पार्कलँड बर्न सूत्र व औषध गणना (सर्व परीक्षांसाठी)',
              description_en: 'High-yield calculation formula frequently asked in DMER, DHS, RRB, ESIC, AIIMS NORCET & State Staff Nurse exams.',
              description_mr: 'DMER, DHS, ESIC, RRB, NORCET व जिल्हा परिषद स्टाफ नर्स परीक्षेत १००% विचारल्या जाणाऱ्या फॉर्म्युला ट्रिक्स एका मिनिटाच्या शॉर्ट रीलमध्ये समजून घ्या.',
              aspect_ratio: '9:16',
              media_type: 'video',
              video_url: 'https://res.cloudinary.com/demo/video/upload/c_fill,ar_9:16,w_720/dog.mp4',
              thumbnail_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=720&q=80',
              cta_text_en: 'Join Free All-Exam Telegram',
              cta_text_mr: 'मोफत टेलिग्राम चॅनेल जॉईन करा',
              cta_link: 'https://t.me/NursingOfficerPrep',
              target_screen: 'all',
              is_active: true,
              enable_sticky_pip: true,
              order_index: 2,
              badge_text_en: 'All-Exam High Yield Reel',
              badge_text_mr: 'सर्व परीक्षांसाठी शॉर्ट रील',
              sponsor_tag: 'Rapid Nursing Reels',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching promo ads:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [screen]);

  // Sticky Floating PiP on Scroll Observer ("takle la vidio scroll kelawar khali disala pahije")
  useEffect(() => {
    if (!mainCardRef.current || ads.length === 0) return;
    const currentAd = ads[currentIndex];
    if (!currentAd || !currentAd.enable_sticky_pip) {
      setIsPipFloating(false);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        // When main video card scrolls out of the viewport, trigger floating PiP
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          setIsPipFloating(true);
        } else {
          setIsPipFloating(false);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(mainCardRef.current);
    return () => observer.disconnect();
  }, [ads, currentIndex]);

  if (loading || ads.length === 0) return null;

  const currentAd = ads[currentIndex] || ads[0];
  const isReel = currentAd.aspect_ratio === '9:16';

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(err => {
              console.warn('Playback prevented or interrupted:', err);
              setIsPlaying(false);
            });
        }
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
    if (pipVideoRef.current) {
      pipVideoRef.current.muted = !pipVideoRef.current.muted;
    }
  };

  const handleCtaClick = () => {
    if (!currentAd.cta_link) return;
    if (currentAd.cta_link.startsWith('http://') || currentAd.cta_link.startsWith('https://')) {
      window.open(currentAd.cta_link, '_blank');
    } else if (onNavigateTab) {
      onNavigateTab(currentAd.cta_link);
    }
  };

  const nextAd = () => {
    setCurrentIndex(prev => (prev + 1) % ads.length);
  };

  const prevAd = () => {
    setCurrentIndex(prev => (prev - 1 + ads.length) % ads.length);
  };

  return (
    <>
      {/* Main Section Banner / Player Card */}
      <div
        ref={mainCardRef}
        className="w-full bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-4 sm:p-6 text-white shadow-xl border border-blue-800/40 relative overflow-hidden my-4 group"
      >
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6">
          {/* Left / Center: Video Player Container */}
          <div className="w-full lg:w-auto flex-shrink-0 flex justify-center">
            {isReel ? (
              /* 9:16 Vertical Reel Player */
              <div className="w-[220px] sm:w-[240px] h-[390px] sm:h-[426px] bg-black rounded-3xl overflow-hidden relative shadow-2xl border-2 border-indigo-500/40 flex flex-col justify-between p-3.5 group/vid">
                {videoError || !currentAd.video_url ? (
                  <div className="absolute inset-0 w-full h-full bg-slate-900 flex items-center justify-center overflow-hidden">
                    <img
                      src={currentAd.thumbnail_url || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=720&q=80'}
                      alt="Reel Poster"
                      className="w-full h-full object-cover opacity-85 group-hover/vid:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/30 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    poster={currentAd.thumbnail_url}
                    playsInline
                    loop
                    muted={isMuted}
                    onError={() => setVideoError(true)}
                    className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                    onClick={togglePlay}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    <source src={currentAd.video_url} type="video/mp4" />
                  </video>
                )}
                
                {/* Top Overlay */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black text-indigo-300 border border-indigo-400/30 flex items-center gap-1">
                    <Smartphone className="w-3 h-3" />
                    <span>{language === 'mr' ? (currentAd.badge_text_mr || '९:१६ रील') : (currentAd.badge_text_en || '9:16 Reel')}</span>
                  </span>
                  <button
                    onClick={toggleMute}
                    className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition cursor-pointer"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Center Play/Pause button */}
                <div
                  onClick={togglePlay}
                  className={`absolute inset-0 flex items-center justify-center cursor-pointer transition ${
                    isPlaying ? 'opacity-0 group-hover/vid:opacity-100' : 'opacity-100'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transform transition group-hover/vid:scale-110">
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                  </div>
                </div>

                {/* Bottom Overlay Info in Reel */}
                <div className="relative z-10 space-y-1.5 mt-auto">
                  <div className="text-[10px] font-black text-amber-300 drop-shadow-sm">
                    {currentAd.sponsor_tag || 'Nursing Officer Academy'}
                  </div>
                  <h4 className="text-xs font-black text-white line-clamp-2 leading-tight drop-shadow-md">
                    {language === 'mr' ? (currentAd.title_mr || currentAd.title_en) : currentAd.title_en}
                  </h4>
                </div>
              </div>
            ) : (
              /* 16:9 Landscape Widescreen Player */
              <div className="w-full sm:w-[480px] lg:w-[500px] aspect-video bg-black rounded-2xl overflow-hidden relative shadow-2xl border-2 border-blue-500/40 group/vid">
                {videoError || !currentAd.video_url ? (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center overflow-hidden relative">
                    <img
                      src={currentAd.thumbnail_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80'}
                      alt="Masterclass Banner"
                      className="w-full h-full object-cover opacity-85 group-hover/vid:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl">
                        <Play className="w-7 h-7 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    poster={currentAd.thumbnail_url}
                    playsInline
                    loop
                    muted={isMuted}
                    onError={() => setVideoError(true)}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={togglePlay}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    <source src={currentAd.video_url} type="video/mp4" />
                  </video>
                )}

                {/* Top Badge & Audio Toggle */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black text-blue-300 border border-blue-400/30 flex items-center gap-1">
                    <Tv className="w-3 h-3" />
                    <span>{language === 'mr' ? (currentAd.badge_text_mr || '१६:९ व्हिडिओ') : (currentAd.badge_text_en || '16:9 Video')}</span>
                  </span>
                  <button
                    onClick={toggleMute}
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition cursor-pointer"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Center Play Button */}
                <div
                  onClick={togglePlay}
                  className={`absolute inset-0 flex items-center justify-center cursor-pointer transition ${
                    isPlaying ? 'opacity-0 group-hover/vid:opacity-100' : 'opacity-100'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center shadow-2xl transform transition group-hover/vid:scale-110">
                    {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-current ml-0.5" />}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Title, Description, Multi-Ad Navigation, & Glowing CTA */}
          <div className="flex-1 flex flex-col justify-between space-y-4 text-left">
            <div>
              {/* Header Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-black uppercase tracking-wider border border-amber-400/30 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentAd.sponsor_tag || 'Special Feature'}</span>
                </span>
                
                {currentAd.enable_sticky_pip && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-400/30">
                    {language === 'mr' ? 'स्क्रोल केल्यावर खाली दिसेल (Sticky PiP)' : 'Floating Video on Scroll'}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-snug">
                {language === 'mr' ? (currentAd.title_mr || currentAd.title_en) : currentAd.title_en}
              </h3>

              {/* Description */}
              <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed line-clamp-3">
                {language === 'mr' ? (currentAd.description_mr || currentAd.description_en) : currentAd.description_en}
              </p>

              {/* All Covered Exams Tag Ribbon */}
              <div className="pt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-300 mr-1 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'mr' ? 'सर्व परीक्षांसाठी उपयुक्त:' : 'For All Exams:'}</span>
                </span>
                {['DMER', 'DHS आरोग्य विभाग', 'ESIC', 'RRB', 'AIIMS NORCET', 'CHO', 'ZP स्टाफ नर्स'].map((examName) => (
                  <span
                    key={examName}
                    className="px-2 py-0.5 rounded-lg bg-white/10 text-white text-[10px] font-black tracking-wide border border-white/15 hover:bg-white/20 transition"
                  >
                    {examName}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar: Glowing CTA Button and Next/Prev Ad Carousel */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                onClick={handleCtaClick}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-xl hover:shadow-blue-500/25 transition transform hover:-translate-y-0.5 cursor-pointer border border-blue-400/30"
              >
                <span>{language === 'mr' ? (currentAd.cta_text_mr || 'आत्ताच जॉईन करा') : (currentAd.cta_text_en || 'Enroll Now')}</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              {ads.length > 1 && (
                <div className="flex items-center justify-end gap-2 text-xs text-slate-400">
                  <span>{currentIndex + 1} / {ads.length}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={prevAd}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition"
                      title="Previous Video"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextAd}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition"
                      title="Next Video"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING STICKY PiP MINI PLAYER ON SCROLL ("takle la vidio scroll kelawar khali disala pahije") */}
      {isPipFloating && !isPipDismissed && currentAd.enable_sticky_pip && (
        <div className="fixed bottom-16 right-4 sm:bottom-6 sm:right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-blue-500/80 p-2 text-white w-[260px] sm:w-[290px] space-y-2 overflow-hidden">
            {/* Top Bar of Floating Player */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="truncate max-w-[170px]">{currentAd.sponsor_tag || 'Live Video'}</span>
              </div>
              <button
                onClick={() => setIsPipDismissed(true)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                title="Close floating video"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Video Canvas */}
            <div className={`relative rounded-xl overflow-hidden bg-black ${isReel ? 'aspect-[9/14] max-h-[190px]' : 'aspect-video'}`}>
              {videoError || !currentAd.video_url ? (
                <div className="w-full h-full bg-slate-950 flex items-center justify-center relative">
                  <img
                    src={currentAd.thumbnail_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'}
                    alt="Lecture Thumbnail"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white drop-shadow-md fill-current" />
                  </div>
                </div>
              ) : (
                <video
                  ref={pipVideoRef}
                  poster={currentAd.thumbnail_url}
                  autoPlay
                  playsInline
                  loop
                  muted={isMuted}
                  onError={() => setVideoError(true)}
                  className="w-full h-full object-cover"
                >
                  <source src={currentAd.video_url} type="video/mp4" />
                </video>
              )}
              
              {/* Bottom Quick Controls */}
              <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                <button
                  onClick={toggleMute}
                  className="p-1 rounded-md bg-black/70 text-white text-[10px] flex items-center gap-1"
                >
                  {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                </button>
                <button
                  onClick={handleCtaClick}
                  className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black shadow-md flex items-center gap-1 cursor-pointer"
                >
                  <span>{language === 'mr' ? (currentAd.cta_text_mr || 'जॉईन') : (currentAd.cta_text_en || 'Join')}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>

            {/* Title snippet */}
            <div className="px-1 text-[11px] font-black text-white truncate">
              {language === 'mr' ? (currentAd.title_mr || currentAd.title_en) : currentAd.title_en}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
