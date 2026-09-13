import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  FileText,
  Sparkles,
  Crown,
  Menu,
  X,
  AlertTriangle,
  Activity,
  History,
  Bell,
  Languages,
  ShieldCheck,
  LogOut,
  ChevronRight,
  User,
  Zap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { LoginModal } from './LoginModal';
import { api } from '../lib/api';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const { language, setLanguage } = useLanguage();
  const { currentUser, signOut } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalTab, setLoginModalTab] = useState<'member' | 'admin'>('member');
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
  const [dueMistakesCount, setDueMistakesCount] = useState<number>(0);

  useEffect(() => {
    if (currentUser) {
      api.getStudentStats().then(stats => {
        if (stats && stats.dueForRevisionCount) {
          setDueMistakesCount(stats.dueForRevisionCount);
        }
      }).catch(() => {});
    }
  }, [currentUser, currentTab]);

  const navItems = [
    {
      id: 'dashboard',
      label: language === 'mr' ? 'होम' : 'Home',
      icon: LayoutDashboard,
      isActive: currentTab === 'dashboard'
    },
    {
      id: 'subjects',
      label: language === 'mr' ? 'सराव' : 'Practice',
      icon: BookOpen,
      isActive: currentTab === 'subjects' || currentTab === 'practice'
    },
    {
      id: 'mock-tests',
      label: language === 'mr' ? 'मॉक टेस्ट' : 'Tests',
      icon: ClipboardCheck,
      isActive: currentTab === 'mock-tests'
    },
    {
      id: 'ai-coach',
      label: language === 'mr' ? 'AI कोच' : 'AI Coach',
      icon: Sparkles,
      isActive: currentTab === 'ai-coach',
      badge: { text: 'AI', bg: 'bg-indigo-600' }
    },
    {
      id: 'more',
      label: language === 'mr' ? 'अधिक' : 'More',
      icon: Menu,
      isActive: ['cases', 'mistakes', 'pyqs', 'materials', 'recruitment', 'upgrade-pro', 'admin-cms'].includes(currentTab),
      badge: dueMistakesCount > 0 ? { text: `${dueMistakesCount}`, bg: 'bg-rose-600' } : undefined,
      onClick: () => setMoreDrawerOpen(true)
    }
  ];

  const handleSelectTab = (tabId: string) => {
    setCurrentTab(tabId);
    setMoreDrawerOpen(false);
  };

  const isAdminRole = currentUser && ['admin', 'super_admin', 'reviewer', 'content_editor'].includes(currentUser.role);

  return (
    <>
      <nav
        id="student-bottom-navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-1 py-1 shadow-lg flex items-center justify-around select-none"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 4px)' }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else {
                  handleSelectTab(item.id);
                }
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition cursor-pointer relative min-h-[48px] ${
                item.isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {/* Optional badge */}
              {item.badge && (
                <span
                  className={`absolute top-0.5 right-2 px-1 py-0.2 ${item.badge.bg} text-white text-[8px] font-black rounded-full leading-none shadow-xs`}
                >
                  {item.badge.text}
                </span>
              )}

              <div
                className={`relative p-1 rounded-xl transition ${
                  item.isActive
                    ? 'bg-blue-50 text-blue-600 scale-105'
                    : 'text-slate-500'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold tracking-tight leading-tight mt-0.5 truncate max-w-[60px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* MOBILE ALL FEATURES DRAWER (Bottom Sheet) */}
      {moreDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setMoreDrawerOpen(false)}
          />

          <div className="relative bg-white rounded-t-3xl p-4 sm:p-5 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom duration-250">
            {/* Grab handle */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />

            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  NO
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {language === 'mr' ? 'सर्व विभाग व सुविधा' : 'All Modules & Tools'}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">Nursing Officer Preparation</p>
                </div>
              </div>
              <button
                onClick={() => setMoreDrawerOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Mistake Notebook */}
              <button
                onClick={() => handleSelectTab('mistakes')}
                className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left flex flex-col justify-between h-22 transition relative group"
              >
                {dueMistakesCount > 0 && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-rose-600 text-white text-[9px] font-black rounded-full shadow-xs">
                    {dueMistakesCount} Due
                  </span>
                )}
                <div className="p-1.5 rounded-xl bg-amber-100 text-amber-800 w-fit">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-black text-slate-900 text-xs">
                    {language === 'mr' ? 'चूक वही' : 'Mistakes'}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">Spaced Revision</div>
                </div>
              </button>

              {/* Clinical Cases */}
              <button
                onClick={() => handleSelectTab('cases')}
                className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left flex flex-col justify-between h-22 transition"
              >
                <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800 w-fit">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-black text-slate-900 text-xs">
                    {language === 'mr' ? 'क्लिनिकल केसेस' : 'Clinical Cases'}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">ICU & ER Scenarios</div>
                </div>
              </button>

              {/* PYQs Verified */}
              <button
                onClick={() => handleSelectTab('pyqs')}
                className="p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-left flex flex-col justify-between h-22 transition"
              >
                <div className="p-1.5 rounded-xl bg-sky-100 text-sky-800 w-fit">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-black text-slate-900 text-xs">
                    {language === 'mr' ? 'मागील वर्षांचे प्रश्न' : 'PYQ Bank'}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">2018-2025 AIIMS</div>
                </div>
              </button>

              {/* Study Notes & Formulas */}
              <button
                onClick={() => handleSelectTab('materials')}
                className="p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-left flex flex-col justify-between h-22 transition"
              >
                <div className="p-1.5 rounded-xl bg-indigo-100 text-indigo-800 w-fit">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-black text-slate-900 text-xs">
                    {language === 'mr' ? 'अभ्यास साहित्य' : 'Study Notes'}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">Formulas & Charts</div>
                </div>
              </button>
            </div>

            {/* List Menu for Secondary items */}
            <div className="space-y-1.5 pt-1 border-t border-slate-100 text-xs font-bold text-slate-700">
              {/* Recruitment Alerts */}
              <button
                onClick={() => handleSelectTab('recruitment')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span>{language === 'mr' ? 'भरती सूचना (NORCET / DHS / ESIC)' : 'Recruitment Alerts'}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Upgrade to PRO */}
              <button
                onClick={() => handleSelectTab('upgrade-pro')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Crown className="w-4 h-4 text-slate-950" />
                  <span>{language === 'mr' ? 'PRO VIP अपग्रेड (अमर्यादित सराव)' : 'Upgrade to PRO VIP Pass'}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-950" />
              </button>

              {/* Admin CMS (if authorized) */}
              {isAdminRole && (
                <button
                  onClick={() => handleSelectTab('admin-cms')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>{language === 'mr' ? 'अ‍ॅडमिन पोर्टल (CMS & प्रश्न व्यवस्थापन)' : 'Admin CMS Portal'}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-700" />
                </button>
              )}

              {/* Language Switch */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-slate-800">
                <div className="flex items-center gap-2.5">
                  <Languages className="w-4 h-4 text-blue-600" />
                  <span>{language === 'mr' ? 'भाषा (Language)' : 'Language (मराठी/English)'}</span>
                </div>
                <button
                  onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
                  className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-blue-700 font-extrabold text-xs shadow-2xs"
                >
                  {language === 'en' ? 'मराठी निवडा' : 'English'}
                </button>
              </div>

              {/* Account / Role */}
              {currentUser && (
                <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{currentUser.name}</div>
                      <div className="text-[10px] text-slate-500 capitalize">{currentUser.role.replace('_', ' ')}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMoreDrawerOpen(false);
                      setLoginModalOpen(true);
                    }}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Switch
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        defaultTab={loginModalTab}
      />
    </>
  );
};

