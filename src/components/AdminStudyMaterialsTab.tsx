import React, { useState } from 'react';
import { StudyMaterial, Subject } from '../types';
import { api } from '../lib/api';
import {
  FileText,
  Plus,
  Trash2,
  Lock,
  Download,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AdminStudyMaterialsProps {
  materials: StudyMaterial[];
  subjects: Subject[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminStudyMaterialsTab: React.FC<AdminStudyMaterialsProps> = ({
  materials,
  subjects,
  onRefresh,
  showToast
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    title_mr: '',
    description: '',
    description_mr: '',
    subject_id: 'subj-fon',
    category: 'notes' as const,
    exam: 'AIIMS NORCET 2025',
    is_premium: false,
    file_size_mb: 2.5,
    source: 'INC Standard Guidelines'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please provide a title for the study material', 'error');
      return;
    }

    try {
      await api.addStudyMaterial(formData);
      showToast('Study material document added successfully', 'success');
      setShowAddForm(false);
      setFormData({
        title: '',
        title_mr: '',
        description: '',
        description_mr: '',
        subject_id: 'subj-fon',
        category: 'notes',
        exam: 'AIIMS NORCET 2025',
        is_premium: false,
        file_size_mb: 2.5,
        source: 'INC Standard Guidelines'
      });
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to add study material', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this study material?')) return;
    try {
      await api.deleteStudyMaterial(id);
      showToast('Material deleted successfully', 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete material', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Study Materials & Notes CMS</h2>
          <p className="text-sm text-slate-500">
            Publish high-yield PDFs, formula sheets, GCS reference cards, and INC standard notes for aspirants.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'Add New Document'}</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Upload & Publish Study Document</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Title (English) *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Parkland Burns Formula & Resuscitation Guide"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Title (Marathi)</label>
              <input
                type="text"
                value={formData.title_mr}
                onChange={e => setFormData({ ...formData, title_mr: e.target.value })}
                placeholder="उदा. पार्कलँड बर्न फ्लुइड फॉर्म्युला व चार्ट"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nursing Subject</label>
              <select
                value={formData.subject_id}
                onChange={e => setFormData({ ...formData, subject_id: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name_en}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <option value="notes">High-Yield Study Notes</option>
                <option value="clinical_guide">Clinical Guide / Chart</option>
                <option value="syllabus_pdf">Official Syllabus PDF</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Exam Track</label>
              <input
                type="text"
                value={formData.exam}
                onChange={e => setFormData({ ...formData, exam: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Source / Citation</label>
              <input
                type="text"
                value={formData.source}
                onChange={e => setFormData({ ...formData, source: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description (English)</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_premium}
                onChange={e => setFormData({ ...formData, is_premium: e.target.checked })}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>PRO Access Only (Locked for free tier students)</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold"
            >
              Publish Document
            </button>
          </div>
        </form>
      )}

      {/* Materials List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Document Title</th>
              <th className="p-3.5">Subject</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Exam Target</th>
              <th className="p-3.5">Access Tier</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {materials.map(m => (
              <tr key={m.id} className="hover:bg-slate-50/70">
                <td className="p-3.5">
                  <div className="font-bold text-slate-900">{m.title}</div>
                  {m.title_mr && <div className="text-slate-500 text-[11px]">{m.title_mr}</div>}
                </td>
                <td className="p-3.5 font-medium text-slate-700">
                  {subjects.find(s => s.id === m.subject_id)?.name_en || 'General'}
                </td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold capitalize">
                    {m.category.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-3.5 text-slate-600">{m.exam}</td>
                <td className="p-3.5">
                  {m.is_premium ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] flex items-center gap-1 w-max">
                      <Lock className="w-3 h-3" />
                      <span>PRO</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold text-[10px] w-max block">
                      Free
                    </span>
                  )}
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
