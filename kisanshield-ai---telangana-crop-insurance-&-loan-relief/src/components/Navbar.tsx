import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Shield,
  Sprout,
  Building2,
  Globe,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  FileText,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAuth: (role: 'FARMER' | 'BANK', isSignUp?: boolean) => void;
  onOpenVoice: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAuth,
  onOpenVoice,
}) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isFarmer = user?.role === 'FARMER';
  const isBank = user?.role === 'BANK';

  return (
    <header className="sticky top-0 z-40 bg-[#153E32] text-white border-b border-[#245344] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand */}
          <div
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#3B7C61] flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight font-display text-white">
                  రైతు రక్ష <span className="text-amber-400 font-bold text-sm sm:text-base">(Rythu Raksha)</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] bg-[#3B7C61]/70 text-emerald-100 font-semibold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  తెలంగాణ
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90 font-medium hidden sm:block">
                పంట నష్టం నుంచి ఆర్థిక భరోసా వరకు
              </p>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {!user && (
              <>
                <button
                  onClick={() => setCurrentTab('home')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'home'
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-emerald-100 hover:bg-white/10'
                  }`}
                >
                  {t('navHome')}
                </button>
                <button
                  onClick={() => setCurrentTab('risk-map')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'risk-map'
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-emerald-100 hover:bg-white/10'
                  }`}
                >
                  {t('navClimateRisk')}
                </button>
              </>
            )}

            {isFarmer && (
              <>
                <button
                  onClick={() => setCurrentTab('home')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'home'
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-emerald-100 hover:bg-white/10'
                  }`}
                >
                  {t('navHome')}
                </button>
                <button
                  onClick={() => setCurrentTab('assess')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'assess'
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-emerald-100 hover:bg-white/10'
                  }`}
                >
                  {t('navCheckDamage')}
                </button>
                <button
                  onClick={() => setCurrentTab('claims')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'claims'
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-emerald-100 hover:bg-white/10'
                  }`}
                >
                  {t('navPrepareClaim')}
                </button>
                <button
                  onClick={() => setCurrentTab('farms')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'farms'
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-emerald-100 hover:bg-white/10'
                  }`}
                >
                  {t('navMyFarms')}
                </button>
                <button
                  onClick={() => setCurrentTab('applications')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'applications'
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-emerald-100 hover:bg-white/10'
                  }`}
                >
                  {t('navApplications')}
                </button>
              </>
            )}

            {isBank && (
              <>
                <button
                  onClick={() => setCurrentTab('bank-dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'bank-dashboard'
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-emerald-100 hover:bg-white/10'
                  }`}
                >
                  {t('navBankQueue')}
                </button>
                <button
                  onClick={() => setCurrentTab('risk-map')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'risk-map'
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-emerald-100 hover:bg-white/10'
                  }`}
                >
                  {t('navClimateRisk')}
                </button>
              </>
            )}
          </nav>

          {/* Right Action Controls: Voice, Language Selector & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Voice Assistant Button for farmers */}
            {isFarmer && (
              <button
                onClick={onOpenVoice}
                className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm cursor-pointer transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-stone-900" />
                <span className="hidden sm:inline">
                  {language === 'te' ? 'మాట్లాడండి' : 'Voice Guide'}
                </span>
              </button>
            )}

            {/* Persistent Language Selector */}
            <div className="flex items-center bg-black/20 rounded-lg p-0.5 border border-white/15">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-[#153E32] shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  language === 'te'
                    ? 'bg-white text-[#153E32] shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                తెలుగు
              </button>
            </div>

            {/* User Profile or Login CTAs */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-white leading-tight">{user.name}</span>
                  <span className="text-[10px] text-amber-300 uppercase font-semibold">
                    {user.role === 'FARMER' ? 'రైతు (Farmer)' : 'బ్యాంక్ (Bank Officer)'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg bg-white/10 hover:bg-red-500/80 text-white transition-colors cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('FARMER', false)}
                  className="bg-[#3B7C61] hover:bg-[#489576] text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-400/40 shadow-xs cursor-pointer transition-colors"
                >
                  {t('farmerLogin')}
                </button>
                <button
                  onClick={() => onOpenAuth('BANK', false)}
                  className="bg-stone-900/40 hover:bg-stone-900/70 text-emerald-100 text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-600/50 cursor-pointer transition-colors"
                >
                  {t('bankLogin')}
                </button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#103027] border-t border-[#1d4c3d] px-4 pt-2 pb-4 space-y-2">
          {!user && (
            <>
              <button
                onClick={() => {
                  setCurrentTab('home');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-emerald-100 rounded-lg hover:bg-white/10"
              >
                {t('navHome')}
              </button>
              <button
                onClick={() => {
                  setCurrentTab('risk-map');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-emerald-100 rounded-lg hover:bg-white/10"
              >
                {t('navClimateRisk')}
              </button>
            </>
          )}

          {isFarmer && (
            <>
              <button
                onClick={() => {
                  setCurrentTab('home');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-emerald-100 rounded-lg hover:bg-white/10"
              >
                {t('navHome')}
              </button>
              <button
                onClick={() => {
                  setCurrentTab('assess');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-emerald-100 rounded-lg hover:bg-white/10"
              >
                {t('navCheckDamage')}
              </button>
              <button
                onClick={() => {
                  setCurrentTab('claims');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-emerald-100 rounded-lg hover:bg-white/10"
              >
                {t('navPrepareClaim')}
              </button>
              <button
                onClick={() => {
                  setCurrentTab('farms');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-emerald-100 rounded-lg hover:bg-white/10"
              >
                {t('navMyFarms')}
              </button>
              <button
                onClick={() => {
                  setCurrentTab('applications');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-emerald-100 rounded-lg hover:bg-white/10"
              >
                {t('navApplications')}
              </button>
              <button
                onClick={() => {
                  onOpenVoice();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-amber-300 font-bold rounded-lg bg-white/5"
              >
                {language === 'te' ? 'కిసాన్‌షీల్డ్ వాయిస్ అసిస్టెంట్' : 'Voice Assistant'}
              </button>
            </>
          )}

          {isBank && (
            <>
              <button
                onClick={() => {
                  setCurrentTab('bank-dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-emerald-100 rounded-lg hover:bg-white/10"
              >
                {t('navBankQueue')}
              </button>
              <button
                onClick={() => {
                  setCurrentTab('risk-map');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-emerald-100 rounded-lg hover:bg-white/10"
              >
                {t('navClimateRisk')}
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
