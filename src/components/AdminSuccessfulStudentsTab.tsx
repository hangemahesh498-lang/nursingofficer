import React, { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { SuccessfulStudent, SystemSettings } from '../types';
import {
  Award,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Building2,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  User,
  Image as ImageIcon,
  Save,
  Loader2,
  GraduationCap,
  UploadCloud,
  Check,
  RefreshCw
} from 'lucide-react';

// Helper to compress any image file down to <= 300KB using Canvas
const compressImageTo300KB = (file: File): Promise<{ dataUrl: string; sizeKb: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let maxDim = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Iteratively compress until size is <= 300KB
        let quality = 0.85;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        let sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

        while (sizeKb > 300 && quality > 0.3) {
          quality -= 0.12;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
        }

        resolve({ dataUrl, sizeKb });
      };
      img.onerror = () => reject(new Error('Image failed to load'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
};

export const AdminSuccessfulStudentsTab: React.FC = () => {
  const [students, setStudents] = useState<SuccessfulStudent[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedSizeInfo, setCompressedSizeInfo] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<SuccessfulStudent | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    student_name: '',
    selected_post: '',
    posting_location: '',
    exam_batch: '',
    marks_or_rank: '',
    photo_url: '',
    testimonial_mr: '',
    is_active: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [list, sysSettings] = await Promise.all([
        api.getSuccessfulStudents(true),
        api.getSettings()
      ]);
      setStudents(list);
      setSettings(sysSettings);
    } catch (err) {
      console.error('Failed to load successful students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSectionVisible = async () => {
    if (!settings) return;
    try {
      const updatedValue = !settings.show_successful_students_section;
      const newSettings = await api.updateSettings({
        show_successful_students_section: updatedValue
      });
      setSettings(newSettings);
    } catch (err) {
      alert('Failed to update system setting');
    }
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setCompressedSizeInfo(null);
    setForm({
      student_name: '',
      selected_post: 'DHS Nursing Officer',
      posting_location: 'जिल्हा सामान्य रुग्णालय, मुंबई',
      exam_batch: 'DHS 2024',
      marks_or_rank: '182/200 (Rank 14)',
      photo_url: '',
      testimonial_mr: 'मराठी मॉक टेस्ट्स व स्पष्टीकरणामुळे माझी DHS परीक्षेत खात्रीशीर निवड झाली.',
      is_active: true
    });
    setShowFormModal(true);
  };

  const openEditModal = (student: SuccessfulStudent) => {
    setEditingStudent(student);
    setCompressedSizeInfo(null);
    setForm({
      student_name: student.student_name,
      selected_post: student.selected_post,
      posting_location: student.posting_location,
      exam_batch: student.exam_batch || '',
      marks_or_rank: student.marks_or_rank || '',
      photo_url: student.photo_url || '',
      testimonial_mr: student.testimonial_mr || '',
      is_active: student.is_active !== false
    });
    setShowFormModal(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('कृपया वैध फोटो निवडा (JPG, PNG किंवा WEBP)');
      return;
    }

    try {
      setIsCompressing(true);
      const originalSizeKb = Math.round(file.size / 1024);
      const { dataUrl, sizeKb } = await compressImageTo300KB(file);
      setForm(prev => ({ ...prev, photo_url: dataUrl }));
      setCompressedSizeInfo(`फोटो कॉम्प्रेस झाला: ${originalSizeKb} KB ➔ ${sizeKb} KB (कमाल मर्यादा <300 KB)`);
    } catch (err: any) {
      alert('फोटो प्रक्रिया करण्यात त्रुटी आली. कृपया दुसरा फोटो निवडा.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.student_name.trim() || !form.selected_post.trim()) {
      alert('कृपया नाव आणि पद प्रविष्ट करा.');
      return;
    }

    try {
      setIsSaving(true);
      if (editingStudent) {
        await api.updateSuccessfulStudent(editingStudent.id, form);
      } else {
        await api.addSuccessfulStudent(form);
      }
      setShowFormModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'फॉरमॅट सेव्ह करण्यास अडचण आली.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`तुम्हाला खात्री आहे की "${name}" यांची नोंद हटवायची आहे?`)) return;
    try {
      await api.deleteSuccessfulStudent(id);
      loadData();
    } catch (err: any) {
      alert('हटवणे अयशस्वी झाले');
    }
  };

  const handleToggleActive = async (student: SuccessfulStudent) => {
    try {
      const nextActive = !student.is_active;
      await api.toggleSuccessfulStudentActive(student.id, nextActive);
      setStudents(students.map(s => s.id === student.id ? { ...s, is_active: nextActive } : s));
    } catch (err) {
      alert('स्थिती अपडेट करणे अयशस्वी झाले');
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-500 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
        <span>यशस्वी विद्यार्थी डेटा लोड होत आहे...</span>
      </div>
    );
  }

  const isSectionVisible = settings?.show_successful_students_section !== false;

  return (
    <div className="space-y-6">
      {/* Top Banner Control */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-md border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Hall of Fame & Selection Wall Management</span>
          </div>
          <h2 className="text-xl font-black flex items-center gap-2">
            🏆 यशस्वी विद्यार्थी व्यवस्थापन (Successful Students / Hall of Fame)
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            होम स्क्रीनवर निवड झालेल्या नर्सिंग अधिकाऱ्यांचे फोटो, पद आणि गुण दाखवण्यासाठी किंवा लपवण्यासाठी व्यवस्था करा.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800 shrink-0">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-200">होम पेज सेक्शन:</div>
            <div className={`text-xs font-black ${isSectionVisible ? 'text-emerald-400' : 'text-slate-400'}`}>
              {isSectionVisible ? 'सक्रिय (VISIBLE)' : 'लपवलेले (HIDDEN)'}
            </div>
          </div>

          <button
            onClick={handleToggleSectionVisible}
            className={`p-2 rounded-xl flex items-center gap-2 font-black text-xs transition cursor-pointer ${
              isSectionVisible
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {isSectionVisible ? (
              <>
                <ToggleRight className="w-6 h-6" />
                <span>चालू आहे</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-6 h-6 text-slate-400" />
                <span>बंद आहे</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Action Header & Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-bold text-slate-900">
          एकूण यशस्वी विद्यार्थी नोंदी ({students.length})
        </h3>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>नवीन यशस्वी विद्यार्थी जोडा</span>
        </button>
      </div>

      {/* List of Cards */}
      {students.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Award className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-700">कोणतीही नोंद उपलब्ध नाही</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            नवीन निवड झालेल्या विद्यार्थ्यांची नावे, पद व फोटो जोडण्यासाठी वरील बटणावर क्लिक करा.
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            पहिली नोंद जोडा
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((st) => (
            <div
              key={st.id}
              className={`bg-white rounded-2xl border p-4 shadow-xs relative flex flex-col justify-between transition ${
                st.is_active ? 'border-slate-200' : 'border-slate-200 bg-slate-50 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={st.photo_url || 'https://images.unsplash.com/photo-1594824813571-28a77885097a?auto=format&fit=crop&q=80&w=300'}
                      alt={st.student_name}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-amber-400 shadow-2xs"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{st.student_name}</h4>
                      <div className="text-xs font-bold text-blue-700 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>{st.selected_post}</span>
                      </div>
                      {st.marks_or_rank && (
                        <div className="text-[11px] font-semibold text-amber-700">
                          {st.marks_or_rank}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleActive(st)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                      st.is_active
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-slate-200 text-slate-600 border-slate-300'
                    }`}
                  >
                    {st.is_active ? 'Visible' : 'Hidden'}
                  </button>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1 mb-3">
                  <div className="flex items-center gap-1 text-slate-600 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{st.posting_location}</span>
                  </div>
                  {st.exam_batch && (
                    <div className="text-[11px] text-slate-500">
                      बैच: {st.exam_batch}
                    </div>
                  )}
                </div>

                {st.testimonial_mr && (
                  <div className="text-[11px] text-slate-600 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100/80 mb-3">
                    "{st.testimonial_mr}"
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(st)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                  title="संपादित करा"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(st.id, st.student_name)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="हटवा"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>{editingStudent ? 'यशस्वी विद्यार्थी संपादित करा' : 'नवीन यशस्वी विद्यार्थी जोडा'}</span>
              </h3>
              <button
                onClick={() => setShowFormModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">विद्यार्थ्याचे नाव *</label>
                <input
                  type="text"
                  required
                  value={form.student_name}
                  onChange={e => setForm({ ...form, student_name: e.target.value })}
                  placeholder="उदा. सुप्रिया पाटील"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">निवड झालेले पद *</label>
                  <input
                    type="text"
                    required
                    value={form.selected_post}
                    onChange={e => setForm({ ...form, selected_post: e.target.value })}
                    placeholder="उदा. DHS Nursing Officer"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">गुण / रँक</label>
                  <input
                    type="text"
                    value={form.marks_or_rank}
                    onChange={e => setForm({ ...form, marks_or_rank: e.target.value })}
                    placeholder="उदा. 184/200 (Rank 14)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">पोस्टिंगचे ठिकाण / हॉस्पिटल *</label>
                <input
                  type="text"
                  required
                  value={form.posting_location}
                  onChange={e => setForm({ ...form, posting_location: e.target.value })}
                  placeholder="उदा. जिल्हा सामान्य रुग्णालय, पुणे"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">परीक्षेची बॅच</label>
                <input
                  type="text"
                  value={form.exam_batch}
                  onChange={e => setForm({ ...form, exam_batch: e.target.value })}
                  placeholder="उदा. DHS 2024 / DMER 2024"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              {/* DIRECT PHOTO UPLOAD & AUTOMATIC <300KB COMPRESSOR */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    <span>विद्यार्थ्याचा फोटो (Direct Upload / Auto Compress)</span>
                  </label>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Max 300 KB
                  </span>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {/* Upload Action Zone */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {form.photo_url ? (
                    <div className="relative group shrink-0">
                      <img
                        src={form.photo_url}
                        alt="Preview"
                        className="w-16 h-16 rounded-xl object-cover border-2 border-amber-400 shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center text-[10px] font-bold transition cursor-pointer"
                      >
                        बदला
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-16 h-16 rounded-xl bg-slate-200 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-300 hover:border-slate-400 transition shrink-0"
                    >
                      <UploadCloud className="w-5 h-5 text-slate-500" />
                      <span className="text-[9px] font-bold mt-0.5">निवडा</span>
                    </div>
                  )}

                  <div className="grow space-y-1 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isCompressing}
                      className="w-full sm:w-auto px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isCompressing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                          <span>कॉम्प्रेस होत आहे...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                          <span>गॅलरीतून फोटो निवडा</span>
                        </>
                      )}
                    </button>

                    {compressedSizeInfo && (
                      <p className="text-[10.5px] font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>{compressedSizeInfo}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Optional URL input fallback */}
                <div className="pt-1 border-t border-slate-200/80">
                  <input
                    type="url"
                    value={form.photo_url}
                    onChange={e => setForm({ ...form, photo_url: e.target.value })}
                    placeholder="किंवा थेट Cloudinary/Web इमेज लिंक टाका (https://...)"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-600 placeholder-slate-400 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">मराठीतील मनोगत / प्रतिक्रिया (Testimonial)</label>
                <textarea
                  rows={2}
                  value={form.testimonial_mr}
                  onChange={e => setForm({ ...form, testimonial_mr: e.target.value })}
                  placeholder="उदा. नर्सिंग ऑफिसर प्लॅटफॉर्मच्या मॉक टेस्ट्समुळे मला वेळेचे नियोजन शिकायला मिळाले."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is_active_check"
                  checked={form.is_active}
                  onChange={e => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="is_active_check" className="text-xs font-bold text-slate-800">
                  होम स्क्रीनवर प्रदर्शित करा (Active Visible)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{editingStudent ? 'अपडेट करा' : 'जोडा'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
