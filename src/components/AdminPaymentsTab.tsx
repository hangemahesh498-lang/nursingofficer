import React, { useState } from 'react';
import { PaymentRecord, PaymentPlan } from '../types';
import { api } from '../lib/api';
import {
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  User,
  Calendar
} from 'lucide-react';

interface AdminPaymentsTabProps {
  payments: PaymentRecord[];
  plans: PaymentPlan[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminPaymentsTab: React.FC<AdminPaymentsTabProps> = ({
  payments,
  plans,
  onRefresh,
  showToast
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredPayments = payments.filter(p => {
    const statusMatch = filterStatus === 'all' || p.status === filterStatus;
    const searchMatch =
      p.utr_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.plan_name.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  const handleVerify = async (paymentId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      setProcessingId(paymentId);
      await api.verifyPayment(paymentId, action);
      showToast(
        `Payment ${action === 'APPROVE' ? 'APPROVED & PRO Activated for user' : 'REJECTED'} successfully`,
        action === 'APPROVE' ? 'success' : 'info'
      );
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Verification failed', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = payments.filter(p => p.status === 'PENDING').length;
  const totalRevenue = payments
    .filter(p => p.status === 'APPROVED')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Pending Manual UTRs</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{pendingCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Awaiting manual bank / UPI settlement check</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Total Verified Revenue</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">₹{totalRevenue.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">From approved PRO subscriptions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Active Plans Configured</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{plans.length}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">30-day, 6-month, and 1-year plans</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search UTR, student name, email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending (Action Required)</option>
            <option value="APPROVED">Approved (PRO Active)</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Payment Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Student / Aspirant</th>
              <th className="p-3.5">Plan Selected</th>
              <th className="p-3.5">Amount</th>
              <th className="p-3.5">UTR / Txn ID</th>
              <th className="p-3.5">Submitted At</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Verification Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  No payment verification submissions found.
                </td>
              </tr>
            ) : (
              filteredPayments.map(p => {
                const isPending = p.status === 'PENDING';
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{p.user_name}</div>
                      <div className="text-slate-500 text-[11px] font-mono">{p.user_email}</div>
                    </td>
                    <td className="p-3.5 font-medium text-slate-800">{p.plan_name}</td>
                    <td className="p-3.5 font-bold text-teal-800">₹{p.amount}</td>
                    <td className="p-3.5 font-mono text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-200 w-max">
                      {p.utr_number}
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {new Date(p.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : p.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {isPending ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            disabled={processingId === p.id}
                            onClick={() => handleVerify(p.id, 'APPROVE')}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve PRO</span>
                          </button>
                          <button
                            disabled={processingId === p.id}
                            onClick={() => handleVerify(p.id, 'REJECT')}
                            className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1 cursor-pointer border border-rose-200 disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          {p.verified_at ? `Verified on ${new Date(p.verified_at).toLocaleDateString()}` : 'Completed'}
                        </span>
                      )}
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
