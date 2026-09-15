import React, { useState } from 'react';
import { ImportedQuestionItem, Subject, Chapter, Topic, ImportBatch } from '../../types';
import { api } from '../../lib/api';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Edit3,
  Search,
  Filter,
  Layers,
  Sparkles,
  ArrowUpRight,
  Eye,
  Check,
  Zap,
  Info,
  ExternalLink,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { EditImportedQuestionModal } from './EditImportedQuestionModal';

interface ImportReviewQueueTabProps {
  batches: ImportBatch[];
  subjects: Subject[];
  chapters: Chapter[];
  topics: Topic[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ImportReviewQueueTab: React.FC<ImportReviewQueueTabProps> = ({
  batches,
  subjects,
  chapters,
  topics,
  onRefresh,
  showToast
}) => {
  const [selectedBatchId, setSelectedBatchId] = useState<string>('all');
  const [selectedFlag, setSelectedFlag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItemIds, setSelectedItemIds] = useState<{ batchId: string; questionId: string }[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<{ question: ImportedQuestionItem; batchId: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Flatten questions from batches matching filter
  const allQuestionsWithBatch: { question: ImportedQuestionItem; batch: ImportBatch }[] = [];
  batches.forEach(b => {
    if (selectedBatchId !== 'all' && b.id !== selectedBatchId) return;
    b.questions.forEach(q => {
      allQuestionsWithBatch.push({ question: q, batch: b });
    });
  });

  // Filter only items that need review (or conflicts/duplicates)
  const filteredItems = allQuestionsWithBatch.filter(({ question }) => {
    // Show review_required, conflict, duplicate, or unapproved
    const isPending =
      question.verificationStatus === 'review_required' ||
      question.verificationStatus === 'conflict' ||
      question.verificationStatus === 'duplicate' ||
      (!question.publishedQuestionId && question.verificationStatus !== 'rejected');

    if (!isPending) return false;

    // Flag filter
    if (selectedFlag !== 'all') {
      if (!question.flags.includes(selectedFlag as any)) return false;
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText =
        question.question_en.toLowerCase().includes(q) ||
        (question.detectedSubjectName && question.detectedSubjectName.toLowerCase().includes(q)) ||
        (question.sourceFile && question.sourceFile.toLowerCase().includes(q));
      if (!matchText) return false;
    }

    return true;
  });

  const isSelected = (batchId: string, qId: string) => {
    return selectedItemIds.some(i => i.batchId === batchId && i.questionId === qId);
  };

  const toggleSelect = (batchId: string, qId: string) => {
    setSelectedItemIds(prev =>
      isSelected(batchId, qId)
        ? prev.filter(i => !(i.batchId === batchId && i.questionId === qId))
        : [...prev, { batchId, questionId: qId }]
    );
  };

  const handleSelectAll = () => {
    if (selectedItemIds.length === filteredItems.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(filteredItems.map(f => ({ batchId: f.batch.id, questionId: f.question.id })));
    }
  };

  const handleApproveSingle = async (batchId: string, questionId: string) => {
    try {
      const res = await api.approveImportedQuestion(batchId, questionId);
      if (res.success) {
        showToast('Question approved into Question Bank!', 'success');
        onRefresh();
      } else {
        showToast(res.error || 'Failed to approve', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Error approving', 'error');
    }
  };

  const handleRejectSingle = async (batchId: string, questionId: string) => {
    try {
      const res = await api.rejectImportedQuestion(batchId, questionId);
      if (res.success) {
        showToast('Question rejected and removed from queue', 'info');
        onRefresh();
      }
    } catch (e: any) {
      showToast(e.message || 'Error rejecting', 'error');
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedItemIds.length === 0) return;
    setActionLoading(true);
    try {
      const res = await api.bulkReviewAction({
        items: selectedItemIds,
        action
      });
      if (res.success) {
        showToast(`Successfully processed ${res.processedCount} questions!`, 'success');
        setSelectedItemIds([]);
        onRefresh();
      }
    } catch (e: any) {
      showToast(e.message || 'Bulk action failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkApproveHighConfidence = async () => {
    if (batches.length === 0) return;
    setActionLoading(true);
    let totalApproved = 0;

    try {
      for (const b of batches) {
        const res = await api.approveBatchHighConfidence(b.id, 90);
        totalApproved += res.approvedCount;
      }
      showToast(`One-Click Auto Approval: Ingested ${totalApproved} high-confidence questions (≥90%)!`, 'success');
      onRefresh();
    } catch (e: any) {
      showToast(e.message || 'Bulk high-confidence approval failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Fast Approval Action */}
      <div className="p-5 rounded-2xl bg-linear-to-r from-blue-900 to-indigo-900 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Exception Review Queue
            </span>
            <span className="text-xs text-blue-200">
              {filteredItems.length} questions require your review
            </span>
          </div>
          <h3 className="text-lg font-bold mt-1">
            Human-in-the-Loop AI Medical Verification
          </h3>
          <p className="text-xs text-blue-200 max-w-xl mt-0.5">
            AI automatically isolates answer conflicts, ambiguities, duplicates, and confidence deficits. Review exceptions before final publication.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleBulkApproveHighConfidence}
            disabled={actionLoading || batches.length === 0}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            Approve All High-Confidence (≥90%)
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by question text, subject name, or source file..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Batch Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Batch:</span>
            <select
              value={selectedBatchId}
              onChange={e => setSelectedBatchId(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Ingestion Batches ({batches.length})</option>
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.id} ({b.fileName} - {b.totalDetected} MCQs)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Flag Chips Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Flag:
          </span>
          {[
            { id: 'all', label: 'All Review Items' },
            { id: 'ANSWER_CONFLICT', label: '⚠️ Answer Conflict' },
            { id: 'LOW_CONFIDENCE', label: '📉 Low Confidence' },
            { id: 'POSSIBLE_DUPLICATE', label: '🔄 Duplicate Detected' },
            { id: 'MEDICAL_REVIEW_REQUIRED', label: '🩺 Medical Safety' },
            { id: 'MISSING_OPTIONS', label: '🧩 Missing Options' },
            { id: 'OCR_LOW_QUALITY', label: '🔍 OCR Ambiguity' }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedFlag(f.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                selectedFlag === f.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Selection Bar */}
      {selectedItemIds.length > 0 && (
        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-200">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>{selectedItemIds.length} question(s) selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleBulkAction('approve')}
              disabled={actionLoading}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              Approve Selected
            </button>
            <button
              type="button"
              onClick={() => handleBulkAction('reject')}
              disabled={actionLoading}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <XCircle className="w-3.5 h-3.5" />
              Reject Selected
            </button>
            <button
              type="button"
              onClick={() => setSelectedItemIds([])}
              className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Question Cards List */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
            Review Queue Clean!
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            There are no pending questions requiring manual review under the current filters. All approved items are safely in the question bank.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="checkbox"
                checked={selectedItemIds.length === filteredItems.length && filteredItems.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded-sm text-blue-600 accent-blue-600"
              />
              Select All Filtered ({filteredItems.length})
            </label>
            <span>Showing {filteredItems.length} question(s)</span>
          </div>

          {filteredItems.map(({ question, batch }) => {
            const hasConflict = question.flags.includes('ANSWER_CONFLICT');
            const isSelectedCard = isSelected(batch.id, question.id);

            return (
              <div
                key={`${batch.id}-${question.id}`}
                className={`p-5 rounded-2xl border transition-all ${
                  isSelectedCard
                    ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                }`}
              >
                {/* Header metadata row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isSelectedCard}
                      onChange={() => toggleSelect(batch.id, question.id)}
                      className="w-4 h-4 rounded-sm text-blue-600 accent-blue-600"
                    />
                    <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {question.id}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {question.detectedSubjectName || 'Subject Unclassified'}
                    </span>
                    {question.detectedTopicName && (
                      <span className="text-xs text-slate-500 hidden sm:inline">
                        • {question.detectedTopicName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Score badges */}
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <span
                        className={`px-2 py-0.5 rounded-md ${
                          question.aiConfidence >= 90
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : question.aiConfidence >= 75
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        Confidence: {question.aiConfidence}%
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Quality: {question.qualityScore}/100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Problem Flag Chips */}
                {question.flags && question.flags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 py-2.5">
                    {question.flags.map((fl, idx) => (
                      <span
                        key={idx}
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 ${
                          fl === 'ANSWER_CONFLICT'
                            ? 'bg-rose-100 text-rose-900 dark:bg-rose-950/80 dark:text-rose-200 border border-rose-300 dark:border-rose-900'
                            : fl === 'POSSIBLE_DUPLICATE'
                            ? 'bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-200'
                            : 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200'
                        }`}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        {fl.replace(/_/g, ' ')}
                      </span>
                    ))}
                    {question.duplicateOfQuestionId && (
                      <span className="text-[11px] text-purple-600 dark:text-purple-400 font-mono">
                        (Matched: {question.duplicateOfQuestionId})
                      </span>
                    )}
                  </div>
                )}

                {/* Question Text */}
                <div className="py-2 space-y-1.5">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                    {question.question_en}
                  </p>
                  {question.question_mr && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-serif">
                      {question.question_mr}
                    </p>
                  )}
                </div>

                {/* 4 Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3 text-xs">
                  {[
                    { key: 'A', en: question.option_a_en, mr: question.option_a_mr },
                    { key: 'B', en: question.option_b_en, mr: question.option_b_mr },
                    { key: 'C', en: question.option_c_en, mr: question.option_c_mr },
                    { key: 'D', en: question.option_d_en, mr: question.option_d_mr }
                  ].map(opt => {
                    const isSource = question.sourceAnswer === opt.key;
                    const isAi = question.aiAnswer === opt.key;

                    return (
                      <div
                        key={opt.key}
                        className={`p-2.5 rounded-xl border flex items-start justify-between gap-2 ${
                          isSource && isAi
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                            : isSource
                            ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20'
                            : isAi
                            ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20'
                            : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 mr-1.5">
                            {opt.key}.
                          </span>
                          <span className="text-slate-800 dark:text-slate-200">{opt.en}</span>
                          {opt.mr && (
                            <p className="text-[11px] text-slate-500 mt-0.5">{opt.mr}</p>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          {isSource && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                              Source Key
                            </span>
                          )}
                          {isAi && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                              AI Suggested
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Source Answer vs AI Answer Comparison Highlight Box */}
                <div
                  className={`p-3 rounded-xl text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                    hasConflict
                      ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900'
                      : 'bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 font-bold">
                      <span className="text-slate-700 dark:text-slate-300">
                        Source Answer: <span className="text-blue-600 font-extrabold">{question.sourceAnswer || 'N/A'}</span>
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="text-slate-700 dark:text-slate-300">
                        AI Verified: <span className="text-amber-600 font-extrabold">{question.aiAnswer || 'N/A'}</span>
                      </span>
                      <span className="text-slate-300">|</span>
                      <span
                        className={`text-[11px] font-bold ${
                          hasConflict ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {hasConflict ? '⚠️ ANSWER CONFLICT' : '✅ MATCHED'}
                      </span>
                    </div>

                    {(question.explanation_en || question.aiExplanation) && (
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-snug mt-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Clinical Rationale: </span>
                        {question.explanation_en || question.aiExplanation}
                      </p>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 shrink-0 text-right">
                    <span>Source: {question.sourceFile}</span>
                    {question.sourcePage && <span> • Page {question.sourcePage}</span>}
                    {question.sourceQuestionNumber && <span> • Q.{question.sourceQuestionNumber}</span>}
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Batch: {batch.id} • Mode: {batch.settings.processingMode}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRejectSingle(batch.id, question.id)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingQuestion({ question, batchId: batch.id })}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit & Fix
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApproveSingle(batch.id, question.id)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve & Publish
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
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
