export type UserRole = 'FARMER' | 'BANK';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  district?: string;
  village?: string;
  bankName?: string;
  bankBranch?: string;
  employeeId?: string;
  isVerified?: boolean;
  assignedDistricts?: string[];
}

export interface Farm {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  district: string;
  village: string;
  latitude: number;
  longitude: number;
  cropType: 'Paddy' | 'Cotton' | 'Maize' | 'Chilli' | 'Red Gram' | 'Soybean' | 'Groundnut';
  acres: number;
  cropStage: 'Vegetative' | 'Flowering / Tillering' | 'Maturity / Harvesting' | 'Germination / Seedling';
  sowingDate: string;
  soilType?: string;
  notes?: string;
}

export type ClimateEventType = 'flood' | 'heavy_rainfall' | 'drought' | 'heatwave';

export interface EvidenceFile {
  id: string;
  name: string;
  sizeBytes: number;
  sha256Hash: string;
  uploadTimestamp: string;
  url?: string;
  notes?: string;
}

export interface WeatherEvidence {
  source: string;
  retrievalDate: string;
  dailyRainfallMm: number;
  cumulativeRainfallMm: number;
  tempMaxC: number;
  tempMinC: number;
  windSpeedKmh: number;
  historicalAverageRainfallMm: number;
  anomalyPct: number;
  observations: { date: string; rainfallMm: number; tempMaxC: number }[];
  isLiveApi: boolean;
  coverageLimitations: string;
  dataGaps?: string;
  uncertaintyMargin?: string;
  confidenceInterval?: string;
}

export interface SatelliteEvidence {
  sensor: string;
  observationDate: string;
  preEventNdvi: number;
  postEventNdvi: number;
  ndviDropPct: number;
  cloudCoverPct: number;
  resolutionMeters: number;
  status: 'AVAILABLE_REAL' | 'NOT_CONFIGURED_DEMO' | 'SIMULATED_DEMO' | 'AVAILABLE';
  limitations: string;
  isRealSatelliteConfigured?: boolean;
  realSourceNotice?: string;
  dataGaps?: string;
  uncertaintyMargin?: string;
}

export type CaseWorkflowStatus = 
  | 'DRAFT'
  | 'READY_TO_SUBMIT'
  | 'SUBMITTED_TO_BANK'
  | 'INFO_REQUESTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'REFERRED';

export interface Assessment {
  id: string; // e.g. KS-TS-2026-7842
  farmId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone?: string;
  farmName: string;
  district: string;
  village: string;
  latitude: number;
  longitude: number;
  cropType: string;
  acres: number;
  cropStage: string;
  eventType: ClimateEventType;
  eventDate: string;
  damageSeverityPct: number;
  affectedAcres: number;
  confidencePct: number;
  dataQualityScore: number;
  weatherEvidence: WeatherEvidence;
  satelliteEvidence: SatelliteEvidence;
  evidenceFiles: EvidenceFile[];
  plainLanguageExplanation: {
    en: string;
    te: string;
  };
  status: CaseWorkflowStatus;
  targetBank?: string;
  assignedBank?: string;
  submissionDate?: string;
  createdAt: string;
  updatedAt: string;
  integrityHash: string;
}

export interface ClaimChecklistItem {
  id: string;
  labelEn: string;
  labelTe: string;
  required: boolean;
  submitted: boolean;
}

export interface ClaimDraft {
  id: string;
  caseId: string;
  farmerId: string;
  type: 'PMFBY_INSURANCE' | 'KCC_LOAN_RELIEF';
  title: string;
  content: string;
  farmerAadhaarMasked: string;
  bankAccountNumberMasked: string;
  targetBank: string;
  estimatedLossInr: number;
  recommendedReliefAction: string;
  checklist: ClaimChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BankReview {
  id: string;
  caseId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerBank: string;
  decision: 'APPROVED' | 'REJECTED' | 'REFERRED' | 'PENDING';
  decisionReason?: string;
  internalNotes: { note: string; timestamp: string; author: string }[];
  requestedInformation: { request: string; requestedAt: string; fulfilled: boolean; responseNote?: string }[];
  reviewedAt: string;
}

export interface AuditEvent {
  id: string;
  caseId: string;
  actorId: string;
  actorName: string;
  actorRole: 'FARMER' | 'BANK' | 'SYSTEM';
  action: string;
  details: string;
  timestamp: string;
  hash: string;
}
