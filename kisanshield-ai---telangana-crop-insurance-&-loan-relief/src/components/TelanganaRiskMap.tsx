import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TelanganaMap } from './TelanganaMap';
import { TELANGANA_DISTRICTS } from '../data/telangana';
import {
  MapPin,
  AlertTriangle,
  CloudRain,
  Sun,
  ShieldCheck,
  Search,
  Layers,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';

interface TelanganaRiskMapProps {
  onSelectDistrictToAssess?: (districtName: string) => void;
}

export const TelanganaRiskMap: React.FC<TelanganaRiskMapProps> = ({
  onSelectDistrictToAssess,
}) => {
  const { language } = useLanguage();
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(
    TELANGANA_DISTRICTS[0].id
  );
  const [searchQuery, setSearchQuery] = useState('');

  const selectedDist =
    TELANGANA_DISTRICTS.find((d) => d.id === selectedDistrictId) || TELANGANA_DISTRICTS[0];

  const filteredDistricts = TELANGANA_DISTRICTS.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nameTe.includes(searchQuery) ||
      d.majorCrops.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="border-b border-stone-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#3B7C61]">
          {language === 'te' ? 'తెలంగాణ వాతావరణ సమాచారం' : 'Agro-Climatic Intelligence'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
          {language === 'te'
            ? 'తెలంగాణ జిల్లాల వాతావరణ ముప్పు మ్యాప్'
            : 'Telangana District Climate-Risk Atlas'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
          {language === 'te'
            ? 'తెలంగాణ వ్యవసాయ వాతావరణ జోన్ల ప్రకారం వరదలు, అధిక వర్షపాతం మరియు వర్షాభావ ముప్పు సూచికలు.'
            : 'Risk indices calibrated with IMD historical gridded data, Godavari/Krishna basin flood corridors, and rainfed black-soil sensitivity.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: District List & Search (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200/90 shadow-sm p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'te' ? 'జిల్లా లేదా పంట శోధించండి...' : 'Search district or crop...'}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#153E32]"
            />
          </div>

          <div className="max-h-[460px] overflow-y-auto space-y-2 pr-1">
            {filteredDistricts.map((d) => (
              <div
                key={d.id}
                onClick={() => setSelectedDistrictId(d.id)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedDistrictId === d.id
                    ? 'bg-[#EBF4F0] border-[#153E32] ring-1 ring-[#153E32]'
                    : 'bg-stone-50/70 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900">
                    {language === 'te' ? d.nameTe : d.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      d.climateRiskScore === 'Severe'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {d.climateRiskScore} Risk
                  </span>
                </div>
                <div className="text-[11px] text-stone-600 mt-1">
                  Crops: {d.majorCrops.join(', ')}
                </div>
                {d.recentAlert && (
                  <div className="text-[10px] text-amber-700 mt-1 truncate">
                    ⚠️ {d.recentAlert}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Map & Deep District Vulnerability Overview (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-800">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#153E32]" />
                <span>
                  {language === 'te' ? selectedDist.nameTe : selectedDist.name} District View
                </span>
              </span>
              <span className="text-[11px] text-stone-600">
                Coordinates: {selectedDist.lat.toFixed(4)}°N, {selectedDist.lng.toFixed(4)}°E
              </span>
            </div>

            <TelanganaMap
              selectedLocation={{
                lat: selectedDist.lat,
                lng: selectedDist.lng,
                name: selectedDist.name,
              }}
              heightClass="h-[340px]"
              readOnly={true}
            />
          </div>

          {/* District Risk & Advisory Card */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-[#3B7C61] uppercase tracking-wider block">
                  Agro-Climatic Vulnerability Card
                </span>
                <h3 className="text-xl font-bold text-stone-900 font-display">
                  {selectedDist.name} ({selectedDist.nameTe})
                </h3>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  selectedDist.climateRiskScore === 'Severe'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {selectedDist.climateRiskScore} Climate Risk
              </span>
            </div>

            {selectedDist.recentAlert && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Active Advisory:</strong> {selectedDist.recentAlert}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] text-stone-600 block">Major Crops</span>
                <span className="font-bold text-stone-900">{selectedDist.majorCrops.join(', ')}</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] text-stone-600 block">Prominent Mandals / Villages</span>
                <span className="font-bold text-stone-900">
                  {selectedDist.prominentVillages.slice(0, 3).join(', ')}
                </span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] text-stone-600 block">Basin Hydrology</span>
                <span className="font-bold text-stone-900">
                  {selectedDist.name.includes('Warangal') || selectedDist.name.includes('Peddapalli')
                    ? 'Godavari River Basin'
                    : 'Krishna River Basin'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
