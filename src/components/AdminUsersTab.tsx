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
  MapPin
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

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.getUserStats();
      setStats(res);
    } catch (err: any) {
      showToast(err.message || 'सदस्यांची माहिती लोड करता आली नाही', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

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
    if (!window.confirm('या सदस्याची PRO सदस्यता रद्द करायची आहे का?')) return;
    try {
      setProcessingId(userId);
      await api.revokeUserPro(userId);
      showToast('PRO सदस्यता यशस्वीपणे रद्द केली', 'info');
      loadUsers();
    } catch (err: any) {
      showToast(err.message || 'रद्द अयशस्वी', 'error');
    } finally {
      setProcessingId(null);
    }
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5">सदस्याचे नाव व संपर्काची माहिती</th>
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
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span>सदस्यांची माहिती लोड होत आहे...</span>
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  कोणताही सदस्य सापडला नाही.
                </td>
              </tr>
            ) : (
              filteredUsers.map(u => {
                const isPro = u.isPremium;
                const daysRem = u.daysRemaining ?? 0;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="p-3.5">
                      <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        {u.name}
                        {isPro && <Crown className="w-3.5 h-3.5 text-amber-500 inline fill-amber-400" />}
                      </div>
                      <div className="text-slate-500 text-[11px] font-mono flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-0.5"><Mail className="w-3 h-3" />{u.email}</span>
                        {u.mobile && <span className="flex items-center gap-0.5"><Phone className="w-3 h-3" />{u.mobile}</span>}
                        {u.district && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{u.district}</span>}
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
    </div>
  );
};
