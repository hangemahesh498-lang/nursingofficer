import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CONTACT_CONFIG } from '../lib/contactConfig';
import {
  Mail,
  Send,
  MapPin,
  Clock,
  UserCheck,
  Building,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  ExternalLink,
  PhoneCall,
  Check,
  FileCheck
} from 'lucide-react';
import { ComplianceFooter } from './ComplianceFooter';

interface ContactUsViewProps {
  onNavigateToUpgrade?: () => void;
}

export const ContactUsView: React.FC<ContactUsViewProps> = ({ onNavigateToUpgrade }) => {
  const { language } = useLanguage();

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Hero Banner - No 24/7 */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-black tracking-wide uppercase">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>{language === 'mr' ? 'अधिकृत विद्यार्थी मदत व तक्रार निवारण केंद्र' : 'Official Student Support & Grievance Desk'}</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {language === 'mr' ? 'संपर्क, रिफंड व तक्रार निवारण' : 'Contact, Refund & Grievance Redressal'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {language === 'mr'
              ? 'नर्सिंग ऑफिसर टेस्ट सिरीज, मॉक टेस्ट, सबस्क्रिप्शन किंवा रिफंडच्या कोणत्याही समस्येसाठी थेट खालील अधिकृत संपर्क साधनांचा वापर करा.'
              : 'Direct official contact channels for Nursing Officer Test Series, PRO Subscriptions, Refund Requests, and Student Assistance.'}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Prominent Resolution Guarantee Notice (3 ते 7 दिवस) */}
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-black uppercase tracking-wider mb-1">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{language === 'mr' ? 'हमीपूर्वक निवारण कालावधी' : 'Official Turnaround Commitment'}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-emerald-950">
                  {language === 'mr'
                    ? 'सर्व Refund आणि Grievance ३ ते ७ कामकाजाच्या दिवसांत सोडवले जातात'
                    : 'All Refund & Grievance Requests are Resolved within 3 to 7 Business Days'}
                </h2>
                <p className="text-xs sm:text-sm text-emerald-800 mt-1 leading-relaxed">
                  {language === 'mr'
                    ? 'कोणताही तांत्रिक बिघाड, दुहेरी पेमेंट किंवा तक्रार असल्यास आमची टीम ३ ते ७ कामकाजाच्या दिवसांत (3 to 7 Days) योग्य तपासणी करून खात्यात परतावा (Refund) किंवा समस्येचे निराकरण करेल.'
                    : 'Any technical failure, duplicate deduction, or grievance inquiry is thoroughly reviewed and processed back to your original payment method within 3 to 7 working days.'}
                </p>
              </div>
            </div>

            <div className="bg-white px-4 py-3 rounded-2xl border border-emerald-200 shadow-2xs shrink-0 text-center sm:text-right w-full sm:w-auto">
              <div className="text-[11px] font-bold text-slate-500 uppercase">
                {language === 'mr' ? 'निवारण कालावधी' : 'Resolution SLA'}
              </div>
              <div className="text-xl font-black text-emerald-700">
                ३ ते ७ दिवस
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                (3 - 7 Working Days)
              </div>
            </div>
          </div>
        </div>

        {/* Primary Direct Contact Channels (No form!) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Direct Telegram 1-on-1 Support */}
          <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-blue-900 text-white rounded-3xl p-6 sm:p-7 shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-black uppercase tracking-wider">
                  Telegram Support
                </span>
                <Send className="w-6 h-6 text-indigo-200" />
              </div>
              
              <div>
                <h3 className="text-xl font-black text-white">
                  {language === 'mr' ? 'थेट टेलिग्राम सपोर्ट (Telegram Direct Chat)' : 'Direct Telegram Support'}
                </h3>
                <p className="text-xs text-indigo-100 mt-2 leading-relaxed">
                  {language === 'mr'
                    ? 'परीक्षेबाबत शंका, मॉक टेस्ट ॲक्टिव्हेशन किंवा रिफंडसाठी टेलिग्रामवर थेट १-ऑन-१ चॅट करा.'
                    : 'Connect directly with our support team on Telegram for test activation, payment confirmation, or instant queries.'}
                </p>
              </div>

              <div className="bg-indigo-950/60 rounded-2xl p-3 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'mr' ? 'थेट प्रतिनिधीशी संवाद' : 'Direct Support Representative'}</span>
                </div>
                <div className="text-[11px] text-indigo-200">
                  {language === 'mr' ? 'सोमवार ते शनिवार उपलब्ध' : 'Available Monday to Saturday'}
                </div>
              </div>
            </div>

            <a
              href={CONTACT_CONFIG.directTelegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-indigo-50 text-indigo-950 font-black text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Send className="w-4 h-4 text-indigo-600" />
              <span>{language === 'mr' ? 'टेलिग्रामवर थेट मेसेज करा' : 'Open Direct Telegram Support'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400 ml-1" />
            </a>
          </div>

          {/* Card 2: Official Support Email */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-black uppercase tracking-wider">
                  Official Email
                </span>
                <Mail className="w-6 h-6 text-teal-600" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {language === 'mr' ? 'अधिकृत ईमेल सपोर्ट (Email Support)' : 'Official Email Support'}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {language === 'mr'
                    ? 'सर्व प्रकारच्या तक्रारी, पेमेंट ट्रॅन्झॅक्शन डिटेल्स किंवा रिफंड विनंतीसाठी थेट ईमेल पाठवा.'
                    : 'Send your query, transaction screenshots, or official refund requests directly to our registered mailbox.'}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-1">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Official Support & Refund Email:
                </div>
                <a
                  href={`mailto:${CONTACT_CONFIG.supportEmail}`}
                  className="text-base sm:text-lg font-black text-teal-800 hover:text-teal-900 underline font-mono break-all block"
                >
                  {CONTACT_CONFIG.supportEmail}
                </a>
              </div>
            </div>

            <a
              href={`mailto:${CONTACT_CONFIG.supportEmail}?subject=Support Inquiry / Refund Request`}
              className="w-full py-3.5 px-5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Mail className="w-4 h-4 text-teal-200" />
              <span>{language === 'mr' ? 'थेट ईमेल पाठवा (Send Email)' : 'Compose Direct Email'}</span>
            </a>
          </div>

        </div>

        {/* Dedicated 2-Column: Refund Process & Grievance Officer Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Column A: How Refund Works (3 to 7 days) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <RefreshCw className="w-5 h-5 text-teal-700" />
              <h3 className="text-base font-black text-slate-900">
                {language === 'mr' ? 'परतावा (Refund) प्रक्रिया व नियम' : 'Refund Procedure & Timeline'}
              </h3>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>{language === 'mr' ? 'पात्रता:' : 'Eligibility:'}</strong> {language === 'mr' ? 'तांत्रिक बिघाड किंवा दुहेरी (Duplicate) पेमेंट झाल्यास परतावा मंजूर होतो.' : 'Approved in cases of duplicate payment or technical access failure.'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>{language === 'mr' ? 'कसा मागावा:' : 'How to Apply:'}</strong> {language === 'mr' ? 'तुमचा Razorpay Payment ID / UTR क्रमांक आणि नाव ईमेल करा.' : 'Email your payment ID/UTR and registered email.'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>{language === 'mr' ? 'निवारण कालावधी:' : 'Timeline:'}</strong> <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">३ ते ७ कामकाजाचे दिवस (3 to 7 Business Days)</span> {language === 'mr' ? 'मध्ये मूळ बँक खात्यात पैसे जमा होतात.' : 'credited back to source account.'}
                </span>
              </li>
            </ul>
          </div>

          {/* Column B: Grievance Officer & Legal Entity Info */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <UserCheck className="w-5 h-5 text-blue-700" />
              <h3 className="text-base font-black text-slate-900">
                {language === 'mr' ? 'तक्रार निवारण अधिकारी (Grievance Officer)' : 'Grievance Redressal Officer'}
              </h3>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <span className="text-slate-500 w-32 shrink-0 font-medium">Officer Name:</span>
                <strong className="text-slate-900 font-bold">{CONTACT_CONFIG.grievanceOfficer}</strong>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-slate-500 w-32 shrink-0 font-medium">Parent Entity:</span>
                <strong className="text-slate-900 font-bold">{CONTACT_CONFIG.parentLegalEntity}</strong>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-slate-500 w-32 shrink-0 font-medium">Grievance Email:</span>
                <a href={`mailto:${CONTACT_CONFIG.supportEmail}`} className="text-teal-700 hover:underline font-mono font-bold">{CONTACT_CONFIG.supportEmail}</a>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-slate-500 w-32 shrink-0 font-medium">Resolution Time:</span>
                <span className="font-bold text-emerald-800">{CONTACT_CONFIG.resolutionTimeline}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Registered Office Address Box */}
        {CONTACT_CONFIG.showAddress && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
              <Building className="w-4 h-4 text-teal-700" />
              <span>{language === 'mr' ? 'नोंदणीकृत कार्यालय पत्ता (Registered Office Address)' : 'Registered Office Address'}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-700 pt-1">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p className="font-medium text-slate-800 leading-relaxed">
                {CONTACT_CONFIG.registeredOfficeAddress}
              </p>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              {CONTACT_CONFIG.legalOwnershipDisclaimer}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
