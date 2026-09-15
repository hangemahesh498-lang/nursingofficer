import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { api } from '../lib/api';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Award,
  Calendar,
  ShieldAlert,
  Crown,
  UserCheck,
  UserX,
  Loader2,
  Clock,
  Phone,
  Mail,
  MapPin,
  Download,
  Key,
  Lock,
  Unlock,
  Sparkles,
  Trash2,
  Gift,
  Share2,
  Check,
  Building,
  Home,
  BookOpen,
  FileText,
  Video,
  Edit2,
  Eye,
  Shield,
  AlertTriangle
} from 'lucide-react';

interface AdminUsersTabProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({ showToast }) => {
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'students' | 'referrals' | 'promo'>('students');
  const [stats, setStats] = useState<{
    totalUsers: number;
    proUsers: number;
    freeUsers: number;
    expiredUsers: number;
    users: UserProfile[];
  }>({
    totalUsers: 0,
    proUsers: 0,
    freeUsers: 0,
    expiredUsers: 0,
    users: []
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterPro, setFilterPro] = useState('all');
  const [filterPlanType, setFilterPlanType] = useState('all'); // all, test_series, mcq_plan, youtube_plan, combo
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'expiry' | 'referrals'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [singleDeleteUser, setSingleDeleteUser] = useState<UserProfile | null>(null);
  const [referrals, setReferrals] = useState<any[]>([]);

  // Student Details & Edit Modal State
  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<UserProfile>>({});
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Password Reset Modal State
  const [passwordResetUser, setPasswordResetUser] = useState<UserProfile | null>(null);
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);

  // Direct PRO & Promotional Grant Modal State
  const [showDirectGrantModal, setShowDirectGrantModal] = useState(false);
  const [grantSearch, setGrantSearch] = useState('');
  const [selectedStudentForGrant, setSelectedStudentForGrant] = useState<UserProfile | null>(null);
  const [grantDays, setGrantDays] = useState(30);
  const [grantProductScope, setGrantProductScope] = useState<'all' | 'mcq' | 'test_series' | 'youtube'>('all');
  const [grantReason, setGrantReason] = useState('Promotional Free Access');
  const [grantingDirect, setGrantingDirect] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.getUserStats();
      setStats(res);
      setSelectedIds([]);
      try {
        const refLeaderboard = await api.getReferralLeaderboard();
        setReferrals(refLeaderboard || []);
      } catch {
        setReferrals([]);
      }
    } catch (err: any) {
      showToast(err.message || 'सदस्यांची माहिती लोड करता आली नाही', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleSelected = (id: string) => {
    setSelectedIds(v => v.includes(id) ? v.filter(x => x !== id) : [...v, id]);
  };

  const selectAllVisible = (rows: UserProfile[]) => {
    const validRows = (rows || []).filter(u => Boolean(u && u.id));
    if (selectedIds.length === validRows.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(validRows.map(u => u.id));
    }
  };

  const handleDeleteConfirmed = async () => {
    const idsToDelete = singleDeleteUser ? [singleDeleteUser.id] : selectedIds;
    if (!idsToDelete.length) return;

    try {
      const res = await api.deleteUsers(idsToDelete, deletePassword);
      showToast(`${res.deleted} विद्यार्थी सुरक्षितरित्या कायमचे हटवण्यात आले.`, 'success');
      setShowDeleteModal(false);
      setSingleDeleteUser(null);
      setDeletePassword('');
      loadUsers();
    } catch (e: any) {
      showToast(e.message || 'हटवणे अयशस्वी झाले (Admin secret required)', 'error');
    }
  };

  const handleGrantPro = async (userId: string, days: number = 30, scope: string = 'COMBO', reason: string = 'Admin Promo Grant') => {
    try {
      setProcessingId(userId);
      const mappedScope: 'PRO_MCQ' | 'TEST_SERIES' | 'YOUTUBE' | 'COMBO' =
        scope === 'mcq' || scope === 'PRO_MCQ'
          ? 'PRO_MCQ'
          : scope === 'test_series' || scope === 'TEST_SERIES'
          ? 'TEST_SERIES'
          : scope === 'youtube' || scope === 'YOUTUBE'
          ? 'YOUTUBE'
          : 'COMBO';
      await api.grantUserPro(userId, days, 'Admin Quick Grant', mappedScope, reason);
      showToast(`सदस्याला ${days} दिवसांसाठी PRO ॲक्सेस मंजूर केला!`, 'success');
      loadUsers();
    } catch (err: any) {
      showToast(err.message || 'प्रो ग्रँट अयशस्वी', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRevokePro = async (userId: string) => {
    try {
      setProcessingId(userId);
      await api.revokeUserPro(userId);
      showToast('PRO सदस्यता यशस्वीपणे रद्द केली', 'success');
      loadUsers();
    } catch (err: any) {
      showToast(err.message || 'रद्द अयशस्वी', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleResetDevice = async (u: UserProfile) => {
    try {
      setProcessingId(u.id);
      await api.resetUserDevice(u.id);
      showToast(`डिव्हाइस बंधन रीसेट केले: ${u.name}`, 'success');
      loadUsers();
    } catch (err: any) {
      showToast(err.message || 'डिव्हाइस रीसेट अयशस्वी', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleExecutePasswordReset = async () => {
    if (!passwordResetUser || !newPasswordVal) return;
    if (newPasswordVal.length < 4) {
      showToast('पासवर्ड किमान ४ अक्षरांचा असणे आवश्यक आहे', 'error');
      return;
    }
    setResettingPassword(true);
    try {
      await api.adminResetPassword(passwordResetUser.id, newPasswordVal);
      showToast(`यशस्वी! ${passwordResetUser.name} यांचा पासवर्ड बदलला आहे.`, 'success');
      setPasswordResetUser(null);
      setNewPasswordVal('');
    } catch (err: any) {
      showToast(err.message || 'पासवर्ड बदलणे अयशस्वी', 'error');
    } finally {
      setResettingPassword(false);
    }
  };

  const handleDirectGrantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForGrant) {
      showToast('कृपया विद्यार्थी निवडा', 'error');
      return;
    }
    setGrantingDirect(true);
    try {
      const mappedScope = grantProductScope === 'all' ? 'COMBO' : grantProductScope === 'mcq' ? 'PRO_MCQ' : grantProductScope === 'test_series' ? 'TEST_SERIES' : 'YOUTUBE';
      const planName = grantProductScope === 'all' ? 'Combo All-Access Promo' : grantProductScope === 'mcq' ? 'MCQ Practice Promo' : grantProductScope === 'test_series' ? 'Test Series Promo' : 'Video Lectures Promo';
      await api.grantUserPro(selectedStudentForGrant.id, grantDays, planName, mappedScope, grantReason);
      showToast(`यशस्वी! ${selectedStudentForGrant.name} यांना ${grantDays} दिवसांचा मोफत प्रो ॲक्सेस दिला आहे.`, 'success');
      setShowDirectGrantModal(false);
      setSelectedStudentForGrant(null);
      setGrantSearch('');
      loadUsers();
    } catch (err: any) {
      showToast(err.message || 'डायरेक्ट ॲक्सेस देणे अयशस्वी', 'error');
    } finally {
      setGrantingDirect(false);
    }
  };

  const handleSaveStudentEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSavingEdit(true);
    try {
      await api.adminUpdateUser(editingUser.id, editFormData);
      showToast(`विद्यार्थी माहिती अपडेट झाली: ${editingUser.name}`, 'success');
      setEditingUser(null);
      loadUsers();
    } catch (err: any) {
      showToast(err.message || 'माहिती अद्ययावत करणे अयशस्वी', 'error');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDownloadPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const html = `
      <html>
        <head>
          <title>Nursing Officer App - Registered Students Directory</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #1e293b; }
            h1 { font-size: 18px; margin-bottom: 4px; color: #0f172a; }
            p { font-size: 11px; color: #64748b; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; font-size: 10px; }
            th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
            th { background: #f8fafc; font-weight: bold; }
            .badge-pro { color: #047857; font-weight: bold; background: #d1fae5; padding: 2px 6px; border-radius: 4px; }
            .badge-free { color: #64748b; }
          </style>
        </head>
        <body>
          <h1>Nursing Officer App - Registered Students Master Directory</h1>
          <p>Generated: ${new Date().toLocaleString()} | Total Active Records: ${stats.users.length}</p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>District</th>
                <th>Taluka</th>
                <th>Village/City</th>
                <th>PIN</th>
                <th>Address</th>
                <th>Reg Date</th>
                <th>Plan Status</th>
                <th>Expiry</th>
                <th>Referral Code</th>
              </tr>
            </thead>
            <tbody>
              ${stats.users.map((u, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td><b>${u.name}</b></td>
                  <td>${u.mobile || u.phone || '-'}</td>
                  <td>${u.email}</td>
                  <td>${u.district || '-'}</td>
                  <td>${u.taluka || '-'}</td>
                  <td>${u.village_city || '-'}</td>
                  <td>${u.pincode || '-'}</td>
                  <td>${u.fullAddress || u.address || '-'}</td>
                  <td>${u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB') : '-'}</td>
                  <td>${u.isPremium ? '<span class="badge-pro">PRO ACTIVE</span>' : '<span class="badge-free">FREE</span>'}</td>
                  <td>${u.planEndDate ? new Date(u.planEndDate).toLocaleDateString('en-GB') : '-'}</td>
                  <td>${u.referralCode || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Distinct districts list for filtering
  const allDistricts = Array.from(new Set(stats.users.map(u => u.district).filter(Boolean))).sort();

  // Filtered & Sorted list
  const filteredUsers = (stats?.users || []).filter(u => {
    if (!u || !u.id) return false;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (u.name || '').toLowerCase().includes(query) ||
      (u.email || '').toLowerCase().includes(query) ||
      (u.mobile && u.mobile.includes(query)) ||
      (u.phone && u.phone.includes(query)) ||
      (u.district && u.district.toLowerCase().includes(query)) ||
      (u.taluka && u.taluka.toLowerCase().includes(query)) ||
      (u.referralCode && u.referralCode.toLowerCase().includes(query));

    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesPro =
      filterPro === 'all' ||
      (filterPro === 'pro' && u.isPremium) ||
      (filterPro === 'free' && !u.isPremium);

    const matchesDistrict = filterDistrict === 'all' || u.district === filterDistrict;

    let matchesPlan = true;
    if (filterPlanType === 'test_series') {
      matchesPlan = Boolean(u.isPremium && (u.hasTestSeriesAccess || u.planType === 'test_series'));
    } else if (filterPlanType === 'mcq_plan') {
      matchesPlan = Boolean(u.isPremium && (u.hasMcqAccess || u.planType === 'mcq_plan'));
    } else if (filterPlanType === 'youtube_plan') {
      matchesPlan = Boolean(u.isPremium && (u.hasYoutubeAccess || u.planType === 'youtube_plan'));
    } else if (filterPlanType === 'combo') {
      matchesPlan = Boolean(u.isPremium && (u.hasMcqAccess && u.hasTestSeriesAccess));
    }

    return matchesSearch && matchesRole && matchesPro && matchesDistrict && matchesPlan;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    if (sortBy === 'date') {
      const d1 = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const d2 = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortOrder === 'asc' ? d1 - d2 : d2 - d1;
    }
    if (sortBy === 'expiry') {
      const d1 = a.planEndDate ? new Date(a.planEndDate).getTime() : 0;
      const d2 = b.planEndDate ? new Date(b.planEndDate).getTime() : 0;
      return sortOrder === 'asc' ? d1 - d2 : d2 - d1;
    }
    if (sortBy === 'referrals') {
      const r1 = a.referralCount || 0;
      const r2 = b.referralCount || 0;
      return sortOrder === 'asc' ? r1 - r2 : r2 - r1;
    }
    return 0;
  });

  return (
    <div className="space-y-5">
      {/* 1. Permanent Retention Guarantee Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-teal-300">
                कायमस्वरूपी विद्यार्थी डेटा सुरक्षा (Lifetime Student Retention Guarantee)
              </h3>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-bold">
                PROTECTED
              </span>
            </div>
            <p className="text-xs text-slate-300">
              नोंदणी केलेले विद्यार्थी आपोआप हटवले जात नाहीत. विद्यार्थ्यांचा संपूर्ण इतिहास व डेटा कायमस्वरूपी सुरक्षित ठेवला जातो.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDirectGrantModal(true)}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>⚡ मोफत प्रो ॲक्सेस द्या</span>
          </button>
        </div>
      </div>

      {/* 2. Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">एकूण विद्यार्थी</span>
            <Users className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{stats.totalUsers}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Total Registered Students</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">सक्रिय PRO विद्यार्थी</span>
            <Crown className="w-5 h-5 text-amber-500 fill-amber-400" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{stats.proUsers}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Active Paid & Promo PRO</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">फ्री वापरकर्ते</span>
            <UserX className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-700 mt-2">{stats.freeUsers}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Free Practice Mode</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">मुदत संपलेले सदस्य</span>
            <Clock className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">{stats.expiredUsers}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Plan Expired</p>
        </div>
      </div>

      {/* 3. Sub-Tab Switcher (Students Management / Referral Program / Promotional Grants) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('students')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'students'
              ? 'bg-teal-800 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>विद्यार्थी यादी व व्यवस्थापन ({filteredUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('referrals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'referrals'
              ? 'bg-indigo-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Gift className="w-4 h-4 text-amber-400" />
          <span>रेफरल लीडरबोर्ड व रिवॉर्ड्स ({referrals.length})</span>
        </button>
      </div>

      {/* SUB-TAB: REFERRALS DASHBOARD */}
      {activeSubTab === 'referrals' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white p-5 rounded-3xl shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-amber-300">
                  रेफरल प्रोग्रॅम आकडेवारी आणि लीडरबोर्ड (Referral Performance Dashboard)
                </h3>
                <p className="text-xs text-indigo-200">
                  विद्यार्थ्यांनी केलेले रेफरल्स, रँक आणि त्यांना मिळालेले मोफत प्रो रिवॉर्ड्स
                </p>
              </div>
              <span className="text-xs bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full font-bold border border-amber-400/30">
                {referrals.length} सक्रिय रेफरर्स
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {referrals.slice(0, 3).map((r: any, idx) => (
                <div key={r.user?.id || idx} className="bg-white/10 rounded-2xl p-3.5 border border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-300 font-extrabold"># रँक {r.rank || idx + 1}</span>
                    <span className="font-mono text-xs bg-black/40 px-2 py-0.5 rounded text-indigo-200">{r.user?.referralCode}</span>
                  </div>
                  <div className="font-extrabold text-sm mt-1">{r.user?.name || 'Student'}</div>
                  <div className="text-xs text-slate-300 mt-0.5">{r.user?.email}</div>
                  <div className="mt-2 text-xs font-bold text-emerald-400 flex items-center justify-between border-t border-white/10 pt-1.5">
                    <span>एकूण रेफरल्स:</span>
                    <span className="font-mono text-base">{r.referralCount || 0} विद्यार्थी</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">रँक</th>
                  <th className="p-3.5">विद्यार्थ्याचे नाव व संपर्क</th>
                  <th className="p-3.5">रेफरल कोड</th>
                  <th className="p-3.5">यशस्वी रेफरल्स</th>
                  <th className="p-3.5">सध्याचा स्टेटस</th>
                  <th className="p-3.5 text-right">ॲक्शन</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {referrals.map((r: any, i) => (
                  <tr key={r.user?.id || i} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-500">#{r.rank || i + 1}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{r.user?.name}</div>
                      <div className="text-[11px] text-slate-500">{r.user?.email} • {r.user?.mobile || '-'}</div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-indigo-800">{r.user?.referralCode || '-'}</td>
                    <td className="p-3.5 font-mono font-black text-emerald-700 text-sm">{r.referralCount || 0}</td>
                    <td className="p-3.5">
                      {r.user?.isPremium ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">PRO ACTIVE</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px]">FREE</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleGrantPro(r.user?.id, 30, 'all', 'Referral Milestone Reward')}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-lg font-bold text-[11px] border border-indigo-200 cursor-pointer"
                      >
                        +३० दिवस बक्षीस द्या
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB: STUDENTS LIST & MANAGEMENT */}
      {activeSubTab === 'students' && (
        <div className="space-y-4">
          {/* Search, Filter and Actions Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="नाव, ईमेल, मोबाईल, जिल्हा किंवा रेफरल कोड..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-600 outline-hidden font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* District Filter */}
              <select
                value={filterDistrict}
                onChange={e => setFilterDistrict(e.target.value)}
                className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden"
              >
                <option value="all">सर्व जिल्हे (All Districts)</option>
                {allDistricts.map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>

              {/* Plan Type Filter */}
              <select
                value={filterPlanType}
                onChange={e => setFilterPlanType(e.target.value)}
                className="px-2.5 py-2 bg-teal-50 text-teal-900 border border-teal-200 rounded-xl text-xs font-bold focus:outline-hidden"
              >
                <option value="all">सर्व प्रॉडक्ट्स (All Products)</option>
                <option value="mcq_plan">📚 MCQ प्लॅन (MCQ Practice)</option>
                <option value="test_series">📊 टेस्ट सिरीज (Test Series)</option>
                <option value="youtube_plan">🎥 YouTube व्हिडिओ प्लॅन</option>
                <option value="combo">👑 कॉम्बो ऑल ॲक्सेस (Combo)</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterPro}
                onChange={e => setFilterPro(e.target.value)}
                className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden"
              >
                <option value="all">सर्व स्टेटस (All Status)</option>
                <option value="pro">PRO सक्रिय (Paid/Promo)</option>
                <option value="free">फ्री वापरकर्ते (Free)</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden"
              >
                <option value="date">नोंदणी तारीख (Reg Date)</option>
                <option value="name">नाव (Name A-Z)</option>
                <option value="expiry">मुदत तारीख (Expiry)</option>
                <option value="referrals">रेफरल संख्या (Referrals)</option>
              </select>

              {/* Bulk Delete Button */}
              <button
                onClick={() => {
                  setSingleDeleteUser(null);
                  setShowDeleteModal(true);
                }}
                disabled={!selectedIds.length}
                className="px-3 py-2 bg-rose-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>निवडलेले हटवा ({selectedIds.length})</span>
              </button>

              {/* PDF Download Button */}
              <button
                onClick={handleDownloadPdf}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
                title="Download Students Report"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF रिपोर्ट</span>
              </button>
            </div>
          </div>

          {/* Students Master Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto w-full">
            <table className="w-full text-left text-xs min-w-[950px]">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={filteredUsers.length > 0 && selectedIds.length === filteredUsers.length}
                      onChange={() => selectAllVisible(filteredUsers)}
                    />
                  </th>
                  <th className="p-3.5">विद्यार्थी नाव व फोटो</th>
                  <th className="p-3.5">मोबाईल व ईमेल</th>
                  <th className="p-3.5">जिल्हा, तालुका व पत्ता</th>
                  <th className="p-3.5">नोंदणी तारीख</th>
                  <th className="p-3.5">प्लॅन व प्रॉडक्ट अधिकार</th>
                  <th className="p-3.5">वैधता / मुदत</th>
                  <th className="p-3.5">रेफरल कोड</th>
                  <th className="p-3.5 text-right">ॲडमिन नियंत्रणे</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
                        <span>विद्यार्थ्यांची माहिती लोड होत आहे...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400">
                      कोणताही विद्यार्थी सापडला नाही.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(u => {
                    const isPro = u.isPremium;
                    const daysRem = u.daysRemaining ?? 0;
                    const avatarUrl = u.avatar || u.avatarUrl;

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80">
                        {/* Checkbox */}
                        <td className="p-3.5">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(u.id)}
                            onChange={() => toggleSelected(u.id)}
                          />
                        </td>

                        {/* Name & Photo */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-teal-100 border border-teal-200 overflow-hidden flex items-center justify-center font-bold text-teal-800 text-xs shrink-0">
                              {avatarUrl ? (
                                <img src={avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                              ) : (
                                u.name?.charAt(0).toUpperCase() || 'U'
                              )}
                            </div>
                            <div>
                              <div className="font-extrabold text-slate-900 flex items-center gap-1">
                                {u.name}
                                {isPro && <Crown className="w-3.5 h-3.5 text-amber-500 inline fill-amber-400" />}
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">ID: {u.id.slice(0, 10)}</span>
                            </div>
                          </div>
                        </td>

                        {/* Mobile & Email */}
                        <td className="p-3.5">
                          <div className="text-slate-800 font-mono text-[11px]">
                            {u.mobile || u.phone ? (
                              <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" />{u.mobile || u.phone}</span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </div>
                          <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{u.email}</span>
                          </div>
                        </td>

                        {/* District, Taluka & Address */}
                        <td className="p-3.5">
                          <div className="font-bold text-teal-900 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                            <span>{u.district || 'जिल्हा नाही'}</span>
                            {u.taluka && <span className="text-slate-500 font-normal">({u.taluka})</span>}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[180px]" title={u.fullAddress || u.address || ''}>
                            {u.village_city ? `${u.village_city} • ` : ''}
                            {u.pincode ? `PIN: ${u.pincode}` : ''}
                            {u.fullAddress ? ` • ${u.fullAddress}` : ''}
                          </div>
                        </td>

                        {/* Reg Date */}
                        <td className="p-3.5 text-slate-600 font-medium">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('mr-IN') : '-'}
                        </td>

                        {/* Plan & Product Entitlements */}
                        <td className="p-3.5">
                          <div>
                            {isPro ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                                <Crown className="w-3 h-3 text-amber-500" />
                                <span>PRO ACTIVE</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                FREE TIER
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {u.hasMcqAccess && <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 text-[9px] font-bold">MCQ</span>}
                            {u.hasTestSeriesAccess && <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 text-[9px] font-bold">TESTS</span>}
                            {u.hasYoutubeAccess && <span className="px-1.5 py-0.2 rounded bg-red-50 text-red-700 text-[9px] font-bold">VIDEO</span>}
                          </div>
                        </td>

                        {/* Expiry & Days */}
                        <td className="p-3.5">
                          {isPro ? (
                            <div>
                              <span className={`font-bold block ${daysRem <= 7 ? 'text-amber-600' : 'text-emerald-700'}`}>
                                {daysRem} दिवस शिल्लक
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {u.planEndDate ? new Date(u.planEndDate).toLocaleDateString('mr-IN') : '-'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">0 दिवस</span>
                          )}
                        </td>

                        {/* Referral Code & Count */}
                        <td className="p-3.5 font-mono">
                          <div className="font-bold text-indigo-700">{u.referralCode || '-'}</div>
                          <div className="text-[10px] text-slate-500">{u.referralCount || 0} रेफरल्स</div>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* View / Edit Modal */}
                            <button
                              onClick={() => {
                                setEditingUser(u);
                                setEditFormData({
                                  name: u.name,
                                  mobile: u.mobile || u.phone,
                                  district: u.district,
                                  taluka: u.taluka,
                                  village_city: u.village_city,
                                  pincode: u.pincode,
                                  fullAddress: u.fullAddress || u.address
                                });
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold cursor-pointer"
                              title="विद्यार्थी माहिती पहा / संपादित करा"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Reset Password */}
                            <button
                              disabled={processingId === u.id}
                              onClick={() => setPasswordResetUser(u)}
                              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg border border-amber-200 text-[11px] font-bold cursor-pointer"
                              title="पासवर्ड रीसेट करा"
                            >
                              <Key className="w-3.5 h-3.5" />
                            </button>

                            {/* Reset Device Lock */}
                            <button
                              disabled={processingId === u.id}
                              onClick={() => handleResetDevice(u)}
                              className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-200 text-[11px] font-bold cursor-pointer"
                              title="डिव्हाइस बंधन रीसेट करा"
                            >
                              <Unlock className="w-3.5 h-3.5" />
                            </button>

                            {/* Grant / Revoke Pro */}
                            {!isPro ? (
                              <button
                                disabled={processingId === u.id}
                                onClick={() => handleGrantPro(u.id, 30, 'all', 'Admin Quick Promo Grant')}
                                className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] cursor-pointer"
                                title="+३० दिवस प्रो द्या"
                              >
                                +३०d PRO
                              </button>
                            ) : (
                              <button
                                disabled={processingId === u.id}
                                onClick={() => handleRevokePro(u.id)}
                                className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] border border-rose-200 cursor-pointer"
                                title="PRO रद्द करा"
                              >
                                रद्द
                              </button>
                            )}

                            {/* Single Delete */}
                            <button
                              onClick={() => {
                                setSingleDeleteUser(u);
                                setShowDeleteModal(true);
                              }}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 cursor-pointer"
                              title="विद्यार्थी कायमचा हटवा (Admin Password required)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: EDIT STUDENT DETAILS */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-teal-600" />
                <span>विद्यार्थी तपशील संपादन (Edit Student)</span>
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudentEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">पूर्ण नाव</label>
                  <input
                    type="text"
                    value={editFormData.name || ''}
                    onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">मोबाईल नंबर</label>
                  <input
                    type="tel"
                    value={editFormData.mobile || ''}
                    onChange={e => setEditFormData({ ...editFormData, mobile: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">जिल्हा (District)</label>
                  <input
                    type="text"
                    value={editFormData.district || ''}
                    onChange={e => setEditFormData({ ...editFormData, district: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">तालुका (Taluka)</label>
                  <input
                    type="text"
                    value={editFormData.taluka || ''}
                    onChange={e => setEditFormData({ ...editFormData, taluka: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">गाव / शहर (Village/City)</label>
                  <input
                    type="text"
                    value={editFormData.village_city || ''}
                    onChange={e => setEditFormData({ ...editFormData, village_city: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">पिन कोड (PIN Code)</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={editFormData.pincode || ''}
                    onChange={e => setEditFormData({ ...editFormData, pincode: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">संपूर्ण पत्ता (Full Address)</label>
                <input
                  type="text"
                  value={editFormData.fullAddress || ''}
                  onChange={e => setEditFormData({ ...editFormData, fullAddress: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl flex items-center gap-1.5"
                >
                  {isSavingEdit && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>बदल जतन करा</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PASSWORD RESET */}
      {passwordResetUser && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-600" />
                <span>विद्यार्थ्याचा पासवर्ड बदला (Reset Password)</span>
              </h3>
              <button
                onClick={() => setPasswordResetUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 text-slate-700">
              <p><b>नाव:</b> {passwordResetUser.name}</p>
              <p><b>ईमेल:</b> {passwordResetUser.email}</p>
              {passwordResetUser.mobile && <p><b>मोबाईल:</b> {passwordResetUser.mobile}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">नवीन पासवर्ड (New Password)</label>
              <input
                type="text"
                value={newPasswordVal}
                onChange={e => setNewPasswordVal(e.target.value)}
                placeholder="किमान ४ अक्षरे टाका..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPasswordResetUser(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                रद्द करा
              </button>
              <button
                disabled={resettingPassword}
                onClick={handleExecutePasswordReset}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                {resettingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>पासवर्ड अपडेट करा</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: DIRECT & PROMOTIONAL PRO GRANT */}
      {showDirectGrantModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>मोफत प्रो / प्रमोशनल ॲक्सेस द्या (Promotional Grant)</span>
              </h3>
              <button
                onClick={() => setShowDirectGrantModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDirectGrantSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">विद्यार्थी शोधा (Search Student by Name / Mobile / Email)</label>
                <input
                  type="text"
                  value={grantSearch}
                  onChange={e => setGrantSearch(e.target.value)}
                  placeholder="विद्यार्थ्याचे नाव किंवा मोबाईल नंबर टाईप करा..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600"
                />
              </div>

              {grantSearch.trim() && (
                <div className="max-h-40 overflow-y-auto space-y-1 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  {stats.users
                    .filter(
                      u =>
                        u.name.toLowerCase().includes(grantSearch.toLowerCase()) ||
                        u.email.toLowerCase().includes(grantSearch.toLowerCase()) ||
                        (u.mobile && u.mobile.includes(grantSearch))
                    )
                    .map(u => (
                      <div
                        key={u.id}
                        onClick={() => setSelectedStudentForGrant(u)}
                        className={`p-2 rounded-xl cursor-pointer flex items-center justify-between text-xs ${
                          selectedStudentForGrant?.id === u.id
                            ? 'bg-teal-700 text-white font-bold'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                        }`}
                      >
                        <div>
                          <div><b>{u.name}</b> ({u.email})</div>
                          <div className="text-[10px] opacity-80">मोबाईल: {u.mobile || 'नाही'} | जिल्हा: {u.district || 'नाही'}</div>
                        </div>
                        {selectedStudentForGrant?.id === u.id && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                    ))}
                </div>
              )}

              {selectedStudentForGrant && (
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-950 font-bold">
                  निवडलेला विद्यार्थी: {selectedStudentForGrant.name} ({selectedStudentForGrant.email})
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">कालावधी (Validity Duration)</label>
                  <select
                    value={grantDays}
                    onChange={e => setGrantDays(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value={7}>७ दिवस (1 Week Demo)</option>
                    <option value={15}>१५ दिवस (2 Weeks)</option>
                    <option value={30}>३० दिवस (1 Month)</option>
                    <option value={90}>९० दिवस (3 Months)</option>
                    <option value={180}>१८० दिवस (6 Months)</option>
                    <option value={365}>३६५ दिवस (1 Year Full Access)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">प्रॉडक्ट स्कोप (Product Scope)</label>
                  <select
                    value={grantProductScope}
                    onChange={e => setGrantProductScope(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="all">👑 कॉम्बो ऑल-ॲक्सेस (All Products)</option>
                    <option value="mcq">📚 फक्त MCQ प्रॅक्टिस प्लॅन</option>
                    <option value="test_series">📊 फक्त टेस्ट सिरीज प्लॅन</option>
                    <option value="youtube">🎥 फक्त YouTube व्हिडिओ प्लॅन</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">प्रमोशनल कारण / नोंद (Reason / Note)</label>
                <input
                  type="text"
                  value={grantReason}
                  onChange={e => setGrantReason(e.target.value)}
                  placeholder="उदा. Referral Reward, Helpdesk Approval, Exam Demo"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDirectGrantModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={grantingDirect || !selectedStudentForGrant}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {grantingDirect && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>⚡ ॲक्सेस मंजूर करा</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: PROTECTED STUDENT DELETION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 border border-rose-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-rose-800">
                  {singleDeleteUser ? 'विद्यार्थी खाते कायमचे हटवा' : `निवडलेले ${selectedIds.length} विद्यार्थी हटवा`}
                </h3>
                <p className="text-xs text-slate-500">
                  Protected Administrative Deletion
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              सुरक्षिततेसाठी विद्यार्थ्यांचे रेकॉर्ड्स आपोआप कधीही हटवले जात नाहीत. हटवण्यासाठी अधिकृत <strong>Admin Deletion Credential</strong> आवश्यक आहे.
            </p>

            {singleDeleteUser && (
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-0.5 border border-slate-200">
                <p><b>नाव:</b> {singleDeleteUser.name}</p>
                <p><b>ईमेल:</b> {singleDeleteUser.email}</p>
                {singleDeleteUser.mobile && <p><b>मोबाईल:</b> {singleDeleteUser.mobile}</p>}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ६ अंकी ॲडमिन डिलीट सिक्रेट (6-Digit Admin Secret Pin):
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value.replace(/\D/g, ''))}
                placeholder="458498"
                className="w-full p-3 border border-slate-300 rounded-xl text-center tracking-widest text-lg font-mono focus:border-rose-600 outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSingleDeleteUser(null);
                  setDeletePassword('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                रद्द करा
              </button>
              <button
                onClick={handleDeleteConfirmed}
                disabled={deletePassword.length !== 6}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs disabled:opacity-40 shadow-xs"
              >
                कायमचे हटवा (Permanently Delete)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
