import React, { useState } from 'react';
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
  Sparkle
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { LoginModal } from './LoginModal';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab }) => {
  const { currentUser, allUsers, switchUser, hasRole, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalTab, setLoginModalTab] = useState<'member' | 'admin'>('member');

  const openLoginModal = (tab: 'member' | 'admin') => {
    setLoginModalTab(tab);
    setLoginModalOpen(true);
    setShowRoleDropdown(false);
  };

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
    { id: 'ai-coach', label: t('aiCoach'), icon: Sparkles },
    ...(hasRole(['content_editor', 'reviewer', 'admin', 'super_admin'])
      ? [{ id: 'admin-cms', label: t('adminCms'), icon: ShieldCheck }]
      : [])
  ];

  const isAdminRole = currentUser && ['admin', 'super_admin', 'reviewer', 'content_editor'].includes(currentUser.role);

  return (
    <>
      {/* SINGLE UNIFIED SLEEK HEADER (Eliminating multiple bulky stacked strips) */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-13 sm:h-16 gap-2 sm:gap-4">
            
            {/* Left: Brand Logo & Title */}
            <div
              onClick={() => setCurrentTab('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-600 flex items-center justify-center text-white shadow-xs font-black text-sm overflow-hidden border border-blue-500/30">
                <img src="/pwa-192x192.png" alt="Nursing Logo" className="w-full h-full object-cover" />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-black text-base sm:text-lg text-slate-900 tracking-tight">
                  Nursing Officer
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-200 tracking-wider">
                  PRO
                </span>
              </div>

              {/* Sub-exam tag visible on large desktop only */}
              <div className="hidden xl:flex items-center gap-1.5 ml-2 pl-2 border-l border-slate-200 text-[11px] text-slate-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>AIIMS NORCET • Maharashtra Staff Nurse • ESIC</span>
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

            {/* Right: Quick Controls & Profile */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Cloud SQL Live Status Indicator */}
              <div
                className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold"
                title="PostgreSQL Cloud SQL Live Database Connected"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>SQL Live</span>
              </div>

              {/* Language Switcher Button (Compact pill) */}
              <button
                id="lang-toggle-btn"
                onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-slate-700 border border-slate-200/80 transition cursor-pointer font-bold text-xs shadow-2xs"
                title="Toggle Language"
              >
                <Languages className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === 'en' ? 'मराठी' : 'English'}</span>
              </button>

              <PWAInstallButton />

              {/* User Account / Role Menu */}
              {currentUser ? (
                <div className="relative">
                  <button
                    id="role-switch-btn"
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 transition cursor-pointer text-xs font-bold shadow-2xs"
                  >
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="hidden sm:inline max-w-[80px] truncate">{currentUser.name}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {showRoleDropdown && (
                    <div
                      className="absolute right-0 mt-1.5 w-60 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                      onClick={() => setShowRoleDropdown(false)}
                    >
                      <div className="px-3.5 py-2 border-b border-slate-100">
                        <div className="font-bold text-xs text-slate-900">{currentUser.name}</div>
                        <div className="text-[11px] text-slate-500 capitalize">{currentUser.role.replace('_', ' ')} • {currentUser.email}</div>
                      </div>

                      {/* Admin Portal shortcut if admin */}
                      {isAdminRole && (
                        <button
                          onClick={() => setCurrentTab('admin-cms')}
                          className="w-full text-left px-3.5 py-2 text-xs font-bold text-amber-800 hover:bg-amber-50 flex items-center gap-2 transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span>Admin CMS Portal</span>
                        </button>
                      )}

                      <div className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Switch Persona
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

                      <div className="p-2 border-t border-slate-100 bg-slate-50 flex gap-1.5">
                        <button
                          onClick={() => openLoginModal('member')}
                          className="flex-1 py-1 text-center text-[10px] font-bold bg-white hover:bg-blue-50 border border-slate-200 rounded-lg text-blue-700 cursor-pointer"
                        >
                          Member Login
                        </button>
                        <button
                          onClick={() => openLoginModal('admin')}
                          className="flex-1 py-1 text-center text-[10px] font-bold bg-white hover:bg-amber-50 border border-slate-200 rounded-lg text-amber-700 cursor-pointer"
                        >
                          Admin Login
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openLoginModal('member')}
                    className="flex items-center gap-1 px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Login</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        defaultTab={loginModalTab}
      />
    </>
  );
};
