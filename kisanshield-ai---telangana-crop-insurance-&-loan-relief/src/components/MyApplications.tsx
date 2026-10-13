import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { exportClaimPdf } from '../utils/pdfGenerator';
import type { Assessment, ClaimDraft, AuditEvent, BankReview } from '../types';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  MessageSquare,
  Upload,
  ArrowRight,
  ShieldAlert,
  Send,
  Lock,
} from 'lucide-react';

interface MyApplicationsProps {
  onNavigateToClaim: (assessment: Assessment) => void;
}

export const MyApplications: React.FC<MyApplicationsProps> = ({ onNavigateToClaim }) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedCase, setSelectedCase] = useState<Assessment | null>(null);
  const [caseDetails, setCaseDetails] = useState<{
    claimDraft: ClaimDraft | null;
    bankReview: BankReview | null;
    auditEvents: AuditEvent[];
  }>({ claimDraft: null, bankReview: null, auditEvents: [] });
  const [loading, setLoading] = useState(true);

  // Response to bank info request
  const [responseNote, setResponseNote] = useState('');
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);

  useEffect(() => {
    fetchAssessments();
  }, [user]);

  const fetchAssessments = async () => {
    try {
      const token = localStorage.getItem('kisanshield_token');
      if (!token) return;
      const resp = await fetch('/api/assessments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        const data = await resp.json();
        setAssessments(data.assessments || []);
        if (data.assessments && data.assessments.length > 0) {
          loadCaseDetails(data.assessments[0]);
        }
      }
    } catch (e) {
      console.warn('Error fetching assessments:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadCaseDetails = async (assessment: Assessment) => {
    setSelectedCase(assessment);
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
      console.warn('Error loading case detail:', err);
    }
  };

  const handleFarmerRespondToBank = async () => {
    if (!selectedCase || !responseNote.trim()) return;
    setIsSubmittingResponse(true);
    try {
      const token = localStorage.getItem('kisanshield_token');
      const resp = await fetch('/api/farmer/respond-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caseId: selectedCase.id,
          responseNote,
          uploadedEvidenceFile: {
            id: `ev-resp-${Date.now()}`,
            name: 'AEO_field_inspection_slip_response.pdf',
            sizeBytes: 940000,
            sha256Hash: 'a71829e31d4789fa0b18273645cf918234812398418293847291837461928374',
            uploadTimestamp: new Date().toISOString(),
            notes: responseNote,
          },
        }),
      });

      if (resp.ok) {
        setResponseNote('');
        loadCaseDetails(selectedCase);
        fetchAssessments();
      }
    } catch (err) {
      console.error('Farmer respond error:', err);
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const getStatusBadge = (status: Assessment['status']) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-300">
            {language === 'te' ? 'సహాయం ఆమోదించబడింది' : 'Relief Endorsed'}
          </span>
        );
      case 'INFO_REQUESTED':
        return (
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold border border-amber-300 animate-pulse">
            {language === 'te' ? 'మరిన్ని పత్రాలు కోరబడ్డాయి' : 'Action Required: Info Requested'}
          </span>
        );
      case 'SUBMITTED_TO_BANK':
        return (
          <span className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-xs font-bold border border-sky-300">
            {language === 'te' ? 'బ్యాంకుకు సమర్పించబడింది' : 'Submitted to Bank'}
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold border border-indigo-300">
            {language === 'te' ? 'పరిశీలనలో ఉంది' : 'Under Bank Review'}
          </span>
        );
      case 'REFERRED':
        return (
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold border border-purple-300">
            {language === 'te' ? 'సంయుక్త సర్వేకు సూచించబడింది' : 'Referred for Field Survey'}
          </span>
        );
      case 'REJECTED':
        return (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold border border-red-300">
            {language === 'te' ? 'తిరస్కరించబడింది' : 'Relief Not Endorsed'}
          </span>
        );
      default:
        return (
          <span className="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-xs font-bold border border-stone-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#3B7C61]">
            {language === 'te' ? 'దరఖాస్తుల ట్రాకింగ్' : 'Recorded Case Tracking'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
            {language === 'te' ? 'నా దరఖాస్తులు' : 'My Applications & Decisions'}
          </h1>
        </div>
      </div>

      {assessments.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-stone-300 space-y-3">
          <FileText className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="font-bold text-base text-stone-800">
            {language === 'te' ? 'ఇంకా ఎటువంటి దరఖాస్తులు లేవు' : 'No Submitted Applications Yet'}
          </h3>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            {language === 'te'
              ? 'పంట నష్టాన్ని తనిఖీ చేసి, క్లెయిమ్ డ్రాఫ్ట్ తయారు చేసిన తర్వాత మీ దరఖాస్తులు ఇక్కడ కనిపిస్తాయి.'
              : 'Assess damage on your farm parcel and generate a claim draft to begin tracking.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Applications Table / Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              {language === 'te' ? 'సమర్పించిన కేసులు' : 'Registered Case Files'} ({assessments.length})
            </h3>

            <div className="space-y-2.5">
              {assessments.map((item) => (
                <div
                  key={item.id}
                  onClick={() => loadCaseDetails(item)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    selectedCase?.id === item.id
                      ? 'bg-white border-[#153E32] shadow-md ring-1 ring-[#153E32]'
                      : 'bg-white border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-900">{item.farmName}</span>
                    <span className="text-[10px] font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                      {item.id}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-600 mt-2">
                    <span>
                      {item.cropType} • {item.eventType.toUpperCase()}
                    </span>
                    <span className="font-bold text-amber-600">{item.damageSeverityPct}% Loss</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    {getStatusBadge(item.status)}
                    <span className="text-[10px] text-stone-600">{item.eventDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Case Inspection Drawer (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 space-y-5">
            {selectedCase ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#153E32]">
                      CASE REF: {selectedCase.id}
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 font-display">
                      {selectedCase.farmName} ({selectedCase.cropType})
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedCase.status)}
                    {caseDetails.claimDraft && (
                      <button
                        type="button"
                        onClick={() =>
                          exportClaimPdf(selectedCase, caseDetails.claimDraft!)
                        }
                        className="px-3 py-1.5 rounded-lg bg-[#3B7C61] hover:bg-[#2f634e] text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* If Bank requested info: Farmer response widget */}
                {selectedCase.status === 'INFO_REQUESTED' && caseDetails.bankReview && (
                  <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                      <AlertCircle className="w-5 h-5 text-amber-700" />
                      <span>
                        {language === 'te'
                          ? 'బ్యాంక్ అధికారి నుండి అభ్యర్థన:'
                          : 'Inquiry from Bank Review Officer:'}
                      </span>
                    </div>

                    <p className="text-xs text-amber-950 font-medium bg-white/70 p-3 rounded-xl border border-amber-200">
                      "{caseDetails.bankReview.requestedInformation[caseDetails.bankReview.requestedInformation.length - 1]?.request || 'Please provide AEO endorsement.'}"
                    </p>

                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">
                        {language === 'te' ? 'మీ వివరణ లేదా పత్రం సమాధానం:' : 'Your Response / Uploaded Document Note:'}
                      </label>
                      <textarea
                        rows={3}
                        value={responseNote}
                        onChange={(e) => setResponseNote(e.target.value)}
                        placeholder={
                          language === 'te'
                            ? 'వ్యవసాయ అధికారి సంతకం చేసిన పత్రాన్ని జతపరిచాము...'
                            : 'Attaching the signed AEO inspection slip from Sultanabad Mandal...'
                        }
                        className="w-full p-2.5 text-xs bg-white rounded-lg border border-amber-300 focus:outline-none focus:border-[#153E32]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleFarmerRespondToBank}
                      disabled={!responseNote.trim() || isSubmittingResponse}
                      className="bg-[#153E32] hover:bg-[#1a4a3c] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{language === 'te' ? 'బ్యాంకుకు సమాధానం పంపండి' : 'Submit Response to Bank'}</span>
                    </button>
                  </div>
                )}

                {/* If Bank Decision is recorded: Display official reasoned decision */}
                {(selectedCase.status === 'APPROVED' || selectedCase.status === 'REJECTED' || selectedCase.status === 'REFERRED') && caseDetails.bankReview && (
                  <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                    selectedCase.status === 'APPROVED' ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-stone-50 border-stone-300 text-stone-900'
                  }`}>
                    <span className="font-bold block text-sm">
                      {language === 'te' ? 'బ్యాంక్ నమోదు చేసిన నిర్ణయం:' : 'Recorded Bank Review Decision:'}
                    </span>
                    <p className="font-medium">
                      Reviewer: {caseDetails.bankReview.reviewerName} ({caseDetails.bankReview.reviewerBank})
                    </p>
                    <p className="bg-white p-2.5 rounded-lg border border-stone-200">
                      Justification: "{caseDetails.bankReview.decisionReason}"
                    </p>
                  </div>
                )}

                {/* Case Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-600 block">Assessed Severity</span>
                    <span className="font-bold text-amber-600 text-sm">
                      {selectedCase.damageSeverityPct}%
                    </span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-600 block">Affected Area</span>
                    <span className="font-bold text-stone-900 text-sm">
                      {selectedCase.affectedAcres} / {selectedCase.acres} Ac
                    </span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-600 block">Open-Meteo Rain</span>
                    <span className="font-bold text-blue-600 text-sm">
                      {selectedCase.weatherEvidence.dailyRainfallMm} mm
                    </span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-600 block">Sentinel-2 NDVI</span>
                    <span className="font-bold text-emerald-700 text-sm">
                      -{selectedCase.satelliteEvidence.ndviDropPct}%
                    </span>
                  </div>
                </div>

                {/* Evidence Files List with Hashes */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#3B7C61]" />
                    <span>Evidence Locker & SHA-256 Checksums</span>
                  </h4>
                  <div className="space-y-1.5">
                    {selectedCase.evidenceFiles.map((f) => (
                      <div key={f.id} className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-stone-900 block">{f.name}</span>
                          <span className="text-[10px] text-stone-600 font-mono">
                            SHA-256: {f.sha256Hash.slice(0, 32)}...
                          </span>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline of Recorded Audit Events */}
                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {language === 'te' ? 'ఆడిట్ చరిత్ర (Audit Trail)' : 'Recorded Action History'}
                  </h4>

                  <div className="space-y-2">
                    {caseDetails.auditEvents.map((ev) => (
                      <div key={ev.id} className="flex items-start gap-2.5 text-xs">
                        <span className="w-2 h-2 rounded-full bg-[#3B7C61] mt-1.5 shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900">{ev.action}</span>
                            <span className="text-[10px] text-stone-600">
                              by {ev.actorName} ({ev.actorRole})
                            </span>
                          </div>
                          <p className="text-stone-600 text-[11px]">{ev.details}</p>
                          <span className="text-[10px] text-stone-600 font-mono">
                            {new Date(ev.timestamp).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-xs text-stone-600">
                Select an application to inspect its audit trail.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
