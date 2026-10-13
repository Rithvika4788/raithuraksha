import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { TELANGANA_DISTRICTS } from '../data/telangana';
import type { Farm, Assessment, ClaimDraft } from '../types';
import {
  Sprout,
  FileText,
  AlertTriangle,
  CloudRain,
  Mic,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingDown,
  Layers,
  ChevronRight,
  ShieldAlert,
  Sun,
  Droplets,
} from 'lucide-react';

interface FarmerDashboardProps {
  onNavigate: (tab: string) => void;
  onOpenVoice: () => void;
  onSelectAssessmentForInspect?: (assessment: Assessment) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  onNavigate,
  onOpenVoice,
  onSelectAssessmentForInspect,
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(
    user?.district || TELANGANA_DISTRICTS[0].name
  );
  const [villageWeather, setVillageWeather] = useState<{
    temp: number;
    rainfall: number;
    alert: string;
    condition: string;
  }>({
    temp: 31,
    rainfall: 48,
    alert: 'Orange Alert: Heavy localized shower probability in central Telangana',
    condition: 'Overcast with showers',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmsAndAssessments();
  }, [user]);

  const fetchFarmsAndAssessments = async () => {
    try {
      const token = localStorage.getItem('kisanshield_token');
      if (!token) return;

      const [farmsRes, assessRes] = await Promise.all([
        fetch('/api/farms', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/assessments', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (farmsRes.ok) {
        const d = await farmsRes.json();
        setFarms(d.farms || []);
      }
      if (assessRes.ok) {
        const d = await assessRes.json();
        setAssessments(d.assessments || []);
      }
    } catch (e) {
      console.warn('Dashboard data fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const currentDistObj =
    TELANGANA_DISTRICTS.find((d) => d.name.toLowerCase() === selectedDistrict.toLowerCase()) ||
    TELANGANA_DISTRICTS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Welcoming Greeting Header */}
      <div className="bg-[#153E32] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#FFF_2px,transparent_2px)] [background-size:14px_14px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B7C61]/60 text-emerald-100 text-xs font-semibold border border-emerald-400/30">
              <Sprout className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {language === 'te'
                  ? `నమోదిత రైతు: ${user?.name || 'మల్లయ్య'}`
                  : `Registered Farmer: ${user?.name || 'Farmer'}`}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
              {language === 'te'
                ? `నమస్కారం, ${user?.name || 'రైతు సోదరా'}!`
                : `Namaskaram, ${user?.name || 'Farmer'}!`}
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
              {language === 'te'
                ? 'మీ పొలం పంట నష్టాన్ని తనిఖీ చేయండి, ఉపగ్రహ ఆధారాలను చూడండి మరియు భీమా లేదా బ్యాంక్ రుణ సహాయ దరఖాస్తును సిద్ధం చేయండి.'
                : 'Assess field-level damage, verify satellite & Open-Meteo weather evidence, and prepare official PMFBY or KCC loan-relief dossiers.'}
            </p>
          </div>

          {/* Large Voice Assistant Action */}
          <button
            onClick={onOpenVoice}
            className="w-full md:w-auto bg-amber-400 hover:bg-amber-300 text-stone-900 px-6 py-4 rounded-2xl shadow-lg font-bold flex items-center justify-center gap-3 transition-all hover:scale-102 cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left">
              <span className="block text-sm font-extrabold font-display leading-tight">
                {language === 'te' ? 'కిసాన్‌షీల్డ్‌తో మాట్లాడండి' : 'Speak to KisanShield'}
              </span>
              <span className="block text-xs font-medium text-stone-800">
                {language === 'te' ? 'తెలుగు వాయిస్ సహాయకుడు' : 'Telugu Voice Guidance'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Live Village Weather & Agro-Advisory Widget */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center shrink-0">
            <CloudRain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                {language === 'te' ? 'గ్రామ వాతావరణ సమాచారం' : 'Village Weather & Agro Advisory'}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                Live Open-Meteo
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-bold text-stone-900 font-display">
                {language === 'te' ? currentDistObj.nameTe : currentDistObj.name} District
              </span>
              <span className="text-xs text-stone-600">
                ({currentDistObj.prominentVillages[0]})
              </span>
            </div>
          </div>
        </div>

        {/* Weather Readings */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-stone-700">
          <div className="flex items-center gap-2 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200">
            <Sun className="w-4 h-4 text-amber-500" />
            <div>
              <span className="block text-[10px] text-stone-600">
                {language === 'te' ? 'గరిష్ట ఉష్ణోగ్రత' : 'Max Temp'}
              </span>
              <span className="font-bold text-stone-900">{villageWeather.temp}°C</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200">
            <Droplets className="w-4 h-4 text-blue-500" />
            <div>
              <span className="block text-[10px] text-stone-600">
                {language === 'te' ? '24 గం. వర్షపాతం' : '24h Rainfall'}
              </span>
              <span className="font-bold text-stone-900">{villageWeather.rainfall} mm</span>
            </div>
          </div>

          {/* Quick District switcher */}
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-stone-400" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs bg-stone-100 border border-stone-300 rounded-lg px-2 py-1.5 font-medium focus:outline-none focus:border-[#153E32]"
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

      {/* Climate Alert Banner if high risk */}
      {currentDistObj.recentAlert && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-center gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
          <div className="flex-1">
            <span className="font-bold mr-1">
              {language === 'te' ? 'వాతావరణ హెచ్చరిక:' : 'Agro-Climate Advisory:'}
            </span>
            <span>{currentDistObj.recentAlert}</span>
          </div>
          <button
            onClick={() => onNavigate('assess')}
            className="font-bold text-[#153E32] hover:underline whitespace-nowrap text-xs cursor-pointer"
          >
            {language === 'te' ? 'నష్టాన్ని లెక్కించండి →' : 'Assess Field →'}
          </button>
        </div>
      )}

      {/* Four Primary Large Actions */}
      <div>
        <h2 className="text-lg font-bold text-stone-900 font-display mb-3 flex items-center gap-2">
          <span>{language === 'te' ? 'ముఖ్యమైన చర్యలు' : 'Primary Actions'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1: Check Crop Damage */}
          <div
            onClick={() => onNavigate('assess')}
            className="group bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm hover:border-[#3B7C61] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EBF4F0] text-[#153E32] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <CloudRain className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base font-display group-hover:text-[#153E32]">
                {language === 'te' ? 'పంట నష్టాన్ని తనిఖీ చేయండి' : 'Check Crop Damage'}
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {language === 'te'
                  ? 'వర్షపాతం, కరువు మరియు సెంటినెల్-2 ఉపగ్రహ ఆధారాలతో నష్టం లెక్కించండి.'
                  : 'Evaluate satellite NDVI and Open-Meteo weather evidence for field impact.'}
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-bold text-[#3B7C61] group-hover:text-[#153E32]">
              <span>{language === 'te' ? 'ప్రారంభించండి' : 'Start Assessment'}</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 2: Prepare a Claim */}
          <div
            onClick={() => onNavigate('claims')}
            className="group bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm hover:border-[#3B7C61] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EBF4F0] text-[#153E32] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base font-display group-hover:text-[#153E32]">
                {language === 'te' ? 'క్లెయిమ్ దరఖాస్తు సిద్ధం' : 'Prepare a Claim'}
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {language === 'te'
                  ? 'పీఎమ్‌ఎఫ్‌బీవై భీమా క్లెయిమ్ లేదా కేసీసీ రుణ రీస్ట్రక్చరింగ్ పత్రాన్ని రాయండి.'
                  : 'Generate evidence-grounded claim drafts and official PDF dossiers.'}
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-bold text-[#3B7C61] group-hover:text-[#153E32]">
              <span>{language === 'te' ? 'డ్రాఫ్ట్ రూపొందించండి' : 'Prepare Draft'}</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 3: My Farm */}
          <div
            onClick={() => onNavigate('farms')}
            className="group bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm hover:border-[#3B7C61] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EBF4F0] text-[#153E32] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base font-display group-hover:text-[#153E32]">
                {language === 'te' ? 'నా పొలాలు' : 'My Farms'}
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {language === 'te'
                  ? 'తెలంగాణ మ్యాప్‌లో పొలాలు, ఎకరాలు, వరి/పత్తి/మిర్చి రకాలను నిర్వహించండి.'
                  : 'Manage parcels, GPS coordinates, crop stages, and acreage in Telangana.'}
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-bold text-[#3B7C61] group-hover:text-[#153E32]">
              <span>{language === 'te' ? 'పొలాలను చూడండి' : 'Manage Fields'}</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 4: My Applications */}
          <div
            onClick={() => onNavigate('applications')}
            className="group bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm hover:border-[#3B7C61] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EBF4F0] text-[#153E32] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base font-display group-hover:text-[#153E32]">
                {language === 'te' ? 'నా దరఖాస్తులు' : 'My Applications'}
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {language === 'te'
                  ? 'సమర్పించిన కేసులు, బ్యాంక్ విచారణలు మరియు సమీక్ష స్థితిని ట్రాక్ చేయండి.'
                  : 'Track real recorded case statuses and respond to bank inquiries.'}
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-bold text-[#3B7C61] group-hover:text-[#153E32]">
              <span>{language === 'te' ? 'స్టేటస్ చూడండి' : 'Track Workflow'}</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Field Assessments & Applications List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Left: Saved Assessments */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-base font-display">
                {language === 'te' ? 'ఇటీవలి పంట నష్ట అంచనాలు' : 'Recent Field Damage Assessments'}
              </h3>
              <p className="text-xs text-stone-600">
                {language === 'te'
                  ? 'శాస్త్రీయ ఆధారాలు మరియు డాక్యుమెంట్ రికార్డులు'
                  : 'Auditable case files with satellite & meteorological evidence'}
              </p>
            </div>
            <button
              onClick={() => onNavigate('assess')}
              className="text-xs font-bold text-[#3B7C61] hover:underline"
            >
              + {language === 'te' ? 'కొత్త అంచనా' : 'New Assessment'}
            </button>
          </div>

          {assessments.length === 0 ? (
            <div className="p-8 text-center text-stone-600 text-xs bg-stone-50 rounded-xl border border-dashed border-stone-300">
              {language === 'te'
                ? 'ఇంకా ఎటువంటి అంచనా నమోదు కాలేదు. "పంట నష్టాన్ని తనిఖీ చేయండి" బటన్ నొక్కండి.'
                : 'No damage assessments recorded yet. Click "Check Crop Damage" to begin.'}
            </div>
          ) : (
            <div className="space-y-3">
              {assessments.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  onClick={() => onSelectAssessmentForInspect ? onSelectAssessmentForInspect(a) : onNavigate('applications')}
                  className="p-4 rounded-xl border border-stone-200 hover:border-[#3B7C61] hover:bg-stone-50/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900">{a.farmName}</span>
                      <span className="text-[10px] bg-[#EBF4F0] text-[#153E32] font-semibold px-2 py-0.5 rounded-full">
                        {a.id}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
                      <span>{a.cropType} ({a.acres} ac)</span>
                      <span>•</span>
                      <span>{a.eventType.toUpperCase()} ({a.eventDate})</span>
                      <span>•</span>
                      <span>Village {a.village}, {a.district}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-right">
                      <span className="block text-xs text-stone-600 font-medium">
                        {language === 'te' ? 'అంచనా నష్టం' : 'Damage Est.'}
                      </span>
                      <span className="text-base font-extrabold text-amber-600">
                        {a.damageSeverityPct}%
                      </span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                      {a.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Farm parcels snapshot */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-base font-display">
              {language === 'te' ? 'నమోదిత పొలాలు' : 'Saved Farm Parcels'}
            </h3>
            <button
              onClick={() => onNavigate('farms')}
              className="text-xs font-bold text-[#3B7C61] hover:underline"
            >
              {language === 'te' ? 'అన్నీ చూడండి' : 'View all'}
            </button>
          </div>

          <div className="space-y-2.5">
            {farms.slice(0, 3).map((f) => (
              <div
                key={f.id}
                className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-stone-900">{f.name}</h4>
                  <p className="text-[11px] text-stone-600">
                    {f.cropType} • {f.acres} Acres • {f.village}, {f.district}
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('assess')}
                  className="px-2 py-1 rounded-md bg-[#153E32] text-white text-[10px] font-bold cursor-pointer"
                >
                  {language === 'te' ? 'విశ్లేషణ' : 'Assess'}
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-200">
            <div className="bg-[#EBF4F0] p-3 rounded-xl text-xs text-[#153E32] space-y-1">
              <span className="font-bold block">
                {language === 'te' ? '💡 సలహా:' : '💡 Farmer Advisory:'}
              </span>
              <p className="text-[11px] text-[#153E32]/90 leading-relaxed">
                {language === 'te'
                  ? 'పంట నష్టం జరిగిన 72 గంటల్లోగా పీఎమ్‌ఎఫ్‌బీవై నిబంధనల ప్రకారం దరఖాస్తు చేసుకోవడం ద్వారా పరిహారం వేగంగా అందుతుంది.'
                  : 'PMFBY guidelines advise reporting localized losses within 72 hours for timely surveyor dispatch.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
