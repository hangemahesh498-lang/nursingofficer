import React, { useState } from 'react';
import { Wrench, ShieldCheck, AlertCircle, RefreshCw, Lock, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SystemSettings } from '../types';

interface MaintenanceViewProps {
  settings: SystemSettings | null;
  onOpenAdminLogin: () => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({ settings, onOpenAdminLogin }) => {
  const { language } = useLanguage();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  const message = language === 'mr'
    ? (settings?.maintenance_message || 'ॲपमध्ये नवीन वैशिष्ट्ये आणि सुधारणा जोडण्याचे काम सुरू आहे. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.')
    : (settings?.maintenance_message || 'Platform system maintenance is currently underway to deploy fresh features and performance upgrades. Please check back shortly.');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        
        {/* Animated Wrench / Maintenance Icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-lg shadow-orange-500/20">
          <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center">
            <Wrench className="w-10 h-10 text-amber-400 animate-bounce" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            <span>{language === 'mr' ? 'सिस्टीम मेंटेनन्स सुरू आहे' : 'System Maintenance In Progress'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {language === 'mr' ? 'ॲप सध्या अपग्रेड होत आहे' : 'App Maintenance Underway'}
          </h1>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
          {message}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{language === 'mr' ? 'पुन्हा तपासा (Refresh)' : 'Check Again'}</span>
          </button>

          <button
            onClick={onOpenAdminLogin}
            className="w-full sm:w-auto px-5 py-3 bg-slate-700/80 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-600/80 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'mr' ? 'अ‍ॅडमिन एंट्री (Admin Login)' : 'Admin Login'}</span>
          </button>
        </div>

        <div className="pt-4 border-t border-slate-700/60 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="font-semibold text-slate-400">Nursing Officer BY MH</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{language === 'mr' ? 'सुरक्षित सिस्टीम' : 'Secure System'}</span>
          </span>
        </div>

      </div>
    </div>
  );
};
