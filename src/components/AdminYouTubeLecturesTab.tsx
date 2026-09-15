import React, { useState, useEffect } from 'react';
import { Tv, Plus, Trash2, Edit2, Play, ExternalLink, CheckCircle2, XCircle, Save, Loader2, Sparkles, ToggleLeft, ToggleRight, Lock, Unlock, Eye, EyeOff, IndianRupee, Shield } from 'lucide-react';
import { YouTubeLecture, SystemSettings } from '../types';
import { api } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export const AdminYouTubeLecturesTab: React.FC = () => {
  const { language } = useLanguage();
  const [lectures, setLectures] = useState<YouTubeLecture[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<YouTubeLecture | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<YouTubeLecture>>({
    title_mr: '',
    title_en: '',
    video_url: '',
    subject_name: 'Pharmacology & Dosage',
    instructor_name: 'MH Sir',
    duration_label: '45 Min',
    description_mr: '',
    description_en: '',
    is_active: true,
    is_paid: false,
    price: 49,
    is_hidden: false
  });
  const [savingItem, setSavingItem] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [list, sysSettings] = await Promise.all([
        api.getYouTubeLectures(false),
        api.getSettings()
      ]);
      setLectures(list);
      setSettings(sysSettings);
    } catch (err) {
      console.error('Failed to load YouTube lectures:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleSection = async () => {
    if (!settings) return;
    setSavingSettings(true);
    const updatedVal = !settings.show_youtube_lectures_section;
    try {
      const newSettings = await api.updateSettings({
        show_youtube_lectures_section: updatedVal
      });
      setSettings(newSettings);
    } catch (err) {
      alert('सेटिंग अपडेट करण्यात अडचण आली / Failed to update setting');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      title_mr: '',
      title_en: '',
      video_url: '',
      subject_name: 'Pharmacology & Dosage',
      instructor_name: 'MH Sir',
      duration_label: '45 Min',
      description_mr: '',
      description_en: '',
      is_active: true,
      is_paid: false,
      price: 49,
      is_hidden: false
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (lec: YouTubeLecture) => {
    setEditingItem(lec);
    setFormData({
      title_mr: lec.title_mr || '',
      title_en: lec.title_en || '',
      video_url: lec.video_url || '',
      subject_name: lec.subject_name || '',
      instructor_name: lec.instructor_name || '',
      duration_label: lec.duration_label || '',
      description_mr: lec.description_mr || '',
      description_en: lec.description_en || '',
      is_active: lec.is_active,
      is_paid: lec.is_paid ?? false,
      price: lec.price ?? 49,
      is_hidden: lec.is_hidden ?? false
    });
    setShowModal(true);
  };

  const handleToggleLectureActive = async (id: string, currentActive: boolean) => {
    try {
      const updated = await api.toggleYouTubeLectureActive(id, !currentActive);
      setLectures(prev => prev.map(l => l.id === id ? updated : l));
    } catch (err) {
      alert('स्टेटस बदलताना त्रुटी आली / Error toggling lecture status');
    }
  };

  const handleToggleLecturePaid = async (lec: YouTubeLecture) => {
    const newPaid = !lec.is_paid;
    try {
      const updated = await api.updateYouTubeLecture(lec.id, {
        is_paid: newPaid,
        price: lec.price || 49
      });
      setLectures(prev => prev.map(l => l.id === lec.id ? updated : l));
    } catch (err) {
      alert('पेड स्टेटस बदलताना अडचण आली / Error changing paid status');
    }
  };

  const handleToggleLectureHidden = async (lec: YouTubeLecture) => {
    const newHidden = !lec.is_hidden;
    try {
      const updated = await api.toggleYouTubeLectureHidden(lec.id, newHidden);
      setLectures(prev => prev.map(l => l.id === lec.id ? updated : l));
    } catch (err) {
      alert('व्हिडिओ लपवताना अडचण आली / Error toggling video visibility');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('तुम्हाला हे यूट्यूब व्याख्यान काढून टाकायचे आहे का? / Are you sure you want to delete this lecture?')) return;
    try {
      await api.deleteYouTubeLecture(id);
      setLectures(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      alert('व्याख्यान काढताना त्रुटी आली / Failed to delete lecture');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.video_url || !formData.title_mr) {
      alert('कृपया यूट्यूब व्हिडिओ लिंक आणि मराठी शीर्षक प्रविष्ट करा. / Please enter Video URL and Marathi Title.');
      return;
    }

    setSavingItem(true);
    try {
      if (editingItem) {
        const updated = await api.updateYouTubeLecture(editingItem.id, formData);
        setLectures(prev => prev.map(l => l.id === editingItem.id ? updated : l));
      } else {
        const created = await api.addYouTubeLecture(formData);
        setLectures(prev => [created, ...prev]);
      }
      setShowModal(false);
    } catch (err) {
      alert('माहिती जतन करताना त्रुटी आली / Failed to save video lecture');
    } finally {
      setSavingItem(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-red-600" />
        <p className="text-sm font-semibold">यूट्यूब व्हिडिओ लेक्चर्स लोड होत आहेत...</p>
      </div>
    );
  }

  const isSectionEnabled = settings?.show_youtube_lectures_section !== false;

  return (
    <div className="space-y-6">
      {/* Top Banner & Main Section Toggle */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-red-900/40">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                यूट्यूब व्याख्यान नियंत्रण कक्ष (YouTube Video CMS)
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
              होमपेजवर सर्वात खाली दिसणारे व्हिडिओ लेक्चर्स येथून सुरू/बंद करा, नवीन यूट्यूब व्हिडिओ लिंक जोडा किंवा संपादित करा.
            </p>
          </div>
        </div>

        {/* Master Section Toggle */}
        <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700 shrink-0">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-200">
              {isSectionEnabled ? 'होमपेजवर विभाग सुरू आहे' : 'विभाग बंद आहे (Hidden)'}
            </div>
            <div className="text-[10px] text-slate-400">
              {isSectionEnabled ? 'विद्यार्थ्यांना लेक्चर्स दिसत आहेत' : 'विद्यार्थ्यांना विभाग दिसणार नाही'}
            </div>
          </div>
          <button
            onClick={handleToggleSection}
            disabled={savingSettings}
            className={`p-1.5 rounded-xl transition cursor-pointer flex items-center justify-center ${
              isSectionEnabled
                ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-900/40'
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >
            {savingSettings ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : isSectionEnabled ? (
              <ToggleRight className="w-8 h-8" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            एकूण व्हिडिओ व्याख्याने ({lectures.length})
          </h3>
          <p className="text-xs text-slate-500">
            खालील यादीतील लिंक ऑन/ऑफ (Toggle) करून दाखवणे किंवा लपवणे नियंत्रित करा.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-red-900/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>नवीन व्हिडिओ लिंक जोडा</span>
        </button>
      </div>

      {/* Lectures List */}
      {lectures.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-200 text-slate-500">
          <Tv className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-bold text-slate-700 text-sm">अद्याप कोणतेही व्हिडिओ लेक्चर्स जोडलेले नाहीत.</p>
          <p className="text-xs text-slate-400 mt-1">वर दिलेल्या 'नवीन व्हिडिओ लिंक जोडा' बटणावर क्लिक करून यूट्यूब व्हिडिओ जोडा.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lectures.map(lec => {
            const ytId = lec.youtube_video_id || 'dQw4w9WgXcQ';
            const thumb = lec.thumbnail_url || `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;

            return (
              <div
                key={lec.id}
                className={`bg-white rounded-2xl border p-4 shadow-2xs transition flex flex-col justify-between ${
                  lec.is_active ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    {/* Thumbnail */}
                    <div className="relative w-28 aspect-video rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-200 shadow-xs">
                      <img src={thumb} alt={lec.title_mr} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="w-5 h-5 text-white fill-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          lec.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {lec.is_active ? 'सुरू' : 'बंद'}
                        </span>
                        {lec.is_paid ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5 text-purple-700" />
                            <span>पेड (₹{lec.price || 49})</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <Unlock className="w-2.5 h-2.5 text-emerald-700" />
                            <span>मोफत</span>
                          </span>
                        )}
                        {lec.is_hidden && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                            <EyeOff className="w-2.5 h-2.5 text-rose-700" />
                            <span>लपवले</span>
                          </span>
                        )}
                        {lec.subject_name && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 truncate max-w-[120px]">
                            {lec.subject_name}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate">{lec.title_mr}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{lec.title_en}</p>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                        <span>मार्गदर्शक: {lec.instructor_name || 'MH Sir'}</span>
                        <span>•</span>
                        <span>वेळ: {lec.duration_label || '30 Min'}</span>
                      </div>
                    </div>
                  </div>

                  {/* URL */}
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80 text-[11px] text-slate-600 truncate mb-3 flex items-center justify-between gap-2">
                    <span className="truncate font-mono text-[10.5px] text-slate-500">{lec.video_url}</span>
                    <a
                      href={lec.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-700 flex items-center gap-1 font-bold shrink-0"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>उघडा</span>
                    </a>
                  </div>
                </div>

                {/* Bottom Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    {/* Quick Paid/Free Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleLecturePaid(lec)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        lec.is_paid
                          ? 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      }`}
                      title={lec.is_paid ? 'क्लिक करून मोफत (FREE) करा' : 'क्लिक करून पेड (PAID) करा'}
                    >
                      {lec.is_paid ? <Lock className="w-3.5 h-3.5 text-purple-600" /> : <Unlock className="w-3.5 h-3.5 text-emerald-600" />}
                      <span>{lec.is_paid ? `PAID (₹${lec.price || 49})` : 'FREE'}</span>
                    </button>

                    {/* Quick Hide/Show Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleLectureHidden(lec)}
                      className={`px-2 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        lec.is_hidden
                          ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                      title={lec.is_hidden ? 'विद्यार्थ्यांना दाखवा (Unhide)' : 'विद्यार्थ्यांपासून लपवा (Hide)'}
                    >
                      {lec.is_hidden ? <EyeOff className="w-3.5 h-3.5 text-rose-600" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{lec.is_hidden ? 'लपवले' : 'सुरू'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(lec)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                      title="संपादित करा"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(lec.id)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                      title="काढून टाका"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Tv className="w-5 h-5 text-red-600" />
                <span>{editingItem ? 'यूट्यूब व्याख्यान संपादित करा' : 'नवीन यूट्यूब व्याख्यान जोडा'}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  यूट्यूब व्हिडिओ लिंक (YouTube URL) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/..."
                  value={formData.video_url}
                  onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    शीर्षक (मराठी) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. पार्कलँड बर्न सूत्र व सराव"
                    value={formData.title_mr}
                    onChange={e => setFormData({ ...formData, title_mr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    शीर्षक (English)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Parkland Burn Formula Masterclass"
                    value={formData.title_en}
                    onChange={e => setFormData({ ...formData, title_en: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    विषय (Subject Name)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pharmacology"
                    value={formData.subject_name}
                    onChange={e => setFormData({ ...formData, subject_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    मार्गदर्शक (Instructor)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MH Sir"
                    value={formData.instructor_name}
                    onChange={e => setFormData({ ...formData, instructor_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    कालावधी (Duration)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 45 Min"
                    value={formData.duration_label}
                    onChange={e => setFormData({ ...formData, duration_label: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  थोडक्यात वर्णन (Marathi Short Summary)
                </label>
                <textarea
                  rows={2}
                  placeholder="व्हिडिओमधील महत्त्वाचे मुद्दे स्पष्ट करा..."
                  value={formData.description_mr}
                  onChange={e => setFormData({ ...formData, description_mr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {/* Paid / Free Configuration */}
              <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-extrabold text-purple-950 text-xs flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-purple-700" />
                      <span>फक्त पेड मेंबरसाठी ठेवा (Paid Lecture Only):</span>
                    </label>
                    <p className="text-[11px] text-purple-700">
                      चालू केल्यास केवळ सशुल्क विद्यार्थी किंवा खरेदी केलेले विद्यार्थीच व्हिडिओ पाहू शकतील.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.is_paid ?? false}
                    onChange={e => setFormData({ ...formData, is_paid: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </div>

                {formData.is_paid && (
                  <div className="pt-2 border-t border-purple-200/80 flex items-center gap-3">
                    <label className="text-xs font-bold text-purple-900 shrink-0">
                      किंमत (Price in ₹):
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="49"
                      value={formData.price ?? 49}
                      onChange={e => setFormData({ ...formData, price: Number(e.target.value) || 0 })}
                      className="w-28 px-3 py-1.5 rounded-xl border border-purple-300 text-xs font-bold bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                    <span className="text-[11px] text-purple-600">
                      (प्रो किंवा टेस्ट सिरीज पास असणाऱ्यांना मोफत अनलॉक)
                    </span>
                  </div>
                )}
              </div>

              {/* Visibility and Active Toggles */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="lecture-hidden-check"
                    checked={formData.is_hidden ?? false}
                    onChange={e => setFormData({ ...formData, is_hidden: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <label htmlFor="lecture-hidden-check" className="text-xs font-bold text-slate-800 cursor-pointer">
                    विद्यार्थ्यांपासून व्हिडिओ लपवा (Hide Video from Student Dashboard)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="lecture-active-check"
                    checked={formData.is_active}
                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="lecture-active-check" className="text-xs font-bold text-slate-800 cursor-pointer">
                    लिंक सुरू ठेवा (Active)
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={savingItem}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-900/20"
                >
                  {savingItem ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{editingItem ? 'बदल जतन करा' : 'नवीन लिंक जोडा'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
