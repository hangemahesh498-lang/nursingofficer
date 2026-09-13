import React, { useEffect, useState } from 'react';
import { ShieldAlert, EyeOff, Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const SecurityEnforcer: React.FC = () => {
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const [securityWarningOpen, setSecurityWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);

  useEffect(() => {
    // 1. Prevent Right-Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerWarning(
        language === 'mr'
          ? 'सुरक्षेच्या कारणास्तव उजवे क्लिक (Right Click) व कॉपी करणे प्रतिबंधित आहे.'
          : 'Right-click and text copying are disabled to protect examination content.'
      );
      return false;
    };

    // 2. Prevent Copy, Cut, Drag
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerWarning(
        language === 'mr'
          ? 'प्रश्नांची चोरी व कॉपी करणे प्रतिबंधित आहे. तुमचे सत्र नोंदवले जात आहे.'
          : 'Content copying is prohibited. Your session is monitored for integrity.'
      );
      return false;
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // 3. Intercept Screenshot & Developer Keys
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen key
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        e.preventDefault();
        // Clear clipboard
        try {
          navigator.clipboard.writeText('');
        } catch (_) {}
        triggerWarning(
          language === 'mr'
            ? '⚠️ स्क्रीनशॉट प्रतिबंधित आहे! परीक्षा व अभ्यास साहित्य सुरक्षित ठेवण्यासाठी स्क्रीनशॉट घेण्यास सक्त मनाई आहे.'
            : '⚠️ Screenshots Prohibited! Taking screenshots of study and examination materials is strictly prohibited.'
        );
        return false;
      }

      // Windows Snipping tool (Win + Shift + S) or Mac (Cmd + Shift + 3/4)
      if (
        (e.key.toLowerCase() === 's' && (e.ctrlKey || e.metaKey) && e.shiftKey) ||
        (e.key.toLowerCase() === 'p' && (e.ctrlKey || e.metaKey)) || // Ctrl + P (Print)
        (e.key.toLowerCase() === 'u' && (e.ctrlKey || e.metaKey)) || // Ctrl + U (View Source)
        (e.key.toLowerCase() === 'c' && (e.ctrlKey || e.metaKey) && e.shiftKey) || // Ctrl + Shift + C
        (e.key.toLowerCase() === 'i' && (e.ctrlKey || e.metaKey) && e.shiftKey) || // Ctrl + Shift + I
        (e.key.toLowerCase() === 'j' && (e.ctrlKey || e.metaKey) && e.shiftKey) || // Ctrl + Shift + J
        e.key === 'F12'
      ) {
        e.preventDefault();
        triggerWarning(
          language === 'mr'
            ? '⚠️ स्क्रीन कॅप्चर व डेव्हलपर टूल्स प्रतिबंधित आहेत.'
            : '⚠️ Screen capture, printing, and inspection shortcuts are disabled.'
        );
        return false;
      }
    };

    // 4. Blur overlay when user switches window / app (anti-screen recorder / external grabber)
    const handleBlur = () => {
      setIsWindowBlurred(true);
    };

    const handleFocus = () => {
      setIsWindowBlurred(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsWindowBlurred(true);
      } else {
        setIsWindowBlurred(false);
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('dragstart', handleDragStart);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [language]);

  const triggerWarning = (msg: string) => {
    setWarningMessage(msg);
    setSecurityWarningOpen(true);
  };

  const userWatermark = currentUser?.email || currentUser?.phone || currentUser?.name || 'Aspirant';

  return (
    <>
      {/* 1. Global Protective Watermark across the app */}
      <div
        className="pointer-events-none fixed inset-0 z-30 select-none overflow-hidden opacity-[0.035] flex flex-wrap items-center justify-around gap-24 p-8"
        aria-hidden="true"
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="rotate-[-28deg] text-xs font-black tracking-widest text-slate-900 whitespace-nowrap">
            {userWatermark} • SECURE EXAM CONTENT • SCREENSHOT PROHIBITED
          </div>
        ))}
      </div>

      {/* 2. Privacy/Security Shield Blur when window is out of focus */}
      {isWindowBlurred && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 transition-all"
          onClick={() => setIsWindowBlurred(false)}
        >
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full text-center space-y-3 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black text-slate-900">
              {language === 'mr' ? 'अ‍ॅप सुरक्षितता सक्रिय' : 'Protected Session Active'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {language === 'mr'
                ? 'स्क्रीन रेकॉर्डिंग व स्क्रीनशॉट प्रतिबंधामुळे पडदा अस्पष्ट केला गेला आहे. सुरू ठेवण्यासाठी येथे क्लिक करा.'
                : 'Content is shielded to protect exam integrity. Tap anywhere to resume.'}
            </p>
            <button
              type="button"
              onClick={() => setIsWindowBlurred(false)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              {language === 'mr' ? 'सराव सुरू ठेवा' : 'Continue Practice'}
            </button>
          </div>
        </div>
      )}

      {/* 3. Explicit Security Warning Modal on Screenshot attempt */}
      {securityWarningOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-rose-200">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                SECURITY VIOLATION PREVENTED
              </span>
              <h3 className="text-base font-black text-slate-900">
                {language === 'mr' ? 'स्क्रीनशॉट प्रतिबंधित आहे' : 'Screenshots Strictly Prohibited'}
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {warningMessage || (language === 'mr'
                ? 'कॉपीराइट आणि अधिकृत परीक्षा नियमांनुसार या अ‍ॅपमधील प्रश्न, उत्तरे आणि स्पष्टीकरणांचे स्क्रीनशॉट घेणे किंवा कॉपी करणे सक्त मनाई आहे.'
                : 'As per exam copyright and platform guidelines, capturing screenshots or copying question materials is strictly forbidden.')}
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left flex items-start gap-2.5 text-[11px] text-slate-600">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">उमेदवार नोंद: </span>
                {userWatermark} (Session Monitored)
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSecurityWarningOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition cursor-pointer shadow-xs"
            >
              {language === 'mr' ? 'मी समजलो (पुढे जा)' : 'I Understand (Continue)'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
