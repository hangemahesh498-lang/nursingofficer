import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  Clock,
  Sparkles,
  FileText,
  CreditCard,
  Bell,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const { t } = useLanguage();

  const quickNavItems = [
    { id: 'dashboard', label: t('dashboard') || 'Home', icon: LayoutDashboard },
    { id: 'practice', label: t('practice') || 'Practice', icon: HelpCircle },
    { id: 'mock-tests', label: t('mockTests') || 'Mocks', icon: Clock },
    { id: 'materials', label: t('materials') || 'Notes', icon: FileText },
    { id: 'ai-coach', label: t('aiCoach') || 'AI Coach', icon: Sparkles },
    { id: 'upgrade-pro', label: t('upgradePro') || 'PRO', icon: CreditCard, highlight: true }
  ];

  return (
    <nav
      id="student-bottom-quick-access"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-2xl flex items-center justify-around safe-area-bottom"
    >
      {quickNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            id={`quick-access-${item.id}`}
            onClick={() => setCurrentTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition cursor-pointer relative ${
              isActive
                ? 'text-teal-700 font-bold'
                : item.highlight
                ? 'text-amber-600 hover:text-amber-700 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div
              className={`relative p-1 rounded-xl transition ${
                isActive
                  ? 'bg-teal-50 text-teal-800'
                  : item.highlight
                  ? 'bg-amber-50 text-amber-600'
                  : ''
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.highlight && !isActive && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              )}
            </div>
            <span className="text-[10px] tracking-tight leading-tight mt-0.5 truncate max-w-[58px]">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
