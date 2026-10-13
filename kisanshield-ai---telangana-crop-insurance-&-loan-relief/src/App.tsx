import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { PublicLanding } from './components/PublicLanding';
import { FarmerDashboard } from './components/FarmerDashboard';
import { DamageAssessmentWizard } from './components/DamageAssessmentWizard';
import { ClaimWorkspace } from './components/ClaimWorkspace';
import { MyFarms } from './components/MyFarms';
import { MyApplications } from './components/MyApplications';
import { BankDashboard } from './components/BankDashboard';
import { TelanganaRiskMap } from './components/TelanganaRiskMap';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { AuthModal } from './components/AuthModal';
import type { Assessment, Farm } from './types';
import { Mic, Sparkles } from 'lucide-react';

function MainApp() {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authRole, setAuthRole] = useState<'FARMER' | 'BANK'>('FARMER');
  const [authIsSignUp, setAuthIsSignUp] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  // Workflow state shared between wizard and claim workspace
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);

  const handleOpenAuth = (role: 'FARMER' | 'BANK', isSignUp: boolean = false) => {
    setAuthRole(role);
    setAuthIsSignUp(isSignUp);
    setAuthModalOpen(true);
  };

  const isFarmer = user?.role === 'FARMER';
  const isBank = user?.role === 'BANK';

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F3] text-stone-900 font-sans selection:bg-[#3B7C61]/20">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={handleOpenAuth}
        onOpenVoice={() => setVoiceModalOpen(true)}
      />

      <main className="flex-1 pb-16">
        {/* Unauthenticated View */}
        {!user && (
          <>
            {currentTab === 'risk-map' ? (
              <TelanganaRiskMap />
            ) : currentTab === 'home' ? (
              <PublicLanding
                onOpenAuth={handleOpenAuth}
                onNavigateToRiskMap={() => setCurrentTab('risk-map')}
              />
            ) : (
              <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl border border-stone-200 shadow-sm text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base font-display">Authentication Required</h3>
                <p className="text-xs text-stone-600">
                  Please log in to your Farmer or Bank account to access this protected area.
                </p>
                <div className="flex gap-2 justify-center pt-2">
                  <button
                    onClick={() => handleOpenAuth('FARMER', false)}
                    className="px-4 py-2 bg-[#153E32] text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Farmer Login
                  </button>
                  <button
                    onClick={() => handleOpenAuth('BANK', false)}
                    className="px-4 py-2 bg-stone-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Bank Login
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Farmer Experience */}
        {isFarmer && (
          <>
            {currentTab === 'home' && (
              <FarmerDashboard
                onNavigate={setCurrentTab}
                onOpenVoice={() => setVoiceModalOpen(true)}
                onSelectAssessmentForInspect={(a) => {
                  setActiveAssessment(a);
                  setCurrentTab('applications');
                }}
              />
            )}

            {currentTab === 'assess' && (
              <DamageAssessmentWizard
                onAssessmentCompleted={(a) => setActiveAssessment(a)}
                onNavigateToClaim={(a) => {
                  setActiveAssessment(a);
                  setCurrentTab('claims');
                }}
              />
            )}

            {currentTab === 'claims' && (
              <ClaimWorkspace
                initialAssessment={activeAssessment}
                onNavigateToApplications={() => setCurrentTab('applications')}
              />
            )}

            {currentTab === 'farms' && (
              <MyFarms
                onSelectFarmForAssess={(_farm: Farm) => {
                  setCurrentTab('assess');
                }}
              />
            )}

            {currentTab === 'applications' && (
              <MyApplications
                onNavigateToClaim={(a) => {
                  setActiveAssessment(a);
                  setCurrentTab('claims');
                }}
              />
            )}

            {currentTab === 'risk-map' && <TelanganaRiskMap />}

            {/* Protected Route Guard: Farmer trying to access bank dashboard */}
            {currentTab === 'bank-dashboard' && (
              <div className="max-w-lg mx-auto my-12 p-6 bg-white rounded-2xl border-2 border-red-200 shadow-sm text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
                  <span className="text-xl">⛔</span>
                </div>
                <h3 className="font-bold text-base text-red-900 font-display">
                  Access Denied: Bank Officer Credentials Required
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  You are currently authenticated as a Farmer ({user.name}). Under server-side role security policies, the Bank Review Portal and credit decision ledger are restricted strictly to verified institutional banking reviewers.
                </p>
                <div className="flex gap-2 justify-center pt-2">
                  <button
                    onClick={() => setCurrentTab('home')}
                    className="px-4 py-2 bg-[#153E32] text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Return to Farmer Dashboard
                  </button>
                  <button
                    onClick={() => handleOpenAuth('BANK', false)}
                    className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Switch to Bank Login
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Bank Experience */}
        {isBank && (
          <>
            {(currentTab === 'bank-dashboard' || currentTab === 'home') && <BankDashboard />}
            {currentTab === 'risk-map' && <TelanganaRiskMap />}

            {/* Protected Route Guard: Bank user trying to access farmer actions */}
            {(currentTab === 'assess' || currentTab === 'claims' || currentTab === 'farms' || currentTab === 'applications') && (
              <div className="max-w-lg mx-auto my-12 p-6 bg-white rounded-2xl border-2 border-red-200 shadow-sm text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
                  <span className="text-xl">⛔</span>
                </div>
                <h3 className="font-bold text-base text-red-900 font-display">
                  Access Denied: Farmer Role Required
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  You are authenticated as an institutional Bank Reviewer ({user.name}). Direct damage assessment submissions and farm parcel creation are reserved for farmers. Bank officers evaluate submitted claims in the Bank Review Queue.
                </p>
                <div className="flex gap-2 justify-center pt-2">
                  <button
                    onClick={() => setCurrentTab('bank-dashboard')}
                    className="px-4 py-2 bg-[#153E32] text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Return to Bank Review Queue
                  </button>
                  <button
                    onClick={() => handleOpenAuth('FARMER', false)}
                    className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Switch to Farmer Login
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Voice Assistant Button for Farmers */}
      {isFarmer && (
        <button
          onClick={() => setVoiceModalOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#153E32] hover:bg-[#1a4b3d] text-white p-4 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-amber-400 cursor-pointer group"
          title="Speak to KisanShield Assistant in Telugu or English"
        >
          <div className="relative">
            <Mic className="w-6 h-6 text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <span className="hidden sm:inline font-bold text-xs pr-1">
            {language === 'te' ? 'కిసాన్‌షీల్డ్ వాయిస్' : 'Speak to KisanShield'}
          </span>
        </button>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole={authRole}
        defaultIsSignUp={authIsSignUp}
      />

      {/* Telugu Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        activeContext={{
          currentTab,
          activeAssessment,
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </AuthProvider>
  );
}
