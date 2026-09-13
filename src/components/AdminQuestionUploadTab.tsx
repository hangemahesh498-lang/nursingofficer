import React, { useState, useEffect } from 'react';
import { Subject, Chapter, Topic, Question, ImportBatch, AdminAiImportSettings } from '../types';
import { api } from '../lib/api';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  FileCode,
  Image as ImageIcon,
  Archive,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sliders,
  Layers,
  Sparkles,
  Zap,
  BookOpen,
  RefreshCw,
  Search,
  ArrowRight
} from 'lucide-react';
import { ImportUploadModal } from './import/ImportUploadModal';
import { ImportReviewQueueTab } from './import/ImportReviewQueueTab';
import { ImportBatchListTab } from './import/ImportBatchListTab';
import { ImportSettingsModal } from './import/ImportSettingsModal';
import { ManualAddQuestionModal } from './import/ManualAddQuestionModal';

interface AdminQuestionUploadTabProps {
  subjects: Subject[];
  chapters: Chapter[];
  topics: Topic[];
  questions: Question[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onNavigateToBank: () => void;
}

export const AdminQuestionUploadTab: React.FC<AdminQuestionUploadTabProps> = ({
  subjects,
  chapters,
  topics,
  questions,
  onRefresh,
  showToast,
  onNavigateToBank
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'queue' | 'batches'>('queue');
  const [batches, setBatches] = useState<ImportBatch[]>([]);
  const [settings, setSettings] = useState<AdminAiImportSettings>({
    autoApprovalEnabled: true,
    minAutoApprovalConfidence: 90,
    minQualityScore: 85,
    autoDuplicateDetection: true,
    autoExplanationGeneration: true,
    autoSubjectDetection: true,
    autoTopicDetection: true,
    medicalSafetyReview: true,
    autoPublish: true,
    processingMode: 'balanced',
    duplicateSimilarityThreshold: 0.85
  });

  const [loading, setLoading] = useState(false);
  const [uploadModalFormat, setUploadModalFormat] = useState<
    'json' | 'excel' | 'csv' | 'pdf' | 'images' | 'zip' | 'paste' | null
  >(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showManualAddModal, setShowManualAddModal] = useState(false);

  const fetchBatchesAndSettings = async () => {
    setLoading(true);
    try {
      const [batchesRes, settingsRes] = await Promise.all([
        api.getImportBatches(),
        api.getAiImportSettings()
      ]);
      setBatches(batchesRes || []);
      if (settingsRes) setSettings(settingsRes);
    } catch (e: any) {
      console.warn('Failed to fetch batches or settings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatchesAndSettings();
  }, []);

  const handleRefreshAll = () => {
    fetchBatchesAndSettings();
    onRefresh();
  };

  // Metrics across all batches
  const totalIngested = batches.reduce((acc, b) => acc + (b.totalDetected || 0), 0);
  const totalApproved = batches.reduce((acc, b) => acc + (b.autoApprovedCount || 0), 0);
  const totalReviewRequired = batches.reduce((acc, b) => acc + (b.reviewRequiredCount || 0), 0);
  const totalDuplicates = batches.reduce((acc, b) => acc + (b.duplicateCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* 1. TOP ACTION BUTTONS / QUICK INGESTION BAR */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                AI Question Ingestion & Auto-Verification System
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Bulk import from JSON, Excel, CSV, PDFs, Images, or ZIP archives with automated OCR and clinical accuracy scoring.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sliders className="w-4 h-4 text-indigo-500" />
              AI Settings
            </button>

            <button
              type="button"
              onClick={handleRefreshAll}
              disabled={loading}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Refresh Queue and Batches"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Ingestion Format Buttons Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowManualAddModal(true)}
            className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add MCQ</span>
          </button>

          <button
            type="button"
            onClick={() => setUploadModalFormat('json')}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all"
          >
            <FileCode className="w-4 h-4 text-blue-500" />
            <span>JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setUploadModalFormat('excel')}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Excel (.xlsx)</span>
          </button>

          <button
            type="button"
            onClick={() => setUploadModalFormat('csv')}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-400 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all"
          >
            <FileText className="w-4 h-4 text-teal-500" />
            <span>CSV File</span>
          </button>

          <button
            type="button"
            onClick={() => setUploadModalFormat('pdf')}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-400 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all"
          >
            <FileText className="w-4 h-4 text-rose-500" />
            <span>PDF (OCR)</span>
          </button>

          <button
            type="button"
            onClick={() => setUploadModalFormat('images')}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all"
          >
            <ImageIcon className="w-4 h-4 text-purple-500" />
            <span>Images</span>
          </button>

          <button
            type="button"
            onClick={() => setUploadModalFormat('zip')}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all"
          >
            <Archive className="w-4 h-4 text-amber-500" />
            <span>ZIP Bundle</span>
          </button>

          <button
            type="button"
            onClick={() => setUploadModalFormat('paste')}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Paste Text</span>
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Ingested MCQs</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            {totalIngested.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Across {batches.length} batch(es)</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Auto-Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">
            {totalApproved.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-600/70 mt-0.5">
            {totalIngested > 0 ? Math.round((totalApproved / totalIngested) * 100) : 0}% auto-publish rate
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Review Queue</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-300 mt-1">
            {totalReviewRequired.toLocaleString()}
          </p>
          <p className="text-[11px] text-amber-600/70 mt-0.5">Exceptions needing review</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Duplicates Filtered</span>
            <Archive className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-extrabold text-purple-700 dark:text-purple-300 mt-1">
            {totalDuplicates.toLocaleString()}
          </p>
          <p className="text-[11px] text-purple-600/70 mt-0.5">SHA-256 & token deduplication</p>
        </div>
      </div>

      {/* 3. SUB-TAB SWITCHER */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('queue')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeSubTab === 'queue'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Review Queue (Exceptions)
            {totalReviewRequired > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                {totalReviewRequired}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('batches')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeSubTab === 'batches'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Layers className="w-4 h-4" />
            Ingestion Batches ({batches.length})
          </button>
        </div>

        <button
          type="button"
          onClick={onNavigateToBank}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40"
        >
          <span>Active Question Bank ({questions.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4. ACTIVE SUB-TAB VIEW */}
      {activeSubTab === 'queue' ? (
        <ImportReviewQueueTab
          batches={batches}
          subjects={subjects}
          chapters={chapters}
          topics={topics}
          onRefresh={handleRefreshAll}
          showToast={showToast}
        />
      ) : (
        <ImportBatchListTab
          batches={batches}
          subjects={subjects}
          chapters={chapters}
          topics={topics}
          onRefresh={handleRefreshAll}
          showToast={showToast}
        />
      )}

      {/* 5. MODALS */}
      {uploadModalFormat && (
        <ImportUploadModal
          initialFormat={uploadModalFormat}
          subjects={subjects}
          settings={settings}
          onClose={() => setUploadModalFormat(null)}
          onSuccess={(newBatches, msg) => {
            showToast(msg, 'success');
            handleRefreshAll();
          }}
          showToast={showToast}
        />
      )}

      {showSettingsModal && (
        <ImportSettingsModal
          settings={settings}
          onClose={() => setShowSettingsModal(false)}
          onSave={updated => {
            setSettings(updated);
            handleRefreshAll();
          }}
          showToast={showToast}
        />
      )}

      {showManualAddModal && (
        <ManualAddQuestionModal
          subjects={subjects}
          chapters={chapters}
          topics={topics}
          onClose={() => setShowManualAddModal(false)}
          onSuccess={() => {
            handleRefreshAll();
          }}
          showToast={showToast}
        />
      )}
    </div>
  );
};
