import React, { useState } from 'react';
import { ImportBatch, Subject, Chapter, Topic } from '../../types';
import { api } from '../../lib/api';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Zap,
  Eye,
  FileSpreadsheet,
  FileText,
  Sparkles,
  Search,
  ExternalLink,
  X
} from 'lucide-react';
import { EditImportedQuestionModal } from './EditImportedQuestionModal';

interface ImportBatchListTabProps {
  batches: ImportBatch[];
  subjects: Subject[];
  chapters: Chapter[];
  topics: Topic[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ImportBatchListTab: React.FC<ImportBatchListTabProps> = ({
  batches,
  subjects,
  chapters,
  topics,
  onRefresh,
  showToast
}) => {
  const [selectedBatch, setSelectedBatch] = useState<ImportBatch | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDeleteBatch = async (batchId: string) => {
    if (!window.confirm(`Are you sure you want to delete Batch ${batchId}?`)) return;
    try {
      const res = await api.deleteImportBatch(batchId);
      if (res.success) {
        showToast('Batch deleted successfully', 'info');
        if (selectedBatch?.id === batchId) setSelectedBatch(null);
        onRefresh();
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to delete batch', 'error');
    }
  };

  const handleApproveBatchHighConfidence = async (batchId: string) => {
    try {
      const res = await api.approveBatchHighConfidence(batchId, 90);
      showToast(`Approved ${res.approvedCount} high-confidence questions from batch!`, 'success');
      onRefresh();
      if (selectedBatch?.id === batchId) {
        setSelectedBatch(res.batch);
      }
    } catch (e: any) {
      showToast(e.message || 'Approval failed', 'error');
    }
  };

  const filteredBatches = (batches || []).filter(b => {
    if (!b || !b.id) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.id.toLowerCase().includes(q) ||
      (b.fileName || '').toLowerCase().includes(q) ||
      (b.uploadedByName && b.uploadedByName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search batches by ID, filename, or uploader..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <span className="text-xs text-slate-500 font-semibold shrink-0">
          Total Batches: {batches.length}
        </span>
      </div>

      {/* Batches Grid */}
      {filteredBatches.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
            No Ingestion Batches Found
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Import files using the buttons above to create your first automated ingestion batch.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBatches.map(batch => {
            const autoApprovedPct =
              batch.totalDetected > 0
                ? Math.round((batch.autoApprovedCount / batch.totalDetected) * 100)
                : 0;

            return (
              <div
                key={batch.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs space-y-4 transition-all"
              >
                {/* Top Title Row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                        {batch.id}
                      </span>
                      <span className="text-xs text-slate-400 capitalize">
                        {batch.fileType}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-1 truncate max-w-xs">
                      {batch.fileName}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Uploaded by {batch.uploadedByName || 'Admin'} • {new Date(batch.createdAt).toLocaleDateString()} {new Date(batch.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      batch.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {batch.status === 'completed' ? 'Processed' : 'Processing'}
                  </span>
                </div>

                {/* Metrics Badges Row */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                    <p className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                      {batch.totalDetected}
                    </p>
                    <p className="text-[10px] text-slate-500">Detected</p>
                  </div>

                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40">
                    <p className="font-extrabold text-emerald-700 dark:text-emerald-300 text-base">
                      {batch.autoApprovedCount}
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Approved</p>
                  </div>

                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40">
                    <p className="font-extrabold text-amber-700 dark:text-amber-300 text-base">
                      {batch.reviewRequiredCount}
                    </p>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400">Review</p>
                  </div>

                  <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40">
                    <p className="font-extrabold text-purple-700 dark:text-purple-300 text-base">
                      {batch.duplicateCount}
                    </p>
                    <p className="text-[10px] text-purple-600 dark:text-purple-400">Duplicates</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    <span>Auto-Approved Efficiency</span>
                    <span>{autoApprovedPct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${autoApprovedPct}%` }}
                    />
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteBatch(batch.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                    title="Delete Batch"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    {batch.reviewRequiredCount > 0 && (
                      <button
                        type="button"
                        onClick={() => handleApproveBatchHighConfidence(batch.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        Approve ≥90%
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedBatch(batch)}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View {batch.questions.length} Questions
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Batch Detail Drilldown Modal */}
      {selectedBatch && (
        <div id="batch-detail-modal" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {selectedBatch.id}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    {selectedBatch.fileName}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedBatch.questions.length} Questions • {selectedBatch.autoApprovedCount} Approved • {selectedBatch.reviewRequiredCount} Review Required
                </p>
              </div>
              <button
                onClick={() => setSelectedBatch(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-3">
              {selectedBatch.questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-500">#{idx + 1}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          q.verificationStatus === 'auto_approved' || q.verificationStatus === 'approved_by_admin'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : q.verificationStatus === 'rejected'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {q.verificationStatus.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <span className="text-slate-500 font-semibold">{q.detectedSubjectName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-600 dark:text-slate-400">
                        Confidence: {q.aiConfidence}%
                      </span>
                      {q.verificationStatus !== 'auto_approved' && q.verificationStatus !== 'approved_by_admin' && (
                        <button
                          type="button"
                          onClick={() => setEditingQuestion({ question: q, batchId: selectedBatch.id })}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px]"
                        >
                          Review & Approve
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {q.question_en}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400">
                    <span>Source Answer: <strong className="text-blue-600">{q.sourceAnswer || 'N/A'}</strong></span>
                    <span>AI Suggested: <strong className="text-amber-600">{q.aiAnswer || 'N/A'}</strong></span>
                    {q.flags && q.flags.length > 0 && (
                      <span className="text-rose-600 font-semibold">
                        Flags: {q.flags.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* In-place question editor */}
      {editingQuestion && (
        <EditImportedQuestionModal
          question={editingQuestion.question}
          batchId={editingQuestion.batchId}
          subjects={subjects}
          chapters={chapters}
          topics={topics}
          onClose={() => setEditingQuestion(null)}
          onSuccess={() => {
            setEditingQuestion(null);
            onRefresh();
          }}
          showToast={showToast}
        />
      )}
    </div>
  );
};
