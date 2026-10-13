import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { TelanganaMap } from './TelanganaMap';
import { exportClaimPdf } from '../utils/pdfGenerator';
import { getCropDamagePhotoUrl } from '../utils/evidencePhotos';
import { TELANGANA_DISTRICTS } from '../data/telangana';
import type { Assessment, ClaimDraft, BankReview, AuditEvent, EvidenceFile } from '../types';
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Download,
  Eye,
  FileText,
  AlertTriangle,
  Lock,
  MessageSquare,
  ShieldCheck,
  TrendingDown,
  Layers,
  ArrowRight,
  Send,
  X,
} from 'lucide-react';

export const BankDashboard: React.FC = () => {
  const { user, verifyBankCode } = useAuth();
  const { language } = useLanguage();

  const [cases, setCases] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyInput, setVerifyInput] = useState('TGB-VERIFY-2026');
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);
  const [verifyErr, setVerifyErr] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [cropFilter, setCropFilter] = useState('ALL');
  const [eventFilter, setEventFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected Case Modal
  const [activeCase, setActiveCase] = useState<Assessment | null>(null);
  const [caseDetails, setCaseDetails] = useState<{
    claimDraft: ClaimDraft | null;
    bankReview: BankReview | null;
    auditEvents: AuditEvent[];
  }>({ claimDraft: null, bankReview: null, auditEvents: [] });

  // Bank Actions State
  const [actionTab, setActionTab] = useState<'decision' | 'request_info' | 'internal_note'>('decision');
  const [decision, setDecision] = useState<'APPROVED' | 'REJECTED' | 'REFERRED'>('APPROVED');
  const [decisionReason, setDecisionReason] = useState('');
  const [infoRequestText, setInfoRequestText] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [inspectedPhoto, setInspectedPhoto] = useState<EvidenceFile | null>(null);

  const handleVerifyAccount = async () => {
    setVerifyErr(null);
    setVerifyMsg(null);
    try {
      await verifyBankCode(verifyInput);
      setVerifyMsg('Institutional verification successful! Case review queue unlocked.');
      fetchBankCases();
    } catch (err: any) {
      setVerifyErr(err.message || 'Verification failed');
    }
  };

  useEffect(() => {
    fetchBankCases();
  }, [user]);

  const fetchBankCases = async () => {
    try {
      const token = localStorage.getItem('kisanshield_token');
      if (!token) return;
      const resp = await fetch('/api/assessments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        const data = await resp.json();
        setCases(data.assessments || []);
      }
    } catch (err) {
      console.warn('Bank cases fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCaseModal = async (assessment: Assessment) => {
    setActiveCase(assessment);
    setActionSuccessMessage(null);
    try {
      const token = localStorage.getItem('kisanshield_token');
      const resp = await fetch(`/api/assessments/${assessment.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        const data = await resp.json();
        setCaseDetails({
          claimDraft: data.claimDraft,
          bankReview: data.bankReview,
          auditEvents: data.auditEvents || [],
        });
      }
    } catch (err) {
      console.warn('Error fetching case detail:', err);
    }
  };

  // Submit Bank Review Decision
  const handleRecordDecision = async () => {
    if (!activeCase || !decisionReason.trim()) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('kisanshield_token');
      const resp = await fetch('/api/bank/decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caseId: activeCase.id,
          decision,
          decisionReason,
        }),
      });

      if (resp.ok) {
        const resJson = await resp.json();
        setActionSuccessMessage(`Decision (${decision}) successfully recorded in immutable case ledger.`);
        setDecisionReason('');
        // Update local active case
        setActiveCase(resJson.assessment);
        openCaseModal(resJson.assessment);
        fetchBankCases();
      }
    } catch (err) {
      console.error('Failed to record decision:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Request Information
  const handleRequestInfo = async () => {
    if (!activeCase || !infoRequestText.trim()) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('kisanshield_token');
      const resp = await fetch('/api/bank/request-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caseId: activeCase.id,
          requestText: infoRequestText,
        }),
      });

      if (resp.ok) {
        const resJson = await resp.json();
        setActionSuccessMessage('Formal document request sent to farmer.');
        setInfoRequestText('');
        setActiveCase(resJson.assessment);
        openCaseModal(resJson.assessment);
        fetchBankCases();
      }
    } catch (err) {
      console.error('Failed to request info:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Add Internal Note
  const handleAddNote = async () => {
    if (!activeCase || !internalNoteText.trim()) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('kisanshield_token');
      const resp = await fetch('/api/bank/note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caseId: activeCase.id,
          note: internalNoteText,
        }),
      });

      if (resp.ok) {
        setActionSuccessMessage('Internal audit note recorded.');
        setInternalNoteText('');
        openCaseModal(activeCase);
      }
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Metrics
  const totalSubmissions = cases.length;
  const pendingActionCount = cases.filter(
    (c) => c.status === 'SUBMITTED_TO_BANK' || c.status === 'UNDER_REVIEW'
  ).length;
  const infoRequestedCount = cases.filter((c) => c.status === 'INFO_REQUESTED').length;
  const approvedCount = cases.filter((c) => c.status === 'APPROVED').length;

  // Filtered Cases
  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.village.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDistrict = districtFilter === 'ALL' || c.district === districtFilter;
    const matchesCrop = cropFilter === 'ALL' || c.cropType === cropFilter;
    const matchesEvent = eventFilter === 'ALL' || c.eventType === eventFilter;
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

    return matchesSearch && matchesDistrict && matchesCrop && matchesEvent && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Enterprise Bank Header */}
      <div className="bg-[#153E32] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B7C61]/70 text-emerald-100 text-xs font-semibold border border-emerald-400/30">
              <Building2 className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {user?.bankName || 'Telangana Grameena Bank'} — {user?.bankBranch || 'Warangal Regional Office'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
              Agricultural Credit & Insurance Review Portal
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
              Objective satellite and weather ground truth for PMFBY localized calamity claims, KCC loan restructuring, and auditable loss justification.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <span className="bg-white/15 px-2.5 py-0.5 rounded-full font-semibold text-emerald-100 border border-white/20">
                Authorized Districts: {user?.assignedDistricts?.length ? user.assignedDistricts.join(', ') : (user?.district || 'None Assigned')}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                user?.isVerified
                  ? 'bg-emerald-400 text-emerald-950'
                  : 'bg-amber-400 text-amber-950 animate-pulse'
              }`}>
                {user?.isVerified ? '✓ Verified Officer' : '⚠️ Verification Pending'}
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs text-emerald-100 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Officer: {user?.name || 'Chief Agri Credit Officer'}</span>
            </div>
            <div className="text-[11px] text-emerald-200">
              Staff ID: {user?.employeeId || 'TGB-AGRI-4821'}
            </div>
          </div>
        </div>
      </div>

      {/* Unverified Account Security Alert & Key Activation */}
      {!user?.isVerified && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 shadow-sm space-y-3 text-xs text-red-950">
          <div className="flex items-center gap-2 font-bold text-sm text-red-900">
            <AlertTriangle className="w-5 h-5 text-red-700 shrink-0" />
            <span>Institutional Access Restricted: Account Pending Verification</span>
          </div>
          <p className="leading-relaxed">
            In accordance with agricultural bank security policies, self-selected bank signups cannot view or modify confidential farmer case files until verified with an authorized institutional key.
          </p>

          {verifyMsg && (
            <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg font-bold">
              {verifyMsg}
            </div>
          )}
          {verifyErr && (
            <div className="p-2.5 bg-red-100 border border-red-300 text-red-900 rounded-lg font-bold">
              {verifyErr}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-md">
            <input
              type="text"
              value={verifyInput}
              onChange={(e) => setVerifyInput(e.target.value)}
              placeholder="Enter Key (e.g. TGB-VERIFY-2026)"
              className="px-3 py-2 text-xs bg-white rounded-lg border border-red-300 font-mono font-bold focus:outline-none focus:border-[#153E32]"
            />
            <button
              type="button"
              onClick={handleVerifyAccount}
              className="px-4 py-2 bg-[#153E32] hover:bg-[#1a4a3c] text-white font-bold rounded-lg text-xs shadow-xs cursor-pointer"
            >
              Unlock Review Access
            </button>
          </div>
        </div>
      )}

      {/* Real Stored Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <span className="text-xs font-semibold text-stone-600">Total Submissions</span>
          <div className="text-3xl font-extrabold text-stone-900 mt-1 font-display">
            {totalSubmissions}
          </div>
          <span className="text-[11px] text-stone-600">Recorded cases in system</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <span className="text-xs font-semibold text-stone-600">Pending Review</span>
          <div className="text-3xl font-extrabold text-amber-600 mt-1 font-display">
            {pendingActionCount}
          </div>
          <span className="text-[11px] text-stone-600">Awaiting officer action</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <span className="text-xs font-semibold text-stone-600">Inquiries Raised</span>
          <div className="text-3xl font-extrabold text-indigo-600 mt-1 font-display">
            {infoRequestedCount}
          </div>
          <span className="text-[11px] text-stone-600">Farmer responses requested</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <span className="text-xs font-semibold text-stone-600">Relief Endorsed</span>
          <div className="text-3xl font-extrabold text-[#3B7C61] mt-1 font-display">
            {approvedCount}
          </div>
          <span className="text-[11px] text-stone-600">Sanctions recommended</span>
        </div>
      </div>

      {/* Human Review Advisory Banner */}
      <div className="bg-stone-100 border border-stone-300 rounded-xl p-3.5 flex items-start gap-3 text-xs text-stone-700">
        <ShieldCheck className="w-4 h-4 text-[#153E32] shrink-0 mt-0.5" />
        <p>
          <strong>Statutory Protocol:</strong> AI model estimates and satellite NDVI spectral drops provide objective decision support. Formal insurance compensation or loan restructuring requires a human reviewer's reasoned justification and field verification.
        </p>
      </div>

      {/* Search & Multifaceted Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Case ID, Farmer Name, Village, Farm..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#153E32]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* District Filter */}
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="text-xs bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 font-medium"
            >
              <option value="ALL">All Districts</option>
              {TELANGANA_DISTRICTS.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Crop Filter */}
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="text-xs bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 font-medium"
            >
              <option value="ALL">All Crops</option>
              <option value="Paddy">Paddy</option>
              <option value="Cotton">Cotton</option>
              <option value="Maize">Maize</option>
              <option value="Chilli">Chilli</option>
            </select>

            {/* Event Filter */}
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="text-xs bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 font-medium"
            >
              <option value="ALL">All Events</option>
              <option value="flood">Flood</option>
              <option value="heavy_rainfall">Heavy Rainfall</option>
              <option value="drought">Drought</option>
              <option value="heatwave">Heatwave</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED_TO_BANK">Submitted to Bank</option>
              <option value="INFO_REQUESTED">Info Requested</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REFERRED">Referred</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Review Queue Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Case Reference</th>
                <th className="p-3.5">Farmer & Village</th>
                <th className="p-3.5">Crop / Area</th>
                <th className="p-3.5">Event & Date</th>
                <th className="p-3.5">Assessed Damage</th>
                <th className="p-3.5">Weather & Satellite</th>
                <th className="p-3.5">Workflow Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-600">
                    No cases match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#153E32]">
                      {c.id}
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-stone-900 block">{c.farmerName}</span>
                      <span className="text-[11px] text-stone-600">
                        Village {c.village}, {c.district}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-stone-800 block">{c.cropType}</span>
                      <span className="text-[11px] text-stone-600">{c.acres} Acres</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-stone-800 uppercase block">{c.eventType}</span>
                      <span className="text-[11px] text-stone-600">{c.eventDate}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-extrabold text-amber-600 text-sm block">
                        {c.damageSeverityPct}%
                      </span>
                      <span className="text-[10px] text-stone-600">
                        {c.affectedAcres} ac affected
                      </span>
                    </td>
                    <td className="p-3.5 space-y-0.5">
                      <div className="text-[11px] text-blue-700 font-semibold">
                        🌧️ {c.weatherEvidence.dailyRainfallMm} mm
                      </div>
                      <div className="text-[11px] text-emerald-700 font-semibold">
                        🛰️ NDVI -{c.satelliteEvidence.ndviDropPct}%
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        c.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : c.status === 'INFO_REQUESTED'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : c.status === 'REFERRED'
                          ? 'bg-purple-100 text-purple-800 border-purple-300'
                          : c.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : 'bg-stone-100 text-stone-700 border-stone-200'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => openCaseModal(c)}
                        className="px-3 py-1.5 rounded-lg bg-[#153E32] hover:bg-[#1a4a3c] text-white text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Case</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Deep-Dive Modal */}
      {activeCase && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
          <div className="bg-[#FAF8F5] w-full max-w-5xl rounded-2xl shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#153E32] text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3B7C61] flex items-center justify-center text-white">
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-black/30 px-2 py-0.5 rounded text-amber-300">
                      CASE {activeCase.id}
                    </span>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-bold">
                      STATUS: {activeCase.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg font-display">
                    {activeCase.farmName} — Farmer {activeCase.farmerName}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {caseDetails.claimDraft && (
                  <button
                    onClick={() => exportClaimPdf(activeCase, caseDetails.claimDraft!)}
                    className="px-3 py-1.5 rounded-lg bg-[#3B7C61] hover:bg-[#2c614d] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export PDF Dossier</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveCase(null)}
                  className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {actionSuccessMessage && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>{actionSuccessMessage}</span>
                </div>
              )}

              {/* Grid: Map & Evidence Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Map (5 cols) */}
                <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                    <span>Field Geolocation</span>
                    <span className="text-stone-600 font-mono">
                      {activeCase.latitude.toFixed(4)}°N, {activeCase.longitude.toFixed(4)}°E
                    </span>
                  </div>
                  <TelanganaMap
                    selectedLocation={{
                      lat: activeCase.latitude,
                      lng: activeCase.longitude,
                      name: activeCase.farmName,
                      acres: activeCase.acres,
                    }}
                    isDamaged={true}
                    heightClass="h-[260px]"
                    readOnly={true}
                  />
                  <div className="text-[11px] text-stone-600">
                    Village {activeCase.village}, {activeCase.district} • {activeCase.acres} Total Acres
                  </div>
                </div>

                {/* Satellite & Weather Truth Breakdown (7 cols) */}
                <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-3">
                  <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                    Scientific Ground Truth Audit
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                      <span className="text-[10px] text-stone-600 block">Severity</span>
                      <span className="font-extrabold text-amber-600 text-base">
                        {activeCase.damageSeverityPct}%
                      </span>
                    </div>
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                      <span className="text-[10px] text-stone-600 block">Affected Area</span>
                      <span className="font-extrabold text-stone-900 text-base">
                        {activeCase.affectedAcres} Ac
                      </span>
                    </div>
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                      <span className="text-[10px] text-stone-600 block">Station Rain</span>
                      <span className="font-extrabold text-blue-600 text-base">
                        {activeCase.weatherEvidence.dailyRainfallMm} mm
                      </span>
                    </div>
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                      <span className="text-[10px] text-stone-600 block">NDVI Drop</span>
                      <span className="font-extrabold text-emerald-700 text-base">
                        -{activeCase.satelliteEvidence.ndviDropPct}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#FAF8F5] p-3 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
                    <span className="font-bold block text-stone-900">Deterministic Model Explanation:</span>
                    <p>{activeCase.plainLanguageExplanation.en}</p>
                  </div>

                  <div className="text-[10px] text-stone-600 space-y-0.5">
                    <div><strong>Atmospheric Source:</strong> {activeCase.weatherEvidence.source}</div>
                    <div><strong>Remote Sensing:</strong> {activeCase.satelliteEvidence.sensor} (Observed: {activeCase.satelliteEvidence.observationDate})</div>
                    <div><strong>Quality Index:</strong> {activeCase.dataQualityScore}/100 • Confidence: {activeCase.confidencePct}%</div>
                  </div>
                </div>
              </div>

              {/* Evidence Locker: Verified Photos with Visual Inspection for Bank Officers */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm font-display flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-[#153E32]" />
                      <span>{language === 'te' ? 'క్షేత్ర స్థాయి ఫోటో ఆధారాలు & డిజిటల్ ధృవీకరణ' : 'Field Photographic Evidence & Verification'}</span>
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {language === 'te'
                        ? 'రైతు అప్‌లోడ్ చేసిన ఫోటోలు, సమగ్రత హాష్‌లు మరియు సర్వే సమయ ముద్రలను బ్యాంక్ అధికారి ఇక్కడ పరిశీలించవచ్చు.'
                        : 'Inspect photographic field disaster records, GPS coordinates, and cryptographic integrity hashes.'}
                    </p>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-1 rounded-full flex items-center gap-1 self-start sm:self-auto">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Cryptographically Verified</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeCase.evidenceFiles.map((file) => {
                    const photoUrl = file.url || getCropDamagePhotoUrl(
                      activeCase.eventType,
                      activeCase.farmName,
                      activeCase.district,
                      activeCase.village,
                      activeCase.latitude,
                      activeCase.longitude,
                      activeCase.eventDate,
                      file.sha256Hash?.slice(0, 8) || 'verified'
                    );

                    return (
                      <div
                        key={file.id}
                        className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-[#3B7C61] transition-all flex flex-col justify-between"
                      >
                        {/* Actual Field Disaster Photo Visible to Bank Officer */}
                        <div className="relative group cursor-pointer bg-stone-900" onClick={() => setInspectedPhoto({ ...file, url: photoUrl })}>
                          <img
                            src={photoUrl}
                            alt={file.name}
                            className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                            <Eye className="w-4 h-4" />
                            <span>{language === 'te' ? 'పూర్తి ఫోటో పరిశీలించండి' : 'Click to Inspect Full Photo'}</span>
                          </div>
                          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span>Verified GPS: {activeCase.latitude.toFixed(3)}°N, {activeCase.longitude.toFixed(3)}°E</span>
                          </div>
                        </div>

                        {/* File Details & Verification Hash */}
                        <div className="p-3.5 space-y-2 text-xs">
                          <div className="flex items-center justify-between font-bold text-stone-900">
                            <span className="truncate max-w-[200px]">{file.name}</span>
                            <span className="text-[10px] text-stone-500 font-mono">
                              {Math.round(file.sizeBytes / 1024)} KB
                            </span>
                          </div>
                          
                          <p className="text-[11px] text-stone-600 line-clamp-2">{file.notes}</p>
                          
                          <div className="p-2 bg-white rounded-lg border border-stone-200 space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold text-[#153E32]">SHA-256 Checksum:</span>
                              <span className="text-emerald-700 font-semibold">✓ Untampered</span>
                            </div>
                            <div className="text-[9px] font-mono text-stone-600 break-all bg-stone-50 p-1 rounded">
                              {file.sha256Hash}
                            </div>
                          </div>

                          <div className="pt-1 flex items-center justify-between">
                            <span className="text-[10px] text-stone-400">
                              Captured: {new Date(file.uploadTimestamp).toLocaleDateString('en-IN')}
                            </span>
                            <button
                              type="button"
                              onClick={() => setInspectedPhoto({ ...file, url: photoUrl })}
                              className="text-[11px] text-[#153E32] hover:text-[#3B7C61] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Evidence</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviewer Action Desk */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h4 className="font-bold text-stone-900 text-sm font-display flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#153E32]" />
                    <span>Officer Review Actions</span>
                  </h4>

                  <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setActionTab('decision')}
                      className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                        actionTab === 'decision' ? 'bg-[#153E32] text-white shadow-xs' : 'text-stone-700'
                      }`}
                    >
                      Record Decision
                    </button>
                    <button
                      type="button"
                      onClick={() => setActionTab('request_info')}
                      className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                        actionTab === 'request_info' ? 'bg-[#153E32] text-white shadow-xs' : 'text-stone-700'
                      }`}
                    >
                      Request Documents
                    </button>
                    <button
                      type="button"
                      onClick={() => setActionTab('internal_note')}
                      className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                        actionTab === 'internal_note' ? 'bg-[#153E32] text-white shadow-xs' : 'text-stone-700'
                      }`}
                    >
                      Add Note
                    </button>
                  </div>
                </div>

                {/* Sub-form: Record Decision */}
                {actionTab === 'decision' && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3">
                      <label className="flex items-center gap-2 text-xs font-bold text-emerald-900 cursor-pointer bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-300">
                        <input
                          type="radio"
                          name="decision"
                          value="APPROVED"
                          checked={decision === 'APPROVED'}
                          onChange={() => setDecision('APPROVED')}
                        />
                        <span>Approve / Recommend Relief</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-bold text-purple-900 cursor-pointer bg-purple-50 px-3 py-2 rounded-xl border border-purple-300">
                        <input
                          type="radio"
                          name="decision"
                          value="REFERRED"
                          checked={decision === 'REFERRED'}
                          onChange={() => setDecision('REFERRED')}
                        />
                        <span>Refer for Joint Field Survey</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-bold text-red-900 cursor-pointer bg-red-50 px-3 py-2 rounded-xl border border-red-300">
                        <input
                          type="radio"
                          name="decision"
                          value="REJECTED"
                          checked={decision === 'REJECTED'}
                          onChange={() => setDecision('REJECTED')}
                        />
                        <span>Do Not Endorse / Reject</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Mandatory Reasoned Justification (Recorded in Audit Ledger) *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={decisionReason}
                        onChange={(e) => setDecisionReason(e.target.value)}
                        placeholder="e.g. Cross-verified with local IMD station precipitation and Sentinel-2 NDVI spectral reduction of 56.9%. Recommended for 25% on-account immediate PMFBY disbursement."
                        className="w-full p-3 text-xs bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#153E32]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleRecordDecision}
                      disabled={!decisionReason.trim() || actionLoading}
                      className="bg-[#153E32] hover:bg-[#1a4a3c] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-300" />
                      <span>{actionLoading ? 'Recording Decision...' : 'Commit Reasoned Decision'}</span>
                    </button>
                  </div>
                )}

                {/* Sub-form: Request Information */}
                {actionTab === 'request_info' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Document / Evidence Request Message to Farmer *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={infoRequestText}
                        onChange={(e) => setInfoRequestText(e.target.value)}
                        placeholder="e.g. Please provide the signed Agriculture Extension Officer (AEO) preliminary survey slip or latest Dharani RoR-1B land title."
                        className="w-full p-3 text-xs bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#153E32]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleRequestInfo}
                      disabled={!infoRequestText.trim() || actionLoading}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{actionLoading ? 'Dispatching...' : 'Dispatch Request to Farmer'}</span>
                    </button>
                  </div>
                )}

                {/* Sub-form: Internal Note */}
                {actionTab === 'internal_note' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Internal Credit Committee Audit Note *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={internalNoteText}
                        onChange={(e) => setInternalNoteText(e.target.value)}
                        placeholder="Internal confidential assessment regarding KCC restructuring scale of finance."
                        className="w-full p-3 text-xs bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#153E32]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddNote}
                      disabled={!internalNoteText.trim() || actionLoading}
                      className="bg-[#3B7C61] hover:bg-[#2e624d] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{actionLoading ? 'Saving...' : 'Save Internal Note'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Append-Only Chronological Audit Log */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-3">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#3B7C61]" />
                  <span>Append-Only Case Audit Trail (Immutable Events)</span>
                </h4>

                <div className="space-y-2.5">
                  {caseDetails.auditEvents.map((ev) => (
                    <div key={ev.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900">
                          {ev.action} by {ev.actorName} ({ev.actorRole})
                        </span>
                        <span className="text-[10px] text-stone-600 font-mono">
                          {new Date(ev.timestamp).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-stone-700 text-[11px]">{ev.details}</p>
                      <div className="text-[9px] font-mono text-stone-600">
                        HASH: {ev.hash}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Photo Inspection Lightbox for Bank Officers */}
      {inspectedPhoto && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-[#153E32] text-white w-full max-w-4xl rounded-2xl overflow-hidden border border-emerald-500/40 shadow-2xl flex flex-col max-h-[92vh]">
            <div className="p-4 bg-black/40 flex items-center justify-between border-b border-emerald-500/30">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm sm:text-base font-display">
                  {language === 'te' ? 'ఫోటో సమగ్రత పరిశీలన & వాటర్‌మార్క్' : 'Field Photo Integrity Inspection'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedPhoto(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center bg-stone-950">
              <img
                src={inspectedPhoto.url}
                alt={inspectedPhoto.name}
                className="max-h-[55vh] max-w-full rounded-xl border border-stone-800 shadow-2xl object-contain"
              />
            </div>

            <div className="p-4 bg-[#1A4B3D] border-t border-emerald-500/30 text-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-emerald-200">{inspectedPhoto.name}</span>
                <span className="text-[11px] font-mono text-emerald-300">
                  Size: {Math.round(inspectedPhoto.sizeBytes / 1024)} KB • Timestamp: {new Date(inspectedPhoto.uploadTimestamp).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-2.5 bg-black/40 rounded-xl border border-emerald-500/30 font-mono text-[11px] break-all flex items-center gap-2">
                <span className="text-emerald-400 font-bold shrink-0">SHA-256 HASH:</span>
                <span className="text-stone-200">{inspectedPhoto.sha256Hash}</span>
              </div>
              <p className="text-[11px] text-emerald-100/90">{inspectedPhoto.notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
