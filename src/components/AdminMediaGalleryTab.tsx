import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { UploadedMediaItem } from '../types';
import {
  Image as ImageIcon,
  Trash2,
  UploadCloud,
  Search,
  CheckCircle2,
  Filter,
  Loader2,
  Copy,
  ExternalLink,
  RefreshCw,
  Folder,
  CheckSquare,
  Square,
  Eye,
  X
} from 'lucide-react';

interface AdminMediaGalleryTabProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminMediaGalleryTab: React.FC<AdminMediaGalleryTabProps> = ({ showToast }) => {
  const { language } = useLanguage();
  const [mediaList, setMediaList] = useState<UploadedMediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Deletion modals
  const [deleteTarget, setDeleteTarget] = useState<UploadedMediaItem | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Image Preview Modal
  const [previewMedia, setPreviewMedia] = useState<UploadedMediaItem | null>(null);

  // Direct Upload State
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadFolder, setUploadFolder] = useState<string>('general');

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await api.getUploadedMedia();
      setMediaList(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load media list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const folders = Array.from(new Set((mediaList || []).filter(m => Boolean(m)).map(m => m.folder || 'general')));

  const filteredMedia = (mediaList || []).filter(m => Boolean(m && (m.public_id || m.id))).filter(m => {
    const matchesFolder = selectedFolder === 'all' || (m.folder || 'general') === selectedFolder;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      !searchQuery ||
      (m.public_id || '').toLowerCase().includes(query) ||
      (m.source_context && m.source_context.toLowerCase().includes(query)) ||
      (m.alt_text && m.alt_text.toLowerCase().includes(query)) ||
      (m.url || '').toLowerCase().includes(query);
    return matchesFolder && matchesQuery;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredMedia.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMedia.filter(m => Boolean(m)).map(m => m.public_id || m.id));
    }
  };

  const handleDeleteSingle = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await api.deleteCloudinaryImage(deleteTarget.public_id);
      showToast(
        language === 'mr' ? 'फोटो यशस्वीरित्या हटवला!' : 'Photo deleted successfully from Cloudinary!',
        'success'
      );
      setDeleteTarget(null);
      loadMedia();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete photo', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBulk = async () => {
    if (selectedIds.length === 0) return;
    setActionLoading(true);
    try {
      const res = await api.deleteUploadedMediaBulk(selectedIds);
      showToast(
        language === 'mr'
          ? `${res.deletedCount || selectedIds.length} फोटो यशस्वीरित्या हटवले!`
          : `Successfully deleted ${res.deletedCount || selectedIds.length} photos!`,
        'success'
      );
      setSelectedIds([]);
      setBulkDeleteConfirm(false);
      loadMedia();
    } catch (err: any) {
      showToast(err.message || 'Bulk delete failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast(
        language === 'mr' ? 'फाईल 10MB पेक्षा लहान असावी' : 'File must be under 10MB',
        'error'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setUploading(true);
      try {
        await api.uploadCloudinaryImage(base64, {
          folder: uploadFolder,
          alt_text: 'Admin Upload'
        });
        showToast(
          language === 'mr' ? 'नवीन फोटो अपलोड झाला!' : 'New photo uploaded successfully!',
          'success'
        );
        loadMedia();
      } catch (err: any) {
        showToast(err.message || 'Upload failed', 'error');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(language === 'mr' ? 'कॉपी झाले!' : 'URL copied to clipboard!', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-indigo-600" />
            <span>
              {language === 'mr'
                ? 'क्लाउडिनरी फोटो व्यवस्थापन (Cloudinary Media Control)'
                : 'Cloudinary Photos Admin Control'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'mr'
              ? 'ॲपमधील सर्व प्रश्न चित्रे, पेमेंट स्क्रीनशॉट, बॅनर व टॉपर विद्यार्थ्यांचे फोटो येथे एकाच ठिकाणी पहा आणि सिंगल/बल्क डिलीट करा.'
              : 'View, search, copy URLs, and perform single or bulk deletion for all Cloudinary media across questions, payments, and banners.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            <span>{uploading ? (language === 'mr' ? 'अपलोड होत आहे...' : 'Uploading...') : (language === 'mr' ? 'नवीन फोटो अपलोड करा' : 'Upload New Photo')}</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="hidden" />
          </label>

          <button
            onClick={loadMedia}
            disabled={loading}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
            title="Refresh Media Gallery"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter, Search & Bulk Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={language === 'mr' ? 'आयडी, फोल्डर किंवा नावाने फोटो शोधा...' : 'Search by ID, folder, or title...'}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Folder Select Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedFolder}
              onChange={e => setSelectedFolder(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">{language === 'mr' ? 'सर्व फोल्डर्स (All Folders)' : 'All Media Folders'}</option>
              {folders.map(f => (
                <option key={f} value={f}>📁 {f}</option>
              ))}
            </select>
          </div>

          {/* Bulk Select & Delete Controls */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 animate-in fade-in">
              <span className="text-xs font-bold text-rose-800">
                {selectedIds.length} {language === 'mr' ? 'निवडलेले' : 'Selected'}
              </span>
              <button
                onClick={() => setBulkDeleteConfirm(true)}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'mr' ? 'बल्क डिलीट करा' : 'Bulk Delete'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Multi-Select Select All bar */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 font-bold text-indigo-600 hover:underline cursor-pointer"
          >
            {selectedIds.length > 0 && selectedIds.length === filteredMedia.length ? (
              <CheckSquare className="w-4 h-4 text-indigo-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>{selectedIds.length === filteredMedia.length ? 'Deselect All' : `Select All (${filteredMedia.length})`}</span>
          </button>

          <span>
            {language === 'mr'
              ? `एकूण ${filteredMedia.length} फोटो सापडले`
              : `Total ${filteredMedia.length} photo assets found`}
          </span>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-600">Cloudinary मीडिया लोड होत आहे...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50 text-indigo-400" />
          <p className="text-sm font-bold text-slate-700">कोणतेही फोटो सापडले नाहीत (No Media Found)</p>
          <p className="text-xs text-slate-500 mt-1">नवीन फोटो अपलोड करा किंवा शोध बदलून पहा.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map(item => {
            const isSelected = selectedIds.includes(item.public_id || item.id);
            return (
              <div
                key={item.id}
                className={`group relative bg-white rounded-2xl border overflow-hidden shadow-2xs transition-all flex flex-col ${
                  isSelected ? 'ring-2 ring-indigo-600 border-indigo-500 bg-indigo-50/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Select Checkbox Overlay */}
                <button
                  type="button"
                  onClick={() => toggleSelect(item.public_id || item.id)}
                  className="absolute top-2 left-2 z-10 p-1 bg-white/90 rounded-lg shadow-sm border border-slate-200 cursor-pointer"
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* Folder Badge */}
                <span className="absolute top-2 right-2 z-10 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white rounded-md text-[9px] font-bold uppercase tracking-wider">
                  {item.folder || 'general'}
                </span>

                {/* Image Container */}
                <div
                  className="h-36 bg-slate-100 relative overflow-hidden cursor-pointer"
                  onClick={() => setPreviewMedia(item)}
                >
                  <img
                    src={item.url}
                    alt={item.source_context || 'Cloudinary Media'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setPreviewMedia(item);
                      }}
                      className="p-2 bg-white text-slate-800 rounded-full shadow-md hover:bg-slate-100 transition"
                      title="Preview Full Image"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2 text-xs">
                  <div>
                    <p className="font-bold text-slate-900 truncate text-[11px]" title={item.source_context}>
                      {item.source_context || 'Uploaded Photo'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono truncate" title={item.public_id}>
                      {item.public_id}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                    <button
                      onClick={() => copyToClipboard(item.url)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="Copy URL"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer ml-auto"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Single Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">
                {language === 'mr' ? 'हा फोटो क्लाउडिनरी वरून हटवायचा का?' : 'Delete Photo from Cloudinary?'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'mr'
                  ? 'हा फोटो कायमचा नष्ट होईल व ॲपमध्ये जिथे वापरला आहे तिथून काढला जाईल.'
                  : 'This image asset will be permanently erased from Cloudinary CDN.'}
              </p>
            </div>

            <div className="h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <img src={deleteTarget.url} alt="Target" className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={actionLoading}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                {language === 'mr' ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleDeleteSingle}
                disabled={actionLoading}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>{actionLoading ? 'हटवत आहे...' : (language === 'mr' ? 'कायमचे हटवा' : 'Yes, Delete')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirm Modal */}
      {bulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">
                {language === 'mr'
                  ? `निवडलेले ${selectedIds.length} फोटो हटवायचे का?`
                  : `Delete ${selectedIds.length} Selected Photos?`}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'mr'
                  ? 'सर्व निवडलेले फोटो क्लाउडिनरीवरून कायमचे हटवले जातील.'
                  : `All ${selectedIds.length} selected photos will be permanently deleted.`}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBulkDeleteConfirm(false)}
                disabled={actionLoading}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                {language === 'mr' ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleDeleteBulk}
                disabled={actionLoading}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>{actionLoading ? 'हटवत आहे...' : (language === 'mr' ? `होय, ${selectedIds.length} फोटो हटवा` : `Delete ${selectedIds.length} Items`)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center">
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 rounded-full transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewMedia.url}
              alt={previewMedia.source_context || 'Full Preview'}
              className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/20"
            />
            <div className="mt-3 text-center text-white space-y-1">
              <p className="text-sm font-bold">{previewMedia.source_context || 'Photo Details'}</p>
              <p className="text-xs text-white/70 font-mono">{previewMedia.url}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
