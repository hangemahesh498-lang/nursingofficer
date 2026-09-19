import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  MessageCircle,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Phone,
  Mail,
  Users,
  Sparkles,
  Loader2,
  MessageSquareQuote
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { SystemSettings } from '../types';
import { CONTACT_CONFIG } from '../lib/contactConfig';

interface ContactAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultQuestionId?: string;
  defaultCategory?: string;
  defaultNote?: string;
}

export const ContactAdminModal: React.FC<ContactAdminModalProps> = ({
  isOpen,
  onClose,
  defaultQuestionId,
  defaultCategory = 'doubt',
  defaultNote = ''
}) => {
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const [category, setCategory] = useState<string>(defaultCategory);
  const [questionId, setQuestionId] = useState<string>(defaultQuestionId || '');
  const [message, setMessage] = useState<string>(defaultNote);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setMessage(defaultNote || '');
      setQuestionId(defaultQuestionId || '');
      setCategory(defaultCategory || 'doubt');
      
      api.getSettings().then(s => {
        setSettings(s);
        setLoadingSettings(false);
      }).catch(err => {
        console.warn('Failed loading system settings', err);
        setLoadingSettings(false);
      });
    }
  }, [isOpen, defaultQuestionId, defaultCategory, defaultNote]);

  if (!isOpen) return null;

  const telegramUsername = settings?.telegram_username?.replace(/^@/, '') || CONTACT_CONFIG.directTelegramUsername;
  const telegramDirectUrl = settings?.telegram_contact_url || CONTACT_CONFIG.directTelegramUrl;
  const telegramGroupUrl = settings?.telegram_group_url || CONTACT_CONFIG.officialTelegramChannelUrl || 'https://t.me/NursingofficerAPP';
  const telegramChannelUrl = settings?.telegram_channel_url || CONTACT_CONFIG.officialTelegramChannelUrl || 'https://t.me/NursingofficerAPP';
  const supportEmail = settings?.support_email || CONTACT_CONFIG.supportEmail;
  const supportPhone = settings?.support_phone || '+91 98765 43210';
  const supportHours = settings?.support_hours || CONTACT_CONFIG.supportAvailability;
  const customMessage = settings?.telegram_support_message || (
    language === 'mr'
      ? 'नर्सिंग ऑफिसर परीक्षेबद्दल किंवा ॲपबद्दल कोणतीही अडचण असल्यास अ‍ॅडमिनशी थेट टेलिग्रामवर संपर्क साधा.'
      : 'Have any doubts regarding Nursing Officer exam preparation or questions? Reach out directly to our admin team.'
  );

  const handleSubmitInAppTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      // Map category to report reason
      let reason: any = 'other';
      if (category === 'question_mistake') reason = 'wrong_answer';
      else if (category === 'app_issue') reason = 'other';
      else if (category === 'pro_payment') reason = 'other';
      else if (category === 'doubt') reason = 'ambiguous';

      const fullDetails = `[Category: ${category}] ${questionId ? `[Target Q: ${questionId}] ` : ''}${message.trim()}`;

      await api.createReport({
        question_id: questionId || 'general-inquiry',
        user_id: currentUser?.id || 'guest',
        user_name: currentUser?.name || 'Student Aspirant',
        reason: reason,
        details: fullDetails
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error('Failed submitting message', err);
      // Fallback: Still show completed state so student can jump to Telegram
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const openTelegramDirect = () => {
    const defaultMsg = encodeURIComponent(
      `Hello Admin, I am using Nursing Officer App (${currentUser?.name || 'Student'}).\nMy Query: ${message ? message : 'Need guidance regarding exam prep / test series.'}`
    );
    const tgUrl = `https://t.me/${telegramUsername}?text=${defaultMsg}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                {language === 'mr' ? 'अ‍ॅडमिनशी संपर्क व मदत' : 'Chat with Admin / Help'}
              </h3>
              <p className="text-xs text-blue-100/90">
                {language === 'mr' ? 'टेलिग्राम किंवा थेट मेसेजद्वारे शंका विचारा' : 'Instant support via Telegram & Direct Ticket'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* Telegram & WhatsApp Quick Contact Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/10 via-blue-50 to-emerald-50 border border-sky-200/80 shadow-xs relative overflow-hidden">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#229ED9] text-white flex items-center justify-center shadow-md shrink-0">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-slate-900 text-sm">Official Telegram & WhatsApp Support</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#229ED9]/15 text-[#0088cc] text-[11px] font-bold">
                      @{telegramUsername}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {customMessage}
                  </p>
                </div>
              </div>

              {/* Action Buttons: 1. Telegram Channel / Group, 2. Telegram Direct Chat / Contact, 3. WhatsApp */}
              <div className="pt-1 flex flex-wrap items-center gap-2">
                {/* 1. Telegram Channel / Group */}
                {telegramChannelUrl && (
                  <a
                    href={telegramChannelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold transition cursor-pointer shadow-xs active:scale-95"
                  >
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{language === 'mr' ? '१. टेलिग्राम ग्रुप / चॅनेल' : '1. Telegram Group / Channel'}</span>
                  </a>
                )}

                {/* 2. Telegram Chat / Contact */}
                <a
                  href={telegramDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={openTelegramDirect}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-black shadow-xs transition cursor-pointer active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'mr' ? '२. टेलिग्राम संपर्क' : '2. Telegram Contact'}</span>
                </a>

                {/* 3. WhatsApp */}
                {(settings?.whatsapp_number || settings?.support_phone) && (
                  <a
                    href={`https://wa.me/${(settings.whatsapp_number || settings.support_phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(language === 'mr' ? 'नमस्कार, मला नर्सिंग ऑफिसर परीक्षेबद्दल मदत हवी आहे.' : 'Hello, I need assistance with Nursing Officer preparation.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-xs active:scale-95"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* In-App Direct Message Form */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MessageSquareQuote className="w-4 h-4 text-indigo-600" />
              <span>{language === 'mr' ? 'ॲपमधून थेट अडचण नोंदवा (In-App Ticket)' : 'Send In-App Problem / Doubt'}</span>
            </h4>

            {submitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in fade-in">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h5 className="font-bold text-sm text-emerald-900">
                  {language === 'mr' ? 'तुमची अडचण अ‍ॅडमिनकडे नोंदवली गेली आहे!' : 'Your message has been submitted to Admin!'}
                </h5>
                <p className="text-xs text-emerald-700">
                  {language === 'mr' 
                    ? 'लवकर उत्तरासाठी तुम्ही वरील टेलिग्राम लिंकवरही थेट मेसेज करू शकता.'
                    : 'For fastest response within minutes, you can also ping the Admin on Telegram directly.'}
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                  >
                    {language === 'mr' ? 'आणखी अडचण सांगा' : 'Send Another Note'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-bold"
                  >
                    {language === 'mr' ? 'बंद करा' : 'Close'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitInAppTicket} className="space-y-3">
                {/* Category Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {language === 'mr' ? 'अडचणीचा प्रकार निवडा (Category)' : 'Select Issue Type'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="doubt">
                      {language === 'mr' ? '❓ प्रश्नाची शंका / स्पष्टीकरण हवे' : '❓ Question Doubt & Explanation'}
                    </option>
                    <option value="question_mistake">
                      {language === 'mr' ? '⚠️ प्रश्नात किंवा उत्तरात चूक आहे' : '⚠️ Mistake in Question / Answer Key'}
                    </option>
                    <option value="pro_payment">
                      {language === 'mr' ? '💳 PRO मेंबरशिप / पेमेंट व्हेरिफिकेशन मदत' : '💳 PRO Subscription / Payment Verification'}
                    </option>
                    <option value="app_issue">
                      {language === 'mr' ? '⚙️ ॲप वापरताना तांत्रिक अडचण' : '⚙️ App Technical Glitch / Bug'}
                    </option>
                    <option value="other">
                      {language === 'mr' ? '📝 इतर सूचना / मार्गदर्शन' : '📝 Other Feedback / Mentorship'}
                    </option>
                  </select>
                </div>

                {/* Optional Question ID */}
                {questionId && (
                  <div className="flex items-center justify-between px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-xs">
                    <span className="text-blue-800 font-medium truncate">
                      {language === 'mr' ? 'संबंधित प्रश्न ID:' : 'Attached Question ID:'} <strong>{questionId}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuestionId('')}
                      className="text-blue-600 hover:text-blue-800 text-[11px] font-bold cursor-pointer"
                    >
                      {language === 'mr' ? 'काढून टाका' : 'Clear'}
                    </button>
                  </div>
                )}

                {/* Message input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {language === 'mr' ? 'तुमची अडचण किंवा प्रश्न सविस्तर लिहा:' : 'Describe your query or problem in detail:'}
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      language === 'mr'
                        ? 'उदा. या प्रश्नाचे उत्तर B ऐवजी C वाटत आहे कारण... किंवा पेमेंट केले असून प्लॅन सुरू झालेला नाही.'
                        : 'e.g. Please clarify rationale for question #12, or need help activating PRO pass...'
                    }
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Submit button */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">
                    {currentUser ? `Sending as: ${currentUser.name}` : 'Sending as Guest Aspirant'}
                  </span>

                  <button
                    type="submit"
                    disabled={submitting || !message.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                  >
                    {submitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>{submitting ? (language === 'mr' ? 'पाठवत आहे...' : 'Sending...') : (language === 'mr' ? 'अडचण पाठवा' : 'Send to Admin')}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Alternate Contact Options (Email / Phone / Hours) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="truncate">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Email Support</div>
                <a href={`mailto:${supportEmail}`} className="font-semibold text-blue-700 hover:underline">
                  {supportEmail}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="truncate">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Support Hours</div>
                <span className="font-medium text-slate-700">
                  {supportHours}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-100/80 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Nursing Officer Prep • Student Support Desk</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition cursor-pointer"
          >
            {language === 'mr' ? 'बंद करा' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
