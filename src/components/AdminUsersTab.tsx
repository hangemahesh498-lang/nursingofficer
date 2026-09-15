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
  Sparkles
} from 'lucide-react';

interface AdminUsersTabProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({ showToast }) => {
  const [loading, setLoading] = useState(false);
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
  const [filterPlanType, setFilterPlanType] = useState('all'); // all, test_series, mcq_plan, full_pro
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [referrals, setReferrals] = useState<any[]>([]);

  // Password Reset Modal State
  const [passwordResetUser, setPasswordResetUser] = useState<UserProfile | null>(null);
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);

  // Direct PRO Grant Modal State
  const [showDirectGrantModal, setShowDirectGrantModal] = useState(false);
  const [grantSearch, setGrantSearch] = useState('');
  const [selectedStudentForGrant, setSelectedStudentForGrant] = useState<UserProfile | null>(null);
  const [grantDays, setGrantDays] = useState(90);
  const [grantPlanName, setGrantPlanName] = useState('PRO Master Access (Direct Grant)');
  const [grantingDirect, setGrantingDirect] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.getUserStats();
      setStats(res);
      setSelectedIds([]);
      try { setReferrals(await api.getReferralLeaderboard()); } catch { setReferrals([]); }
    } catch (err: any) {
      showToast(err.message || 'सदस्यांची माहिती लोड करता आली नाही', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleSelected = (id:string) => setSelectedIds(v => v.includes(id) ? v.filter(x=>x!==id) : [...v,id]);
  const selectAllVisible = (rows:UserProfile[]) => setSelectedIds(selectedIds.length === rows.length ? [] : rows.map(u=>u.id));
  const handleBulkDelete = async () => { if(!selectedIds.length) return; try { const r=await api.deleteUsers(selectedIds, deletePassword); showToast(`${r.deleted} विद्यार्थी delete झाले.`, 'success'); setShowDeleteModal(false); setDeletePassword(''); loadUsers(); } catch(e:any){ showToast(e.message || 'Delete failed','error'); } };

  const handleGrantPro = async (userId: string, days: number = 30) => {
    try {
      setProcessingId(userId);
      await api.grantUserPro(userId, days, `Admin ${days}-Day Grant`);
      showToast(`सदस्याला ${days} दिवसांसाठी PRO सुविधी दिलेली आहे!`, 'success');
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
      showToast(`डिव्हाइस लॉक यशस्वीपणे रीसेट केले: ${u.name}`, 'success');
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
      await api.grantUserPro(selectedStudentForGrant.id, grantDays, grantPlanName);
      showToast(`यशस्वी! ${selectedStudentForGrant.name} यांना ${grantDays} दिवसांचा प्रो ॲक्सेस दिला आहे.`, 'success');
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

  const handleDownloadPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const html = `
      <html>
        <head>
          <title>Nursing Officer App - Registered Students Directory</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #1e293b; }
            h1 { font-size: 20px; margin-bottom: 4px; }
            p { font-size: 12px; color: #64748b; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
            th { background: #f1f5f9; font-weight: bold; }
            .badge-pro { color: #047857; font-weight: bold; }
            .badge-free { color: #64748b; }
          </style>
        </head>
        <body>
          <h1>Nursing Officer App - Registered Students & Subscribers Directory</h1>
          <p>Generated on: ${new Date().toLocaleString()} | Total Students: ${stats.users.length}</p>
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" checked={filteredUsers.length>0 && selectedIds.length===filteredUsers.length} onChange={() => selectAllVisible(filteredUsers)} /></th><th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile Number</th>
                <th>District</th>
                <th>Full Address</th>
                <th>Role</th>
                <th>Status</th>
                <th>Plan Details</th>
              </tr>
            </thead>
            <tbody>
              ${stats.users.map((u, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td><b>${u.name}</b></td>
                  <td>${u.email}</td>
                  <td>${u.mobile || '-'}</td>
                  <td>${u.district || '-'}</td>
                  <td>${u.fullAddress || '-'}</td>
                  <td>${u.role}</td>
                  <td>${u.isPremium ? '<span class="badge-pro">PRO ACTIVE</span>' : '<span class="badge-free">FREE TIER</span>'}</td>
                  <td>${u.planName || (u.isPremium ? 'PRO Plan' : 'Free')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const filteredUsers = stats.users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.mobile && u.mobile.includes(searchQuery)) ||
      (u.district && u.district.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesPro =
      filterPro === 'all' ||
      (filterPro === 'pro' && u.isPremium) ||
      (filterPro === 'free' && !u.isPremium);

    let matchesPlan = true;
    if (filterPlanType === 'test_series') {
      matchesPlan = u.isPremium && (u.planType === 'test_series' || u.planName?.toLowerCase().includes('test'));
    } else if (filterPlanType === 'mcq_plan') {
      matchesPlan = u.isPremium && (u.planType === 'mcq_plan' || u.planName?.toLowerCase().includes('mcq'));
    } else if (filterPlanType === 'full_pro') {
      matchesPlan = u.isPremium && (!u.planType || u.planType === 'full_pro' || u.planName?.toLowerCase().includes('full'));
    }

    return matchesSearch && matchesRole && matchesPro && matchesPlan;
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-950 to-slate-900 text-white p-5 rounded-3xl shadow-lg"><div className="flex items-center justify-between mb-3"><div><h3 className="font-black text-base">Referral Leaderboard</h3><p className="text-xs text-slate-300">जास्त referral करणारे विद्यार्थी, rank आणि join झालेले members.</p></div><span className="text-xs bg-white/10 px-3 py-1 rounded-full">{referrals.length} referrers</span></div><div className="grid grid-cols-1 md:grid-cols-3 gap-2">{referrals.slice(0,3).map((r:any)=><div key={r.user.id} className="bg-white/10 rounded-2xl p-3"><div className="text-xs text-indigo-200">#{r.rank}</div><div className="font-bold text-sm">{r.user.name}</div><div className="text-xs text-slate-300">{r.referralCount} referrals</div></div>)}</div></div>
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">एकूण नोंदणीकृत सदस्य</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{stats.totalUsers}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Total registered nursing aspirants</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">सक्रिय PRO सदस्य</span>
            <Crown className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{stats.proUsers}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Active paid subscribers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">फ्री वापरकर्ते</span>
            <UserX className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-700 mt-2">{stats.freeUsers}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Free tier users</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">मुदत संपलेले सदस्य</span>
            <Clock className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">{stats.expiredUsers}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Expired subscription plans</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="नाव, ईमेल, मोबाईल किंवा जिल्हा शोधा..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={filterPlanType}
            onChange={e => setFilterPlanType(e.target.value)}
            className="px-3 py-2 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-bold focus:outline-hidden"
          >
            <option value="all">सर्व प्लॅन्स (All Plans)</option>
            <option value="test_series">📊 टेस्ट सिरीज विद्यार्थी (Test Series Students)</option>
            <option value="mcq_plan">📚 MCQ प्लॅन विद्यार्थी (MCQ Practice Students)</option>
            <option value="full_pro">👑 संपूर्ण PRO ॲक्सेस (Full Access)</option>
          </select>

          <select
            value={filterPro}
            onChange={e => setFilterPro(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden"
          >
            <option value="all">सर्व सदस्य (All)</option>
            <option value="pro">फक्त PRO सदस्य</option>
            <option value="free">फक्त फ्री वापरकर्ते</option>
          </select>

          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden"
          >
            <option value="all">सर्व रोल (All Roles)</option>
            <option value="student">विद्यार्थी (Student)</option>
            <option value="admin">ॲडमिन (Admin)</option>
            <option value="super_admin">सुपर ॲडमिन (Super Admin)</option>
          </select>

          <button
            onClick={() => setShowDirectGrantModal(true)}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
            title="Grant PRO Access Directly via Email/Mobile"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>⚡ त्वरित ॲक्सेस द्या</span>
          </button>

          <button onClick={() => setShowDeleteModal(true)} disabled={!selectedIds.length} className="px-3 py-2 bg-rose-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"><Trash2 className="w-4 h-4"/> Bulk Delete ({selectedIds.length})</button>

          <button
            onClick={handleDownloadPdf}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
            title="Download Registered Students PDF Report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF रिपोर्ट</span>
          </button>
        </div>
      </div>

      {/* Razorpay Key Security & Setup Box */}
      <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span>रेझरपे (Razorpay) पेमेंट की सुरक्षा व सेटअप मार्गदर्शक (Razorpay API Key Guide)</span>
          </h3>
          <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-mono">
            SECURE SERVER PROXY ACTIVE
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          रेझरपे चा <strong>Razorpay Key ID</strong> व <strong>Razorpay Key Secret</strong> क्लायंट (ब्राउझर) मध्ये कधीही थेट ठेवू नका.
          सुरक्षिततेसाठी सर्व पेमेंट ऑर्डर्स आणि वेबहूक व्हेरिफिकेशन्स सर्व्हर साईडवरून (<code className="text-emerald-400 font-mono">/api/payment</code>) चालतात.
          तुम्ही तुमची Key <code className="text-indigo-300 font-mono">RAZORPAY_KEY_ID</code> आणि <code className="text-indigo-300 font-mono">RAZORPAY_KEY_SECRET</code> ही सर्व्हर <code className="text-indigo-300 font-mono">.env</code> फाईल किंवा AI Studio सिएक्रेट मॅनेजरमध्ये कॉन्फिगर करा.
        </p>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto w-full">
        <table className="w-full text-left text-xs min-w-[800px]">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5 w-10"><input type="checkbox" checked={filteredUsers.length>0 && selectedIds.length===filteredUsers.length} onChange={()=>selectAllVisible(filteredUsers)} /></th><th className="p-3.5">सदस्याचे नाव व संपर्काची माहिती</th>
              <th className="p-3.5">रोल (Role)</th>
              <th className="p-3.5">सदस्यता प्रकार (Status)</th>
              <th className="p-3.5">शिल्लक दिवस (Days Remaining)</th>
              <th className="p-3.5">मुदत तारीख (Plan Expiry)</th>
              <th className="p-3.5 text-right">ॲडमिन ॲक्शन (PRO Control)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span>सदस्यांची माहिती लोड होत आहे...</span>
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  कोणताही सदस्य सापडला नाही.
                </td>
              </tr>
            ) : (
              filteredUsers.map(u => {
                const isPro = u.isPremium;
                const daysRem = u.daysRemaining ?? 0;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="p-3.5"><input type="checkbox" checked={selectedIds.includes(u.id)} onChange={()=>toggleSelected(u.id)} /></td>
                    <td className="p-3.5">
                      <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        {u.name}
                        {isPro && <Crown className="w-3.5 h-3.5 text-amber-500 inline fill-amber-400" />}
                      </div>
                      <div className="text-slate-500 text-[11px] font-mono flex items-center flex-wrap gap-2 mt-0.5">
                        <span className="flex items-center gap-0.5"><Mail className="w-3 h-3" />{u.email}</span>
                        {u.mobile && <span className="flex items-center gap-0.5"><Phone className="w-3 h-3" />{u.mobile}</span>}
                        {u.district && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{u.district}</span>}
                      </div>
                      {u.fullAddress && (
                        <div className="text-slate-600 text-[11px] mt-1 flex items-center gap-1">
                          <span className="font-semibold text-slate-700">पत्ता:</span> {u.fullAddress}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {u.hasMcqAccess && <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px] font-bold">MCQ</span>}
                        {u.hasTestSeriesAccess && <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[9px] font-bold">TEST SERIES</span>}
                        {u.hasYoutubeAccess && <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-700 text-[9px] font-bold">YOUTUBE</span>}
                        {u.referralCode && <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[9px] font-bold">REF: {u.referralCode}</span>}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="capitalize px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium text-[11px]">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-3.5">
                      {isPro ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                          <Crown className="w-3 h-3 text-amber-500" />
                          <span>PRO ACTIVE</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          FREE TIER
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 font-bold">
                      {isPro ? (
                        <span className={`text-sm ${daysRem <= 7 ? 'text-amber-600 font-extrabold' : 'text-emerald-600'}`}>
                          {daysRem} दिवस शिल्लक
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">0 दिवस</span>
                      )}
                    </td>

                    <td className="p-3.5 text-slate-600 font-medium">
                      {u.planEndDate ? new Date(u.planEndDate).toLocaleDateString('mr-IN') : '-'}
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          disabled={processingId === u.id}
                          onClick={() => setPasswordResetUser(u)}
                          className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg border border-amber-200 text-[11px] font-bold cursor-pointer"
                          title="पासवर्ड बदला (Reset Password)"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={processingId === u.id}
                          onClick={() => handleResetDevice(u)}
                          className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-200 text-[11px] font-bold cursor-pointer"
                          title="डिव्हाइस बंधन रीसेट करा (Reset Device Lock)"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                        </button>

                        {!isPro ? (
                          <>
                            <button
                              disabled={processingId === u.id}
                              onClick={() => handleGrantPro(u.id, 30)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer"
                              title="३० दिवस प्रो द्या"
                            >
                              +30 दिवस PRO
                            </button>
                            <button
                              disabled={processingId === u.id}
                              onClick={() => handleGrantPro(u.id, 180)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] cursor-pointer"
                              title="६ महिने प्रो द्या"
                            >
                              +6 महिने PRO
                            </button>
                          </>
                        ) : (
                          <button
                            disabled={processingId === u.id}
                            onClick={() => handleRevokePro(u.id)}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] border border-rose-200 cursor-pointer"
                          >
                            PRO रद्द करा
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Password Reset Modal */}
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
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPasswordResetUser(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                रद्द करा
              </button>
              <button
                disabled={resettingPassword}
                onClick={handleExecutePasswordReset}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {resettingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>पासवर्ड अपडेट करा</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct PRO Grant Modal */}
      {showDirectGrantModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>विद्यार्थ्याला त्वरित PRO ॲक्सेस द्या (Direct Grant)</span>
              </h3>
              <button
                onClick={() => setShowDirectGrantModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDirectGrantSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">विद्यार्थी शोधा (Search Student by Name / Email / Mobile)</label>
                <input
                  type="text"
                  value={grantSearch}
                  onChange={e => setGrantSearch(e.target.value)}
                  placeholder="नाव किंवा मोबाईल नंबर टाईप करा..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600"
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
                            ? 'bg-emerald-600 text-white font-bold'
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
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-bold">
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
                    <option value={30}>३० दिवस (1 Month)</option>
                    <option value={90}>९० दिवस (3 Months)</option>
                    <option value={180}>१८० दिवस (6 Months)</option>
                    <option value={365}>३६५ दिवस (1 Year Full Access)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">प्लॅनचे नाव (Plan Title)</label>
                  <input
                    type="text"
                    value={grantPlanName}
                    onChange={e => setGrantPlanName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
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
                  <span>⚡ त्वरित ॲक्सेस मंजूर करा</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && <div className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"><div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"><h3 className="font-black text-lg text-rose-700">Protected Student Deletion</h3><p className="text-xs text-slate-600 mt-2">{selectedIds.length} विद्यार्थ्यांचे accounts कायमचे delete होतील. Admin deletion password आवश्यक आहे.</p><input type="password" inputMode="numeric" maxLength={6} value={deletePassword} onChange={e=>setDeletePassword(e.target.value.replace(/\D/g,''))} placeholder="6-digit deletion password" className="w-full mt-4 p-3 border rounded-xl"/><div className="flex justify-end gap-2 mt-4"><button onClick={()=>setShowDeleteModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold">Cancel</button><button onClick={handleBulkDelete} disabled={deletePassword.length!==6} className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold disabled:opacity-40">Delete Permanently</button></div></div></div>}
    </div>
  );
};
