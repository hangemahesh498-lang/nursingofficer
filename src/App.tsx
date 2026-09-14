import React, { useState } from 'react';
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
import { SecurityEnforcer } from './components/SecurityEnforcer';
import { BottomNav } from './components/BottomNav';
import { LoginModal } from './components/LoginModal';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [practiceSubjectFilter, setPracticeSubjectFilter] = useState<string | undefined>(undefined);
  const [aiCoachTopic, setAiCoachTopic] = useState<string | undefined>(undefined);
  const [aiCoachDoubt, setAiCoachDoubt] = useState<string | undefined>(undefined);
  const [aiCoachContext, setAiCoachContext] = useState<string | undefined>(undefined);

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalTab, setLoginModalTab] = useState<'member' | 'admin'>('member');
  const [loginModalInitialRegister, setLoginModalInitialRegister] = useState(false);

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
          />
        )}

        {currentTab === 'mock-tests' && (
          <MockTestEngineView
            onGoToMistakes={() => setCurrentTab('mistakes')}
            onBackToDashboard={() => setCurrentTab('dashboard')}
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

        {currentTab === 'admin-cms' && <AdminCmsView />}
      </main>

      {/* Mobile Student Bottom Quick Access Bar */}
      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 pb-24 lg:pb-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Nursing Officer</span>
            <span>•</span>
            <span>Indian Nursing Council Standard Syllabus Compliant</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentTab('landing')}
              className="hover:text-slate-900 cursor-pointer font-medium"
            >
              About & Pricing
            </button>
            <button
              onClick={() => setCurrentTab('ai-coach')}
              className="hover:text-slate-900 cursor-pointer font-medium"
            >
              AI Clinical Mentor
            </button>
            <span>All-India AIIMS NORCET & State Nursing Prep</span>
          </div>
        </div>
      </footer>

      {/* Login / Register Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        defaultTab={loginModalTab}
        initialRegisterMode={loginModalInitialRegister}
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
