import React, { useState, useEffect } from 'react';
import { PaymentRecord, PaymentPlan, SystemSettings } from '../types';
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
  Calendar,
  Settings,
  CreditCard,
  QrCode,
  Save,
  Loader2,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Layers,
  Star
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

  // System Payment Settings state
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [razorpayEnabled, setRazorpayEnabled] = useState(false);
  const [manualQrEnabled, setManualQrEnabled] = useState(true);
  const [upiId, setUpiId] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [customQrUrl, setCustomQrUrl] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  // Plan Edit/Create modal state
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Partial<PaymentPlan> | null>(null);
  const [savingPlan, setSavingPlan] = useState(false);

  const handleOpenNewPlan = () => {
    setEditingPlan({
      name: 'Plan ' + (plans.length + 1) + ' - Nursing Pro',
      name_mr: 'प्लॅन ' + (plans.length + 1) + ' - नर्सिंग प्रो',
      price: 299,
      currency: 'INR',
      duration_days: 90,
      duration_label: '3 Months Access',
      duration_label_mr: '३ महिन्यांसाठी',
      is_active: true,
      popular: false,
      plan_type: 'PRO_MCQ',
      features: ['Full Subject Question Bank Access', 'Timed Mock Test Access', 'Instant Scorecard'],
      features_mr: ['सर्व विषय सराव', 'टाईम मॉक टेस्ट्स', 'अचूकता रिपोर्ट']
    });
    setShowPlanModal(true);
  };

  const handleOpenEditPlan = (plan: PaymentPlan) => {
    setEditingPlan({ ...plan });
    setShowPlanModal(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan?.name || !editingPlan?.price) {
      showToast('Name and price are required', 'error');
      return;
    }
    try {
      setSavingPlan(true);
      if (editingPlan.id) {
        await api.updatePaymentPlan(editingPlan.id, editingPlan);
        showToast('प्लॅन माहिती अपडेट केली!', 'success');
      } else {
        await api.createPaymentPlan(editingPlan as any);
        showToast('नवीन प्लॅन तयार केला!', 'success');
      }
      setShowPlanModal(false);
      setEditingPlan(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to save plan', 'error');
    } finally {
      setSavingPlan(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment plan?')) return;
    try {
      await api.deletePaymentPlan(id);
      showToast('प्लॅन काढून टाकला', 'info');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Deletion failed', 'error');
    }
  };

  useEffect(() => {
    api.getSettings().then(s => {
      if (s) {
        setSettings(s);
        setRazorpayEnabled(!!s.razorpay_enabled);
        setManualQrEnabled(s.manual_qr_enabled !== undefined ? s.manual_qr_enabled : true);
        setUpiId(s.upi_id || '');
        setReceiverName(s.receiver_name || '');
        setCustomQrUrl(s.custom_qr_image_url || '');
      }
    }).catch(err => console.warn('Failed to load settings:', err));
  }, []);

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      const updated = await api.updateSettings({
        razorpay_enabled: razorpayEnabled,
        manual_qr_enabled: manualQrEnabled,
        upi_id: upiId,
        receiver_name: receiverName,
        custom_qr_image_url: customQrUrl
      });
      setSettings(updated);
      showToast('पेमेंट गेटवे सेटिंग्ज यशस्वीपणे सेव्ह केल्या!', 'success');
    } catch (err: any) {
      showToast(err.message || 'सेटिंग्ज सेव्ह करताना त्रुटी आली', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

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
      {/* Payment Gateway Settings Card (Razorpay & Manual QR / UPI ID) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-teal-600" />
            <h3 className="font-extrabold text-slate-900 text-base">
              पेमेंट गेटवे व UPI ID व्यवस्था (Payment Gateway Settings)
            </h3>
          </div>
          <button
            onClick={handleSaveSettings}
            disabled={savingSettings}
            className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>सेटिंग्ज सेव्ह करा (Save)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Razorpay Toggle */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                  <span>रोझर पे (Razorpay Gateway)</span>
                  {razorpayEnabled && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                      सुरू आहे (ACTIVE)
                    </span>
                  )}
                </h4>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Razorpay ची मान्यता मिळाल्यानंतर हे बटण ऑन करा. रोझर पेनी पेमेंट झाल्यावर ऑटो सर्व अनलॉक होईल (No Approval Needed).
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                <input
                  type="checkbox"
                  checked={razorpayEnabled}
                  onChange={e => setRazorpayEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            {razorpayEnabled ? (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-[11px] font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ऑटो अनलॉक सक्रिय: विद्यार्थ्याने Razorpay द्वारे पेमेंट केल्यावर लगेचच PRO प्लॅन सुरू होईल!</span>
              </div>
            ) : (
              <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-[11px] font-medium">
                सध्या Razorpay गेटवे बंद आहे. विद्यार्थी QR कोड / UPI द्वारे UTR सबमिट करून प्लॅन खरेदी करू शकतात.
              </div>
            )}
          </div>

          {/* Manual QR & UPI Setup */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <QrCode className="w-4 h-4 text-blue-600" />
                <span>मॅन्युअल QR कोड व UPI ID पर्याय</span>
              </h4>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={manualQrEnabled}
                  onChange={e => setManualQrEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="space-y-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">UPI ID (उदा. 9168458498@upi / hange@ybl)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="उदा. hangemahesh916@ybl"
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">खातेदाराचे नाव (Account / Receiver Name)</label>
                <input
                  type="text"
                  value={receiverName}
                  onChange={e => setReceiverName(e.target.value)}
                  placeholder="उदा. Mahesh Hange (Nursing Officer Prep)"
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans Management Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>वर्गणी प्लॅन्स व्यवस्थापन (Subscription Plans Management)</span>
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              येथे ऍडमिन प्लॅन १, प्लॅन २, प्लॅन ३ ची किंमत, कालावधी आणि वैशिष्ट्ये सेट करू शकतात.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenNewPlan}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>नवीन प्लॅन जोडा (Add Plan)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, idx) => (
            <div
              key={plan.id || idx}
              className={`p-4 rounded-2xl border transition relative flex flex-col justify-between ${
                plan.popular
                  ? 'border-indigo-300 bg-indigo-50/40'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200">
                    {plan.plan_type === 'TEST_SERIES' ? 'Test Series' : plan.plan_type === 'YOUTUBE' ? 'YouTube Videos' : plan.plan_type === 'COMBO' ? 'All Access Combo' : 'MCQ Bank'}
                  </span>
                  {plan.popular && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> Popular
                    </span>
                  )}
                </div>

                <h4 className="font-black text-slate-900 text-sm">{plan.name}</h4>
                {plan.name_mr && <p className="text-xs text-slate-600 font-medium">{plan.name_mr}</p>}

                <div className="my-3 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">₹{plan.price}</span>
                  <span className="text-xs text-slate-500 font-medium">/ {plan.duration_label}</span>
                </div>

                <ul className="text-xs text-slate-600 space-y-1 mb-4">
                  {(plan.features_mr || plan.features || []).slice(0, 3).map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span className="line-clamp-1">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${plan.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                  {plan.is_active ? 'सक्रिय (Active)' : 'बंद (Inactive)'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditPlan(plan)}
                    className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="Edit Plan"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePlan(plan.id)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Edit / Add Modal */}
      {showPlanModal && editingPlan && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingPlan.id ? 'प्लॅन माहिती संपादित करा' : 'नवीन वर्गणी प्लॅन तयार करा'}
              </h3>
              <button
                onClick={() => setShowPlanModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">प्लॅनचे नाव (English Name)</label>
                <input
                  type="text"
                  required
                  value={editingPlan.name || ''}
                  onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  placeholder="e.g. 6 Months NORCET Master Pro"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">प्लॅनचे नाव (मराठी)</label>
                <input
                  type="text"
                  value={editingPlan.name_mr || ''}
                  onChange={e => setEditingPlan({ ...editingPlan, name_mr: e.target.value })}
                  placeholder="उदा. ६ महिने NORCET मास्टर प्रो प्लॅन"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">किंमत ₹ (Price in INR)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingPlan.price || ''}
                    onChange={e => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">कालावधी (दिवस - Days)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingPlan.duration_days || 30}
                    onChange={e => setEditingPlan({ ...editingPlan, duration_days: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">कालावधी लेबल (EN)</label>
                  <input
                    type="text"
                    value={editingPlan.duration_label || ''}
                    onChange={e => setEditingPlan({ ...editingPlan, duration_label: e.target.value })}
                    placeholder="e.g. 6 Months Access"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">कालावधी लेबल (MR)</label>
                  <input
                    type="text"
                    value={editingPlan.duration_label_mr || ''}
                    onChange={e => setEditingPlan({ ...editingPlan, duration_label_mr: e.target.value })}
                    placeholder="उदा. ६ महिन्यांसाठी"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">प्लॅन प्रकार (Plan Product Type)</label>
                <select
                  value={editingPlan.plan_type || 'PRO_MCQ'}
                  onChange={e => setEditingPlan({ ...editingPlan, plan_type: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="PRO_MCQ">📚 PRO MCQ Bank (सर्व १८ विषयांचे प्रश्नसंच)</option>
                  <option value="TEST_SERIES">📝 Test Series Pass (केवळ टेस्ट सिरीज)</option>
                  <option value="YOUTUBE">▶️ YouTube Video Plan (व्हिडिओ लायब्ररी)</option>
                  <option value="COMBO">🔥 Combo All-Access (MCQ + Test Series + YouTube)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">वैशिष्ट्ये - मराठी (Features - Line by Line)</label>
                <textarea
                  rows={3}
                  value={(editingPlan.features_mr || []).join('\n')}
                  onChange={e => setEditingPlan({ ...editingPlan, features_mr: e.target.value.split('\n').filter(Boolean) })}
                  placeholder="प्रत्येक ओळीवर एक वैशिष्ट्य टाका..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingPlan.popular || false}
                    onChange={e => setEditingPlan({ ...editingPlan, popular: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Popular Badge दाखवा</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingPlan.is_active !== false}
                    onChange={e => setEditingPlan({ ...editingPlan, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>सक्रिय ठेवा (Active)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={savingPlan}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2"
                >
                  {savingPlan ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>सेव्ह करा (Save Plan)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
