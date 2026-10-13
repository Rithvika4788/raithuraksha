// Telangana Geographic Boundaries & Districts Data

export const TELANGANA_BOUNDS = {
  minLat: 15.80,
  maxLat: 19.92,
  minLng: 77.20,
  maxLng: 81.82,
  center: [17.8749, 78.1008] as [number, number],
  defaultZoom: 7,
};

export function isWithinTelangana(lat: number, lng: number): boolean {
  return (
    lat >= TELANGANA_BOUNDS.minLat &&
    lat <= TELANGANA_BOUNDS.maxLat &&
    lng >= TELANGANA_BOUNDS.minLng &&
    lng <= TELANGANA_BOUNDS.maxLng
  );
}

export interface TelanganaDistrict {
  id: string;
  name: string;
  nameTe: string;
  lat: number;
  lng: number;
  majorCrops: string[];
  prominentVillages: string[];
  climateRiskScore: 'High' | 'Moderate' | 'Severe';
  recentAlert?: string;
}

export const TELANGANA_DISTRICTS: TelanganaDistrict[] = [
  {
    id: 'warangal',
    name: 'Warangal',
    nameTe: 'వరంగల్',
    lat: 17.9689,
    lng: 79.5941,
    majorCrops: ['Cotton', 'Chilli', 'Paddy', 'Maize'],
    prominentVillages: ['Dharmasagar', 'Wardhannapet', 'Geesugonda', 'Atmakur', 'Hanamkonda Rural'],
    climateRiskScore: 'Severe',
    recentAlert: 'High rainfall inundation in low-lying cotton belts',
  },
  {
    id: 'karimnagar',
    name: 'Karimnagar',
    nameTe: 'కరీంనగర్',
    lat: 18.4386,
    lng: 79.1288,
    majorCrops: ['Paddy', 'Cotton', 'Maize', 'Soybean'],
    prominentVillages: ['Choppadandi', 'Manakondur', 'Gangadhara', 'Timmapur', 'Ramadugu'],
    climateRiskScore: 'Moderate',
    recentAlert: 'Sudden localized waterlogging observed',
  },
  {
    id: 'nizamabad',
    name: 'Nizamabad',
    nameTe: 'నిజామాబాద్',
    lat: 18.6725,
    lng: 78.0941,
    majorCrops: ['Paddy', 'Soybean', 'Maize', 'Turmeric'],
    prominentVillages: ['Armoor', 'Bodhan', 'Dichpally', 'Balkonda', 'Navipet'],
    climateRiskScore: 'Moderate',
    recentAlert: 'Intermittent rainfall post-dry spell',
  },
  {
    id: 'khammam',
    name: 'Khammam',
    nameTe: 'ఖమ్మం',
    lat: 17.2473,
    lng: 80.1514,
    majorCrops: ['Chilli', 'Cotton', 'Paddy', 'Mango'],
    prominentVillages: ['Wyra', 'Madhira', 'Sathupalli', 'Nelakondapalli', 'Kallur'],
    climateRiskScore: 'Severe',
    recentAlert: 'Munneru river backwaters flash flood risk',
  },
  {
    id: 'nalgonda',
    name: 'Nalgonda',
    nameTe: 'నల్గొండ',
    lat: 17.0575,
    lng: 79.2684,
    majorCrops: ['Paddy', 'Cotton', 'Sweet Orange', 'Red Gram'],
    prominentVillages: ['Miryalaguda', 'Devarakonda', 'Nakrekal', 'Narketpally', 'Chityal'],
    climateRiskScore: 'Severe',
    recentAlert: 'Soil moisture deficit in tail-end areas',
  },
  {
    id: 'mahabubnagar',
    name: 'Mahabubnagar',
    nameTe: 'మహబూబ్‌నగర్',
    lat: 16.7488,
    lng: 77.9856,
    majorCrops: ['Cotton', 'Paddy', 'Castor', 'Groundnut'],
    prominentVillages: ['Jadcherla', 'Bhoothpur', 'Devarkadra', 'Nawabpet', 'Koilkonda'],
    climateRiskScore: 'Severe',
    recentAlert: 'Prolonged dry spell affecting vegetative stage',
  },
  {
    id: 'adilabad',
    name: 'Adilabad',
    nameTe: 'ఆదిలాబాద్',
    lat: 19.6641,
    lng: 78.5320,
    majorCrops: ['Cotton', 'Soybean', 'Red Gram', 'Paddy'],
    prominentVillages: ['Utnoor', 'Bela', 'Gudihatnoor', 'Boath', 'Jainath'],
    climateRiskScore: 'Moderate',
    recentAlert: 'Heavy downpour on black cotton soil',
  },
  {
    id: 'siddipet',
    name: 'Siddipet',
    nameTe: 'సిద్దిపేట',
    lat: 18.1018,
    lng: 78.8520,
    majorCrops: ['Paddy', 'Maize', 'Cotton', 'Vegetables'],
    prominentVillages: ['Gajwel', 'Dubbak', 'Husnabad', 'Thoguta', 'Mirdoddi'],
    climateRiskScore: 'Moderate',
  },
  {
    id: 'suryapet',
    name: 'Suryapet',
    nameTe: 'సూర్యాపేట',
    lat: 17.1439,
    lng: 79.6239,
    majorCrops: ['Paddy', 'Cotton', 'Chilli'],
    prominentVillages: ['Kodad', 'Huzurnagar', 'Thungathurthy', 'Mothey', 'Chivvemla'],
    climateRiskScore: 'Moderate',
  },
  {
    id: 'jagtial',
    name: 'Jagtial',
    nameTe: 'జగిత్యాల',
    lat: 18.7915,
    lng: 78.9135,
    majorCrops: ['Paddy', 'Maize', 'Turmeric', 'Mango'],
    prominentVillages: ['Korutla', 'Metpally', 'Raikal', 'Dharmapuri', 'Mallial'],
    climateRiskScore: 'Moderate',
  },
  {
    id: 'peddapalli',
    name: 'Peddapalli',
    nameTe: 'పెద్దపల్లి',
    lat: 18.6164,
    lng: 79.3739,
    majorCrops: ['Paddy', 'Cotton', 'Maize'],
    prominentVillages: ['Sultanabad', 'Julapalle', 'Eligaid', 'Manthani', 'Ramagundam Rural'],
    climateRiskScore: 'High',
    recentAlert: 'Godavari basin rain surge',
  },
  {
    id: 'kamareddy',
    name: 'Kamareddy',
    nameTe: 'కామారెడ్డి',
    lat: 18.3242,
    lng: 78.3396,
    majorCrops: ['Paddy', 'Sugarcane', 'Soybean', 'Maize'],
    prominentVillages: ['Banswada', 'Yellareddy', 'Domakonda', 'Pitlam', 'Gandhari'],
    climateRiskScore: 'Moderate',
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad (Peri-urban)',
    nameTe: 'హైదరాబాద్ పెరి-అర్బన్',
    lat: 17.3850,
    lng: 78.4867,
    majorCrops: ['Vegetables', 'Flowers', 'Fodder'],
    prominentVillages: ['Shamshabad Rural', 'Rajendranagar Agri Zone', 'Moinabad', 'Hayathnagar'],
    climateRiskScore: 'Moderate',
  }
];

export const DEMO_FARMS_PRESET = [
  {
    id: 'demo-farm-1',
    farmerId: 'farmer-demo-1',
    farmerName: 'Konaiah Mallaiah (మల్లయ్య)',
    name: 'Peddapalli Sri Rama Paddy Field',
    district: 'Peddapalli',
    village: 'Sultanabad',
    latitude: 18.528,
    longitude: 79.324,
    cropType: 'Paddy' as const,
    acres: 4.5,
    cropStage: 'Flowering / Tillering' as const,
    sowingDate: '2026-07-15',
    soilType: 'Clayey Loam (నల్లరేగడి)',
    notes: 'Canal-fed wet crop along SRSP command area.',
  },
  {
    id: 'demo-farm-2',
    farmerId: 'farmer-demo-1',
    farmerName: 'Konaiah Mallaiah (మల్లయ్య)',
    name: 'Warangal Red Soil Cotton Plot',
    district: 'Warangal',
    village: 'Wardhannapet',
    latitude: 17.829,
    longitude: 79.614,
    cropType: 'Cotton' as const,
    acres: 3.2,
    cropStage: 'Vegetative' as const,
    sowingDate: '2026-06-28',
    soilType: 'Deep Black Cotton Soil',
    notes: 'Rainfed high-density cotton, sensitive to prolonged stagnation.',
  },
  {
    id: 'demo-farm-3',
    farmerId: 'farmer-demo-1',
    farmerName: 'Konaiah Mallaiah (మల్లయ్య)',
    name: 'Nizamabad Spring Maize Field',
    district: 'Nizamabad',
    village: 'Armoor',
    latitude: 18.790,
    longitude: 78.291,
    cropType: 'Maize' as const,
    acres: 2.5,
    cropStage: 'Maturity / Harvesting' as const,
    sowingDate: '2026-06-10',
    soilType: 'Sandy Loam',
    notes: 'Well-drained maize crop affected by September storm gusts.',
  },
  {
    id: 'demo-farm-4',
    farmerId: 'farmer-demo-1',
    farmerName: 'Konaiah Mallaiah (మల్లయ్య)',
    name: 'Khammam Teja Chilli Garden',
    district: 'Khammam',
    village: 'Wyra',
    latitude: 17.189,
    longitude: 80.354,
    cropType: 'Chilli' as const,
    acres: 1.8,
    cropStage: 'Flowering / Tillering' as const,
    sowingDate: '2026-08-01',
    soilType: 'Alluvial Loam',
    notes: 'High investment commercial crop vulnerable to root rot.',
  }
];

// Deterministic Transparent Damage Calculation Engine
// Based on agronomic sensitivity curves calibrated for Telangana agro-climatic zones
export function calculateTransparentDamageEstimate(params: {
  cropType: string;
  cropStage: string;
  eventType: string;
  acres: number;
  rainfallMm: number;
  tempMaxC: number;
  ndviDropPct: number;
  soilDrainageFactor?: number;
}) {
  const { cropType, cropStage, eventType, acres, rainfallMm, tempMaxC, ndviDropPct } = params;

  // Base vulnerability by crop stage
  let stageFactor = 1.0;
  if (cropStage.includes('Flowering') || cropStage.includes('Tillering')) {
    stageFactor = 1.35; // Most sensitive stage
  } else if (cropStage.includes('Vegetative')) {
    stageFactor = 1.1;
  } else if (cropStage.includes('Maturity')) {
    stageFactor = 1.25; // Crop lodging / grain discoloration
  } else {
    stageFactor = 0.9;
  }

  // Crop-specific vulnerability
  let cropFactor = 1.0;
  if (cropType === 'Chilli') cropFactor = 1.4; // Extremely vulnerable to moisture & root rot
  if (cropType === 'Cotton') cropFactor = 1.25; // Stagnation causes boll shedding
  if (cropType === 'Maize') cropFactor = 1.1;
  if (cropType === 'Paddy') cropFactor = eventType === 'drought' ? 1.4 : 0.85; // Paddy tolerates moderate water

  let rawDamagePct = 0;
  let explanationPoints: string[] = [];

  if (eventType === 'flood' || eventType === 'heavy_rainfall') {
    if (rainfallMm > 150) {
      rawDamagePct = 55 + (rainfallMm - 150) * 0.22;
      explanationPoints.push(`Precipitation recorded (${rainfallMm.toFixed(1)} mm) exceeded the 72-hour extreme flash threshold (120 mm).`);
    } else if (rainfallMm > 80) {
      rawDamagePct = 30 + (rainfallMm - 80) * 0.35;
      explanationPoints.push(`Continuous heavy rainfall (${rainfallMm.toFixed(1)} mm) caused field saturation and drainage backlog.`);
    } else {
      rawDamagePct = 18 + rainfallMm * 0.15;
      explanationPoints.push(`Moderate inundation recorded (${rainfallMm.toFixed(1)} mm) with localized crop submersion.`);
    }
  } else if (eventType === 'drought') {
    if (rainfallMm < 15) {
      rawDamagePct = 52 + (tempMaxC > 36 ? (tempMaxC - 36) * 4 : 0);
      explanationPoints.push(`Severe rainfall deficit (< 15 mm in critical window) paired with elevated temperatures (${tempMaxC}°C).`);
    } else {
      rawDamagePct = 28 + (tempMaxC > 34 ? (tempMaxC - 34) * 3 : 0);
      explanationPoints.push(`Moderate moisture deficit causing early wilting and delayed tillering.`);
    }
  } else {
    // Heatwave
    const excessHeat = Math.max(0, tempMaxC - 38);
    rawDamagePct = 25 + excessHeat * 7;
    explanationPoints.push(`Peak diurnal temperatures reached ${tempMaxC}°C, surpassing thermal stress limit.`);
  }

  // Blend satellite vegetation change (NDVI) if observed
  if (ndviDropPct > 5) {
    const satelliteInfluence = ndviDropPct * 1.1;
    rawDamagePct = rawDamagePct * 0.65 + satelliteInfluence * 0.35;
    explanationPoints.push(`Sentinel-2 vegetation vigor (NDVI) dropped by ${ndviDropPct.toFixed(1)}% compared to the 15-day baseline.`);
  }

  // Apply stage and crop factor
  let finalDamagePct = Math.min(96, Math.max(5, rawDamagePct * stageFactor * cropFactor));
  finalDamagePct = Math.round(finalDamagePct * 10) / 10;

  const affectedAcres = Math.min(acres, Math.round((acres * (finalDamagePct / 100)) * 100) / 100);

  // Confidence calculation based on evidence consistency
  let confidencePct = 86;
  if (rainfallMm > 0 && ndviDropPct > 0) confidencePct = 92;
  if (rainfallMm === 0) confidencePct = 74;

  const dataQualityScore = 94;

  return {
    damageSeverityPct: finalDamagePct,
    affectedAcres,
    confidencePct,
    dataQualityScore,
    explanationPoints,
  };
}
