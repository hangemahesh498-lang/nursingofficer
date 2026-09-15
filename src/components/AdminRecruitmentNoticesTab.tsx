import React, { useState, useRef } from 'react';
import { RecruitmentNotice } from '../types';
import { api } from '../lib/api';
import {
  Bell,
  Plus,
  Building2,
  Calendar,
  GraduationCap,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  UploadCloud,
  FileUp,
  Trash2,
  Edit3,
  Eye,
  Download,
  IndianRupee,
  Users,
  Palette,
  AlertCircle,
  RefreshCw,
  Megaphone,
  Check
} from 'lucide-react';

interface AdminRecruitmentNoticesProps {
  notices: RecruitmentNotice[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminRecruitmentNoticesTab: React.FC<AdminRecruitmentNoticesProps> = ({
  notices,
  onRefresh,
  showToast
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [inputMode, setInputMode] = useState<'pdf' | 'text' | 'manual'>('pdf');
  const [rawText, setRawText] = useState('');
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editing notice ID if editing an existing one
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<RecruitmentNotice, 'id'>>({
    organization: 'महाराष्ट्र शासन - आरोग्य सेवा संचालनालय (DMER / DHS)',
    organization_mr: 'महाराष्ट्र शासन - सार्वजनिक आरोग्य विभाग व वैद्यकीय शिक्षण (DMER / DHS)',
    post_name: 'Staff Nurse / Nursing Officer (Group B)',
    post_name_mr: 'अधिपरिचारिका / नर्सिंग ऑफिसर (गट-ब)',
    year: 2025,
    eligibility_summary: 'B.Sc Nursing / Post Basic B.Sc OR GNM Diploma with Maharashtra Nursing Council (MNC) Registration.',
    eligibility_summary_mr: 'बी.एस्सी. नर्सिंग / पोस्ट बेसिक बी.एस्सी. किंवा जी.एन.एम. डिप्लोमा + महाराष्ट्र नर्सिंग कौन्सिल (MNC) नोंदणी अनिवार्य.',
    age_limit: '18 ते 38 वर्षे (मागासवर्गीय उमेदवारांना 5 वर्षे सूट)',
    application_start_date: new Date().toISOString().split('T')[0],
    application_end_date: '2025-05-15',
    exam_pattern_summary: 'CBT Examination: 100 MCQs (80 Nursing Technical + 20 General). 90 Minutes.',
    exam_pattern_summary_mr: 'CBT संगणकीय परीक्षा: 100 बहुपर्यायी प्रश्न (80 नर्सिंग विषय + 20 सामान्य ज्ञान, मराठी, इंग्रजी व बुद्धिमत्ता).',
    official_website: 'https://arogya.maharashtra.gov.in',
    pdf_url: '',
    status: 'active',
    total_vacancies: 3974,
    salary_range: 'Level S-14 (₹38,600 - ₹1,22,800) + DA + HRA',
    salary_range_mr: 'पे मॅट्रिक्स लेव्हल S-14 (₹38,600 ते ₹1,22,800) + महागाई भत्ता व इतर भत्ते',
    banner_color: 'emerald',
    badge_text: '🔥 महाराष्ट्र महाभरती 2025',
    highlights: [
      'शासकीय सेवेतील कायमस्वरूपी गट-ब पद',
      'महाराष्ट्र नर्सिंग कौन्सिल (MNC) नोंदणीधारक पात्र',
      'राज्यभरातील शासकीय वैद्यकीय महाविद्यालये व रुग्णालयांत पदस्थापना'
    ],
    source_disclaimer: 'अधिकृत शासन निर्णय व जाहिरातीनुसार माहिती संकलित.'
  });

  const [newHighlightText, setNewHighlightText] = useState('');

  // Handle PDF/Text File upload to AI Formatter
  const handleFileUpload = async (file: File) => {
    setSelectedFile(file);
    setIsProcessingAi(true);
    try {
      showToast('AI PDF वाचून आकर्षक जाहिरात तयार करत आहे...', 'info');
      const res = await api.formatAdvertisementFile(file);
      if (res.success && res.advertisement) {
        applyAiGeneratedNotice(res.advertisement);
        showToast('PDF मधून आकर्षक जाहिरात यशस्वीरीत्या तयार झाली!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'PDF विश्लेषण अयशस्वी, कृपया मजकूर थेट पेस्ट करा', 'error');
    } finally {
      setIsProcessingAi(false);
    }
  };

  // Handle Raw Text AI Formatting
  const handleFormatRawText = async () => {
    if (!rawText.trim()) {
      showToast('कृपया जाहिरातीचा मजकूर किंवा परिपत्रक पेस्ट करा', 'error');
      return;
    }
    setIsProcessingAi(true);
    try {
      showToast('AI मजकुरातून आकर्षक जाहिरात तयार करत आहे...', 'info');
      const res = await api.formatAdvertisement(rawText);
      if (res.success && res.advertisement) {
        applyAiGeneratedNotice(res.advertisement);
        showToast('आकर्षक जाहिरात यशस्वीरीत्या तयार झाली!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'AI निर्मिती अयशस्वी, कृपया पुन्हा प्रयत्न करा', 'error');
    } finally {
      setIsProcessingAi(false);
    }
  };

  const applyAiGeneratedNotice = (ad: any) => {
    setFormData(prev => ({
      ...prev,
      organization: ad.organization || prev.organization,
      organization_mr: ad.organization_mr || prev.organization_mr,
      post_name: ad.post_name || prev.post_name,
      post_name_mr: ad.post_name_mr || prev.post_name_mr,
      year: ad.year || prev.year,
      eligibility_summary: ad.eligibility_summary || prev.eligibility_summary,
      eligibility_summary_mr: ad.eligibility_summary_mr || prev.eligibility_summary_mr,
      age_limit: ad.age_limit || prev.age_limit,
      application_start_date: ad.application_start_date || prev.application_start_date,
      application_end_date: ad.application_end_date || prev.application_end_date,
      exam_pattern_summary: ad.exam_pattern_summary || prev.exam_pattern_summary,
      exam_pattern_summary_mr: ad.exam_pattern_summary_mr || prev.exam_pattern_summary_mr,
      official_website: ad.official_website || prev.official_website,
      pdf_url: ad.pdf_url || prev.pdf_url,
      status: ad.status || prev.status,
      total_vacancies: ad.total_vacancies || prev.total_vacancies,
      salary_range: ad.salary_range || prev.salary_range,
      salary_range_mr: ad.salary_range_mr || prev.salary_range_mr,
      banner_color: ad.banner_color || 'emerald',
      badge_text: ad.badge_text || '🔥 नवीन अधिकृत भरती जाहिरात',
      highlights: Array.isArray(ad.highlights) && ad.highlights.length > 0 ? ad.highlights : prev.highlights,
      source_disclaimer: ad.source_disclaimer || prev.source_disclaimer
    }));
    setInputMode('manual'); // Show structured form for review
  };

  const handleAddHighlight = () => {
    if (!newHighlightText.trim()) return;
    setFormData(prev => ({
      ...prev,
      highlights: [...(prev.highlights || []), newHighlightText.trim()]
    }));
    setNewHighlightText('');
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: (prev.highlights || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.organization.trim() || !formData.post_name.trim()) {
      showToast('कृपया संस्था आणि पदाचे नाव भरा', 'error');
      return;
    }

    try {
      if (editingId) {
        await api.updateRecruitmentNotice(editingId, formData);
        showToast('जाहिरात यशस्वीरित्या अद्ययावत केली!', 'success');
      } else {
        await api.addRecruitmentNotice(formData);
        showToast('आकर्षक जाहिरात यशस्वीरित्या प्रकाशित केली!', 'success');
      }
      setShowAddForm(false);
      setEditingId(null);
      setSelectedFile(null);
      setRawText('');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'जाहिरात सेव्ह करता आली नाही', 'error');
    }
  };

  const handleDelete = async (id: string, postTitle: string) => {
    if (!window.confirm(`खरोखर "${postTitle}" ही जाहिरात हटवायची आहे का?`)) return;
    try {
      await api.deleteRecruitmentNotice(id);
      showToast('जाहिरात यशस्वीरित्या हटवली', 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'हटवण्यात अडचण आली', 'error');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('खरोखर सर्व जाहिराती काढून टाकायच्या आहेत का? यानंतर ॲपमध्ये "सध्या जाहिराती उपलब्ध नाहीत" हा संदेश दिसेल.')) return;
    try {
      await api.clearAllRecruitmentNotices();
      showToast('सर्व जाहिराती काढल्या. आता "सध्या जाहिराती उपलब्ध नाहीत" दिसेल.', 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'सर्व जाहिराती काढता आल्या नाहीत', 'error');
    }
  };

  const startEdit = (notice: RecruitmentNotice) => {
    setEditingId(notice.id);
    setFormData({
      organization: notice.organization,
      organization_mr: notice.organization_mr || notice.organization,
      post_name: notice.post_name,
      post_name_mr: notice.post_name_mr || notice.post_name,
      year: notice.year || 2025,
      eligibility_summary: notice.eligibility_summary,
      eligibility_summary_mr: notice.eligibility_summary_mr || notice.eligibility_summary,
      age_limit: notice.age_limit || '',
      application_start_date: notice.application_start_date || '',
      application_end_date: notice.application_end_date || '',
      exam_pattern_summary: notice.exam_pattern_summary || '',
      exam_pattern_summary_mr: notice.exam_pattern_summary_mr || '',
      official_website: notice.official_website || '',
      pdf_url: notice.pdf_url || '',
      status: notice.status,
      total_vacancies: notice.total_vacancies || 0,
      salary_range: notice.salary_range || '',
      salary_range_mr: notice.salary_range_mr || '',
      banner_color: notice.banner_color || 'emerald',
      badge_text: notice.badge_text || '',
      highlights: notice.highlights || [],
      source_disclaimer: notice.source_disclaimer || ''
    });
    setInputMode('manual');
    setShowAddForm(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & CONTROLS */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                <Megaphone className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                नोकरी व भरती जाहिराती व्यवस्थापन (Recruitment Ads CMS)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              येथे PDF परिपत्रक किंवा मजकूर टाकून एका क्लिकवर <strong>आकर्षक, रंगीबेरंगी जाहिरात (Attractive Advertisement)</strong> तयार करा.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setShowAddForm(!showAddForm);
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddForm ? 'फॉर्म बंद करा' : '+ आकर्षक जाहिरात बनवा'}</span>
            </button>

            {notices.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="px-3.5 py-2.5 rounded-xl border border-rose-300 hover:bg-rose-50 text-rose-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
                title="सर्व जाहिराती काढून 'सध्या जाहिराती उपलब्ध नाहीत' संदेश दाखवा"
              >
                <Trash2 className="w-4 h-4" />
                <span>सर्व जाहिराती काढा</span>
              </button>
            )}

            <button
              type="button"
              onClick={onRefresh}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Status Banner */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${notices.length > 0 ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            <span className="font-bold text-slate-800">
              सध्या सक्रिय जाहिराती: <strong className="text-blue-700">{notices.length}</strong>
            </span>
          </div>
          {notices.length === 0 ? (
            <span className="font-semibold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-md">
              विद्यार्थ्यांना <strong>'सध्या जाहिराती उपलब्ध नाहीत'</strong> दिसत आहे ✅
            </span>
          ) : (
            <span className="font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-md">
              विद्यार्थ्यांना आकर्षक जाहिराती दिसत आहेत
            </span>
          )}
        </div>
      </div>

      {/* 2. ATTRACTIVE AD CREATION STUDIO (MODAL / INLINE FORM) */}
      {showAddForm && (
        <div className="bg-white p-5 sm:p-7 rounded-3xl border-2 border-blue-400 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="font-black text-slate-900 text-base">
                {editingId ? 'जाहिरात संपादन करा (Edit Advertisement)' : 'AI आकर्षक जाहिरात क्रिएटर (Attractive Ad Studio)'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2 py-1 rounded"
            >
              ✕ बंद करा
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          {!editingId && (
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setInputMode('pdf')}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
                  inputMode === 'pdf' ? 'bg-white text-blue-700 shadow-2xs font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileUp className="w-4 h-4" />
                <span>१. PDF परिपत्रक टाका</span>
              </button>
              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
                  inputMode === 'text' ? 'bg-white text-blue-700 shadow-2xs font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>२. मजकूर (Text) पेस्ट करा</span>
              </button>
              <button
                type="button"
                onClick={() => setInputMode('manual')}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
                  inputMode === 'manual' ? 'bg-white text-blue-700 shadow-2xs font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>३. थेट संपादन (Manual)</span>
              </button>
            </div>
          )}

          {/* Option 1: PDF Upload Mode */}
          {inputMode === 'pdf' && !editingId && (
            <div className="p-6 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/50 text-center space-y-3">
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.txt"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-sm">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm">
                  अधिकृत भरती परिपत्रक किंवा GR (PDF फाईल) येथे निवडा
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  AI संपूर्ण PDF मधील पदांची संख्या, शैक्षणिक पात्रता, वेतनश्रेणी आणि शेवटची तारीख काढून आकर्षक जाहिरात तयार करेल.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={isProcessingAi}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs inline-flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                >
                  <FileUp className="w-4 h-4" />
                  <span>{isProcessingAi ? 'PDF वाचून आकर्षक जाहिरात बनवत आहे...' : '📄 PDF फाईल निवडा (Select PDF)'}</span>
                </button>
              </div>

              {selectedFile && (
                <div className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 p-2 rounded-lg inline-block">
                  निवडलेली फाईल: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>
          )}

          {/* Option 2: Raw Text Mode */}
          {inputMode === 'text' && !editingId && (
            <div className="space-y-3 p-5 rounded-2xl border border-slate-200 bg-slate-50">
              <label className="block text-xs font-black text-slate-800">
                जाहिरातीचा कच्चा मजकूर, व्हॉट्सॲप मेसेज किंवा GR मजकूर पेस्ट करा:
              </label>
              <textarea
                rows={5}
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder="उदा. महाराष्ट्र शासन आरोग्य सेवा आयुक्तालय भरती २०२५. एकूण ३९७४ पदे. स्टाफ नर्स पदासाठी जीएनएम / बीएससी नर्सिंग पात्र. शेवटची तारीख १५ मे. वेतनश्रेणी एस-१४..."
                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs leading-relaxed focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
              <button
                type="button"
                disabled={isProcessingAi || !rawText.trim()}
                onClick={handleFormatRawText}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs inline-flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isProcessingAi ? 'AI जाहिरात डिझाइन करत आहे...' : '✨ AI द्वारे आकर्षक जाहिरात तयार करा'}</span>
              </button>
            </div>
          )}

          {/* Option 3 / Detailed Customization Form */}
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-indigo-600" />
                <span>जाहिरात तपशील व आकर्षक डिझाइन (Customization)</span>
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">
                खालील माहिती बदलून थेट सेव्ह करू शकता
              </span>
            </div>

            {/* Banner Theme Color & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  आकर्षक बॅनर रंग (Banner Theme Color)
                </label>
                <div className="flex items-center gap-2">
                  {(['emerald', 'blue', 'purple', 'amber', 'rose'] as const).map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, banner_color: color })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black capitalize flex items-center gap-1.5 border transition cursor-pointer ${
                        formData.banner_color === color
                          ? 'ring-2 ring-blue-600 font-black border-transparent shadow-xs'
                          : 'border-slate-300 opacity-70 hover:opacity-100'
                      } ${
                        color === 'emerald'
                          ? 'bg-emerald-600 text-white'
                          : color === 'blue'
                          ? 'bg-blue-600 text-white'
                          : color === 'purple'
                          ? 'bg-purple-600 text-white'
                          : color === 'amber'
                          ? 'bg-amber-500 text-white'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {formData.banner_color === color && <Check className="w-3 h-3" />}
                      <span>{color}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  हायलाईट बॅज (Badge Text)
                </label>
                <input
                  type="text"
                  value={formData.badge_text}
                  onChange={e => setFormData({ ...formData, badge_text: e.target.value })}
                  placeholder="उदा. 🔥 महाराष्ट्र महाभरती 2025"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            {/* Post & Org Titles in Marathi & English */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">पदाचे नाव (मराठीत) *</label>
                <input
                  type="text"
                  required
                  value={formData.post_name_mr || ''}
                  onChange={e => setFormData({ ...formData, post_name_mr: e.target.value })}
                  placeholder="उदा. अधिपरिचारिका / नर्सिंग ऑफिसर (गट-ब)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Post Name (English) *</label>
                <input
                  type="text"
                  required
                  value={formData.post_name}
                  onChange={e => setFormData({ ...formData, post_name: e.target.value })}
                  placeholder="e.g. Nursing Officer (Group B)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">भरती मंडळ / विभाग (मराठीत) *</label>
                <input
                  type="text"
                  required
                  value={formData.organization_mr || ''}
                  onChange={e => setFormData({ ...formData, organization_mr: e.target.value })}
                  placeholder="उदा. महाराष्ट्र शासन - सार्वजनिक आरोग्य विभाग (DHS)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Organization / Board (English) *</label>
                <input
                  type="text"
                  required
                  value={formData.organization}
                  onChange={e => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="e.g. Maharashtra Public Health Department (DHS)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Vacancies, Salary, Status, Year */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">एकूण पदे (Vacancies)</label>
                <input
                  type="number"
                  value={formData.total_vacancies || ''}
                  onChange={e => setFormData({ ...formData, total_vacancies: parseInt(e.target.value) || 0 })}
                  placeholder="उदा. 3974"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">वेतनश्रेणी (Salary Range)</label>
                <input
                  type="text"
                  value={formData.salary_range_mr || formData.salary_range || ''}
                  onChange={e => setFormData({ ...formData, salary_range_mr: e.target.value, salary_range: e.target.value })}
                  placeholder="उदा. लेव्हल S-14 (₹38,600 ते ₹1,22,800)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">स्थिती (Status)</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  <option value="active">Active (अर्ज सुरू आहेत)</option>
                  <option value="upcoming">Upcoming (लवकरच येत आहे)</option>
                  <option value="closed">Closed (मुदत संपली)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">भरती वर्ष (Year)</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) || 2025 })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Dates & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">अर्ज सुरुवात तारीख</label>
                <input
                  type="text"
                  value={formData.application_start_date || ''}
                  onChange={e => setFormData({ ...formData, application_start_date: e.target.value })}
                  placeholder="YYYY-MM-DD"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">अर्ज करण्याची अंतिम मुदत (Last Date)</label>
                <input
                  type="text"
                  value={formData.application_end_date || ''}
                  onChange={e => setFormData({ ...formData, application_end_date: e.target.value })}
                  placeholder="YYYY-MM-DD"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-rose-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">वयोमर्यादा (Age Limit)</label>
                <input
                  type="text"
                  value={formData.age_limit || ''}
                  onChange={e => setFormData({ ...formData, age_limit: e.target.value })}
                  placeholder="उदा. 18 ते 38 वर्षे (मागासवर्गीय: 43 वर्षे)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Eligibility & Exam Pattern in Marathi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">शैक्षणिक पात्रता (Eligibility Summary)</label>
                <textarea
                  rows={2}
                  value={formData.eligibility_summary_mr || formData.eligibility_summary}
                  onChange={e => setFormData({ ...formData, eligibility_summary_mr: e.target.value, eligibility_summary: e.target.value })}
                  placeholder="उदा. बी.एस्सी. नर्सिंग किंवा जी.एन.एम. + MNC नोंदणी आवश्यक."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">परीक्षेचे स्वरूप (Exam Pattern)</label>
                <textarea
                  rows={2}
                  value={formData.exam_pattern_summary_mr || formData.exam_pattern_summary}
                  onChange={e => setFormData({ ...formData, exam_pattern_summary_mr: e.target.value, exam_pattern_summary: e.target.value })}
                  placeholder="उदा. CBT परीक्षा: 100 प्रश्न (80 तांत्रिक नर्सिंग + 20 अतांत्रिक), 90 मिनिटे."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">अधिकृत वेबसाईट लिंक (Official Portal URL)</label>
                <input
                  type="url"
                  value={formData.official_website || ''}
                  onChange={e => setFormData({ ...formData, official_website: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">PDF जाहिरात डाऊनलोड लिंक (Direct PDF URL)</label>
                <input
                  type="url"
                  value={formData.pdf_url || ''}
                  onChange={e => setFormData({ ...formData, pdf_url: e.target.value })}
                  placeholder="https://.../notification.pdf"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Highlights List Management */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
              <label className="block text-xs font-black text-amber-950">
                जाहिरातीचे प्रमुख ठळक मुद्दे (Bullet Highlights):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newHighlightText}
                  onChange={e => setNewHighlightText(e.target.value)}
                  placeholder="उदा. शासकीय सेवेतील कायमस्वरूपी गट-ब पद"
                  className="grow p-2 bg-white border border-amber-300 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer"
                >
                  + जोडा
                </button>
              </div>

              {formData.highlights && formData.highlights.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  {formData.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-semibold bg-white p-2 rounded-lg border border-amber-200">
                      <span>• {h}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(idx)}
                        className="text-rose-600 hover:text-rose-800 font-bold px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* LIVE PREVIEW OF ATTRACTIVE CARD */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 mb-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span>थेट आकर्षक जाहिरात पूर्वावलोकन (Live Preview for Students):</span>
              </div>
              <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-md">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500 text-white">
                    ● {formData.status.toUpperCase()}
                  </span>
                  {formData.badge_text && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-amber-950">
                      {formData.badge_text}
                    </span>
                  )}
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20">
                    {formData.year} Session
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">
                  {formData.post_name_mr || formData.post_name}
                </h3>
                <p className="text-xs font-bold text-amber-300 mt-0.5">
                  🏢 {formData.organization_mr || formData.organization}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-white/20 text-center">
                  <div className="bg-white/10 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-300">एकूण पदे</div>
                    <div className="font-black text-amber-400 text-sm">{formData.total_vacancies} पदे</div>
                  </div>
                  <div className="bg-white/10 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-300">वेतनश्रेणी</div>
                    <div className="font-bold text-white text-xs truncate">{formData.salary_range_mr || formData.salary_range}</div>
                  </div>
                  <div className="bg-white/10 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-300">शेवटची तारीख</div>
                    <div className="font-black text-rose-300 text-xs">{formData.application_end_date}</div>
                  </div>
                  <div className="bg-white/10 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-300">वयोमर्यादा</div>
                    <div className="font-bold text-white text-xs truncate">{formData.age_limit}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                रद्द करा (Cancel)
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm cursor-pointer active:scale-95 transition"
              >
                {editingId ? '💾 जाहिरात अपडेट करा' : '🚀 ही आकर्षक जाहिरात प्रकाशित करा (Publish)'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. CURRENT PUBLISHED NOTICES LIST */}
      <div className="space-y-4">
        <h3 className="font-black text-slate-900 text-sm flex items-center justify-between">
          <span>सध्या प्रसिद्ध असलेल्या जाहिराती ({notices.length}):</span>
          {notices.length === 0 && (
            <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              विद्यार्थ्यांना 'सध्या जाहिराती उपलब्ध नाहीत' हा संदेश दिसत आहे
            </span>
          )}
        </h3>

        {notices.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
            <Megaphone className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">सध्या कोणतीही जाहिरात अपलोड केलेली नाही</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              विद्यार्थ्यांच्या ॲपमधील जाहिराती टॅबवर सध्या <strong>"सध्या जाहिराती उपलब्ध नाहीत"</strong> असा संदेश दिसत आहे. नवीन जाहिरात टाकण्यासाठी वरील <strong>'+ आकर्षक जाहिरात बनवा'</strong> बटणावर क्लिक करा.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {(notices || []).filter(notice => Boolean(notice && notice.id)).map(notice => (
              <div
                key={notice.id}
                className="bg-white p-5 rounded-2xl border-2 border-slate-200 hover:border-blue-400 transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 grow min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase">
                      {notice.status}
                    </span>
                    {notice.badge_text && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-amber-950">
                        {notice.badge_text}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 font-bold">
                      {notice.year} भरती
                    </span>
                  </div>

                  <h4 className="text-base font-black text-slate-900">
                    {notice.post_name_mr || notice.post_name}
                  </h4>
                  <p className="text-xs font-bold text-blue-700">
                    {notice.organization_mr || notice.organization}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                    {notice.total_vacancies && (
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        👥 {notice.total_vacancies.toLocaleString()} पदे
                      </span>
                    )}
                    {notice.application_end_date && (
                      <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                        📅 शेवटची तारीख: {notice.application_end_date}
                      </span>
                    )}
                    {notice.salary_range_mr && (
                      <span className="text-slate-700 truncate max-w-xs">
                        💰 {notice.salary_range_mr}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    type="button"
                    onClick={() => startEdit(notice)}
                    className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 transition"
                    title="संपादन करा (Edit)"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(notice.id, notice.post_name_mr || notice.post_name)}
                    className="p-2 rounded-xl border border-rose-300 hover:bg-rose-50 text-rose-700 transition"
                    title="हटवा (Delete)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
