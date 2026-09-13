import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../context/LanguageContext';
import {
  Download,
  Smartphone,
  Share,
  PlusSquare,
  CheckCircle2,
  X,
  ExternalLink,
  Laptop,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { language } = useLanguage();
  const [showModal, setShowModal] = useState(false);

  // If already running as standalone launcher app, show subtle active badge or hide
  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>App Installed</span>
      </div>
    );
  }

  const handleOpenInstall = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleOpenInstall}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white text-xs font-bold shadow-xs hover:shadow-sm transition active:scale-95 cursor-pointer"
        title="Install / Launch App on Phone or PC"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{language === 'mr' ? 'अ‍ॅप इन्स्टॉल करा' : 'Install App'}</span>
      </button>

      {/* Launcher & Install Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in duration-150">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* App Launcher Header */}
            <div className="flex items-center gap-4">
              <img
                src="/icon.svg"
                alt="NursingPrep Launcher Icon"
                className="w-16 h-16 rounded-2xl shadow-md border border-slate-100 p-1 bg-teal-900"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <span>NursingPrep App</span>
                  <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-extrabold">
                    PWA Launcher
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'mr'
                    ? 'मोबाईल व कॉम्प्युटरसाठी अधिकृत नर्सिंग अधिकारी अ‍ॅप'
                    : 'Fast offline-ready app launcher for Mobile & Desktop'}
                </p>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[11px] text-slate-700">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                <span>5 Free MCQs / Topic</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Home Screen Launcher</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Zero Ads & Fast Load</span>
              </div>
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Works on PC & Mobile</span>
              </div>
            </div>

            {/* Platform Instructions */}
            {isInstallable ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 text-center font-medium">
                  {language === 'mr'
                    ? 'आपल्या डिव्हाइसवर १-क्लिकमध्ये अ‍ॅप इन्स्टॉल करा आणि थेट होम स्क्रीनवरून सुरू करा.'
                    : 'Click below to add the NursingPrep app directly to your device home screen / desktop.'}
                </p>
                <button
                  onClick={async () => {
                    await install();
                    setShowModal(false);
                  }}
                  className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'mr' ? 'आताच इन्स्टॉल करा' : 'Install NursingPrep Now'}</span>
                </button>
              </div>
            ) : isIOS ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2 text-xs text-amber-900">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <Share className="w-4 h-4 text-amber-700" />
                  <span>iOS (iPhone / iPad) वर ॲप कसे इन्स्टॉल करावे:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-amber-800 text-[11px]">
                  <li>Safari ब्राऊझरमध्ये तळाशी असलेले <strong>Share (शेअर)</strong> बटण दाबा.</li>
                  <li>खाली स्क्रोल करा आणि <strong>'Add to Home Screen' (होम स्क्रीनवर जोडा)</strong> निवडा.</li>
                  <li>उजव्या कोपऱ्यात <strong>'Add'</strong> दाबा. ॲप होम स्क्रीनवर दिसेल.</li>
                </ol>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs text-slate-700">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-teal-600" />
                  <span>Android / Chrome / Desktop Setup:</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {language === 'mr'
                    ? 'ब्राऊझर मेन्यू (३ डॉट्स ⋮) वर क्लिक करा आणि "Install app" किंवा "Add to Home Screen" निवडा. त्यानंतर ॲप स्वतंत्र ॲपप्रमाणे चालू होईल.'
                    : 'Click the browser menu (⋮ 3 dots) and select "Install app" or "Add to Home screen" to launch full screen.'}
                </p>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
            >
              {language === 'mr' ? 'बंद करा' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
