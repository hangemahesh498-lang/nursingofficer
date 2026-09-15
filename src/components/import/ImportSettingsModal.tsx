import React, { useState } from 'react';
import { AdminAiImportSettings } from '../../types';
import { api } from '../../lib/api';
import { Sliders, CheckCircle2, ShieldCheck, Zap, Sparkles, X } from 'lucide-react';

interface ImportSettingsModalProps {
  settings: AdminAiImportSettings;
  onClose: () => void;
  onSave: (updated: AdminAiImportSettings) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ImportSettingsModal: React.FC<ImportSettingsModalProps> = ({
  settings,
  onClose,
  onSave,
  showToast
}) => {
  const [formData, setFormData] = useState<AdminAiImportSettings>({ ...settings });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.updateAiImportSettings(formData);
      if (res.success) {
        onSave(res.settings);
        showToast('AI Ingestion & Auto-Verification Settings updated successfully', 'success');
        onClose();
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to update settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="import-settings-modal-backdrop" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div id="import-settings-modal-container" className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                AI Question Ingestion Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure auto-verification thresholds, duplicate detection, and publishing rules
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

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Processing Mode */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              AI Processing Mode
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'fast', title: '⚡ Fast Mode', desc: 'Syntax + basic key validation. Minimal tokens.' },
                { id: 'balanced', title: '⚖️ Balanced (Recommended)', desc: 'Clinical validation + auto classification + duplicate check.' },
                { id: 'strict', title: '🛡️ Strict Mode', desc: 'Deep medical rationale + double verified answer cross-check.' }
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, processingMode: m.id as any }))}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    formData.processingMode === m.id
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p className="font-semibold text-sm">{m.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders for Confidence & Quality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Auto-Approval Confidence Threshold
                </label>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {formData.minAutoApprovalConfidence}%
                </span>
              </div>
              <input
                type="range"
                min="70"
                max="98"
                step="1"
                value={formData.minAutoApprovalConfidence}
                onChange={e => setFormData(prev => ({ ...prev, minAutoApprovalConfidence: Number(e.target.value) }))}
                className="w-full accent-indigo-600"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Questions scoring ≥ {formData.minAutoApprovalConfidence}% without conflicts are eligible for auto-approval.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Minimum Quality Score
                </label>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {formData.minQualityScore}%
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="95"
                step="1"
                value={formData.minQualityScore}
                onChange={e => setFormData(prev => ({ ...prev, minQualityScore: Number(e.target.value) }))}
                className="w-full accent-emerald-600"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Minimum linguistic, clinical, and formatting score required to publish.
              </p>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-3.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Automated Pipeline Capabilities
            </label>

            {[
              {
                key: 'autoApprovalEnabled',
                title: 'Enable Auto-Approval Pipeline',
                desc: 'Allow high-confidence questions with matching answers to bypass manual review queue.'
              },
              {
                key: 'autoPublish',
                title: 'Auto-Publish Approved Questions',
                desc: 'Instantly make auto-approved questions available in active mock tests & practice bank.'
              },
              {
                key: 'autoDuplicateDetection',
                title: 'AI Duplicate & Similarity Scanner',
                desc: 'Compare incoming questions against all existing questions in the bank using SHA-256 and semantic token analysis.'
              },
              {
                key: 'autoExplanationGeneration',
                title: 'Auto-Generate Clinical Rationales',
                desc: 'Create evidence-based nursing explanations if source document lacks full rationale.'
              },
              {
                key: 'autoSubjectDetection',
                title: 'Auto-Detect Subject & Curriculum Classification',
                desc: 'Map questions automatically to standard Nursing Officer syllabus (FON, MSN, OBG, CHN, etc.).'
              },
              {
                key: 'medicalSafetyReview',
                title: 'Medical Safety & Protocol Verification',
                desc: 'Flag questions with outdated nursing interventions, dosage ambiguities, or contradictory keys.'
              }
            ].map(item => (
              <label
                key={item.key}
                className="flex items-start justify-between gap-4 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={(formData as any)[item.key]}
                  onChange={e => setFormData(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  className="mt-1 w-4 h-4 rounded-sm text-indigo-600 accent-indigo-600"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-sm flex items-center gap-2 transition-colors"
          >
            {saving ? <Sparkles className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Save Ingestion Settings
          </button>
        </div>
      </div>
    </div>
  );
};
