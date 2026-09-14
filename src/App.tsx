import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { SubjectsView } from './components/SubjectsView';
import { PracticeEngineView } from './components/PracticeEngineView';
import { MockTestEngineView } from './components/MockTestEngineView';
import { ClinicalCaseView } from './components/ClinicalCaseView';
import { MistakeNotebookView } from './components/MistakeNotebookView';
import { PyqView } from './components/PyqView';
import { AiStudyCoachView } from './components/AiStudyCoachView';
import { AdminCmsView } from './components/AdminCmsView';
import { StudyMaterialsView } from './components/StudyMaterialsView';
import { RecruitmentNoticeView } from './components/RecruitmentNoticeView';
import { UpgradeProView } from './components/UpgradeProView';
import { ProfileView } from './components/ProfileView';
import { ContactUsView } from './components/ContactUsView';
import { ComplianceFooter } from './components/ComplianceFooter';
import { SecurityEnforcer } from './components/SecurityEnforcer';
import { BottomNav } from './components/BottomNav';
import { LoginModal } from './components/LoginModal';
import { MaintenanceView } from './components/MaintenanceView';
import { OfferPopupModal } from './components/OfferPopupModal';
import { api } from './lib/api';
import { SystemSettings } from './types';
import { CONTACT_CONFIG } from './lib/contactConfig';

function AppContent() {
  const { currentUser, isSuperAdmin, isAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [practiceSubjectFilter, setPracticeSubjectFilter] = useState<string | undefined>(undefined);
  const [aiCoachTopic, setAiCoachTopic] = useState<string | undefined>(undefined);
  const [aiCoachDoubt, setAiCoachDoubt] = useState<string | undefined>(undefined);
  const [aiCoachContext, setAiCoachContext] = useState<string | undefined>(undefined);

  const [settings, setSettings] = useState<SystemSettings | null>(null);

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalTab, setLoginModalTab] = useState<'member' | 'admin'>('member');
  const [loginModalInitialRegister, setLoginModalInitialRegister] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const s = await api.getSettings();
        setSettings(s);
      } catch (err) {
        console.error('Failed to load settings in App:', err);
      }
    }
    fetchSettings();
  }, [currentTab]);

  const openLoginModal = (tab: 'member' | 'admin', registerMode = false) => {
    setLoginModalTab(tab);
    setLoginModalInitialRegister(registerMode);
    setLoginModalOpen(true);
  };

  const handleDashboardNavigate = (tab: string, filter?: any) => {
    if (tab === 'practice' && filter?.subject_id) {
      setPracticeSubjectFilter(filter.subject_id);
    }
    if (tab === 'ai-coach' && filter?.topic) {
      setAiCoachTopic(filter.topic);
    }
    setCurrentTab(tab);
  };

  const handleAskAiCoachFromPractice = (doubt: string, context: string) => {
    setAiCoachDoubt(doubt);
    setAiCoachContext(context);
    setCurrentTab('ai-coach');
  };

  // If Maintenance Mode is Active & User is not Admin/SuperAdmin
  if (settings?.maintenance_mode && !isSuperAdmin && !isAdmin && currentTab !== 'admin-cms') {
    return <MaintenanceView settings={settings} onAdminLoginClick={() => openLoginModal('admin')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans select-none overflow-x-hidden w-full relative">
      {/* Active App Screenshot & Anti-Leak Protection */}
      <SecurityEnforcer />

      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} openLoginModal={openLoginModal} />

      <main className="grow pb-24 lg:pb-8">
        {currentTab === 'landing' && (
          <LandingView
            onGetStarted={() => setCurrentTab('dashboard')}
            onExploreMock={() => setCurrentTab('mock-tests')}
            onOpenRegister={() => openLoginModal('member', true)}
            onOpenLogin={() => openLoginModal('member', false)}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView onNavigate={handleDashboardNavigate} openLoginModal={openLoginModal} />
        )}

        {currentTab === 'subjects' && (
          <SubjectsView
            onSelectSubject={subId => {
              setPracticeSubjectFilter(subId);
              setCurrentTab('practice');
            }}
          />
        )}

        {currentTab === 'practice' && (
          <PracticeEngineView
            initialSubjectId={practiceSubjectFilter}
            onAskAiCoach={handleAskAiCoachFromPractice}
            onBack={() => setCurrentTab('subjects')}
            openLoginModal={openLoginModal}
            onNavigateToUpgradePro={() => setCurrentTab('upgrade-pro')}
          />
        )}

        {currentTab === 'mock-tests' && (
          <MockTestEngineView
            onGoToMistakes={() => setCurrentTab('mistakes')}
            onBackToDashboard={() => setCurrentTab('dashboard')}
            onNavigateToUpgradePro={() => setCurrentTab('upgrade-pro')}
            openLoginModal={openLoginModal}
          />
        )}

        {currentTab === 'cases' && <ClinicalCaseView />}

        {currentTab === 'mistakes' && (
          <MistakeNotebookView
            onStartRetest={qIds => {
              setCurrentTab('practice');
            }}
          />
        )}

        {currentTab === 'pyqs' && <PyqView />}

        {currentTab === 'materials' && (
          <StudyMaterialsView onUpgradePro={() => setCurrentTab('upgrade-pro')} />
        )}

        {currentTab === 'recruitment' && <RecruitmentNoticeView />}

        {currentTab === 'upgrade-pro' && <UpgradeProView />}

        {currentTab === 'profile' && (
          <ProfileView
            onNavigateToUpgradePro={() => setCurrentTab('upgrade-pro')}
            onNavigateToMockTests={() => setCurrentTab('mock-tests')}
            onNavigateToMistakes={() => setCurrentTab('mistakes')}
            onNavigateToSubjects={() => setCurrentTab('subjects')}
          />
        )}

        {currentTab === 'ai-coach' && (
          <AiStudyCoachView
            initialTopic={aiCoachTopic}
            initialDoubt={aiCoachDoubt}
            initialContext={aiCoachContext}
          />
        )}

        {(currentTab === 'contact' || currentTab === 'contact-us') && (
          <ContactUsView onNavigateToUpgrade={() => setCurrentTab('upgrade-pro')} />
        )}

        {currentTab === 'admin-cms' && <AdminCmsView />}
      </main>

      {/* Mobile Student Bottom Quick Access Bar */}
      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Single Sleek Global Compliance & Policy Footer */}
      <ComplianceFooter
        onNavigateToContact={() => setCurrentTab('contact-us')}
        onNavigateToAbout={() => setCurrentTab('landing')}
      />

      {/* Login / Register Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        defaultTab={loginModalTab}
        initialRegisterMode={loginModalInitialRegister}
      />

      {/* Global Offer Announcement Popup Modal */}
      <OfferPopupModal
        settings={settings}
        onNavigateToUpgrade={() => setCurrentTab('upgrade-pro')}
        onActionClick={() => setCurrentTab('upgrade-pro')}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
