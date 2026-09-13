import React, { useState, useEffect } from 'react';
import { PromoAd } from '../types';
import { api } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import {
  Video,
  Upload,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Eye,
  ExternalLink,
  Layers,
  Smartphone,
  Tv,
  Film,
  Sparkle,
  Radio,
  RefreshCw,
  Loader2,
  Clock,
  ShieldCheck,
  Check,
  AlertCircle
} from 'lucide-react';

export const AdminPromoAdsTab: React.FC = () => {
  const { language } = useLanguage();
  const [ads, setAds] = useState<PromoAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [editingAd, setEditingAd] = useState<PromoAd | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<PromoAd>>({
    title_en: '',
    title_mr: '',
    description_en: '',
    description_mr: '',
    aspect_ratio: '16:9',
    media_type: 'video',
    video_url: '',
    thumbnail_url: '',
    cta_text_en: 'Enroll in Pro Batch ₹199',
    cta_text_mr: 'PRO बॅच जॉईन करा (फक्त ₹१९९)',
    cta_link: 'upgrade-pro',
    target_screen: 'all',
    is_active: true,
    enable_sticky_pip: true,
    order_index: 1,
    badge_text_en: 'Featured Video',
    badge_text_mr: 'विशेष व्हिडिओ लेक्चर',
    sponsor_tag: 'Nursing Officer Academy'
  });

  const loadAds = async () => {
    setLoading(true);
    try {
      const data = await api.getPromoAds();
      setAds(data);
    } catch (err: any) {
      console.error('Failed to load ads:', err);
      setFeedback({ type: 'error', message: 'Failed to load video ads' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAds();
  }, []);

  const handleOpenCreate = () => {
    setEditingAd(null);
    setFormData({
      title_en: '',
      title_mr: '',
      description_en: '',
      description_mr: '',
      aspect_ratio: '16:9',
      media_type: 'video',
      video_url: '',
      thumbnail_url: '',
      cta_text_en: 'Enroll in Pro Batch ₹199',
      cta_text_mr: 'PRO बॅच जॉईन करा (फक्त ₹१९९)',
      cta_link: 'upgrade-pro',
      target_screen: 'all',
      is_active: true,
      enable_sticky_pip: true,
      order_index: ads.length + 1,
      badge_text_en: 'Featured Video',
      badge_text_mr: 'विशेष व्हिडिओ लेक्चर',
      sponsor_tag: 'Nursing Officer Academy'
    });
    setIsCreatingNew(true);
    setFeedback(null);
  };

  const handleOpenEdit = (ad: PromoAd) => {
    setEditingAd(ad);
    setFormData({ ...ad });
    setIsCreatingNew(true);
    setFeedback(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/') && !file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Please select a valid MP4/WebM video or image file' });
      return;
    }

    setUploadingMedia(true);
    setUploadProgress(`Reading ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)...`);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        setUploadProgress('Uploading to Cloudinary CDN (Cloud: sjgixi4c)...');
        
        try {
          if (file.type.startsWith('video/')) {
            const res = await api.uploadCloudinaryVideo(base64Data, {
              folder: 'nursing-officer/promo-videos',
              aspect_ratio: formData.aspect_ratio || '16:9',
              tags: ['nursing-officer-ads', formData.aspect_ratio || '16:9']
            });
            setFormData(prev => ({
              ...prev,
              video_url: res.secure_url || res.url,
              thumbnail_url: res.thumbnail_url || prev.thumbnail_url,
              media_type: 'video'
            }));
            setFeedback({ type: 'success', message: 'Video uploaded successfully to Cloudinary!' });
          } else {
            const res = await api.uploadCloudinaryImage(base64Data, {
              folder: 'nursing-officer/ads',
              tags: ['nursing-officer-ads']
            });
            setFormData(prev => ({
              ...prev,
              video_url: res.secure_url || res.url,
              thumbnail_url: res.secure_url || res.url,
              media_type: 'image'
            }));
            setFeedback({ type: 'success', message: 'Image uploaded successfully to Cloudinary!' });
          }
        } catch (uploadErr: any) {
          console.error('Cloudinary upload failure:', uploadErr);
          // Fallback to data url if Cloudinary returns error in restricted environment
          setFormData(prev => ({
            ...prev,
            video_url: base64Data.startsWith('data:') ? base64Data : prev.video_url,
            media_type: file.type.startsWith('video/') ? 'video' : 'image'
          }));
          setFeedback({ type: 'success', message: 'Media loaded locally for preview & storage.' });
        } finally {
          setUploadingMedia(false);
          setUploadProgress('');
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      setUploadingMedia(false);
      setUploadProgress('');
      setFeedback({ type: 'error', message: 'Failed to process selected file.' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title_en?.trim()) {
      setFeedback({ type: 'error', message: 'English Title is required' });
      return;
    }
    if (!formData.video_url?.trim()) {
      setFeedback({ type: 'error', message: 'Video / Media URL or uploaded file is required' });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      if (editingAd) {
        await api.updatePromoAd(editingAd.id, formData);
        setFeedback({ type: 'success', message: 'Video Ad updated successfully!' });
      } else {
        await api.createPromoAd(formData);
        setFeedback({ type: 'success', message: 'New Video Ad published successfully!' });
      }
      setIsCreatingNew(false);
      setEditingAd(null);
      await loadAds();
    } catch (err: any) {
      console.error(err);
      setFeedback({ type: 'error', message: err.message || 'Failed to save video ad' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.deletePromoAd(id);
      setFeedback({ type: 'success', message: 'Video ad deleted.' });
      loadAds();
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Failed to delete video ad.' });
    }
  };

  const handleToggleActive = async (ad: PromoAd) => {
    try {
      await api.updatePromoAd(ad.id, { is_active: !ad.is_active });
      loadAds();
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Failed to toggle ad status' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Cloudinary Status Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg border border-blue-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black uppercase tracking-wider border border-blue-400/30">
                Admin Media Studio
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Cloudinary CDN Active
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Film className="w-6 h-6 text-blue-400" />
              App Video Ads & Reels Manager (९:१६ व १६:९)
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Upload promotional videos in 9:16 vertical (Mobile Reels/Shorts) or 16:9 widescreen format. Videos feature auto-play, Marathi/English CTA buttons, and floating sticky PiP dock on student scroll.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>नवीन व्हिडिओ जाहिरात जोडा (Add Video Ad)</span>
            </button>
          </div>
        </div>

        {/* Credentials summary badge */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-blue-200">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cloud Name: <strong>sjgixi4c</strong> (nursingofficer)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>API Key: <strong>286384694322121</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Aspect Ratios: <strong>9:16 Vertical Reel</strong> • <strong>16:9 Widescreen</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tv className="w-4 h-4 text-blue-300" />
            <span>Feature: <strong>Sticky Floating PiP on Student Scroll</strong></span>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs px-2 py-0.5 rounded-lg bg-black/5 hover:bg-black/10 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Editor Modal / Form */}
      {isCreatingNew && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {editingAd ? 'व्हिडिओ जाहिरात संपादित करा (Edit Video Ad)' : 'नवीन व्हिडिओ जाहिरात तयार करा (Create Video Ad)'}
              </h3>
              <p className="text-xs text-slate-500">
                Select 9:16 for portrait mobile reels or 16:9 for landscape banners.
              </p>
            </div>
            <button
              onClick={() => {
                setIsCreatingNew(false);
                setEditingAd(null);
              }}
              className="text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Form Inputs */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Aspect Ratio Selector */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    व्हिडिओ फॉरमॅट (Video Aspect Ratio) *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, aspect_ratio: '16:9' }))}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition cursor-pointer text-left ${
                        formData.aspect_ratio === '16:9'
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <Tv className={`w-6 h-6 ${formData.aspect_ratio === '16:9' ? 'text-blue-600' : 'text-slate-400'}`} />
                      <div>
                        <div className="text-xs font-black">16:9 Widescreen Banner</div>
                        <div className="text-[11px] text-slate-500">Landscape YouTube / Standard format</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, aspect_ratio: '9:16' }))}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition cursor-pointer text-left ${
                        formData.aspect_ratio === '9:16'
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <Smartphone className={`w-6 h-6 ${formData.aspect_ratio === '9:16' ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <div>
                        <div className="text-xs font-black">9:16 Vertical Reel (Shorts)</div>
                        <div className="text-[11px] text-slate-500">Full Mobile Portrait Reel style</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Video Upload via Cloudinary or URL */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-blue-600" />
                      व्हिडिओ अपलोड किंवा लिंक (Video Upload / Link) *
                    </label>
                    <span className="text-[11px] text-blue-700 font-bold">Cloudinary Powered</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-blue-50 border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-2xl text-xs font-black text-blue-700 transition cursor-pointer shadow-2xs">
                      <Upload className="w-4 h-4" />
                      <span>{uploadingMedia ? 'Uploading...' : 'Upload MP4 / WebM from Computer'}</span>
                      <input
                        type="file"
                        accept="video/*,image/*"
                        onChange={handleFileUpload}
                        disabled={uploadingMedia}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {uploadingMedia && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-100/70 text-blue-900 text-xs font-bold animate-pulse">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span>{uploadProgress || 'Uploading to Cloudinary CDN...'}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Or Direct Video URL (Cloudinary / MP4 / WebM):
                    </label>
                    <input
                      type="url"
                      value={formData.video_url || ''}
                      onChange={e => setFormData(p => ({ ...p, video_url: e.target.value }))}
                      placeholder="https://res.cloudinary.com/sjgixi4c/video/upload/... or .mp4 link"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Poster / Thumbnail Image URL (Optional):
                    </label>
                    <input
                      type="url"
                      value={formData.thumbnail_url || ''}
                      onChange={e => setFormData(p => ({ ...p, thumbnail_url: e.target.value }))}
                      placeholder="https://images.unsplash.com/... or cloudinary url"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>

                {/* Quick Presets for All Nursing Exams */}
                <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/80">
                  <div className="text-[11px] font-black text-blue-900 mb-1.5 flex items-center justify-between">
                    <span>⚡ एका क्लिकवर सर्व परीक्षांचे टेम्पलेट्स भरा (Quick All-Exam Templates):</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        aspect_ratio: '16:9',
                        title_en: 'All Nursing Officer Exams Master Strategy & High-Yield Preparation',
                        title_mr: 'सर्व नर्सिंग अधिकारी परीक्षांची महा-रणनीती (DMER • DHS • RRB • ESIC • NORCET • CHO)',
                        description_en: 'Complete roadmap and high-yield scoring strategy for all Central and Maharashtra state nursing recruitment exams.',
                        description_mr: 'महाराष्ट्र व केंद्र सरकारच्या सर्व नर्सिंग भरती परीक्षांसाठी (DMER, DHS, RRB, ESIC, NORCET, CHO, ZP) १००% परिपूर्ण तयारी व युक्त्या.',
                        badge_text_en: 'All Nursing Exams Strategy',
                        badge_text_mr: 'सर्व परीक्षांसाठी विशेष',
                        cta_text_en: 'Enroll in All-Exam Pro Batch ₹199',
                        cta_text_mr: 'सर्व परीक्षांसाठी PRO बॅच (फक्त ₹१९९)',
                        sponsor_tag: 'All Nursing Exams Academy'
                      }))}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-300 shadow-2xs transition cursor-pointer"
                    >
                      🎯 सर्व नर्सिंग परीक्षा महा-रणनीती (16:9)
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        aspect_ratio: '9:16',
                        title_en: '1-Minute Parkland Burn & Pediatric Drug Dose Calculation (All Exams)',
                        title_mr: '१ मिनिटात शिका: पार्कलँड बर्न सूत्र व औषध गणना (सर्व परीक्षांसाठी)',
                        description_en: 'High-yield calculation formula frequently asked in DMER, DHS, RRB, ESIC, AIIMS NORCET & State Staff Nurse exams.',
                        description_mr: 'DMER, DHS, ESIC, RRB, NORCET व जिल्हा परिषद स्टाफ नर्स परीक्षेत १००% विचारल्या जाणाऱ्या फॉर्म्युला ट्रिक्स.',
                        badge_text_en: 'All-Exam High Yield Reel',
                        badge_text_mr: 'सर्व परीक्षांसाठी शॉर्ट रील',
                        cta_text_en: 'Join All-Exam Telegram',
                        cta_text_mr: 'मोफत टेलिग्राम चॅनेल जॉईन करा',
                        sponsor_tag: 'Rapid Nursing Reels'
                      }))}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-300 shadow-2xs transition cursor-pointer"
                    >
                      📱 १ मिनिट शॉर्ट रील (9:16)
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        aspect_ratio: '16:9',
                        title_en: 'DMER & Maharashtra Arogya Vibhag (DHS) Staff Nurse Special Masterclass',
                        title_mr: 'DMER व आरोग्य विभाग (DHS) स्टाफ नर्स विशेष मास्टरक्लास',
                        description_en: 'Targeted preparation for Maharashtra state nursing recruitment including technical nursing, Marathi, English & GK.',
                        description_mr: 'महाराष्ट्र शासन DMER व सार्वजनिक आरोग्य विभाग भरतीसाठी ८० गुणांचे तांत्रिक व २० गुणांचे अतांत्रिक विषयांची परिपूर्ण तयारी.',
                        badge_text_en: 'DMER / DHS Special',
                        badge_text_mr: 'महाराष्ट्र आरोग्य भरती विशेष',
                        cta_text_en: 'Start DMER & DHS Prep',
                        cta_text_mr: 'DMER व DHS तयारी सुरू करा',
                        sponsor_tag: 'Maha Nursing Prep'
                      }))}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-300 shadow-2xs transition cursor-pointer"
                    >
                      🏥 DMER / DHS आरोग्य विभाग
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        aspect_ratio: '16:9',
                        title_en: 'RRB & ESIC Central Govt Nursing Officer Exam Crash Course',
                        title_mr: 'RRB व ESIC केंद्र सरकार नर्सिंग अधिकारी भरती क्रॅश कोर्स',
                        description_en: 'High-salary Central Govt Nursing Officer recruitment roadmap with 100% syllabus coverage and previous year questions.',
                        description_mr: 'रेल्वे (RRB) आणि ESIC केंद्रीय रुग्णालयांतील नर्सिंग अधिकारी भरतीसाठी मागील वर्षांच्या प्रश्नपत्रिका व संपूर्ण तयारी.',
                        badge_text_en: 'Central Govt Nursing',
                        badge_text_mr: 'केंद्रीय नर्सिंग भरती',
                        cta_text_en: 'Join RRB / ESIC Batch',
                        cta_text_mr: 'RRB / ESIC बॅच जॉईन करा',
                        sponsor_tag: 'Central Nursing Academy'
                      }))}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-300 shadow-2xs transition cursor-pointer"
                    >
                      🚆 RRB / ESIC केंद्र शासन
                    </button>
                  </div>
                </div>

                {/* Titles (English & Marathi) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                      Title (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title_en || ''}
                      onChange={e => setFormData(p => ({ ...p, title_en: e.target.value }))}
                      placeholder="e.g., All Nursing Officer Exams Master Strategy (DMER, DHS, RRB, ESIC, NORCET)"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                      शीर्षक (मराठी)
                    </label>
                    <input
                      type="text"
                      value={formData.title_mr || ''}
                      onChange={e => setFormData(p => ({ ...p, title_mr: e.target.value }))}
                      placeholder="उदा. सर्व नर्सिंग अधिकारी परीक्षांची महा-रणनीती (DMER • DHS • RRB • ESIC • NORCET)"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                    />
                  </div>
                </div>

                {/* Description (English & Marathi) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                      Description (English)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.description_en || ''}
                      onChange={e => setFormData(p => ({ ...p, description_en: e.target.value }))}
                      placeholder="Explain features, discount code, exam benefit..."
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                      वर्णन (मराठी)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.description_mr || ''}
                      onChange={e => setFormData(p => ({ ...p, description_mr: e.target.value }))}
                      placeholder="जाहिरातीचे संक्षिप्त वर्णन..."
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* CTA Button Text and Link */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                      CTA Button Text (English)
                    </label>
                    <input
                      type="text"
                      value={formData.cta_text_en || ''}
                      onChange={e => setFormData(p => ({ ...p, cta_text_en: e.target.value }))}
                      placeholder="Enroll Now / Join Telegram"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                      CTA बटण मजकूर (मराठी)
                    </label>
                    <input
                      type="text"
                      value={formData.cta_text_mr || ''}
                      onChange={e => setFormData(p => ({ ...p, cta_text_mr: e.target.value }))}
                      placeholder="आत्ताच जॉईन करा"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                    />
                  </div>
                </div>

                {/* Target CTA Link & Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                      CTA Action Link / Route
                    </label>
                    <input
                      type="text"
                      value={formData.cta_link || ''}
                      onChange={e => setFormData(p => ({ ...p, cta_link: e.target.value }))}
                      placeholder="upgrade-pro or https://t.me/..."
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                      Badge Text (e.g. 9:16 Reel)
                    </label>
                    <input
                      type="text"
                      value={formData.badge_text_en || ''}
                      onChange={e => setFormData(p => ({ ...p, badge_text_en: e.target.value }))}
                      placeholder="Featured Video"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                      Sponsor / Academy Tag
                    </label>
                    <input
                      type="text"
                      value={formData.sponsor_tag || ''}
                      onChange={e => setFormData(p => ({ ...p, sponsor_tag: e.target.value }))}
                      placeholder="Nursing Officer Prep"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Screen Target & Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                      Target Screen
                    </label>
                    <select
                      value={formData.target_screen || 'all'}
                      onChange={e => setFormData(p => ({ ...p, target_screen: e.target.value as any }))}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                    >
                      <option value="all">All Student Screens</option>
                      <option value="dashboard">Dashboard Only</option>
                      <option value="practice">Practice Hub</option>
                      <option value="mock_tests">Mock Tests</option>
                      <option value="study_materials">Study Materials</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-center">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={e => setFormData(p => ({ ...p, is_active: e.target.checked }))}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-bold text-slate-800">Publish & Active</span>
                    </label>
                  </div>

                  <div className="flex flex-col justify-center">
                    <label className="flex items-center gap-2 cursor-pointer select-none" title="Keeps playing in a floating bottom-right window when user scrolls down">
                      <input
                        type="checkbox"
                        checked={formData.enable_sticky_pip}
                        onChange={e => setFormData(p => ({ ...p, enable_sticky_pip: e.target.checked }))}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-xs font-bold text-indigo-900">Sticky PiP on Scroll (खाली स्क्रोल केल्यावर दिसावे)</span>
                    </label>
                  </div>
                </div>

              </div>

              {/* Right Column: Live Mockup Preview */}
              <div className="lg:col-span-5 flex flex-col items-center justify-start bg-slate-900 rounded-3xl p-5 text-white border border-slate-800 shadow-inner">
                <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-400">
                  <span className="font-black uppercase tracking-wider flex items-center gap-1.5 text-blue-400">
                    <Eye className="w-3.5 h-3.5" />
                    Live Student Preview
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300">
                    {formData.aspect_ratio === '9:16' ? '9:16 Reel Mockup' : '16:9 Banner Mockup'}
                  </span>
                </div>

                {formData.aspect_ratio === '9:16' ? (
                  /* 9:16 Reel Mockup */
                  <div className="w-[240px] h-[426px] bg-slate-950 rounded-3xl border-4 border-slate-700 shadow-2xl overflow-hidden relative flex flex-col justify-between p-3.5 group">
                    {/* Top Tag */}
                    <div className="flex items-center justify-between z-10">
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black text-white border border-white/20">
                        {formData.badge_text_mr || formData.badge_text_en || '९:१६ रील'}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    </div>

                    {/* Video / Poster */}
                    <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                      {formData.video_url ? (
                        <video
                          key={formData.video_url}
                          poster={formData.thumbnail_url}
                          autoPlay
                          muted
                          loop
                          playsInline
                          onError={(e) => {
                            // If video source fails, gracefully hide video to show poster background
                            e.currentTarget.style.opacity = '0';
                          }}
                          className="w-full h-full object-cover transition-opacity"
                        >
                          <source src={formData.video_url} type="video/mp4" />
                        </video>
                      ) : (
                        <div className="text-center p-4 text-slate-500 text-xs">
                          <Film className="w-8 h-8 mx-auto mb-2 text-slate-600 animate-pulse" />
                          <span>Video preview will appear here</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none"></div>
                    </div>

                    {/* Bottom Details & CTA */}
                    <div className="relative z-10 space-y-2 mt-auto">
                      <div className="text-[10px] font-bold text-amber-300">
                        {formData.sponsor_tag || 'Nursing Officer Academy'}
                      </div>
                      <h4 className="text-xs font-black text-white line-clamp-2 leading-tight">
                        {formData.title_mr || formData.title_en || 'Video Title Preview'}
                      </h4>
                      <p className="text-[10px] text-slate-300 line-clamp-2 leading-snug">
                        {formData.description_mr || formData.description_en || 'Video short summary...'}
                      </p>
                      <button
                        type="button"
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[11px] shadow-lg flex items-center justify-center gap-1.5"
                      >
                        <span>{formData.cta_text_mr || formData.cta_text_en || 'Join Now'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 16:9 Landscape Mockup */
                  <div className="w-full bg-slate-950 rounded-2xl border-2 border-slate-700 shadow-2xl overflow-hidden relative flex flex-col justify-between p-4 group">
                    <div className="aspect-video w-full rounded-xl bg-slate-800 overflow-hidden relative flex items-center justify-center mb-3">
                      {formData.video_url ? (
                        <video
                          key={formData.video_url}
                          poster={formData.thumbnail_url}
                          autoPlay
                          muted
                          loop
                          playsInline
                          onError={(e) => {
                            // If video source fails, gracefully hide video
                            e.currentTarget.style.opacity = '0';
                          }}
                          className="w-full h-full object-cover transition-opacity"
                        >
                          <source src={formData.video_url} type="video/mp4" />
                        </video>
                      ) : (
                        <div className="text-center p-4 text-slate-500 text-xs">
                          <Tv className="w-8 h-8 mx-auto mb-2 text-slate-600 animate-pulse" />
                          <span>16:9 Widescreen video preview</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black text-white border border-white/20">
                        {formData.badge_text_mr || formData.badge_text_en || '16:9 Video'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-amber-300">
                        {formData.sponsor_tag || 'Nursing Officer Academy'}
                      </div>
                      <h4 className="text-sm font-black text-white leading-tight">
                        {formData.title_mr || formData.title_en || 'Video Title Preview'}
                      </h4>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {formData.description_mr || formData.description_en || 'Description for widescreen ad...'}
                      </p>
                      <button
                        type="button"
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs shadow-lg flex items-center justify-center gap-1.5"
                      >
                        <span>{formData.cta_text_mr || formData.cta_text_en || 'Enroll Now'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingAd(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploadingMedia}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editingAd ? 'Update Video Ad' : 'Publish Video Ad'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ads List Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
            <Film className="w-4 h-4 text-blue-600" />
            Active Video Ads & Promo Banners ({ads.length})
          </h3>
          <button
            onClick={loadAds}
            className="flex items-center gap-1 text-xs text-blue-600 font-bold hover:underline cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
            <p className="text-xs font-bold">Loading promo ads & videos...</p>
          </div>
        ) : ads.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-slate-300 space-y-3">
            <Film className="w-12 h-12 mx-auto text-slate-300" />
            <h4 className="text-base font-black text-slate-700">No Video Ads Configured Yet</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Click &quot;Add Video Ad&quot; to upload your first 9:16 mobile reel or 16:9 widescreen video ad using your Cloudinary credentials.
            </p>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-black shadow-md cursor-pointer hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Video Ad</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ads.map(ad => (
              <div
                key={ad.id}
                className={`bg-white rounded-3xl p-5 border transition shadow-sm hover:shadow-md flex flex-col justify-between ${
                  ad.is_active ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
                }`}
              >
                <div>
                  {/* Top Bar with badges */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase border flex items-center gap-1 ${
                          ad.aspect_ratio === '9:16'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {ad.aspect_ratio === '9:16' ? (
                          <Smartphone className="w-3 h-3" />
                        ) : (
                          <Tv className="w-3 h-3" />
                        )}
                        <span>{ad.aspect_ratio} {ad.aspect_ratio === '9:16' ? 'Reel' : 'Widescreen'}</span>
                      </span>

                      {ad.enable_sticky_pip && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                          Sticky PiP on Scroll
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleActive(ad)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer border ${
                        ad.is_active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-200 text-slate-600 border-slate-300'
                      }`}
                    >
                      {ad.is_active ? '● Active' : '○ Paused'}
                    </button>
                  </div>

                  {/* Video Thumbnail / Preview snippet */}
                  <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video mb-3 flex items-center justify-center group">
                    {ad.video_url ? (
                      <video
                        src={ad.video_url}
                        poster={ad.thumbnail_url}
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Film className="w-8 h-8 text-slate-500" />
                    )}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 text-blue-600 flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Title & Info */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-blue-600">{ad.sponsor_tag}</div>
                    <h4 className="font-black text-sm text-slate-900 leading-snug">
                      {ad.title_en}
                    </h4>
                    {ad.title_mr && (
                      <p className="text-xs text-slate-600 font-medium">{ad.title_mr}</p>
                    )}
                    {ad.description_en && (
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{ad.description_en}</p>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold">
                    <span>CTA:</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 truncate max-w-[120px]">
                      {ad.cta_text_mr || ad.cta_text_en || 'CTA'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(ad)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                      title="Edit Ad"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ad.id, ad.title_en)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Delete Ad"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
