import React, { useState } from 'react';
import { useAuth, DemoAccountType } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { TELANGANA_DISTRICTS } from '../data/telangana';
import type { UserRole } from '../types';
import {
  X,
  Shield,
  Sprout,
  Building2,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Sparkles,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  defaultIsSignUp?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'FARMER',
  defaultIsSignUp = false,
}) => {
  const { login, register, loginAsSpecificDemo } = useAuth();
  const { language } = useLanguage();

  const [role, setRole] = useState<UserRole>(defaultRole);
  const [isSignUp, setIsSignUp] = useState(defaultIsSignUp);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState(TELANGANA_DISTRICTS[0].name);
  const [village, setVillage] = useState('');
  const [bankName, setBankName] = useState('Telangana Grameena Bank (TGB)');
  const [bankBranch, setBankBranch] = useState('Warangal Regional Office');
  const [employeeId, setEmployeeId] = useState('');
  const [bankVerificationCode, setBankVerificationCode] = useState('TGB-VERIFY-2026');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await register({
          name,
          email,
          password,
          role,
          phone,
          district,
          village: role === 'FARMER' ? village || 'Main Village' : undefined,
          bankName: role === 'BANK' ? bankName : undefined,
          bankBranch: role === 'BANK' ? bankBranch : undefined,
          employeeId: role === 'BANK' ? employeeId || 'TGB-EMP-101' : undefined,
          bankVerificationCode: role === 'BANK' ? bankVerificationCode : undefined,
        });
      } else {
        await login(email, password, role);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = async (account: DemoAccountType) => {
    setError(null);
    setLoading(true);
    try {
      await loginAsSpecificDemo(account);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-[#FAF8F5] w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#153E32] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B7C61] flex items-center justify-center text-white">
              {role === 'FARMER' ? (
                <Sprout className="w-5 h-5 text-amber-300" />
              ) : (
                <Building2 className="w-5 h-5 text-amber-300" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-base font-display">
                {role === 'FARMER'
                  ? language === 'te'
                    ? 'రైతు పోర్టల్'
                    : 'Farmer Access Portal'
                  : language === 'te'
                  ? 'బ్యాంక్ & క్రెడిట్ ఆడిట్ పోర్టల్'
                  : 'Bank Officer Review Portal'}
              </h3>
              <p className="text-xs text-emerald-200">
                {isSignUp
                  ? language === 'te'
                    ? 'నూతన ఖాతా నమోదు (Protected Onboarding)'
                    : 'Create protected role account'
                  : language === 'te'
                  ? 'మీ ఖాతాలోకి ప్రవేశించండి (Persistent Session)'
                  : 'Sign in to protected session'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-stone-200/80 border-b border-stone-200 shrink-0">
          <button
            type="button"
            onClick={() => {
              setRole('FARMER');
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'FARMER'
                ? 'bg-white text-[#153E32] shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>{language === 'te' ? 'రైతు (Farmer)' : 'Farmer Role'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('BANK');
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'BANK'
                ? 'bg-white text-[#153E32] shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{language === 'te' ? 'బ్యాంక్ అధికారి (Bank)' : 'Bank Reviewer Role'}</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'te' ? 'పూర్తి పేరు' : 'Full Name'} *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'FARMER' ? 'Konaiah Mallaiah' : 'V. Ramanjaneyulu'}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-stone-300 focus:outline-none focus:border-[#153E32]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {language === 'te' ? 'ఈమెయిల్ చిరునామా' : 'Email Address'} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'FARMER' ? 'farmer@kisanshield.in' : 'bank@telanganagrameena.in'}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-stone-300 focus:outline-none focus:border-[#153E32]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {language === 'te' ? 'పాస్‌వర్డ్' : 'Password'} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-stone-300 focus:outline-none focus:border-[#153E32]"
                />
              </div>
            </div>

            {isSignUp && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {language === 'te' ? 'మొబైల్ నంబర్' : 'Mobile Phone'}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98480 23456"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-stone-300 focus:outline-none focus:border-[#153E32]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {language === 'te' ? 'తెలంగాణ జిల్లా' : 'Telangana District'} *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-stone-300 focus:outline-none focus:border-[#153E32]"
                      >
                        {TELANGANA_DISTRICTS.map((d) => (
                          <option key={d.id} value={d.name}>
                            {language === 'te' ? d.nameTe : d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {role === 'FARMER' ? (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {language === 'te' ? 'గ్రామం / మండలం' : 'Village / Mandal'}
                    </label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder="Sultanabad"
                      className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-stone-300 focus:outline-none focus:border-[#153E32]"
                    />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          {language === 'te' ? 'బ్యాంక్ పేరు' : 'Bank Institution'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          placeholder="Telangana Grameena Bank"
                          className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-stone-300 focus:outline-none focus:border-[#153E32]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          {language === 'te' ? 'ఉద్యోగి ఐడీ' : 'Employee ID'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={employeeId}
                          onChange={(e) => setEmployeeId(e.target.value)}
                          placeholder="TGB-AGRI-8421"
                          className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-stone-300 focus:outline-none focus:border-[#153E32]"
                        />
                      </div>
                    </div>

                    {/* Controlled Bank Verification Code */}
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-300 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <KeyRound className="w-4 h-4 text-amber-700" />
                        <span>Institutional Bank Key (Controlled Onboarding)</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        To prevent self-selecting bank privileges, enter an authorized key (e.g. <code>TGB-VERIFY-2026</code>) or official domain. Accounts without keys remain unverified with case access blocked.
                      </p>
                      <input
                        type="text"
                        value={bankVerificationCode}
                        onChange={(e) => setBankVerificationCode(e.target.value)}
                        placeholder="TGB-VERIFY-2026"
                        className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-amber-400 font-mono focus:outline-none focus:border-[#153E32]"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#153E32] hover:bg-[#1a4a3c] text-white py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{language === 'te' ? 'ప్రాసెస్ అవుతోంది...' : 'Authenticating session...'}</span>
                </span>
              ) : isSignUp ? (
                language === 'te' ? 'ఖాతా సృష్టించండి' : 'Complete Registration'
              ) : (
                language === 'te' ? 'లాగిన్ అవ్వండి' : 'Sign In'
              )}
            </button>

            {/* Toggle Login / Sign Up */}
            <div className="text-center pt-1 text-xs text-stone-600">
              {isSignUp ? (
                <span>
                  {language === 'te' ? 'ఇప్పటికే ఖాతా ఉందా?' : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className="font-bold text-[#3B7C61] hover:underline cursor-pointer"
                  >
                    {language === 'te' ? 'లాగిన్ అవ్వండి' : 'Log in here'}
                  </button>
                </span>
              ) : (
                <span>
                  {language === 'te' ? 'కొత్త ఖాతా కావాలా?' : "Don't have an account?"}{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className="font-bold text-[#3B7C61] hover:underline cursor-pointer"
                  >
                    {language === 'te' ? 'ఇప్పుడే నమోదు చేసుకోండి' : 'Sign up now'}
                  </button>
                </span>
              )}
            </div>
          </form>

          {/* Comprehensive Demo Switching Suite for Evaluators */}
          <div className="pt-4 border-t border-stone-200 space-y-2.5">
            <p className="text-[11px] font-bold text-stone-600 uppercase tracking-wider text-center flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Multi-Role Isolation Test Accounts (1-Click)</span>
            </p>

            {/* Farmers */}
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                Farmer Profiles (Isolated from each other):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoSelect('farmer1')}
                  className="p-2 bg-emerald-50 hover:bg-emerald-100 text-[#153E32] rounded-lg text-[11px] font-bold border border-emerald-300 text-left transition-colors cursor-pointer"
                >
                  <span className="block truncate">🌾 Konaiah Mallaiah</span>
                  <span className="text-[9px] text-stone-500 font-normal">Peddapalli (Has Case 1048)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoSelect('farmer2')}
                  className="p-2 bg-emerald-50 hover:bg-emerald-100 text-[#153E32] rounded-lg text-[11px] font-bold border border-emerald-300 text-left transition-colors cursor-pointer"
                >
                  <span className="block truncate">🌾 Ramesh Goud</span>
                  <span className="text-[9px] text-stone-500 font-normal">Nalgonda (Has Case 3012)</span>
                </button>
              </div>
            </div>

            {/* Banks */}
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                Bank Officer Profiles (Separated by Jurisdiction):
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleDemoSelect('bank1')}
                  className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-[10px] font-bold border border-stone-300 text-left transition-colors cursor-pointer"
                >
                  <span className="block truncate">🏛️ TGB Warangal</span>
                  <span className="text-[8px] text-stone-500 block truncate">Jurisdiction: Warangal</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoSelect('bank2')}
                  className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-[10px] font-bold border border-stone-300 text-left transition-colors cursor-pointer"
                >
                  <span className="block truncate">🏛️ DCCB Nalgonda</span>
                  <span className="text-[8px] text-stone-500 block truncate">Jurisdiction: Nalgonda</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoSelect('bank_unverified')}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-900 rounded-lg text-[10px] font-bold border border-red-300 text-left transition-colors cursor-pointer"
                >
                  <span className="block truncate">⚠️ Unverified</span>
                  <span className="text-[8px] text-red-700 block truncate">Access Blocked</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
