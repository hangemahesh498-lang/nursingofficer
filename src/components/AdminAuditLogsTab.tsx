import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { AuditLogEntry } from '../types';
import {
  ShieldAlert,
  Trash2,
  Search,
  Filter,
  Loader2,
  RefreshCw,
  Clock,
  CheckSquare,
  Square,
  AlertTriangle,
  Info
} from 'lucide-react';

interface AdminAuditLogsTabProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminAuditLogsTab: React.FC<AdminAuditLogsTabProps> = ({ showToast }) => {
  const { language } = useLanguage();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Delete confirm states
  const [deleteTarget, setDeleteTarget] = useState<AuditLogEntry | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load audit logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const actionTypes = Array.from(new Set((logs || []).filter(l => Boolean(l && l.action)).map(l => l.action)));

  const filteredLogs = (logs || []).filter(l => Boolean(l && l.id)).filter(l => {
    const matchesAction = selectedAction === 'all' || l.action === selectedAction;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      !searchQuery ||
      (l.action || '').toLowerCase().includes(query) ||
      (l.details || '').toLowerCase().includes(query) ||
      (l.actor_name || '').toLowerCase().includes(query) ||
      (l.entity || '').toLowerCase().includes(query) ||
      (l.id || '').toLowerCase().includes(query);
    return matchesAction && matchesQuery;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredLogs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLogs.filter(l => Boolean(l && l.id)).map(l => l.id));
    }
  };

  const handleDeleteSingle = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await api.deleteAuditLog(deleteTarget.id);
      showToast(
        language === 'mr' ? 'ऑडिट लॉग एंट्री हटवली!' : 'Audit log entry deleted!',
        'success'
      );
      setDeleteTarget(null);
      loadAuditLogs();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete audit log', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBulk = async () => {
    setActionLoading(true);
    try {
      const res = await api.deleteAuditLogsBulk(selectedIds);
      showToast(
        language === 'mr'
          ? `${res.deletedCount || selectedIds.length} लॉग एंट्रीज हटवल्या!`
          : `Successfully deleted ${res.deletedCount || selectedIds.length} log entries!`,
        'success'
      );
      setSelectedIds([]);
      setBulkDeleteConfirm(false);
      loadAuditLogs();
    } catch (err: any) {
      showToast(err.message || 'Bulk delete failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteOlderThan2Months = async () => {
    if (!window.confirm(language === 'mr' ? '२ महिन्यांपेक्षा (६० दिवस) जुने सर्व ऑडिट लॉग्स हटवायचे का?' : 'Delete all audit logs older than 2 months (60 days)?')) return;
    setActionLoading(true);
    try {
      const res = await api.deleteAuditLogsOlderThan2Months();
      showToast(
        language === 'mr' ? `${res.deletedCount || 0} जुने लॉग्स यशस्वीपणे हटवले!` : `Successfully deleted ${res.deletedCount || 0} logs older than 2 months!`,
        'success'
      );
      loadAuditLogs();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete old logs', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & 1.5 Month Policy Notice */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-indigo-600" />
              <span>
                {language === 'mr'
                  ? 'अ‍ॅक्टिव्हिटी व सिक्युरिटी ऑडिट लॉग्स (Audit Security Stream)'
                  : 'Log Activity Management & Audit Security Stream'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'mr'
                ? 'अ‍ॅडमिनचे सर्व बदल, प्रश्न संपादन, लॉग इन व सिस्टीम अपडेट्सचे पुरावे येथे नोंदवले जातात.'
                : 'Append-only stream of administrative modifications, question updates, logins, and system configuration events.'}
            </p>
          </div>

          <button
            onClick={loadAuditLogs}
            disabled={loading}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer self-start sm:self-auto"
            title="Refresh Audit Logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* 1.5 Month Auto Deletion Banner */}
        <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 text-amber-900 flex items-start gap-3 text-xs font-medium">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-amber-950">
              {language === 'mr'
                ? '⚡ १.५ महिने (४५ दिवस) ऑटो-हटवणे धोरण (1.5 Months Auto-Purge Policy Active)'
                : '⚡ 1.5 Months (45 Days) Automatic Log Purge Policy Active'}
            </p>
            <p className="text-[11px] text-amber-800">
              {language === 'mr'
                ? 'सिस्टीमचा वेग कायम ठेवण्यासाठी ४५ दिवसांपेक्षा जुने ऑडिट लॉग्स आपोआप डेटाबेसमधून नष्ट केले जातात. तुम्ही खालील बटणाने मॅन्युअली देखील हटवू शकता.'
                : 'Audit logs older than 45 days (1.5 months) are automatically deleted by the server to keep database execution lightweight and secure.'}
            </p>
          </div>
        </div>
      </div>

      {/* Search, Filter & Bulk Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={language === 'mr' ? 'अ‍ॅक्शन, युजर किंवा तपशीलाने शोधा...' : 'Search by action, actor, or log details...'}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Action Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedAction}
              onChange={e => setSelectedAction(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">{language === 'mr' ? 'सर्व अ‍ॅक्शन्स (All Actions)' : 'All Action Types'}</option>
              {actionTypes.map(act => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>

          {/* Bulk Action Controls */}
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
                <span>{language === 'mr' ? 'निवडलेले हटवा' : 'Delete Selected'}</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleDeleteOlderThan2Months}
              disabled={actionLoading}
              className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
            >
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === 'mr' ? '२ महिन्यांपेक्षा जुने हटवा (> 60 Days)' : 'Delete > 2 Months'}</span>
            </button>

            <button
              onClick={() => {
                setSelectedIds([]);
                setBulkDeleteConfirm(true);
              }}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>{language === 'mr' ? 'सर्व लॉग्स साफ करा' : 'Clear All Logs'}</span>
            </button>
          </div>
        </div>

        {/* Select All Row */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-500">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 font-bold text-indigo-600 hover:underline cursor-pointer"
          >
            {selectedIds.length > 0 && selectedIds.length === filteredLogs.length ? (
              <CheckSquare className="w-4 h-4 text-indigo-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>{selectedIds.length === filteredLogs.length ? 'Deselect All' : `Select All (${filteredLogs.length})`}</span>
          </button>

          <span>
            {language === 'mr'
              ? `एकूण ${filteredLogs.length} लॉग्स दर्शवले आहेत`
              : `Showing ${filteredLogs.length} audit logs`}
          </span>
        </div>
      </div>

      {/* Logs Table / Stream */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-600">ऑडिट लॉग्स लोड होत आहेत...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
          <ShieldAlert className="w-12 h-12 mx-auto mb-2 opacity-50 text-indigo-400" />
          <p className="text-sm font-bold text-slate-700">कोणतेही ऑडिट लॉग्स आढळले नाहीत (No Logs Found)</p>
          <p className="text-xs text-slate-500 mt-1">नवीन अ‍ॅक्टिव्हिटी घडल्यास येथे नोंदी दिसतील.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100 max-h-[700px] overflow-y-auto">
            {filteredLogs.map(log => {
              const isSelected = selectedIds.includes(log.id);
              return (
                <div
                  key={log.id}
                  className={`p-4 flex items-start gap-3 transition-colors text-xs ${
                    isSelected ? 'bg-indigo-50/40' : 'hover:bg-slate-50'
                  }`}
                >
                  <button
                    onClick={() => toggleSelect(log.id)}
                    className="mt-0.5 cursor-pointer text-slate-400 hover:text-indigo-600"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldAlert className="w-4 h-4" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono">
                          {log.action}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {log.id}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-slate-700 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {log.details}
                    </p>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>
                        Actor: <strong>{log.actor_name}</strong> ({log.actor_role})
                      </span>
                      <span>
                        Entity: <strong>{log.entity}</strong> #{log.entity_id}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setDeleteTarget(log)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer shrink-0"
                    title="Delete Log Entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
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
                {language === 'mr' ? 'ही लॉग एंट्री हटवायची का?' : 'Delete This Audit Log Entry?'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'mr'
                  ? 'ही नोंद डेटाबेसमधून पूर्णपणे नष्ट केली जाईल.'
                  : 'This audit trail item will be permanently erased.'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-mono space-y-1">
              <p className="font-bold">{deleteTarget.action}</p>
              <p className="text-[11px] text-slate-500">{deleteTarget.details}</p>
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
                <span>{actionLoading ? 'हटवत आहे...' : (language === 'mr' ? 'होय, हटवा' : 'Yes, Delete')}</span>
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
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">
                {selectedIds.length > 0
                  ? (language === 'mr' ? `निवडलेले ${selectedIds.length} लॉग्स हटवायचे का?` : `Delete ${selectedIds.length} Selected Logs?`)
                  : (language === 'mr' ? 'सर्व ऑडिट लॉग्स साफ करायचे का?' : 'Clear All Audit Security Logs?')}
              </h3>
              <p className="text-xs text-slate-500">
                {selectedIds.length > 0
                  ? (language === 'mr' ? 'निवडलेल्या सर्व नोंदी डेटाबेसमधून कायमच्या हटवल्या जातील.' : 'All selected audit entries will be permanently deleted.')
                  : (language === 'mr' ? 'सर्व नोंदी डेटाबेसमधून हटवल्या जातील. ही कृती पूर्ववत करता येणार नाही.' : 'All log entries will be wiped. This action cannot be undone.')}
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
                <span>
                  {actionLoading
                    ? 'हटवत आहे...'
                    : (selectedIds.length > 0
                        ? (language === 'mr' ? `होय, ${selectedIds.length} हटवा` : `Delete ${selectedIds.length} Items`)
                        : (language === 'mr' ? 'होय, सर्व साफ करा' : 'Yes, Clear All'))}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
