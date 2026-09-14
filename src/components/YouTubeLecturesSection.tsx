import React, { useEffect, useState } from 'react';
import { Play, Tv, ExternalLink, Clock, User, X, Sparkles } from 'lucide-react';
import { YouTubeLecture, SystemSettings } from '../types';
import { api } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export const YouTubeLecturesSection: React.FC = () => {
  const { language } = useLanguage();
  const [lectures, setLectures] = useState<YouTubeLecture[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeLecture | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const [lectList, sysSettings] = await Promise.all([
          api.getYouTubeLectures(true),
          api.getSettings()
        ]);
        if (mounted) {
          setLectures(lectList);
          setSettings(sysSettings);
        }
      } catch (err) {
        console.error('Failed to load YouTube lectures:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, []);

  // If section disabled by Admin CMS or loading or empty, don't show
  if (!loading && settings && settings.show_youtube_lectures_section === false) {
    return null;
  }

  if (!loading && lectures.length === 0) {
    return null;
  }

  return (
    <div id="youtube-lectures-section" className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-4 sm:p-6 text-white shadow-md border border-slate-700/60 mt-6 sm:mt-8 relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 relative z-10 border-b border-slate-700/80 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/90 text-white flex items-center justify-center shadow-md shadow-red-900/40 ring-2 ring-red-400/30">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                {language === 'mr' ? '📺 यूट्यूब व्हिडिओ व्याख्याने व मास्टरक्लास' : '📺 YouTube Video Lectures & Masterclasses'}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse">
                {language === 'mr' ? 'मोफत व्याख्याने' : 'FREE LECTURES'}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              {language === 'mr'
                ? 'नर्सिंग अधिकारी भरती परीक्षांसाठी विषयनिहाय महत्त्वाचे व्हिडिओ व्याख्याने'
                : 'High-Yield Video Lectures & Concept Breakdown for Nursing Officer Recruitment Exams'}
            </p>
          </div>
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {lectures.map((lec) => {
          const ytVideoId = lec.youtube_video_id || 'dQw4w9WgXcQ';
          const thumbUrl = lec.thumbnail_url || `https://img.youtube.com/vi/${ytVideoId}/hqdefault.jpg`;

          return (
            <div
              key={lec.id}
              onClick={() => setSelectedVideo(lec)}
              className="group bg-slate-800/90 rounded-xl overflow-hidden border border-slate-700 hover:border-red-500/50 shadow-sm hover:shadow-lg hover:shadow-red-900/20 transition cursor-pointer flex flex-col"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img
                  src={thumbUrl}
                  alt={language === 'mr' ? lec.title_mr : lec.title_en}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

                {/* Duration Badge */}
                {lec.duration_label && (
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-slate-900/90 text-slate-200 text-[10px] font-bold flex items-center gap-1 backdrop-blur-xs border border-slate-700">
                    <Clock className="w-3 h-3 text-red-400" />
                    <span>{lec.duration_label}</span>
                  </div>
                )}

                {/* Subject Badge */}
                {lec.subject_name && (
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-extrabold shadow-xs">
                    {lec.subject_name}
                  </div>
                )}

                {/* Big Red Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600/90 group-hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-900/50 group-hover:scale-110 transition duration-200 ring-4 ring-white/20">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-red-300 transition line-clamp-2 leading-snug mb-1.5">
                    {language === 'mr' ? (lec.title_mr || lec.title_en) : (lec.title_en || lec.title_mr)}
                  </h3>
                  {(lec.description_mr || lec.description_en) && (
                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                      {language === 'mr' ? (lec.description_mr || lec.description_en) : (lec.description_en || lec.description_mr)}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/60 mt-2">
                  <div className="flex items-center gap-1 font-medium text-slate-300 truncate">
                    <User className="w-3 h-3 text-red-400 shrink-0" />
                    <span className="truncate">{lec.instructor_name || 'MH Sir (Nursing Officer)'}</span>
                  </div>
                  <span className="text-red-400 font-bold group-hover:underline flex items-center gap-1 shrink-0">
                    {language === 'mr' ? 'पहा' : 'Watch'}
                    <Play className="w-3 h-3 fill-current" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-4 py-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate">
                <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <Tv className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                  {language === 'mr' ? selectedVideo.title_mr : selectedVideo.title_en}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={selectedVideo.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white border border-red-500/30 text-xs font-bold transition flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{language === 'mr' ? 'यूट्यूबवर उघडा' : 'YouTube App'}</span>
                </a>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-1.5 rounded-lg bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600 cursor-pointer transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Player Frame */}
            <div className="relative aspect-video bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtube_video_id}?autoplay=1&modestbranding=1&rel=0`}
                title={selectedVideo.title_en}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Footer Description */}
            <div className="p-4 bg-slate-900 text-xs text-slate-300 space-y-1.5 overflow-y-auto">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold text-[11px] border border-red-500/30">
                    {selectedVideo.subject_name || 'Nursing Lecture'}
                  </span>
                  <span className="text-slate-400 font-medium text-[11px]">
                    {selectedVideo.instructor_name || 'MH Sir & Experts'}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
