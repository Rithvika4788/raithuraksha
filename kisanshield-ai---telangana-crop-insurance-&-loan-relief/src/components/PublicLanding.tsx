import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Shield,
  Sprout,
  Building2,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Compass,
  Languages,
  Layers,
  FileText,
  Search,
  Lock,
} from 'lucide-react';
import { TELANGANA_DISTRICTS } from '../data/telangana';

interface PublicLandingProps {
  onOpenAuth: (role: 'FARMER' | 'BANK', isSignUp?: boolean) => void;
  onNavigateToRiskMap: () => void;
}

export const PublicLanding: React.FC<PublicLandingProps> = ({
  onOpenAuth,
  onNavigateToRiskMap,
}) => {
  const { language, setLanguage } = useLanguage();
  // Dedicated toggle for the 4-step workflow as explicitly requested
  const [workflowLang, setWorkflowLang] = useState<'en' | 'te'>(language);

  // Workflow steps specification
  const workflowSteps = {
    en: [
      {
        stepNum: '01',
        digit: '1',
        title: 'Select Telangana Field',
        desc: 'Pinpoint your farm parcel with strictly validated Telangana geographic boundaries and crop stage.',
      },
      {
        stepNum: '02',
        digit: '2',
        title: 'Analyze Real Evidence',
        desc: 'System queries station rainfall, temperature anomalies, and pre/post satellite NDVI vegetation vigor.',
      },
      {
        stepNum: '03',
        digit: '3',
        title: 'Draft Insurance & Relief',
        desc: 'Generate and customize structured PMFBY or KCC restructuring petitions, checklist, and PDF output.',
      },
      {
        stepNum: '04',
        digit: '4',
        title: 'Bank Officer Audit',
        desc: 'Credit officers verify photo hashes, query missing documents, add notes, and log reasoned decisions.',
      },
    ],
    te: [
      {
        stepNum: '01',
        digit: '1',
        title: 'తెలంగాణ పొలాన్ని ఎంచుకోండి',
        desc: 'ఖచ్చితమైన తెలంగాణ భౌగోళిక సరిహద్దులు మరియు పంట దశతో మీ వ్యవసాయ పార్శిల్‌ను గుర్తించండి.',
      },
      {
        stepNum: '02',
        digit: '2',
        title: 'నిజమైన ఆధారాల విశ్లేషణ',
        desc: 'స్టేషన్ వర్షపాతం, ఉష్ణోగ్రత క్రమరాహిత్యాలు మరియు ఉపగ్రహ NDVI పంట పచ్చదనం సూచికలను సిస్టమ్ పరిశీలిస్తుంది.',
      },
      {
        stepNum: '03',
        digit: '3',
        title: 'బీమా & ఉపశమన డ్రాఫ్ట్',
        desc: 'నిర్మాణాత్మక PMFBY లేదా KCC రీస్ట్రక్చరింగ్ పిటిషన్లు, చెక్‌లిస్ట్ మరియు PDF అవుట్‌పుట్‌ను రూపొందించండి మరియు అనుకూలీకరించండి.',
      },
      {
        stepNum: '04',
        digit: '4',
        title: 'బ్యాంక్ అధికారి ఆడిట్',
        desc: 'క్రెడిట్ అధికారులు ఫోటో హాష్‌లను ధృవీకరిస్తారు, తప్పిపోయిన పత్రాలను అడుగుతారు, గమనికలను జోడిస్తారు మరియు సహేతుకమైన నిర్ణయాలను నమోదు చేస్తారు.',
      },
    ],
  };

  const stepsToDisplay = workflowSteps[workflowLang];

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-stone-800">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#153E32] via-[#1A4B3D] to-[#205847] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Official Telangana Agricultural Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>తెలంగాణ వ్యవసాయ భద్రత • Telangana Agro-Climatic Intelligence</span>
          </div>

          {/* Title: రైతు రక్ష */}
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight font-display text-white">
              రైతు రక్ష
            </h1>
            <span className="text-emerald-200/90 font-mono text-sm sm:text-base tracking-widest uppercase block">
              RYTHU RAKSHA
            </span>
          </div>

          {/* Tagline: పంట నష్టం నుంచి ఆర్థిక భరోసా వరకు */}
          <p className="text-2xl sm:text-4xl font-bold text-amber-300 font-display max-w-3xl mx-auto leading-snug">
            పంట నష్టం నుంచి ఆర్థిక భరోసా వరకు
          </p>

          <p className="text-sm sm:text-base text-emerald-100/90 font-medium max-w-2xl mx-auto">
            From Crop Damage to Financial Assurance • Official Decision Support for Telangana Farmers &amp; Credit Institutions
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <div className="w-full sm:w-auto flex flex-col gap-1.5">
              <button
                onClick={() => onOpenAuth('FARMER', false)}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-base shadow-xl transition-all hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sprout className="w-5 h-5 text-stone-900" />
                <span>{language === 'te' ? 'రైతు పోర్టల్ లాగిన్' : 'Farmer Access Login'}</span>
                <ArrowRight className="w-4 h-4 text-stone-900" />
              </button>
              <button
                onClick={() => onOpenAuth('FARMER', true)}
                className="text-xs text-emerald-200 hover:text-white underline cursor-pointer"
              >
                {language === 'te' ? 'కొత్త రైతు? ఇక్కడ నమోదు అవ్వండి' : 'New Farmer? Register here'}
              </button>
            </div>

            <div className="w-full sm:w-auto flex flex-col gap-1.5">
              <button
                onClick={() => onOpenAuth('BANK', false)}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-base border border-white/25 backdrop-blur-md shadow-xl transition-all hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
              >
                <Building2 className="w-5 h-5 text-amber-300" />
                <span>{language === 'te' ? 'బ్యాంక్ ఆఫీసర్ లాగిన్' : 'Bank Officer Portal'}</span>
              </button>
              <button
                onClick={() => onOpenAuth('BANK', true)}
                className="text-xs text-emerald-200 hover:text-white underline cursor-pointer"
              >
                {language === 'te' ? 'బ్యాంక్ నమోదు' : 'Bank User Registration'}
              </button>
            </div>
          </div>

          {/* Climate Risk Atlas Shortcut */}
          <div className="pt-2">
            <button
              onClick={onNavigateToRiskMap}
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-emerald-200 hover:text-white font-medium bg-black/25 px-4 py-2 rounded-xl border border-white/15 backdrop-blur-sm transition-colors"
            >
              <MapPin className="w-4 h-4 text-amber-300" />
              <span>{language === 'te' ? 'తెలంగాణ 33 జిల్లాల వాతావరణ రిస్క్ అట్లాస్ చూడండి' : 'Explore Telangana 33 Districts Climate Risk Atlas'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Live Telangana Agro-Advisory & District Ticker */}
      <section className="bg-[#153E32] border-t border-b border-[#235848] text-white py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold shrink-0">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>తెలంగాణ వాతావరణ సమాచారం (Live Grid):</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-stone-200">
            <span>వరంగల్ (Warangal): <strong>అధిక వర్షపాతం హెచ్చరిక</strong></span>
            <span>•</span>
            <span>నల్గొండ (Nalgonda): <strong>కరువు ముప్పు సూచిక</strong></span>
            <span>•</span>
            <span>కరీంనగర్ (Karimnagar): <strong>ఎండ తీవ్రత నిఘా</strong></span>
            <span>•</span>
            <span>ఖమ్మం (Khammam): <strong>మున్నేరు బేసిన్ పరిశీలన</strong></span>
          </div>
        </div>
      </section>

      {/* 4-Step Workflow with Prominent Language Toggle (English & Telugu) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3B7C61]">
              {workflowLang === 'te' ? 'సులభమైన విధానం' : 'Structured 4-Step Process'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-display mt-1">
              {workflowLang === 'te'
                ? 'రైతు రక్ష: 4 దశల్లో నష్ట నివారణ & భరోసా'
                : 'From Field Damage to Settled Relief in 4 Steps'}
            </h2>
          </div>

          {/* Language Toggle for the 4 Steps (English and Telugu) */}
          <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-xl border border-stone-200 shadow-xs self-start sm:self-auto">
            <Languages className="w-4 h-4 text-stone-500 ml-1.5" />
            <button
              type="button"
              onClick={() => {
                setWorkflowLang('en');
                setLanguage('en');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                workflowLang === 'en'
                  ? 'bg-[#153E32] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => {
                setWorkflowLang('te');
                setLanguage('te');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                workflowLang === 'te'
                  ? 'bg-[#153E32] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>

        {/* 4 Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stepsToDisplay.map((s) => (
            <div
              key={s.stepNum}
              className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm relative flex flex-col justify-between hover:border-[#3B7C61] hover:shadow-md transition-all group"
            >
              <div>
                <span className="text-5xl font-black text-[#153E32]/10 font-display absolute top-4 right-4 group-hover:text-[#3B7C61]/20 transition-colors">
                  {s.stepNum}
                </span>

                <div className="w-9 h-9 rounded-xl bg-[#EBF4F0] text-[#153E32] flex items-center justify-center font-bold text-sm mb-4 border border-emerald-200">
                  {s.digit}
                </div>

                <h3 className="font-bold text-stone-900 text-lg mb-2 font-display leading-snug">
                  {s.title}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  {s.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-[#3B7C61]">
                <span>Step {s.digit}</span>
                <span className="font-mono text-stone-600">✓ Verified</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Trial Action Strip */}
      <section className="py-12 bg-[#FAF8F5] border-t border-stone-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-[#E2DDD0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-[#153E32] font-display">
              {workflowLang === 'te'
                ? 'మీ పంట నష్టాన్ని పరిశీలించడానికి సిద్ధంగా ఉన్నారా?'
                : 'Ready to evaluate field damage and prepare a claim?'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              {workflowLang === 'te'
                ? 'తెలంగాణ రైతులకు సులభమైన తెలుగు వాయిస్ మార్గదర్శకత్వం మరియు తక్షణ డ్రాఫ్ట్.'
                : 'Guided Telugu speech assistance, live Open-Meteo weather verification, and PMFBY claim drafting.'}
            </p>
          </div>

          <button
            onClick={() => onOpenAuth('FARMER', false)}
            className="px-6 py-3.5 rounded-xl bg-[#153E32] hover:bg-[#1a4b3d] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Sprout className="w-4 h-4 text-amber-300" />
            <span>{workflowLang === 'te' ? 'నష్టాన్ని వెంటనే అంచనా వేయండి' : 'Check Damage Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#153E32] text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-[#235645]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-300" />
            <span className="font-bold text-white text-base">రైతు రక్ష (Rythu Raksha)</span>
            <span className="text-emerald-300/80">— తెలంగాణ వ్యవసాయ భద్రత</span>
          </div>

          <div className="flex flex-wrap gap-4 text-emerald-200">
            <span>పంట నష్టం నుంచి ఆర్థిక భరోసా వరకు</span>
            <span>•</span>
            <span>33 తెలంగాణ జిల్లాలు</span>
            <span>•</span>
            <span>తెలుగు వాయిస్ అసిస్టెంట్</span>
          </div>

          <p className="text-emerald-300/70 text-[11px]">
            &copy; 2026 రైతు రక్ష (Rythu Raksha). Built with precision for Telangana farmers.
          </p>
        </div>
      </footer>
    </div>
  );
};
