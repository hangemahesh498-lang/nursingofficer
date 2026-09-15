import React, { useState } from 'react';
import { Subject, Chapter, Topic, Question } from '../../types';
import { api } from '../../lib/api';
import { PlusCircle, CheckCircle2, X, Sparkles, BookOpen } from 'lucide-react';

interface ManualAddQuestionModalProps {
  subjects: Subject[];
  chapters: Chapter[];
  topics: Topic[];
  onClose: () => void;
  onSuccess: (newQ: Question) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ManualAddQuestionModal: React.FC<ManualAddQuestionModalProps> = ({
  subjects,
  chapters,
  topics,
  onClose,
  onSuccess,
  showToast
}) => {
  const [formData, setFormData] = useState({
    subject_id: subjects[0]?.id || '',
    topic_id: '',
    exam_target: 'both' as const,
    question_en: '',
    question_mr: '',
    option_a_en: '',
    option_a_mr: '',
    option_b_en: '',
    option_b_mr: '',
    option_c_en: '',
    option_c_mr: '',
    option_d_en: '',
    option_d_mr: '',
    correct_option: 'A',
    explanation_en: '',
    explanation_mr: '',
    difficulty: 'medium' as const,
    question_type: 'single_best' as const,
    is_free: true
  });

  const [saving, setSaving] = useState(false);
  const filteredTopics = topics.filter(t => t.subject_id === formData.subject_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question_en.trim() || !formData.option_a_en.trim() || !formData.option_b_en.trim()) {
      showToast('Please fill the English question and options A & B', 'error');
      return;
    }

    setSaving(true);
    try {
      const newQuestion = await api.addQuestion(formData);
      showToast('Question successfully created and published into bank!', 'success');
      onSuccess(newQuestion);
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to create question', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="manual-add-q-modal-backdrop" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div id="manual-add-q-modal-container" className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Add Single MCQ Manually
              </h3>
              <p className="text-xs text-slate-500">
                Create a verified nursing question with dual language and clinical rationale
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[72vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject *
              </label>
              <select
                value={formData.subject_id}
                onChange={e => setFormData(prev => ({ ...prev, subject_id: e.target.value, topic_id: '' }))}
                className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-2 text-slate-800 dark:text-slate-200"
                required
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name_en} ({s.name_mr})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Topic (Optional)
              </label>
              <select
                value={formData.topic_id}
                onChange={e => setFormData(prev => ({ ...prev, topic_id: e.target.value }))}
                className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-2 text-slate-800 dark:text-slate-200"
              >
                <option value="">-- घटक निवडा (Select Topic) --</option>
                {filteredTopics.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name_mr ? `${t.name_mr} (${t.name_en})` : t.name_en}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={e => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-2 text-slate-800 dark:text-slate-200"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Question Text (English) *
            </label>
            <textarea
              rows={3}
              value={formData.question_en}
              onChange={e => setFormData(prev => ({ ...prev, question_en: e.target.value }))}
              placeholder="e.g. Which of the following is the primary nursing action for a patient with acute pulmonary embolism?"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Question Text (Marathi)
            </label>
            <textarea
              rows={2}
              value={formData.question_mr}
              onChange={e => setFormData(prev => ({ ...prev, question_mr: e.target.value }))}
              placeholder="मराठीत प्रश्न..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {(['A', 'B', 'C', 'D'] as const).map(opt => {
              const optKeyEn = `option_${opt.toLowerCase()}_en` as keyof typeof formData;
              const optKeyMr = `option_${opt.toLowerCase()}_mr` as keyof typeof formData;
              const isSelected = formData.correct_option === opt;

              return (
                <div
                  key={opt}
                  className={`p-3 rounded-xl border ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Option {opt}
                    </span>
                    <label className="flex items-center gap-1 cursor-pointer text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      <input
                        type="radio"
                        name="manualCorrectOption"
                        value={opt}
                        checked={isSelected}
                        onChange={() => setFormData(prev => ({ ...prev, correct_option: opt }))}
                        className="accent-blue-600"
                      />
                      Correct Answer
                    </label>
                  </div>

                  <input
                    type="text"
                    value={formData[optKeyEn] as string}
                    onChange={e => setFormData(prev => ({ ...prev, [optKeyEn]: e.target.value }))}
                    placeholder={`Option ${opt} (English)`}
                    className="w-full mb-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-slate-800 dark:text-slate-200"
                    required={opt === 'A' || opt === 'B'}
                  />
                  <input
                    type="text"
                    value={formData[optKeyMr] as string}
                    onChange={e => setFormData(prev => ({ ...prev, [optKeyMr]: e.target.value }))}
                    placeholder={`पर्याय ${opt} (मराठी)`}
                    className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-slate-800 dark:text-slate-200"
                  />
                </div>
              );
            })}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Clinical Explanation / Rationale (English)
            </label>
            <textarea
              rows={3}
              value={formData.explanation_en}
              onChange={e => setFormData(prev => ({ ...prev, explanation_en: e.target.value }))}
              placeholder="Clinical reason why the correct answer is right..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm flex items-center gap-2 transition-colors"
            >
              {saving ? <Sparkles className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Publish to Question Bank
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
