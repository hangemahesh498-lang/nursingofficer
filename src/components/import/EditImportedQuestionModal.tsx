import React, { useState } from 'react';
import { Subject, Chapter, Topic, ImportedQuestionItem } from '../../types';
import { api } from '../../lib/api';
import {
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  HelpCircle,
  FileText,
  BookOpen
} from 'lucide-react';

interface EditImportedQuestionModalProps {
  question: ImportedQuestionItem;
  batchId: string;
  subjects: Subject[];
  chapters: Chapter[];
  topics: Topic[];
  onClose: () => void;
  onSuccess: (updatedQuestion: ImportedQuestionItem) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const EditImportedQuestionModal: React.FC<EditImportedQuestionModalProps> = ({
  question,
  batchId,
  subjects,
  chapters,
  topics,
  onClose,
  onSuccess,
  showToast
}) => {
  const [formData, setFormData] = useState<ImportedQuestionItem>({ ...question });
  const [saving, setSaving] = useState(false);

  const filteredTopics = topics.filter(t => t.subject_id === formData.detectedSubjectId);

  const handleApprove = async () => {
    setSaving(true);
    try {
      const res = await api.approveImportedQuestion(batchId, question.id, formData);
      if (res.success) {
        showToast('Question updated and approved into Question Bank!', 'success');
        onSuccess({ ...formData, verificationStatus: 'approved_by_admin' });
        onClose();
      } else {
        showToast(res.error || 'Failed to approve', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Error approving question', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="edit-imported-q-modal-backdrop" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div id="edit-imported-q-modal-container" className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {question.id}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Edit & Approve Question
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Source: {question.sourceFile} {question.sourcePage ? `• Page ${question.sourcePage}` : ''} {question.sourceQuestionNumber ? `• Q.${question.sourceQuestionNumber}` : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Validation Alert Header */}
        {question.flags && question.flags.length > 0 && (
          <div className="px-6 py-3 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs text-amber-900 dark:text-amber-200">
              <span className="font-semibold">Review Flag: </span>
              {question.flags.join(', ')} • Source Answer: <span className="font-bold">{question.sourceAnswer || 'N/A'}</span> • AI Suggested: <span className="font-bold">{question.aiAnswer || 'N/A'}</span>
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
          {/* Classification */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <select
                value={formData.detectedSubjectId || ''}
                onChange={e => {
                  const s = subjects.find(sub => sub.id === e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    detectedSubjectId: e.target.value,
                    detectedSubjectName: s ? s.name_en : prev.detectedSubjectName
                  }));
                }}
                className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-2 text-slate-800 dark:text-slate-200"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name_en}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Topic
              </label>
              <select
                value={formData.detectedTopicId || ''}
                onChange={e => {
                  const t = topics.find(top => top.id === e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    detectedTopicId: e.target.value,
                    detectedTopicName: t ? t.name_en : prev.detectedTopicName
                  }));
                }}
                className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-2 text-slate-800 dark:text-slate-200"
              >
                <option value="">Select Topic (Optional)</option>
                {filteredTopics.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name_en}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Difficulty
              </label>
              <select
                value={formData.difficulty || 'medium'}
                onChange={e => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-2 text-slate-800 dark:text-slate-200"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Question Text (English) */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Question Text (English) *
            </label>
            <textarea
              rows={3}
              value={formData.question_en}
              onChange={e => setFormData(prev => ({ ...prev, question_en: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Question Text (Marathi) */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Question Text (Marathi)
            </label>
            <textarea
              rows={2}
              value={formData.question_mr || ''}
              onChange={e => setFormData(prev => ({ ...prev, question_mr: e.target.value }))}
              placeholder="मराठी प्रश्न (ऐच्छिक)..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 4 Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {(['A', 'B', 'C', 'D'] as const).map(opt => {
              const optKeyEn = `option_${opt.toLowerCase()}_en` as keyof ImportedQuestionItem;
              const optKeyMr = `option_${opt.toLowerCase()}_mr` as keyof ImportedQuestionItem;
              const isSourceCorrect = formData.sourceAnswer === opt;
              const isAiCorrect = formData.aiAnswer === opt;

              return (
                <div
                  key={opt}
                  className={`p-3 rounded-xl border ${
                    formData.sourceAnswer === opt
                      ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Option {opt}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isSourceCorrect && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold">
                          Source Key
                        </span>
                      )}
                      {isAiCorrect && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                          AI Verified
                        </span>
                      )}
                      <label className="flex items-center gap-1 cursor-pointer ml-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        <input
                          type="radio"
                          name="correctOption"
                          value={opt}
                          checked={formData.sourceAnswer === opt}
                          onChange={() => setFormData(prev => ({ ...prev, sourceAnswer: opt }))}
                          className="accent-blue-600"
                        />
                        Mark Correct
                      </label>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={(formData[optKeyEn] as string) || ''}
                    onChange={e => setFormData(prev => ({ ...prev, [optKeyEn]: e.target.value }))}
                    placeholder={`Option ${opt} (English)`}
                    className="w-full mb-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-slate-800 dark:text-slate-200"
                  />
                  <input
                    type="text"
                    value={(formData[optKeyMr] as string) || ''}
                    onChange={e => setFormData(prev => ({ ...prev, [optKeyMr]: e.target.value }))}
                    placeholder={`पर्याय ${opt} (मराठी)`}
                    className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-slate-800 dark:text-slate-200"
                  />
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Clinical Explanation / Rationale
            </label>
            <textarea
              rows={3}
              value={formData.explanation_en || formData.aiExplanation || ''}
              onChange={e => setFormData(prev => ({ ...prev, explanation_en: e.target.value }))}
              placeholder="Evidence-based nursing rationale..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApprove}
            disabled={saving}
            className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg shadow-sm flex items-center gap-2 transition-colors"
          >
            {saving ? <Sparkles className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Save & Publish to Question Bank
          </button>
        </div>
      </div>
    </div>
  );
};
