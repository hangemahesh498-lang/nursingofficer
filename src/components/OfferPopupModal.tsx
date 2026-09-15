import React, { useState, useEffect } from 'react';
import { SystemSettings } from '../types';
import { Sparkles, Copy, Check, ArrowRight, X, Gift, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface OfferPopupModalProps {
  settings: SystemSettings | null;
  onNavigateToUpgrade?: () => void;
  onActionClick?: () => void;
}

export const OfferPopupModal: React.FC<OfferPopupModalProps> = ({ settings, onNavigateToUpgrade, onActionClick }) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!settings?.offer_popup_active) return;
    
    // Check if user already closed offer in this session
    const isDismissed = sessionStorage.getItem('nursing_offer_dismissed_v1');
    if (!isDismissed) {
      // Delay slightly for smooth smooth entry
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [settings?.offer_popup_active]);

  if (!isOpen || !settings?.offer_popup_active) return null;

  const title = language === 'mr'
    ? (settings.offer_popup_title_mr || '🔥 विशेष सवलत ऑफर!')
    : (settings.offer_popup_title_en || '🔥 Special Discount Offer!');

  const message = language === 'mr'
    ? (settings.offer_popup_message_mr || 'सर्व १८ नर्सिंग विषयांचे सराव प्रश्नसंच, ५०+ ग्रँड मॉक टेस्ट्स आणि ऑल-इंडिया प्रेडिक्टर ५०% डिस्काउंटसह मिळवा!')
    : (settings.offer_popup_message_en || 'Unlock all 18 Nursing subjects, 50+ Grand Mocks & AI Coach at 50% discount!');

  const badge = settings.offer_popup_badge_mr || (language === 'mr' ? 'मर्यादित कालावधी ऑफर' : 'LIMITED TIME OFFER');
  const promoCode = settings.offer_popup_promo_code || 'MH50';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClose = () => {
    sessionStorage.setItem('nursing_offer_dismissed_v1', 'true');
    setIsOpen(false);
  };

  const handleClaimOffer = () => {
    handleClose();
    if (typeof onNavigateToUpgrade === 'function') {
      onNavigateToUpgrade();
    } else if (typeof onActionClick === 'function') {
      onActionClick();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden text-slate-900 animate-in zoom-in-95 duration-200">
        
        {/* Top Decorative Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 p-6 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-amber-100 uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{badge}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black leading-tight tracking-tight">
            {title}
          </h3>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {message}
          </p>

          {/* Promo Code Highlight Box */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/80 space-y-2 text-center">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
              {language === 'mr' ? 'हा प्रोमो कोड वापरून सवलत मिळवा:' : 'Use Promo Code at Checkout:'}
            </span>

            <div className="flex items-center justify-center gap-3">
              <div className="bg-white border-2 border-dashed border-amber-400 rounded-xl px-4 py-2 flex items-center gap-2 shadow-xs">
                <Tag className="w-4 h-4 text-amber-600" />
                <span className="text-lg font-black text-amber-900 tracking-wider">
                  {promoCode}
                </span>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-3 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{language === 'mr' ? 'कॉपी केले!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{language === 'mr' ? 'कॉपी करा' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleClaimOffer}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Gift className="w-4 h-4" />
              <span>{language === 'mr' ? 'ऑफरचा लाभ घ्या - PRO सुरू करा' : 'Claim Offer - Upgrade to PRO'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleClose}
              className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              {language === 'mr' ? 'नंतर पाहू' : 'Maybe Later'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
