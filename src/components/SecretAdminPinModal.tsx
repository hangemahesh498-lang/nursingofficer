import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Lock, X, CheckCircle2, AlertCircle, Eye, EyeOff, Sparkles, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface SecretAdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessNavigate: () => void;
  showToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const SecretAdminPinModal: React.FC<SecretAdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccessNavigate,
  showToast
}) => {
  const { loginWithAdminPin } = useAuth();
  const { language } = useLanguage();

  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setErrorMsg(null);
      setIsSuccess(false);
      setIsVerifying(false);
      // Auto-focus with small timeout to ensure DOM transition is ready
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = async () => {
    if (pin.length < 6) {
      setErrorMsg(language === 'mr' ? 'कृपया पूर्ण ६ अंकी पिन प्रविष्ट करा.' : 'Please enter the complete 6-digit PIN.');
      triggerShake();
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    try {
      const ok = await loginWithAdminPin(pin);
      if (ok) {
        setIsSuccess(true);
        if (showToast) {
          showToast(
            language === 'mr'
              ? '🎉 अ‍ॅडमिन लॉगिन यशस्वी!'
              : 'Admin Login Successful!',
            'success'
          );
        }
        setTimeout(() => {
          onClose();
          onSuccessNavigate();
        }, 400);
      } else {
        setErrorMsg('चुकीचा पिन! कृपया पुन्हा प्रयत्न करा.');
        triggerShake();
        setPin('');
        inputRef.current?.focus();
      }
    } catch (err: any) {
      setErrorMsg('चुकीचा पिन! कृपया पुन्हा प्रयत्न करा.');
      triggerShake();
      setPin('');
      inputRef.current?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleVerify();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only accept numeric digits up to 6 characters
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPin(val);
    if (errorMsg) setErrorMsg(null);
  };

  return (
    <div
      id="admin-pin-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="admin-pin-modal-card"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Modal Top Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-5 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <Lock className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                  🔐 Admin Access
                </h3>
                <span className="text-[10px] font-black text-amber-300 bg-amber-950/80 border border-amber-500/40 px-1.5 py-0.2 rounded tracking-wider flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 fill-amber-300" />
                  <span>BY MH</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {language === 'mr' ? '६ अंकी मास्टर सिक्युरिटी पिन प्रविष्ट करा' : 'Enter 6-digit Master Security PIN'}
              </p>
            </div>
          </div>

          <button
            id="admin-pin-modal-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer relative z-10"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Security Notice */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2.5 text-xs text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              {language === 'mr'
                ? 'हे पॅनेल केवळ अधिकृत अ‍ॅडमिनिस्ट्रेटरसाठी राखीव आहे.'
                : 'Authorized administrative verification for syllabus & exam control.'}
            </span>
          </div>

          {/* 6-Digit PIN Input Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="admin-security-pin" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                <span>{language === 'mr' ? 'मास्टर पिन (Security PIN)' : 'Master Security PIN'}</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? (language === 'mr' ? 'लपवा' : 'Hide') : (language === 'mr' ? 'दाखवा' : 'Show')}</span>
              </button>
            </div>

            <div className="relative">
              <input
                id="admin-security-pin"
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={pin}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="••••••"
                autoComplete="one-time-code"
                className={`w-full py-3 px-4 text-center tracking-[0.5em] text-2xl font-black rounded-xl border transition shadow-inner font-mono ${
                  errorMsg
                    ? 'border-rose-400 bg-rose-50/50 text-rose-900 focus:ring-2 focus:ring-rose-500'
                    : isSuccess
                    ? 'border-emerald-400 bg-emerald-50/50 text-emerald-900 focus:ring-2 focus:ring-emerald-500'
                    : 'border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'
                }`}
              />
            </div>

            {/* Visual 6 Dots Indicator */}
            <div className="flex items-center justify-center gap-2 pt-1">
              {[0, 1, 2, 3, 4, 5].map((idx) => {
                const isFilled = pin.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                      isSuccess
                        ? 'bg-emerald-500 scale-110'
                        : isFilled
                        ? 'bg-blue-600 scale-110'
                        : 'bg-slate-200'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Inline Error Message */}
          {errorMsg && (
            <div
              id="admin-pin-error-notice"
              className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-rose-700 animate-fadeIn"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Inline Success Message */}
          {isSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-700 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{language === 'mr' ? 'पिन सत्यापित झाला! पुनर्निर्देशित करत आहे...' : 'PIN verified! Redirecting to Admin Panel...'}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              id="admin-pin-cancel-btn"
              type="button"
              onClick={onClose}
              disabled={isVerifying}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              {language === 'mr' ? 'रद्द करा (Cancel)' : 'Cancel / Close'}
            </button>

            <button
              id="admin-pin-verify-btn"
              type="button"
              onClick={handleVerify}
              disabled={isVerifying || pin.length !== 6}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                pin.length === 6 && !isVerifying
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25 active:scale-98'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isVerifying ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{language === 'mr' ? 'तपासत आहे...' : 'Verifying...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{language === 'mr' ? 'पिन सत्यापित करा' : 'Verify PIN'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
