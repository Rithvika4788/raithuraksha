import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { TelanganaMap } from './TelanganaMap';
import { TELANGANA_DISTRICTS, isWithinTelangana, DEMO_FARMS_PRESET } from '../data/telangana';
import type { Farm } from '../types';
import {
  Sprout,
  Plus,
  MapPin,
  Calendar,
  Layers,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit,
  ArrowRight,
} from 'lucide-react';

interface MyFarmsProps {
  onSelectFarmForAssess: (farm: Farm) => void;
}

export const MyFarms: React.FC<MyFarmsProps> = ({ onSelectFarmForAssess }) => {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [name, setName] = useState('');
  const [district, setDistrict] = useState(TELANGANA_DISTRICTS[0].name);
  const [village, setVillage] = useState('Sultanabad');
  const [cropType, setCropType] = useState<Farm['cropType']>('Paddy');
  const [acres, setAcres] = useState<number>(3.5);
  const [cropStage, setCropStage] = useState<Farm['cropStage']>('Flowering / Tillering');
  const [sowingDate, setSowingDate] = useState('2026-07-15');
  const [soilType, setSoilType] = useState('Deep Black Clayey Soil (నల్లరేగడి)');
  const [lat, setLat] = useState<number>(18.528);
  const [lng, setLng] = useState<number>(79.324);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFarms();
  }, [user]);

  const fetchFarms = async () => {
    try {
      const token = localStorage.getItem('kisanshield_token');
      if (token) {
        const resp = await fetch('/api/farms', { headers: { Authorization: `Bearer ${token}` } });
        if (resp.ok) {
          const d = await resp.json();
          if (d.farms && d.farms.length > 0) {
            setFarms(d.farms);
            return;
          }
        }
      }
      setFarms(DEMO_FARMS_PRESET);
    } catch {
      setFarms(DEMO_FARMS_PRESET);
    } finally {
      setLoading(false);
    }
  };

  const handleMapLocationSelect = (
    selectedLat: number,
    selectedLng: number,
    districtName?: string,
    villageName?: string
  ) => {
    if (!isWithinTelangana(selectedLat, selectedLng)) {
      setError('Location must be inside Telangana State (15.80°-19.92°N, 77.20°-81.82°E)');
      return;
    }
    setLat(selectedLat);
    setLng(selectedLng);
    if (districtName) {
      setDistrict(districtName);
    }
    if (villageName) {
      setVillage(villageName);
    }
    setError(null);
  };

  const handleCreateFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide a farm name.');
      return;
    }

    if (!isWithinTelangana(lat, lng)) {
      setError('Selected coordinates fall outside Telangana boundaries.');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('kisanshield_token');
      const resp = await fetch('/api/farms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          district,
          village,
          latitude: lat,
          longitude: lng,
          cropType,
          acres,
          cropStage,
          sowingDate,
          soilType,
        }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Failed to save farm');
      }

      setFarms((prev) => [data.farm, ...prev]);
      setShowAddForm(false);
      setName('');
    } catch (err: any) {
      setError(err.message || 'Failed to save farm');
    } finally {
      setSaving(false);
    }
  };

  const handleLoadDemoPresets = () => {
    setFarms(DEMO_FARMS_PRESET);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#3B7C61]">
            {language === 'te' ? 'భూమి వివరాలు' : 'Land Parcel Management'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
            {language === 'te' ? 'నా పొలాలు' : 'My Farm Parcels'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadDemoPresets}
            className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold cursor-pointer"
          >
            {language === 'te' ? 'డెమో పొలాలు లోడ్ చేయండి' : 'Reset Demo Fields'}
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#153E32] hover:bg-[#1a4a3c] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'te' ? 'కొత్త పొలాన్ని జోడించండి' : 'Add New Farm Parcel'}</span>
          </button>
        </div>
      </div>

      {/* Add Farm Form with Interactive Telangana Map */}
      {showAddForm && (
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="font-bold text-base text-stone-900 font-display">
              {language === 'te' ? 'కొత్త పొలం నమోదు పత్రం' : 'Register New Farm Parcel in Telangana'}
            </h3>
            <span className="text-xs text-[#3B7C61] font-semibold">
              Strict Telangana Boundary Check
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCreateFarm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'te' ? 'పొలం పేరు' : 'Farm Parcel Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Warangal Sri Laxmi Cotton Plot"
                  className="w-full px-3 py-2 text-sm bg-stone-50 rounded-lg border border-stone-300 focus:outline-none focus:border-[#153E32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'te' ? 'జిల్లా' : 'Telangana District'} *
                </label>
                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    const found = TELANGANA_DISTRICTS.find((d) => d.name === e.target.value);
                    if (found) {
                      setLat(found.lat);
                      setLng(found.lng);
                    }
                  }}
                  className="w-full px-3 py-2 text-sm bg-stone-50 rounded-lg border border-stone-300 focus:outline-none focus:border-[#153E32]"
                >
                  {TELANGANA_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.name}>
                      {language === 'te' ? d.nameTe : d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'te' ? 'గ్రామం / మండలం' : 'Village / Mandal'} *
                </label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Wardhannapet"
                  className="w-full px-3 py-2 text-sm bg-stone-50 rounded-lg border border-stone-300 focus:outline-none focus:border-[#153E32]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'te' ? 'పంట రకం' : 'Crop Type'} *
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 rounded-lg border border-stone-300 focus:outline-none focus:border-[#153E32]"
                >
                  <option value="Paddy">Paddy (వరి)</option>
                  <option value="Cotton">Cotton (పత్తి)</option>
                  <option value="Maize">Maize (మొక్కజొన్న)</option>
                  <option value="Chilli">Chilli (మిర్చి)</option>
                  <option value="Red Gram">Red Gram (కందులు)</option>
                  <option value="Soybean">Soybean (సోయాబీన్)</option>
                  <option value="Groundnut">Groundnut (వేరుశనగ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'te' ? 'విస్తీర్ణం (ఎకరాలు)' : 'Area (Acres)'} *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  required
                  value={acres}
                  onChange={(e) => setAcres(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 rounded-lg border border-stone-300 focus:outline-none focus:border-[#153E32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'te' ? 'పంట దశ' : 'Crop Stage'} *
                </label>
                <select
                  value={cropStage}
                  onChange={(e) => setCropStage(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 rounded-lg border border-stone-300 focus:outline-none focus:border-[#153E32]"
                >
                  <option value="Vegetative">Vegetative (ఎదుగుదల)</option>
                  <option value="Flowering / Tillering">Flowering / Tillering (పూత/పిలకల)</option>
                  <option value="Maturity / Harvesting">Maturity / Harvesting (కోత సమయం)</option>
                  <option value="Germination / Seedling">Germination (మొలక దశ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'te' ? 'విత్తిన తేదీ' : 'Sowing Date'}
                </label>
                <input
                  type="date"
                  value={sowingDate}
                  onChange={(e) => setSowingDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 rounded-lg border border-stone-300 focus:outline-none focus:border-[#153E32]"
                />
              </div>
            </div>

            {/* Map coordinate picker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-stone-700">
                  {language === 'te'
                    ? 'మ్యాప్‌పై క్లిక్ చేసి ఖచ్చితమైన పొలం స్థానాన్ని ఎంచుకోండి (తెలంగాణ లోపల):'
                    : 'Click on Map to Pin Precise Coordinates (Restricted to Telangana):'}
                </label>
                <span className="text-xs font-mono font-bold text-[#153E32]">
                  Lat: {lat.toFixed(4)}°, Lng: {lng.toFixed(4)}°
                </span>
              </div>
              <TelanganaMap
                selectedLocation={{ lat, lng, acres }}
                onLocationSelect={handleMapLocationSelect}
                heightClass="h-[300px]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 rounded-xl bg-[#153E32] hover:bg-[#1a4a3c] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Register Farm Parcel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Farms List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {farms.map((farm) => (
          <div
            key={farm.id}
            className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5 flex flex-col justify-between space-y-4 hover:border-[#3B7C61] transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-stone-900 text-base font-display">
                    {farm.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#3B7C61]" />
                    <span>Village {farm.village}, {farm.district}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-[#EBF4F0] text-[#153E32] font-bold text-xs rounded-full">
                  {farm.acres} Ac
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
                  <span className="text-[10px] text-stone-600 block">Crop</span>
                  <span className="font-bold text-stone-900">{farm.cropType}</span>
                </div>
                <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
                  <span className="text-[10px] text-stone-600 block">Stage</span>
                  <span className="font-bold text-stone-900 truncate block">{farm.cropStage}</span>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-stone-600 space-y-1">
                <div>
                  <span className="font-semibold text-stone-700">GPS:</span>{' '}
                  <span className="font-mono">{farm.latitude.toFixed(4)}°N, {farm.longitude.toFixed(4)}°E</span>
                </div>
                {farm.soilType && (
                  <div>
                    <span className="font-semibold text-stone-700">Soil:</span> {farm.soilType}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
              <span className="text-[10px] text-stone-600">Sown: {farm.sowingDate}</span>
              <button
                type="button"
                onClick={() => onSelectFarmForAssess(farm)}
                className="px-3.5 py-1.5 rounded-xl bg-[#153E32] hover:bg-[#1a4a3c] text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <span>{language === 'te' ? 'నష్టాన్ని తనిఖీ చేయండి' : 'Assess Damage'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
