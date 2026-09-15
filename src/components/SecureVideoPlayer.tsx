import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Lock, EyeOff, CheckCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface SecureVideoPlayerProps {
  youtubeVideoId: string;
  title: string;
  currentUser?: UserProfile | null;
  onClose?: () => void;
}

export const SecureVideoPlayer: React.FC<SecureVideoPlayerProps> = ({
  youtubeVideoId,
  title,
  currentUser,
  onClose
}) => {
  const [screenshotAttempt, setScreenshotAttempt] = useState(false);
  const [watermarkPos, setWatermarkPos] = useState<{ top: string; left: string }>({
    top: '20%',
    left: '20%'
  });

  // Floating watermark position changes dynamically every 4.5 seconds
  useEffect(() => {
    const positions = [
      { top: '15%', left: '12%' },
      { top: '45%', left: '35%' },
      { top: '25%', left: '60%' },
      { top: '65%', left: '18%' },
      { top: '55%', left: '65%' },
      { top: '30%', left: '40%' },
      { top: '70%', left: '48%' },
    ];

    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % positions.length;
      setWatermarkPos(positions[idx]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Intercept screenshot and printing shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen key
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        triggerCaptureAlert();
      }

      // Ctrl+P / Cmd+P (Print)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        triggerCaptureAlert();
      }

      // Ctrl+S / Cmd+S (Save)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
      }

      // Mac screenshot shortcuts (Cmd + Shift + 3 / 4 / 5)
      if (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
        triggerCaptureAlert();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        triggerCaptureAlert();
      }
    };

    const triggerCaptureAlert = () => {
      setScreenshotAttempt(true);
      setTimeout(() => {
        setScreenshotAttempt(false);
      }, 3000);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const studentDisplay = currentUser?.name || currentUser?.email || 'Registered Nursing Student';
  const studentEmail = currentUser?.email || currentUser?.mobile || 'Confidential Session';
  const studentId = currentUser?.id ? `ID: ${currentUser.id.substring(0, 8)}` : 'SECURE_STREAM';

  return (
    <div
      className="relative aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl select-none secure-video-shield"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 1. Base YouTube Embed with nocookie & disabled keyboards & minimal UI */}
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&controls=1&disablekb=1&playsinline=1`}
        title={title}
        className="w-full h-full border-0 pointer-events-auto"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      {/* 2. Top-Right Anti-Share Shield (Transparent overlay blocking clicking the YouTube share icon / link) */}
      <div
        className="absolute top-0 right-0 w-32 h-14 bg-transparent z-20 cursor-default pointer-events-auto"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        title="Protected Video Stream"
      />

      {/* 3. Top-Left Anti-Title Shield (Prevents clicking title to navigate to youtube.com) */}
      <div
        className="absolute top-0 left-0 w-72 h-14 bg-transparent z-20 cursor-default pointer-events-auto"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        title="Protected Video Stream"
      />

      {/* 4. Dynamic Moving Security Watermark (Anti-Piracy & Anti-Screen-Record) */}
      <div
        className="absolute z-30 pointer-events-none transition-all duration-1000 ease-in-out px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-xs border border-white/10"
        style={{
          top: watermarkPos.top,
          left: watermarkPos.left,
        }}
      >
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-white/50 tracking-wider">
          <Shield className="w-3 h-3 text-red-400/60" />
          <span>{studentDisplay}</span>
          <span>•</span>
          <span>{studentId}</span>
        </div>
      </div>

      {/* 5. Fixed Top Left Security Tag */}
      <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
        <div className="px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-xs text-[10px] text-slate-300 font-bold border border-slate-700/80 flex items-center gap-1">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>सुरक्षित व्हिडिओ प्रवाह (DRM Protected)</span>
        </div>
      </div>

      {/* 6. Screenshot Detection Blackout Shield */}
      {screenshotAttempt && (
        <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white animate-fadeIn">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3 ring-4 ring-rose-500/30">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h4 className="text-base font-black text-rose-300 mb-1">
            ⚠️ स्क्रीनशॉट / रेकॉर्डिंग प्रतिबंधित आहे!
          </h4>
          <p className="text-xs text-slate-300 max-w-sm">
            सुरक्षा कारणास्तव व्हिडिओ व्याख्यानांचे स्क्रीनशॉट, स्क्रीन रेकॉर्डिंग किंवा शेअरिंग करणे प्रतिबंधित आहे. हा व्हिडिओ केवळ आपल्या अधिकृत खात्यासाठी आहे.
          </p>
          <div className="mt-3 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
            वापरकर्ता: {studentDisplay} • {studentEmail}
          </div>
        </div>
      )}
    </div>
  );
};
