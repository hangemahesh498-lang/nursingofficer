import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CONTACT_CONFIG } from '../lib/contactConfig';
import {
  ShieldCheck,
  FileText,
  Lock,
  RefreshCw,
  Truck,
  Phone,
  Info,
  DollarSign,
  X,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  ExternalLink,
  Building,
  UserCheck,
  Send
} from 'lucide-react';

export type PolicyTab = 'terms' | 'privacy' | 'refund' | 'shipping' | 'contact' | 'about' | 'pricing';

interface CompliancePoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PolicyTab;
}

export const CompliancePoliciesModal: React.FC<CompliancePoliciesModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms'
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);

  if (!isOpen) return null;

  const tabs: { id: PolicyTab; label: string; icon: any }[] = [
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'contact', label: 'Contact Us', icon: Phone },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'privacy', label: 'Privacy Policy', icon: Lock },
    { id: 'refund', label: 'Refund Policy', icon: RefreshCw },
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'pricing', label: 'Pricing & Plans', icon: DollarSign }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-tight text-white">
                Nursing Officer BY MH
              </h2>
              <p className="text-[11px] text-slate-400">
                Official Terms, Policies & Support Information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Navigation */}
        <div className="bg-slate-100 p-2 sm:px-4 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Policy Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          {/* 1. ABOUT US */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 uppercase">
                  Merchant Profile & Business Information
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  About Nursing Officer BY MH
                </h3>
                <p className="text-xs text-slate-500">
                  Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <div className="space-y-3">
                <p>
                  <strong>Nursing Officer BY MH</strong> is a premier e-learning and digital test preparation platform specifically tailored for nursing professionals and aspirants appearing for central and state government recruitment examinations across India.
                </p>
                <p>
                  Our primary mission is to provide affordable, high-yield, and scientifically structured preparation material—including full-length simulated mock tests, clinical scenario-based MCQs, bilingual explanations (English and Marathi), previous year question analyses, and automated mistake notebooks.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-teal-600" />
                      Core Examinations Covered
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                      <li>AIIMS NORCET (All-India Institute of Medical Sciences)</li>
                      <li>Maharashtra DHS (Public Health Department Staff Nurse)</li>
                      <li>Maharashtra DMER (Medical Education & Research)</li>
                      <li>ESIC, RRB, GMCH, and State Nursing Officer exams</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-teal-600" />
                      Legal Entity & Merchant Identity
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      <li><strong>Operating Brand:</strong> {CONTACT_CONFIG.operatingBrand}</li>
                      <li><strong>Parent Legal Entity:</strong> {CONTACT_CONFIG.parentLegalEntity}</li>
                      <li><strong>Support Representative:</strong> {CONTACT_CONFIG.supportRepresentative}</li>
                      <li><strong>Official Email:</strong> {CONTACT_CONFIG.supportEmail}</li>
                      <li><strong>Direct Telegram:</strong> @{CONTACT_CONFIG.directTelegramUsername}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. CONTACT US & GRIEVANCE REDRESSAL */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                  Support & Grievance Mechanism
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  Contact Us & Grievance Redressal Officer
                </h3>
                <p className="text-xs text-slate-500">
                  {CONTACT_CONFIG.reviewerNotice}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 space-y-3">
                  <h4 className="font-bold text-teal-950 text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4 text-teal-700" />
                    Customer Support Channels
                  </h4>
                  <p className="text-xs text-teal-900">
                    For questions regarding subscriptions, payment status, mock tests, or account help:
                  </p>
                  <div className="text-xs space-y-1.5 text-teal-950">
                    <div><strong>Email:</strong> <a href={`mailto:${CONTACT_CONFIG.supportEmail}`} className="underline font-mono">{CONTACT_CONFIG.supportEmail}</a></div>
                    <div><strong>Direct Telegram:</strong> <a href={CONTACT_CONFIG.directTelegramUrl} target="_blank" rel="noopener noreferrer" className="underline font-mono text-indigo-700">@{CONTACT_CONFIG.directTelegramUsername}</a></div>
                    <div><strong>Support Person:</strong> {CONTACT_CONFIG.supportRepresentative}</div>
                    <div><strong>Availability:</strong> {CONTACT_CONFIG.supportAvailability}</div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-700" />
                    Grievance Redressal Officer
                  </h4>
                  <p className="text-xs text-slate-600">
                    In accordance with Information Technology Act, 2000 and consumer protection rules, the details of the Grievance Officer are:
                  </p>
                  <div className="text-xs space-y-1.5 text-slate-800">
                    <div><strong>Officer Name:</strong> {CONTACT_CONFIG.grievanceOfficer}</div>
                    <div><strong>Entity:</strong> {CONTACT_CONFIG.parentLegalEntity}</div>
                    <div><strong>Email:</strong> <a href={`mailto:${CONTACT_CONFIG.supportEmail}`} className="underline font-mono">{CONTACT_CONFIG.supportEmail}</a></div>
                    <div><strong>Resolution Commitment:</strong> Within 3 to 7 business days (३ ते ७ कामकाजाचे दिवस)</div>
                  </div>
                </div>
              </div>

              {CONTACT_CONFIG.showAddress && (
                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-600" />
                    Registered Office Address:
                  </div>
                  <div className="text-slate-800 font-medium">{CONTACT_CONFIG.registeredOfficeAddress}</div>
                  <div className="text-[11px] text-slate-500 pt-1">Operated by {CONTACT_CONFIG.parentLegalEntity}</div>
                </div>
              )}
            </div>
          )}

          {/* 3. TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                  User Agreement
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  Terms & Conditions of Service
                </h3>
                <p className="text-xs text-slate-500">
                  By registering or purchasing a subscription plan, you agree to the following terms.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">1. Account Registration & Single Device Binding</h4>
                <p>
                  Users must provide accurate details (Name, Email, Mobile number, and Maharashtra District). To protect educational content and prevent account sharing, each subscription is bound to a single active device. Sharing credentials or attempting concurrent multi-device logins is strictly prohibited.
                </p>

                <h4 className="font-bold text-slate-900">2. Intellectual Property & Non-Transferability</h4>
                <p>
                  All questions, rationales, clinical cases, simulated test papers, and software features are the intellectual property of <strong>Nursing Officer BY MH</strong>. Users may not copy, scrape, redistribute, publish, or resell any mock test materials.
                </p>

                <h4 className="font-bold text-slate-900">3. Examination Simulation & Disclaimer</h4>
                <p>
                  <strong>Nursing Officer BY MH</strong> is an independent digital coaching platform. We do not claim official government affiliation with AIIMS, ESIC, DMER, or Maharashtra Government. All mock tests are practice simulations crafted for educational enhancement.
                </p>

                <h4 className="font-bold text-slate-900">4. Governing Law & Jurisdiction</h4>
                <p>
                  These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in Maharashtra, India.
                </p>
              </div>
            </div>
          )}

          {/* 4. PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                  Data Protection & Privacy
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  Privacy Policy (DPDP Act & IT Act Compliant)
                </h3>
                <p className="text-xs text-slate-500">
                  How we protect your personal and examination data.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">1. Information We Collect</h4>
                <p>
                  We collect minimal necessary details including Name, Email Address, Contact Mobile Number, Target Exam Track, District, and test score analytics to power personalized learning and mistake notebook tracking.
                </p>

                <h4 className="font-bold text-slate-900">2. Payment Gateway & Financial Data Security</h4>
                <p>
                  <strong>We do NOT store or process your credit card, debit card numbers, CVVs, or UPI PINs.</strong> All online financial transactions are securely processed through <strong>Razorpay Payment Gateway</strong> using end-to-end 256-bit SSL encryption adhering to PCI-DSS Level 1 compliance standards.
                </p>

                <h4 className="font-bold text-slate-900">3. Data Sharing & Third Parties</h4>
                <p>
                  We never sell, lease, or distribute your personal contact information to any third-party advertisers or telemarketers.
                </p>

                <h4 className="font-bold text-slate-900">4. User Data Rights & Account Deletion</h4>
                <p>
                  Users have the right to request a copy of their stored profile data or request complete account deletion by emailing our support desk at <a href={`mailto:${CONTACT_CONFIG.supportEmail}`} className="underline font-mono">{CONTACT_CONFIG.supportEmail}</a>.
                </p>
              </div>
            </div>
          )}

          {/* 5. REFUND & CANCELLATION POLICY (ENGLISH - COMPACT & STRICT) */}
          {activeTab === 'refund' && (
            <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed">
              <div className="border-b border-slate-200 pb-2.5">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-100 text-rose-800 uppercase tracking-wider">
                  Cancellation & Refund Policy
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  Refund & Cancellation Policy
                </h3>
                <p className="text-[11px] text-slate-500">
                  Instant digital educational content delivery terms and refund conditions.
                </p>
              </div>

              <div className="space-y-2.5">
                {/* Immediate Digital Delivery & Strict No-Refund Notice */}
                <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-1.5 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-rose-400 font-extrabold text-[11px] uppercase tracking-wide">
                    <span>⚡ Instant Digital Delivery • Strict No-Refund Policy</span>
                  </div>
                  <p className="text-[11.5px] text-slate-200 leading-snug">
                    All subscriptions, mock test packages, PYQs, and educational materials provided on <strong>Nursing Officer BY MH</strong> are <strong>purely digital services delivered and activated immediately</strong> upon successful payment.
                  </p>
                  <p className="text-[11px] text-amber-300 font-semibold">
                    ⚠️ Once a subscription plan or mock test package is activated on your account, strictly <u>NO REFUND</u> or cancellation will be issued under any circumstances.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                    1. Sole Exception: Duplicate / Double Payment
                  </h4>
                  <p className="text-[11.5px]">
                    Refunds will only be considered and approved in the event of an <strong>accidental duplicate transaction</strong> (where your payment source was charged twice for the exact same package or plan on the same day due to a network or gateway glitch).
                  </p>

                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide pt-1">
                    2. Refund Claim Procedure
                  </h4>
                  <p className="text-[11.5px]">
                    To report a double charge, email us at <a href={`mailto:${CONTACT_CONFIG.supportEmail}`} className="underline font-mono text-blue-600 font-semibold">{CONTACT_CONFIG.supportEmail}</a> within <strong>48 hours</strong> of the transaction with your registered mobile number, email, and Razorpay payment receipts.
                  </p>

                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide pt-1">
                    3. Processing & Settlement
                  </h4>
                  <p className="text-[11.5px]">
                    Upon verification of the duplicate payment, the excess amount is refunded back to your original source (Bank Account/UPI) within <strong>3 to 7 business days</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 6. SHIPPING & DELIVERY POLICY */}
          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase">
                  Digital Content Delivery
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  Shipping & Delivery Policy
                </h3>
                <p className="text-xs text-slate-500">
                  Details regarding the delivery and fulfillment of digital educational packages.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-2">
                  <h4 className="font-bold text-teal-950 text-xs uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-700" />
                    Instant Digital Fulfillment
                  </h4>
                  <p className="text-xs text-teal-900">
                    <strong>Nursing Officer BY MH</strong> deals exclusively in online digital educational content (Online Mock Tests, Clinical MCQs, PDF Question Banks, AI Study Coach, and Bilingual Explanations).
                  </p>
                </div>

                <h4 className="font-bold text-slate-900">1. Delivery Timeline & Mode</h4>
                <p>
                  Upon successful payment completion via Razorpay or manual UTR approval, access to all paid mock tests, study materials, and PRO features is <strong>instantly activated</strong> on your registered account.
                </p>

                <h4 className="font-bold text-slate-900">2. Physical Shipping Disclaimer</h4>
                <p>
                  There are <strong>NO physical shipments or couriers</strong> involved. Consequently, there are zero (₹0) shipping, handling, or logistics charges applicable.
                </p>

                <h4 className="font-bold text-slate-900">3. Delivery Confirmation</h4>
                <p>
                  A confirmation message and digital payment receipt are recorded instantly under your account’s "Payment History" tab.
                </p>
              </div>
            </div>
          )}

          {/* 7. PRICING & SUBSCRIPTION PRODUCTS */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 uppercase">
                  Product & Service Details
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  Pricing & Educational Subscription Packages
                </h3>
                <p className="text-xs text-slate-500">
                  Transparent fee structure in Indian Rupees (INR ₹) inclusive of all taxes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Starter Pack</span>
                  <div className="text-xl font-black text-slate-900">₹99 <span className="text-xs font-normal text-slate-500">/ 30 Days</span></div>
                  <p className="text-xs text-slate-600">Full access to 10+ Standard Mock Tests & Chapter Question Banks.</p>
                </div>

                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 shadow-xs space-y-2">
                  <span className="text-[10px] font-bold text-teal-800 uppercase">AIIMS NORCET Master Pro</span>
                  <div className="text-xl font-black text-teal-950">₹299 <span className="text-xs font-normal text-teal-700">/ 180 Days</span></div>
                  <p className="text-xs text-teal-900">Grand Mock Tests, AI Study Coach, Clinical Cases & Mistake Notebook.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 text-white rounded-2xl shadow-xs space-y-2">
                  <span className="text-[10px] font-bold text-yellow-400 uppercase">Annual Ultimate Pass</span>
                  <div className="text-xl font-black text-white">₹499 <span className="text-xs font-normal text-slate-400">/ 365 Days</span></div>
                  <p className="text-xs text-slate-300">All current & upcoming nursing recruitment test series with VIP support.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="bg-slate-50 p-4 sm:px-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Official Razorpay Payment Gateway & Consumer Protection Compliant</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
          >
            {language === 'mr' ? 'बंद करा (Close)' : 'Close Policy Window'}
          </button>
        </div>
      </div>
    </div>
  );
};
