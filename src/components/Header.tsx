import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  Clock,
  Activity,
  AlertTriangle,
  History,
  Sparkles,
  ShieldCheck,
  Languages,
  User,
  ChevronDown,
  Database,
  FileText,
  Bell,
  CreditCard,
  GraduationCap,
  LogOut,
  Send,
  Phone,
  MessageCircle,
  Users
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { api } from '../lib/api';
import { SystemSettings } from '../types';
import { ContactAdminModal } from './ContactAdminModal';
import { CONTACT_CONFIG } from '../lib/contactConfig';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openLoginModal: (tab: 'member' | 'admin', registerMode?: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, openLoginModal }) => {
  const { currentUser, allUsers, switchUser, hasRole, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  useEffect(() => {
    api.getSettings().then(s => setSettings(s)).catch(() => {});
  }, []);

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'subjects', label: t('subjects'), icon: BookOpen },
    { id: 'practice', label: t('practice'), icon: HelpCircle },
    { id: 'mock-tests', label: t('mockTests'), icon: Clock },
    { id: 'cases', label: t('cases'), icon: Activity },
    { id: 'mistakes', label: t('mistakes'), icon: AlertTriangle },
    { id: 'pyqs', label: t('pyq'), icon: History },
    { id: 'materials', label: t('materials'), icon: FileText },
    { id: 'recruitment', label: t('recruitment'), icon: Bell },
    { id: 'upgrade-pro', label: t('upgradePro'), icon: CreditCard },
    { id: 'ai-coach', label: t('aiCoach'), icon: GraduationCap },
    ...(hasRole(['content_editor', 'reviewer', 'admin', 'super_admin'])
      ? [{ id: 'admin-cms', label: t('adminCms'), icon: ShieldCheck }]
      : [])
  ];

  const isAdminRole = currentUser && ['admin', 'super_admin', 'reviewer', 'content_editor'].includes(currentUser.role);

  const telegramUsername = settings?.telegram_username?.replace(/^@/, '') || 'NursingOfficerSupport';
  const telegramChatUrl = settings?.telegram_contact_url || `https://t.me/${telegramUsername}`;
  const telegramGroupUrl = settings?.telegram_channel_url || settings?.telegram_group_url || 'https://t.me/NursingOfficerUpdates';
  
  const rawPhone = settings?.whatsapp_number || settings?.support_phone || '';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
  const finalWaPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const waMsg = encodeURIComponent(
    language === 'mr'
      ? 'नमस्कार, मला नर्सिंग ऑफिसर परीक्षेच्या तयारीबद्दल माहिती हवी आहे.'
      : 'Hello, I need guidance regarding Nursing Officer Exam preparation.'
  );
  const whatsAppUrl = finalWaPhone ? `https://wa.me/${finalWaPhone}?text=${waMsg}` : 'https://wa.me/';
  const showWhatsApp = settings?.show_whatsapp !== false && settings?.show_support_phone !== false && !!rawPhone;

  return (
    <>
      {/* TOP SCROLLING ANNOUNCEMENT TICKER */}
      {settings?.ticker_active !== false && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white text-xs font-bold py-1.5 px-3 sm:px-4 overflow-hidden relative z-50 flex items-center justify-between border-b border-amber-500/40">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full overflow-hidden">
            <span className="bg-white/20 text-amber-100 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
              <span>{language === 'mr' ? 'विशेष ऑफर' : 'SPECIAL OFFER'}</span>
            </span>
            <div className="whitespace-nowrap overflow-x-auto no-scrollbar font-semibold text-[11px] sm:text-xs text-amber-50">
              {language === 'mr'
                ? (settings?.ticker_text_mr || '🎉 विशेष सराव ऑफर: MH50 प्रोमो कोड वापरा आणि ५०% सूट मिळवा! 🎉')
                : (settings?.ticker_text_en || '🎉 Special Offer: Use promo code MH50 to get 50% OFF! 🎉')}
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('upgrade-pro')}
            className="hidden sm:flex items-center gap-1 bg-white text-amber-950 text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-md hover:bg-amber-50 transition shrink-0 cursor-pointer ml-2 shadow-xs"
          >
            <span>{language === 'mr' ? 'सवलत मिळवा (50% OFF)' : 'Get Discount (50% OFF)'}</span>
          </button>
        </div>
      )}

      {/* SINGLE UNIFIED SLEEK HEADER */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-2 sm:px-6">
          <div className="flex items-center justify-between h-12 sm:h-16 gap-1.5 sm:gap-4">
            
            {/* Left: Brand Logo & Title */}
            <div
              onClick={() => setCurrentTab('dashboard')}
              className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer select-none shrink-0 group"
            >
              <div className="w-7 h-7 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs font-black text-xs overflow-hidden border border-blue-400/30 ring-1 ring-blue-500/20 group-hover:scale-105 transition shrink-0">
                <img
                  src="/icon.png"
                  alt="Nursing Officer BY MH"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/pwa-192x192.png';
                  }}
                />
              </div>

              {/* Title with prominent "Nursing Officer" and eye-catching "BY MH" badge */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-black text-[13px] xs:text-[15px] sm:text-lg md:text-xl tracking-tight bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 bg-clip-text text-transparent whitespace-nowrap group-hover:from-blue-900 group-hover:to-indigo-600 transition">
                  Nursing Officer
                </span>
                <span className="text-[8px] sm:text-[10px] font-black text-white bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 border border-blue-400/30 px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded-md tracking-wider shadow-xs shrink-0 flex items-center gap-0.5">
                  <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-amber-300 fill-amber-300 shrink-0" />
                  <span>BY MH</span>
                </span>
              </div>

              {/* Sub-exam tag visible on large desktop only */}
              <div className="hidden xl:flex items-center gap-1.5 ml-2 pl-2 border-l border-slate-200 text-[11px] text-slate-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>AIIMS NORCET • DMER • ESIC</span>
              </div>
            </div>

            {/* Center: Desktop Navigation Bar (Hidden on Mobile to save vertical space) */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.slice(0, 7).map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                const isSpecialAdmin = item.id === 'admin-cms';
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                      isActive
                        ? isSpecialAdmin
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-blue-600 text-white shadow-xs'
                        : isSpecialAdmin
                        ? 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : isSpecialAdmin ? 'text-amber-700' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right: Quick Compact Controls (Language, TG Group, TG Chat, WhatsApp) */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {/* Cloud SQL Live Status Indicator (Desktop only) */}
              <div
                className="hidden xl:flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold"
                title="PostgreSQL Cloud SQL Live Database Connected"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>SQL Live</span>
              </div>

              {/* Language Switcher Button (Ultra compact) */}
              <button
                id="lang-toggle-btn"
                onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
                className="flex items-center justify-center gap-0.5 px-1 sm:px-2 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-slate-700 border border-slate-200/80 transition cursor-pointer font-bold text-[10px] sm:text-xs shadow-2xs shrink-0"
                title={language === 'en' ? 'मराठीत बदला' : 'Switch to English'}
              >
                <Languages className="w-3 h-3 text-blue-600 shrink-0" />
                <span className="font-extrabold">{language === 'en' ? 'म' : 'EN'}</span>
              </button>

              <div className="hidden md:block">
                <PWAInstallButton />
              </div>

              {/* 1. DIRECT TELEGRAM SUPPORT CHAT Button */}
              <a
                id="header-telegram-direct-btn"
                href={CONTACT_CONFIG.directTelegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] sm:text-xs transition cursor-pointer shadow-xs active:scale-95 shrink-0"
                title={language === 'mr' ? 'थेट टेलिग्राम सपोर्ट चॅट (1-on-1 Support)' : 'Direct 1-on-1 Telegram Support'}
              >
                <Send className="w-3.5 h-3.5 text-indigo-100 shrink-0" />
                <span>{language === 'mr' ? 'टेलिग्राम' : 'Telegram'}</span>
              </a>

              {/* 2. WHATSAPP Contact Button */}
              {showWhatsApp && (
                <a
                  id="header-whatsapp-btn"
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] sm:text-xs transition cursor-pointer shadow-xs active:scale-95 shrink-0"
                  title={language === 'mr' ? 'थेट व्हॉट्सॲपवर संपर्क करा' : 'Chat on WhatsApp'}
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-100 shrink-0" />
                  <span>{language === 'mr' ? 'व्हॉट्सॲप' : 'WhatsApp'}</span>
                </a>
              )}

              {/* User Profile Pill & Quick Account Switcher dropdown if logged in */}
              {currentUser && (
                <div className="relative shrink-0">
                  <button
                    id="role-switch-btn"
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition cursor-pointer text-xs font-bold shadow-2xs"
                    title="User Profile & Quick Switch"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="hidden md:inline max-w-[80px] truncate">{currentUser.name}</span>
                    <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
                  </button>

                  {showRoleDropdown && (
                    <div
                      className="absolute right-0 mt-1.5 w-64 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                      onClick={() => setShowRoleDropdown(false)}
                    >
                      <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-xs text-slate-900">{currentUser.name}</div>
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                            {currentUser.role.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">{currentUser.email}</div>
                      </div>

                      {/* Direct My Profile link */}
                      <button
                        onClick={() => setCurrentTab('profile')}
                        className="w-full text-left px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50 flex items-center gap-2 transition cursor-pointer"
                      >
                        <User className="w-4 h-4 text-blue-600" />
                        <span>{language === 'mr' ? 'माझे प्रोफाइल (My Profile)' : 'My Profile & Stats'}</span>
                      </button>

                      {/* Admin Portal shortcut if admin */}
                      {isAdminRole && (
                        <button
                          onClick={() => setCurrentTab('admin-cms')}
                          className="w-full text-left px-3.5 py-2 text-xs font-bold text-amber-800 hover:bg-amber-50 flex items-center gap-2 transition cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span>Admin CMS Management</span>
                        </button>
                      )}

                      <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Quick Switch Account
                      </div>

                      {allUsers.map(user => (
                        <button
                          key={user.id}
                          onClick={() => switchUser(user.id)}
                          className={`w-full text-left px-3.5 py-1.5 text-xs hover:bg-slate-50 flex items-center justify-between transition cursor-pointer ${
                            currentUser?.id === user.id ? 'bg-blue-50/70 font-bold text-blue-900' : ''
                          }`}
                        >
                          <div>
                            <div className="font-semibold">{user.name}</div>
                            <div className="text-[10px] text-slate-400 capitalize">{user.role.replace('_', ' ')}</div>
                          </div>
                          {currentUser?.id === user.id && (
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                          )}
                        </button>
                      ))}

                      <div className="p-2 border-t border-slate-100 bg-slate-50 flex gap-2">
                        <button
                          onClick={() => signOut()}
                          className="w-full py-1.5 text-center text-xs font-bold bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-rose-700 cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-600" />
                          <span>{language === 'mr' ? 'बाहेर पडा (Sign Out)' : 'Sign Out'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Support & Contact Dialog */}
      <ContactAdminModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </>
  );
};
