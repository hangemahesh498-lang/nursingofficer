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
  Flame,
  User,
  ChevronDown,
  Award,
  Database,
  LogIn,
  LogOut,
  Download,
  FileText,
  Bell,
  CreditCard,
  Send
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab }) => {
  const { currentUser, allUsers, switchUser, hasRole, signInWithGoogle, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user')
      ) {
        // User closed or dismissed the popup voluntarily
        return;
      }
      console.warn('Google Sign In:', err?.message || err);
    } finally {
      setIsSigningIn(false);
    }
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

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'super_admin':
      case 'admin':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'reviewer':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'content_editor':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner / Utility Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            AIIMS NORCET 2025 & State Nursing Recruitment Edition
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300">
            Certified Syllabus: INC Guidelines • 100% Medical Rationale
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Cloud SQL Database Connected Badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 text-[11px] font-semibold"
            title="Cloud SQL PostgreSQL Database Connected in us-west1"
          >
            <Database className="w-3 h-3 text-emerald-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Cloud SQL (PostgreSQL)</span>
          </div>

          {/* Language Switcher */}
          <button
            id="lang-toggle-btn"
            onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer font-medium"
            title="Toggle English / Marathi"
          >
            <Languages className="w-3.5 h-3.5 text-sky-400" />
            <span>{language === 'en' ? 'मराठी' : 'English'}</span>
          </button>

          {/* Google Sign-In / User Profile */}
          <button
            id="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white border border-blue-500 transition cursor-pointer font-medium disabled:opacity-50"
            title="Sign in with Google Account"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{isSigningIn ? 'Connecting...' : 'Google Sign-In'}</span>
          </button>

          {/* Quick Role Switcher for demo/testing */}
          <div className="relative">
            <button
              id="role-switch-btn"
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="capitalize">{currentUser?.role.replace('_', ' ')}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div
                className="absolute right-0 mt-1 w-64 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1.5 z-50"
                onClick={() => setShowRoleDropdown(false)}
              >
                <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Persona
                </div>
                {allUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => switchUser(user.id)}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between ${
                      currentUser?.id === user.id ? 'bg-slate-100 font-semibold' : ''
                    }`}
                  >
                    <div>
                      <div className="text-slate-900">{user.name}</div>
                      <div className="text-slate-500 text-[11px] capitalize">{user.role.replace('_', ' ')}</div>
                    </div>
                    {currentUser?.id === user.id && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo and Brand */}
          <div
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-sm font-bold text-xl overflow-hidden border border-teal-600">
              <img src="/pwa-192x192.png" alt="Nursing Officer Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">Nursing Officer</span>
                <span className="bg-teal-100 text-teal-800 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-teal-200">
                  AI PRO
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {language === 'mr' ? 'नर्सिंग ऑफिसर सर्वसमावेशक परीक्षा मंच' : 'Nursing Officer Preparation Platform'}
              </p>
            </div>
          </div>

          {/* User Streak, Points & PWA Install */}
          <div className="flex items-center gap-3">
            <PWAInstallButton />

            {currentUser && (
              <div className="hidden lg:flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs font-semibold text-amber-900">
                  <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span>{currentUser.streakDays} Day Streak</span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 border border-sky-200 rounded-lg text-xs font-semibold text-sky-900">
                  <Award className="w-4 h-4 text-sky-600" />
                  <span>{currentUser.points} XP</span>
                </div>

                <span className={`text-[11px] px-2.5 py-1 rounded-md border font-semibold ${getRoleBadgeColor(currentUser.role)}`}>
                  {currentUser.role.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-100">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
