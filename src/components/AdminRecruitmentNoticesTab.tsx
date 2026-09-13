import React, { useState } from 'react';
import { RecruitmentNotice } from '../types';
import { api } from '../lib/api';
import {
  Bell,
  Plus,
  Building2,
  Calendar,
  GraduationCap,
  ExternalLink,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface AdminRecruitmentNoticesProps {
  notices: RecruitmentNotice[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminRecruitmentNoticesTab: React.FC<AdminRecruitmentNoticesProps> = ({
  notices,
  onRefresh,
  showToast
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    organization: '',
    post_name: 'Nursing Officer',
    year: 2025,
    eligibility_summary: 'B.Sc. Nursing / Post Basic B.Sc. OR GNM with 2 years clinical hospital experience.',
    age_limit: '18 to 30 years (Standard category relaxations apply)',
    application_start_date: '2025-03-01',
    application_end_date: '2025-03-31',
    exam_pattern_summary: 'Computer Based Test (CBT): 100 MCQs, 90 minutes. 1/3rd Negative Marking.',
    official_website: 'https://norcet.aiimsexams.ac.in',
    status: 'active' as const,
    total_vacancies: 3000,
    source_disclaimer: 'Extracted from official gazette notification.'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.organization.trim() || !formData.post_name.trim()) {
      showToast('Please fill Organization and Post Name', 'error');
      return;
    }

    try {
      await api.addRecruitmentNotice(formData);
      showToast('Recruitment vacancy announcement published', 'success');
      setShowAddForm(false);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to add notice', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Recruitment & Vacancy Alerts CMS</h2>
          <p className="text-sm text-slate-500">
            Publish and manage official AIIMS, ESIC, RRB, and State Nursing recruitment schedules, syllabus patterns, and eligibility criteria.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'Add Vacancy Notice'}</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Create New Recruitment Notification</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Organization / Board *</label>
              <input
                type="text"
                required
                value={formData.organization}
                onChange={e => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g. AIIMS New Delhi / ESIC HQ"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Post Name *</label>
              <input
                type="text"
                required
                value={formData.post_name}
                onChange={e => setFormData({ ...formData, post_name: e.target.value })}
                placeholder="e.g. Nursing Officer (Group B)"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Vacancies (Approx)</label>
              <input
                type="number"
                value={formData.total_vacancies}
                onChange={e => setFormData({ ...formData, total_vacancies: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <option value="active">Active (Applications Open)</option>
                <option value="upcoming">Upcoming Notification</option>
                <option value="closed">Closed / Concluded</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Application Start Date</label>
              <input
                type="date"
                value={formData.application_start_date}
                onChange={e => setFormData({ ...formData, application_start_date: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Application Last Date</label>
              <input
                type="date"
                value={formData.application_end_date}
                onChange={e => setFormData({ ...formData, application_end_date: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Eligibility Summary</label>
            <textarea
              rows={2}
              value={formData.eligibility_summary}
              onChange={e => setFormData({ ...formData, eligibility_summary: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Portal URL</label>
            <input
              type="url"
              value={formData.official_website}
              onChange={e => setFormData({ ...formData, official_website: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
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
              Publish Vacancy Notice
            </button>
          </div>
        </form>
      )}

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notices.map(n => (
          <div key={n.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 uppercase">
                  {n.status}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1.5">{n.post_name}</h3>
                <p className="text-xs font-semibold text-slate-600">{n.organization}</p>
              </div>
              {n.total_vacancies && (
                <div className="text-right">
                  <span className="text-lg font-black text-teal-800">{n.total_vacancies.toLocaleString()}</span>
                  <div className="text-[10px] text-slate-400">Vacancies</div>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600 line-clamp-2">{n.eligibility_summary}</p>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between items-center">
              <span>Last Date: <strong className="text-rose-600">{n.application_end_date}</strong></span>
              {n.official_website && (
                <a
                  href={n.official_website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-700 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
