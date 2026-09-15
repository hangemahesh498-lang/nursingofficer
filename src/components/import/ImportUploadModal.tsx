import React, { useState, useRef } from 'react';
import { Subject, AdminAiImportSettings } from '../../types';
import { api } from '../../lib/api';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  FileCode,
  Image as ImageIcon,
  Archive,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  FileCheck,
  ChevronRight,
  Info
} from 'lucide-react';

interface ImportUploadModalProps {
  initialFormat?: 'json' | 'excel' | 'csv' | 'pdf' | 'images' | 'zip' | 'paste' | null;
  subjects: Subject[];
  settings: AdminAiImportSettings;
  onClose: () => void;
  onSuccess: (batches: any[], message: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ImportUploadModal: React.FC<ImportUploadModalProps> = ({
  initialFormat = null,
  subjects,
  settings,
  onClose,
  onSuccess,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<'file' | 'paste'>(initialFormat === 'paste' ? 'paste' : 'file');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [targetSubjectId, setTargetSubjectId] = useState<string>('');
  const [examName, setExamName] = useState<string>('AIIMS NORCET / State Nursing Officer Exam');
  const [rawText, setRawText] = useState<string>('');
  const [pasteFormat, setPasteFormat] = useState<'text' | 'json'>('text');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (filesList: FileList | null) => {
    if (!filesList) return;
    const arr = Array.from(filesList);
    setSelectedFiles(prev => [...prev, ...arr]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'file') {
      if (selectedFiles.length === 0) {
        showToast('Please select or drop at least one file to import', 'error');
        return;
      }

      setIsProcessing(true);
      setProcessingStatus('Uploading and parsing document contents...');

      try {
        const formData = new FormData();
        selectedFiles.forEach(f => formData.append('files', f));
        if (targetSubjectId) formData.append('targetSubjectId', targetSubjectId);
        if (examName) formData.append('examName', examName);

        setProcessingStatus('Performing AI OCR, duplicate scanning & medical verification...');
        const res = await api.uploadImportFiles(formData);

        if (res.success) {
          onSuccess(res.batches, res.message);
          onClose();
        }
      } catch (err: any) {
        showToast(err.message || 'Import failed', 'error');
      } finally {
        setIsProcessing(false);
        setProcessingStatus('');
      }
    } else {
      if (!rawText.trim()) {
        showToast('Please paste your questions text or JSON content', 'error');
        return;
      }

      setIsProcessing(true);
      setProcessingStatus('Parsing raw text questions & verifying with AI...');

      try {
        const res = await api.processImportText({
          rawText,
          format: pasteFormat,
          fileName: pasteFormat === 'json' ? 'direct_json_paste.json' : 'pasted_questions.txt',
          targetSubjectId: targetSubjectId || undefined,
          examName: examName || undefined
        });

        if (res.success) {
          onSuccess([res.batch], `Successfully ingested ${res.batch.totalDetected} questions.`);
          onClose();
        }
      } catch (err: any) {
        showToast(err.message || 'Direct text processing failed', 'error');
      } finally {
        setIsProcessing(false);
        setProcessingStatus('');
      }
    }
  };

  return (
    <div id="import-upload-modal-backdrop" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div id="import-upload-modal-container" className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                Import & Ingest Nursing MCQs
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                JSON, Excel (.xlsx), CSV, PDF (Digital & Scanned), Image(s), ZIP, or Direct Text
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: File Upload vs Direct Paste */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'file'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            File Upload (Multi-Format & ZIP)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'paste'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <FileCode className="w-4 h-4" />
            Direct Text / JSON Paste
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
          {/* Metadata Pre-selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Subject (Optional)
              </label>
              <select
                value={targetSubjectId}
                onChange={e => setTargetSubjectId(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 px-3 py-2 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">✨ Auto-Detect Subject via AI</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name_en} ({s.name_mr})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Exam / Reference Name
              </label>
              <input
                type="text"
                value={examName}
                onChange={e => setExamName(e.target.value)}
                placeholder="e.g. AIIMS NORCET 2025, DMER Staff Nurse"
                className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 px-3 py-2 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {activeTab === 'file' ? (
            <div className="space-y-4">
              {/* Drag & Drop Zone */}
              <div
                onDragOver={e => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={e => {
                  e.preventDefault();
                  setDragActive(false);
                  handleFiles(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30'
                    : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50/50 dark:bg-slate-850/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".json,.xlsx,.xls,.csv,.pdf,.jpg,.jpeg,.png,.webp,.zip"
                  className="hidden"
                  onChange={e => handleFiles(e.target.files)}
                />
                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                  Click to browse or drag & drop files here
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Supports JSON, Excel (.xlsx), CSV, PDF (with Multimodal OCR), Images (JPG/PNG), and ZIP archives containing thousands of questions.
                </p>

                {/* Badges of supported formats */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    📊 Excel / CSV
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    📄 JSON
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    📕 PDF (Scanned / Digital)
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                    🖼️ Images (OCR)
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    📦 ZIP Bundle
                  </span>
                </div>
              </div>

              {/* Selected Files List */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span>Selected Files ({selectedFiles.length})</span>
                    <button
                      type="button"
                      onClick={() => setSelectedFiles([])}
                      className="text-rose-600 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                            {file.name}
                          </span>
                          <span className="text-slate-400 shrink-0">
                            ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Paste Content
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPasteFormat('text')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium ${
                      pasteFormat === 'text'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Raw Text / Notes Format
                  </button>
                  <button
                    type="button"
                    onClick={() => setPasteFormat('json')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium ${
                      pasteFormat === 'json'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    JSON Format
                  </button>
                </div>
              </div>

              <textarea
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                rows={9}
                placeholder={
                  pasteFormat === 'json'
                    ? '[\n  {\n    "question_en": "Normal arterial blood pH range is:",\n    "option_a_en": "7.35 - 7.45",\n    "option_b_en": "7.25 - 7.35",\n    "option_c_en": "7.45 - 7.55",\n    "option_d_en": "7.00 - 7.15",\n    "correct_option": "A",\n    "explanation_en": "Normal blood pH is strictly maintained between 7.35 and 7.45."\n  }\n]'
                    : '1. What is the priority nursing assessment before administering Digoxin?\nA. Respiratory rate\nB. Apical pulse for 1 full minute\nC. Blood glucose level\nD. Urine output\nAnswer: B\nExplanation: Withhold digoxin if apical pulse < 60 bpm in adults.\n\n2. Next question...'
                }
                className="w-full text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-3 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 leading-relaxed"
              />
            </div>
          )}

          {/* Active Auto-Verification Parameters Brief */}
          <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/60 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
              <p className="font-semibold">
                Auto-Verification Pipeline Active:
              </p>
              <p className="text-indigo-700 dark:text-indigo-300">
                Confidence Threshold: <span className="font-bold">{settings.minAutoApprovalConfidence}%</span> • Quality Score: <span className="font-bold">{settings.minQualityScore}%</span> • Mode: <span className="font-bold uppercase">{settings.processingMode}</span> • Auto-Publish: <span className="font-bold">{settings.autoPublish ? 'YES' : 'NO (Staged)'}</span>
              </p>
            </div>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center gap-3 animate-pulse">
              <Sparkles className="w-6 h-6 text-blue-600 animate-spin" />
              <div>
                <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                  Processing Ingestion Pipeline...
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {processingStatus}
                </p>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing || (activeTab === 'file' && selectedFiles.length === 0) || (activeTab === 'paste' && !rawText.trim())}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-md flex items-center gap-2 transition-colors"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Start AI Ingestion Pipeline</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
