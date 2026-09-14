import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { PaymentPlan, PaymentRecord, SystemSettings } from '../types';
import { DEFAULT_PAYMENT_PLANS } from '../data/plans';
import {
  Crown,
  CheckCircle2,
  QrCode,
  Send,
  Upload,
  Clock,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  CreditCard,
  Zap,
  Loader2
} from 'lucide-react';

import { ComplianceFooter } from './ComplianceFooter';
import { CompliancePoliciesModal, PolicyTab } from './CompliancePoliciesModal';

export const UpgradeProView: React.FC = () => {
  const { language } = useLanguage();
  const { currentUser, refreshProfile } = useAuth();
  const [plans, setPlans] = useState<PaymentPlan[]>(DEFAULT_PAYMENT_PLANS);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [myHistory, setMyHistory] = useState<PaymentRecord[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(DEFAULT_PAYMENT_PLANS[1] || DEFAULT_PAYMENT_PLANS[0]);
  const [selectedPlanTypeFilter, setSelectedPlanTypeFilter] = useState<'ALL' | 'TEST_SERIES' | 'PRO_MCQ' | 'COMBO'>('ALL');
  const [paymentModeTab, setPaymentModeTab] = useState<'AUTO_RAZORPAY' | 'MANUAL_QR'>('AUTO_RAZORPAY');
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoProcessing, setIsAutoProcessing] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<PaymentRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [policyModalTab, setPolicyModalTab] = useState<PolicyTab>('refund');

  // Promo Code State
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountAmount: number;
    finalAmount: number;
    message: string;
  } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isVerifyingPromo, setIsVerifyingPromo] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [plansData, settingsData, historyData] = await Promise.all([
          api.getPaymentPlans(),
          api.getSettings(),
          api.getMyPaymentHistory()
        ]);
        setPlans(plansData);
        setSettings(settingsData);
        setMyHistory(historyData);
        if (plansData.length > 0) {
          const pop = plansData.find(p => p.popular) || plansData[0];
          setSelectedPlan(pop);
        }
        if (settingsData && !settingsData.razorpay_enabled) {
          setPaymentModeTab('MANUAL_QR');
        }
      } catch (err) {
        console.error('Failed to load payment plans:', err);
      }
    }
    loadData();
  }, []);

  // Re-verify promo code whenever selected plan changes
  useEffect(() => {
    if (appliedPromo && selectedPlan) {
      api.verifyPromoCode(appliedPromo.code, selectedPlan.price).then(res => {
        if (res.valid) {
          setAppliedPromo({
            code: appliedPromo.code,
            discountAmount: res.discountAmount,
            finalAmount: res.finalAmount,
            message: res.message
          });
        }
      });
    }
  }, [selectedPlan]);

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim() || !selectedPlan) return;
    setIsVerifyingPromo(true);
    setPromoError(null);
    try {
      const res = await api.verifyPromoCode(promoCodeInput.trim(), selectedPlan.price);
      if (res.valid) {
        setAppliedPromo({
          code: promoCodeInput.trim().toUpperCase(),
          discountAmount: res.discountAmount,
          finalAmount: res.finalAmount,
          message: res.message
        });
        setPromoError(null);
      } else {
        setAppliedPromo(null);
        setPromoError(res.message);
      }
    } catch (err: any) {
      setPromoError('प्रोमो कोड पडताळणी गर्दीमुळे अयशस्वी झाली.');
    } finally {
      setIsVerifyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput('');
    setPromoError(null);
  };

  const handleCopyUpi = () => {
    if (!settings?.upi_id) return;
    navigator.clipboard.writeText(settings.upi_id);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleRazorpayAutoPay = async () => {
    if (!selectedPlan) return;
    try {
      setIsAutoProcessing(true);
      setErrorMessage(null);

      const orderData = await api.createRazorpayOrder(selectedPlan.id, appliedPromo?.code);

      // Check if Razorpay script is loaded
      const win = window as any;
      if (!win.Razorpay) {
        // Dynamically load Razorpay checkout script if not present
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      if (win.Razorpay && settings?.razorpay_key_id) {
        const options = {
          key: settings.razorpay_key_id,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: settings.app_name || 'Nursing Officer Prep Hub',
          description: `PRO Activation - ${selectedPlan.name}`,
          order_id: orderData.order_id,
          prefill: {
            name: currentUser?.name || '',
            email: currentUser?.email || '',
            contact: ''
          },
          theme: {
            color: '#0f766e'
          },
          handler: async function (response: any) {
            try {
              const verified = await api.verifyRazorpayAuto({
                plan_id: selectedPlan.id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id || orderData.order_id
              });
              setSubmitSuccess(verified.payment);
              if (refreshProfile) await refreshProfile();
              const updated = await api.getMyPaymentHistory();
              setMyHistory(updated);
            } catch (err: any) {
              setErrorMessage(err.message || 'Auto verification error');
            }
          }
        };
        const rzp = new win.Razorpay(options);
        rzp.open();
      } else {
        // Razorpay not configured or key missing -> Switch to Manual QR
        setPaymentModeTab('MANUAL_QR');
        setErrorMessage('Razorpay सध्या पूर्णपणे कॉन्फिगर केलेले नाही. कृपया खालील QR कोड वापरून पेमेंट करा व 12-अंकी UTR सबमिट करा.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment initiation failed');
    } finally {
      setIsAutoProcessing(false);
    }
  };

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    if (!utrNumber.trim() || utrNumber.trim().length < 8) {
      setErrorMessage(language === 'mr' ? 'कृपया अचूक १२-अंकी UTR किंवा Transaction ID प्रविष्ट करा.' : 'Please enter a valid 12-digit UTR or Transaction ID.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const res = await api.submitManualPaymentUtr({
        plan_id: selectedPlan.id,
        utr_number: utrNumber.trim(),
        promo_code: appliedPromo?.code
      });
      setSubmitSuccess(res);
      setUtrNumber('');
      const updatedHistory = await api.getMyPaymentHistory();
      setMyHistory(updatedHistory);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold mb-4 uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>AIIMS NORCET & Nursing Officer Pro Pass</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {language === 'mr'
              ? 'सर्वोत्कृष्ट तयारीसाठी PRO प्लॅन निवडा'
              : 'Supercharge Your Nursing Officer Selection with PRO'}
          </h1>
          <p className="text-teal-100/90 text-sm sm:text-base mt-3 leading-relaxed">
            {language === 'mr'
              ? 'अमर्यादित AIIMS NORCET टाइमर मॉक टेस्ट्स, सर्व १८ विषयांचे प्रश्नसंच, पार्कलँड व GCS क्लिनिकल चार्ट्स, स्वयंचलित चूक वही आणि थेट टेलिग्राम VIP सपोर्ट.'
              : 'Unlock full-length timed NORCET simulator tests with 1/3rd negative marking, verified PYQ archive, clinical PDFs, and AI-powered spaced repetition notebook.'}
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-2xl mx-auto border border-slate-200">
        <button
          type="button"
          onClick={() => setSelectedPlanTypeFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            selectedPlanTypeFilter === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🌟 सर्व प्लॅन्स (All Plans)
        </button>

        <button
          type="button"
          onClick={() => setSelectedPlanTypeFilter('TEST_SERIES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            selectedPlanTypeFilter === 'TEST_SERIES'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📝 केवळ टेस्ट सिरीज पास (Test Series Only)
        </button>

        <button
          type="button"
          onClick={() => setSelectedPlanTypeFilter('PRO_MCQ')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            selectedPlanTypeFilter === 'PRO_MCQ'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📚 MCQ Bank & Notes (विषय सराव)
        </button>

        <button
          type="button"
          onClick={() => setSelectedPlanTypeFilter('COMBO')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            selectedPlanTypeFilter === 'COMBO'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🔥 Combo All-Access (सगळे एकत्र)
        </button>
      </div>

      {/* Plans Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans
          .filter(plan => {
            if (selectedPlanTypeFilter === 'ALL') return true;
            return plan.plan_type === selectedPlanTypeFilter;
          })
          .map(plan => {
          const isSelected = selectedPlan?.id === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`rounded-3xl p-6 sm:p-7 bg-white border-2 transition relative flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-teal-700 shadow-lg ring-4 ring-teal-600/10'
                  : 'border-slate-200 hover:border-teal-300 shadow-xs'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-xs">
                  ★ Most Popular Choice
                </div>
              )}

              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {language === 'mr' && plan.name_mr ? plan.name_mr : plan.name}
                    </h3>
                    <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>{language === 'mr' && plan.duration_label_mr ? plan.duration_label_mr : plan.duration_label}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-3xl font-black text-teal-800 leading-none">₹{plan.price}</div>
                    <div className="text-[10px] font-bold text-slate-500 mt-1 whitespace-nowrap">
                      {language === 'mr' ? '(सर्व करांसहित)' : '(Inclusive of all taxes)'}
                    </div>
                  </div>
                </div>

                {/* Instant Access Badge */}
                <div className="mt-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                  <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 shrink-0" />
                  <span>{language === 'mr' ? 'पेमेंटनंतर लगेच डिजिटल ॲक्सेस सुरू' : 'Instant Digital Access upon payment'}</span>
                </div>

                {/* Features List */}
                <ul className="mt-5 space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-700">
                  {(language === 'mr' && plan.features_mr ? plan.features_mr : plan.features).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-teal-700 text-white hover:bg-teal-800 shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Crown className="w-4 h-4" />
                  <span>{isSelected ? (language === 'mr' ? 'हा प्लॅन निवडला आहे' : 'Plan Selected') : (language === 'mr' ? 'हा प्लॅन निवडा' : 'Select Plan')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Checkout Section */}
      {selectedPlan && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          {/* Payment Method Selector Switch */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {language === 'mr' ? 'पेमेंट पद्धत निवडा' : 'Select Payment Mode'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'mr'
                  ? 'सुरक्षित ऑनलाइन पेमेंट करून त्वरित टेस्ट अनलॉक करा (One-time Payment) किंवा मॅन्युअल QR वापरा.'
                  : 'Unlock tests instantly with secure online one-time payment or use manual QR.'}
              </p>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setPaymentModeTab('AUTO_RAZORPAY')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  paymentModeTab === 'AUTO_RAZORPAY'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'mr' ? '⚡ झटपट अनलॉक (Razorpay / UPI)' : '⚡ Instant Unlock (Razorpay / UPI)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentModeTab('MANUAL_QR')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  paymentModeTab === 'MANUAL_QR'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{language === 'mr' ? 'मॅन्युअल QR / UTR' : 'Manual QR / UTR'}</span>
              </button>
            </div>
          </div>

          {/* PROMO CODE INPUT BOX */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-extrabold text-amber-950 text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{language === 'mr' ? 'विशेष डिस्काउंट प्रोमो कोड टाका' : 'Have a Promo Code / Discount Coupon?'}</span>
              </div>
              <p className="text-[11px] text-amber-800">
                {language === 'mr' ? 'उदा. ५०% डिस्काउंटसाठी MH50 कोड वापरा.' : 'Try promo code MH50 to get instant discount!'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              {appliedPromo ? (
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-emerald-300 shadow-2xs">
                  <div className="text-left">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono font-bold text-xs rounded-md">
                      {appliedPromo.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 ml-2">
                      -₹{appliedPromo.discountAmount} SAVED!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold ml-1 cursor-pointer"
                  >
                    काढा (Remove)
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={e => setPromoCodeInput(e.target.value.toUpperCase())}
                    placeholder="e.g. MH50"
                    className="w-full sm:w-36 px-3 py-2 bg-white border border-amber-300 rounded-xl font-mono text-xs font-bold uppercase focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={isVerifyingPromo || !promoCodeInput.trim()}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-2xs transition disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    {isVerifyingPromo ? 'तपासत आहे...' : (language === 'mr' ? 'लागू करा (Apply)' : 'Apply')}
                  </button>
                </div>
              )}
            </div>
          </div>
          {promoError && (
            <div className="text-xs font-semibold text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              {promoError}
            </div>
          )}
          {appliedPromo && (
            <div className="text-xs font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{appliedPromo.message}</span>
            </div>
          )}

          {/* TAB 1: AUTO RAZORPAY INSTANT PAYMENT */}
          {paymentModeTab === 'AUTO_RAZORPAY' ? (
            <div className="max-w-2xl mx-auto py-4 space-y-6 text-center">
              <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-800 flex items-center justify-center mx-auto shadow-inner">
                <CreditCard className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {language === 'mr' ? 'झटपट स्वयंचलित PRO सक्रियता' : 'Instant Automated PRO Activation'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
                  {language === 'mr'
                    ? 'Razorpay द्वारे सुरक्षित पेमेंट करा. पेमेंट यशस्वी होताच तुमचा PRO प्लॅन १ सेकंदात सुरू होईल.'
                    : 'Pay securely via UPI, Cards, NetBanking, or Wallets with instant auto-verification.'}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left max-w-md mx-auto space-y-3">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Selected Package:</span>
                  <span className="font-bold text-slate-900">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Validity Duration:</span>
                  <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">{selectedPlan.duration_label}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Fulfillment:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                    Instant Digital Access
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-3 border-t border-slate-200 items-baseline">
                  <div>
                    <span>Total Payable:</span>
                    <div className="text-[10px] font-normal text-slate-500">(Inclusive of all taxes)</div>
                  </div>
                  {appliedPromo ? (
                    <div className="text-right">
                      <span className="line-through text-slate-400 text-xs mr-2">₹{selectedPlan.price}</span>
                      <span className="text-xl text-emerald-700 font-black">₹{appliedPromo.finalAmount}</span>
                    </div>
                  ) : (
                    <span className="text-xl text-teal-800 font-black">₹{selectedPlan.price}</span>
                  )}
                </div>
              </div>

              {submitSuccess && submitSuccess.status === 'APPROVED' ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 animate-fadeIn max-w-md mx-auto text-left">
                  <div className="flex items-center gap-2 font-bold text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>{language === 'mr' ? 'PRO सदस्यत्व यशस्वीरित्या सक्रिय झाले!' : 'PRO Membership Activated Instantly!'}</span>
                  </div>
                  <p className="text-xs text-emerald-700">
                    {language === 'mr'
                      ? 'तुमचे खाते PRO मध्ये अपग्रेड झाले आहे. तुम्ही सर्व टेस्ट्स व नोट्स वापरू शकता.'
                      : 'Your account has been upgraded to PRO. Full mock test simulator and notes unlocked.'}
                  </p>
                </div>
              ) : (
                <div className="max-w-md mx-auto space-y-3">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 text-left">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={isAutoProcessing}
                    onClick={handleRazorpayAutoPay}
                    className="w-full py-4 px-6 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-sm transition shadow-lg hover:shadow-teal-700/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isAutoProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing Payment Gateway...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
                        <span>{language === 'mr' ? `₹${appliedPromo ? appliedPromo.finalAmount : selectedPlan.price} भरा व लगेच PRO सुरू करा` : `Pay ₹${appliedPromo ? appliedPromo.finalAmount : selectedPlan.price} & Unlock PRO Instantly`}</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-400">
                    100% Encrypted & RBI Approved 256-bit SSL Gateway
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* TAB 2: MANUAL QR CODE & UTR SUBMISSION */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Payment QR & Instructions */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                  <QrCode className="w-5 h-5" />
                  <span>{language === 'mr' ? 'पायरी १: UPI QR कोड स्कॅन करा' : 'Step 1: Scan & Pay via any UPI App'}</span>
                </div>

                {/* Dynamic QR Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-4">
                  <div className="inline-block p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                        `upi://pay?pa=${settings?.upi_id || 'nursingprep@upi'}&pn=${encodeURIComponent(
                          settings?.receiver_name || 'Nursing Officer Prep'
                        )}&am=${appliedPromo ? appliedPromo.finalAmount : selectedPlan.price}&cu=INR&tn=${encodeURIComponent(selectedPlan.name)}`
                      )}`}
                      alt="UPI Payment QR Code"
                      className="w-44 h-44 mx-auto rounded-lg"
                    />
                  </div>

                  <div>
                    <div className="text-xl font-black text-slate-900">
                      {appliedPromo ? (
                        <>
                          <span className="line-through text-slate-400 text-sm mr-2">₹{selectedPlan.price}</span>
                          <span className="text-emerald-700 font-black">₹{appliedPromo.finalAmount}</span>
                        </>
                      ) : (
                        `₹${selectedPlan.price}`
                      )}{' '}
                      <span className="text-xs font-normal text-slate-500">
                        ({selectedPlan.name})
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Accepts GPay, PhonePe, Paytm, BHIM, and all Banking Apps
                    </div>
                  </div>

                  {/* UPI ID copy box */}
                  <div className="flex items-center justify-center gap-2 max-w-sm mx-auto">
                    <span className="text-xs font-mono bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700">
                      {settings?.upi_id || 'nursingprep@upi'}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Step By Step Instructions */}
                <div className="text-xs text-slate-600 bg-teal-50/50 rounded-xl p-4 border border-teal-100 space-y-1.5 leading-relaxed">
                  <div className="font-bold text-teal-900 mb-1">
                    {language === 'mr' ? 'शुल्क भरण्याची सोपी पद्धत:' : 'Payment Steps:'}
                  </div>
                  <div>{language === 'mr' ? settings?.payment_instructions_mr : settings?.payment_instructions_en}</div>
                </div>
              </div>

              {/* Right: Submit UTR Verification Form */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                  <Send className="w-5 h-5" />
                  <span>{language === 'mr' ? 'पायरी २: UTR / Transaction ID नोंदवा' : 'Step 2: Enter Transaction / UTR Number'}</span>
                </div>

                {submitSuccess ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-2 text-base font-bold text-emerald-800">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>{language === 'mr' ? 'पेमेंट पडताळणीसाठी पाठवले!' : 'UTR Submitted for Verification!'}</span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-emerald-800">
                      {language === 'mr'
                        ? `तुमचा १२-अंकी UTR (${submitSuccess.utr_number}) अ‍ॅडमिनकडे तपासणीसाठी जमा झाला आहे. १५-३० मिनिटांत तुमचा PRO प्लॅन सक्रिय केला जाईल.`
                        : `Your UTR number (${submitSuccess.utr_number}) has been recorded for review. Admin will activate your PRO access within 15-30 minutes.`}
                    </p>
                    <div className="text-xs font-mono bg-white/80 p-2.5 rounded-lg border border-emerald-200 text-emerald-950">
                      Reference ID: {submitSuccess.id} • Status: {submitSuccess.status}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitUtr} className="space-y-4">
                    {errorMessage && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        {language === 'mr' ? '१२-अंकी UPI / UTR क्रमांक (आवश्यक)' : '12-Digit UPI / UTR Transaction ID (Required)'}
                      </label>
                      <input
                        type="text"
                        required
                        value={utrNumber}
                        onChange={e => setUtrNumber(e.target.value)}
                        placeholder="e.g. 504918273645"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:bg-white"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        {language === 'mr'
                          ? 'गुगल पे / फोनपे / पेटीएम मधील १२-अंकी Transaction / UTR ID टाका.'
                          : 'Found in your Google Pay, PhonePe, or Paytm payment receipt details.'}
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
                      <div className="flex justify-between">
                        <span>Selected Plan:</span>
                        <span className="font-bold text-slate-900">{selectedPlan.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Validity Duration:</span>
                        <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">{selectedPlan.duration_label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fulfillment:</span>
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                          Instant Digital Access
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                        <div>
                          <span className="font-bold text-slate-900">Amount Payable:</span>
                          <div className="text-[10px] text-slate-500 font-normal">(Inclusive of all taxes)</div>
                        </div>
                        <span className="text-base font-black text-teal-800">₹{appliedPromo ? appliedPromo.finalAmount : selectedPlan.price}</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span>Aspirant Name:</span>
                        <span className="font-semibold text-slate-800">{currentUser?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Registered Email:</span>
                        <span className="font-mono text-slate-600">{currentUser?.email}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isSubmitting ? 'Submitting...' : language === 'mr' ? 'UTR सबमिट करा व PRO अनलॉक करा' : 'Submit UTR & Activate PRO'}</span>
                    </button>
                  </form>
                )}

                {/* Direct Telegram Support Card */}
                {settings?.telegram_contact_url && (
                  <div className="pt-4 border-t border-slate-100">
                    <a
                      href={settings.telegram_contact_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-2xl bg-sky-50 border border-sky-200 hover:border-sky-300 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-sky-950">
                            {language === 'mr' ? 'थेट टेलिग्राम सपोर्ट व शंका निवारण' : 'Direct Telegram VIP Support'}
                          </div>
                          <div className="text-[11px] text-sky-700 mt-0.5">
                            {settings.telegram_support_message || 'Instant verification & study materials assistance.'}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-sky-600 group-hover:translate-x-0.5 transition" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Compliance Policies Modal */}
      <CompliancePoliciesModal
        isOpen={policyModalOpen}
        onClose={() => setPolicyModalOpen(false)}
        initialTab={policyModalTab}
      />
    </div>
  );
};
