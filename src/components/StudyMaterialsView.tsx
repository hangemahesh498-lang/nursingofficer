import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { StudyMaterial, Subject } from '../types';
import {
  FileText,
  Download,
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  Sparkles,
  ExternalLink,
  Tag,
  Calendar,
  AlertCircle,
  Eye,
  ShieldAlert
} from 'lucide-react';

interface StudyMaterialsViewProps {
  onUpgradePro: () => void;
}

export const StudyMaterialsView: React.FC<StudyMaterialsViewProps> = ({ onUpgradePro }) => {
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [showReaderModal, setShowReaderModal] = useState<StudyMaterial | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [mats, subs] = await Promise.all([
          api.getStudyMaterials(),
          api.getSubjects()
        ]);
        setMaterials(mats);
        setSubjects(subs);
      } catch (err) {
        console.error('Failed to load study materials:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredMaterials = materials.filter(item => {
    const titleMatch = (language === 'mr' && item.title_mr ? item.title_mr : item.title)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const descMatch = (language === 'mr' && item.description_mr ? item.description_mr : item.description)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const queryMatch = titleMatch || descMatch || item.exam.toLowerCase().includes(searchQuery.toLowerCase());

    const subjectMatch = selectedSubject === 'all' || item.subject_id === selectedSubject;
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;

    return queryMatch && subjectMatch && categoryMatch;
  });

  const handleAction = (material: StudyMaterial) => {
    if (material.is_premium && !currentUser?.isPremium) {
      onUpgradePro();
      return;
    }

    if (isAdmin) {
      // Admin download permission
      setDownloadSuccess(language === 'mr' ? `ॲडमिन डाऊनलोड: "${material.title}" सुरक्षितपणे डाउनलोड झाले!` : `Admin Download: "${material.title}" downloaded!`);
      setTimeout(() => {
        setDownloadSuccess(null);
      }, 4000);
      if (material.file_url) {
        window.open(material.file_url, '_blank');
      }
    } else {
      // Students can only read/view online - downloads are strictly restricted
      setShowReaderModal(material);
    }
  };

  const getSubjectName = (subId?: string) => {
    if (!subId) return 'General Nursing';
    const sub = subjects.find(s => s.id === subId);
    if (!sub) return 'General Nursing';
    return language === 'mr' ? sub.name_mr : sub.name_en;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm mb-1">
              <FileText className="w-4 h-4" />
              <span>{language === 'mr' ? 'प्रमाणित अभ्यास साहित्य' : 'INC Certified Study Library'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {language === 'mr' ? 'अभ्यास नोट्स, सूत्रे व क्लिनिकल चार्ट्स' : 'Study Notes, Formulas & Clinical Protocols'}
            </h1>
            <p className="text-slate-600 text-sm mt-1 max-w-3xl">
              {language === 'mr'
                ? 'AIIMS NORCET, ESIC, RRB आणि राज्य भरतीसाठी उच्च प्राधान्य सूत्रे, पार्कलँड फॉर्म्युला, GCS स्केल, लसीकरण चार्ट आणि बायोमेडिकल वेस्ट नियम.'
                : 'High-yield PDF summaries, Parkland Burns formulas, Glasgow Coma Scale references, National Immunization Schedules, and drug calculation charts.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!currentUser?.isPremium && (
              <button
                onClick={onUpgradePro}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 text-white font-semibold text-sm hover:from-teal-800 hover:to-emerald-800 transition shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'mr' ? 'सर्व नोट्स अनलॉक करा (PRO)' : 'Unlock All Notes (PRO)'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={language === 'mr' ? 'नोट्स किंवा विषय शोधा...' : 'Search notes, charts, topics...'}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:bg-white"
            />
          </div>

          <div>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:bg-white"
            >
              <option value="all">{language === 'mr' ? 'सर्व विषय (All Subjects)' : 'All Subjects'}</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {language === 'mr' ? s.name_mr : s.name_en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:bg-white"
            >
              <option value="all">{language === 'mr' ? 'सर्व प्रकार (All Formats)' : 'All Categories'}</option>
              <option value="notes">{language === 'mr' ? 'अभ्यास नोट्स (High-Yield Notes)' : 'Study Notes'}</option>
              <option value="clinical_guide">{language === 'mr' ? 'क्लिनिकल चार्ट्स (Clinical Charts)' : 'Clinical Protocols'}</option>
              <option value="syllabus_pdf">{language === 'mr' ? 'अभ्यासक्रम (Syllabus PDF)' : 'Official Syllabus'}</option>
            </select>
          </div>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-medium">
              {language === 'mr'
                ? `"${downloadSuccess}" दस्तऐवज यशस्वीरित्या उघडला!`
                : `"${downloadSuccess}" document loaded successfully!`}
            </span>
          </div>
        </div>
      )}

      {/* Material Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-medium">
          {language === 'mr' ? 'अभ्यास साहित्य लोड होत आहे...' : 'Loading certified study library...'}
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-500">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-slate-700">
            {language === 'mr' ? 'कोणतेही साहित्य सापडले नाही' : 'No study materials found'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'mr' ? 'शोध शब्द बदला किंवा फिल्टर रीसेट करा' : 'Try adjusting your search query or filters'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredMaterials.map(mat => {
            const isLocked = mat.is_premium && !currentUser?.isPremium;
            return (
              <div
                key={mat.id}
                className={`bg-white border rounded-2xl p-6 transition flex flex-col justify-between ${
                  isLocked ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200 hover:border-teal-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                        {getSubjectName(mat.subject_id)}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {mat.exam}
                      </span>
                    </div>

                    {mat.is_premium ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-700" />
                        <span>PRO Only</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Free Access
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {language === 'mr' && mat.title_mr ? mat.title_mr : mat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {language === 'mr' && mat.description_mr ? mat.description_mr : mat.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      <span>{mat.source || 'INC Standard Protocol'}</span>
                    </div>
                    {mat.file_size_mb && (
                      <span className="font-mono text-slate-400">{mat.file_size_mb} MB PDF</span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3">
                  {isLocked ? (
                    <button
                      onClick={onUpgradePro}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{language === 'mr' ? 'प्रो प्लॅनमध्ये अनलॉक करा' : 'Upgrade to PRO to Access'}</span>
                    </button>
                  ) : isAdmin ? (
                    <button
                      onClick={() => handleAction(mat)}
                      className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Download className="w-4 h-4" />
                      <span>{language === 'mr' ? 'ॲडमिन: PDF डाऊनलोड' : 'Admin: Download PDF'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction(mat)}
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{language === 'mr' ? 'ऑनलाईन अभ्यास नोट्स वाचा' : 'Read Notes Online'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ONLINE READER MODAL FOR STUDENTS (NO DOWNLOAD ALLOWED) */}
      {showReaderModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full">
                  <BookOpen className="w-3 h-3" />
                  {showReaderModal.category}
                </span>
                <h3 className="text-base font-bold text-white">{showReaderModal.title}</h3>
              </div>
              <button
                onClick={() => setShowReaderModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body with Security Banner */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-900 font-medium">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  {language === 'mr'
                    ? 'सुरक्षा धोरण: पीडीएफ डाऊनलोड फक्त ॲडमिनसाठी राखीव आहे. विद्यार्थ्यांना हे साहित्य केवळ ऑनलाईन वाचनासाठी उपलब्ध आहे.'
                    : 'Security Policy: PDF downloads are restricted strictly to administrators. Content is available for secure online reading.'}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm">दस्तऐवज तपशील:</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {showReaderModal.description || 'या अभ्यास साहित्यामध्ये महाराष्ट्र शासन आरोग्य विभाग व नर्सिंग भरतीसाठी आवश्यक महत्त्वाचे पॉईंट्स आणि नोट्स समाविष्ट आहेत.'}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs text-slate-600">
                  <div>
                    <span className="font-bold text-slate-800">विषय: </span>
                    {getSubjectName(showReaderModal.subject_id)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">प्रकार: </span>
                    {showReaderModal.file_type.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="text-center py-4">
                <p className="text-xs text-slate-500 mb-3">
                  {language === 'mr'
                    ? 'तुम्ही या साहित्याचा ऑनलाईन सराव करू शकता.'
                    : 'You can study these reference notes directly inside the application.'}
                </p>
                <button
                  onClick={() => setShowReaderModal(null)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  {language === 'mr' ? 'समजले / बंद करा' : 'Close Reader'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
