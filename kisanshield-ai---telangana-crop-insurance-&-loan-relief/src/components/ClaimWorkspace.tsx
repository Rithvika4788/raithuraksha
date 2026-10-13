import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { exportClaimPdf } from '../utils/pdfGenerator';
import type { Assessment, ClaimDraft, ClaimChecklistItem } from '../types';
import {
  FileText,
  Download,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Edit3,
  Save,
  Building2,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface ClaimWorkspaceProps {
  initialAssessment?: Assessment | null;
  onNavigateToApplications: () => void;
}

export const ClaimWorkspace: React.FC<ClaimWorkspaceProps> = ({
  initialAssessment,
  onNavigateToApplications,
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(initialAssessment?.id || '');
  const [claimType, setClaimType] = useState<'PMFBY_INSURANCE' | 'KCC_LOAN_RELIEF'>('PMFBY_INSURANCE');
  const [claimDraft, setClaimDraft] = useState<ClaimDraft | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [checklist, setChecklist] = useState<ClaimChecklistItem[]>([]);
  const [farmerAadhaar, setFarmerAadhaar] = useState('XXXX-XXXX-7142');
  const [bankAccount, setBankAccount] = useState('XXXXXXXX4821');
  const [targetBank, setTargetBank] = useState('Telangana Grameena Bank, Sultanabad Branch');
  const [submittedToBankSuccess, setSubmittedToBankSuccess] = useState(false);

  useEffect(() => {
    fetchAssessments();
  }, [user]);

  useEffect(() => {
    if (initialAssessment) {
      setSelectedCaseId(initialAssessment.id);
    }
  }, [initialAssessment]);

  useEffect(() => {
    if (selectedCaseId) {
      loadOrGenerateDraft(selectedCaseId);
    }
  }, [selectedCaseId, claimType]);

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
        if (!selectedCaseId && data.assessments && data.assessments.length > 0) {
          setSelectedCaseId(data.assessments[0].id);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch assessments:', e);
    }
  };

  const activeAssessment = assessments.find((a) => a.id === selectedCaseId) || initialAssessment;

  const loadOrGenerateDraft = async (caseId: string) => {
    setIsGenerating(true);
    setSubmittedToBankSuccess(false);
    try {
      const token = localStorage.getItem('kisanshield_token');
      const resp = await fetch('/api/claims/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caseId,
          claimType,
          farmerAadhaarMasked: farmerAadhaar,
          bankAccountNumberMasked: bankAccount,
          targetBank,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        setClaimDraft(data.claimDraft);
        setEditedContent(data.claimDraft.content);
        setChecklist(data.claimDraft.checklist);
      }
    } catch (err) {
      console.error('Failed to generate draft:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveEdits = async () => {
    if (!claimDraft) return;
    try {
      const token = localStorage.getItem('kisanshield_token');
      const resp = await fetch(`/api/claims/${claimDraft.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: editedContent,
          checklist,
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setClaimDraft(data.claimDraft);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Failed to save claim edits:', err);
    }
  };

  const toggleChecklistItem = (itemId: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, submitted: !item.submitted } : item))
    );
  };

  const handleSubmitToBank = async () => {
    if (!activeAssessment) return;
    try {
      const token = localStorage.getItem('kisanshield_token');
      const resp = await fetch(`/api/assessments/${activeAssessment.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'SUBMITTED_TO_BANK' }),
      });
      if (resp.ok) {
        setSubmittedToBankSuccess(true);
        // Refresh local assessments
        fetchAssessments();
      }
    } catch (err) {
      console.error('Submit to bank failed:', err);
    }
  };

  const handleDownloadPdf = () => {
    if (!activeAssessment || !claimDraft) return;
    exportClaimPdf(activeAssessment, {
      ...claimDraft,
      content: editedContent || claimDraft.content,
      checklist,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#3B7C61]">
            {language === 'te' ? 'ఆధారాలతో కూడిన దరఖాస్తు' : 'Evidence-Grounded Dossier Workspace'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
            {language === 'te' ? 'భీమా & కేసీసీ రుణ ఉపశమనం' : 'Insurance Claim & Loan-Relief Workspace'}
          </h1>
        </div>

        {/* Case selector dropdown */}
        {assessments.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-600">
              {language === 'te' ? 'కేసు ఫైల్:' : 'Case File:'}
            </span>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-bold text-[#153E32] focus:outline-none focus:border-[#153E32]"
            >
              {assessments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.id} — {a.farmName} ({a.cropType})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {!activeAssessment ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-stone-300 space-y-3">
          <FileText className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="font-bold text-base text-stone-800">
            {language === 'te' ? 'ఎటువంటి నష్ట అంచనా ఎంపిక కాలేదు' : 'No Damage Assessment Selected'}
          </h3>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            {language === 'te'
              ? 'ముందుగా "పంట నష్టం తనిఖీ" విభాగంలో వాతావరణ మరియు ఉపగ్రహ విశ్లేషణను రన్ చేయండి.'
              : 'Please run an assessment first in the "Check Crop Damage" section to ground your claim in real weather & satellite telemetry.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Claim Mode Selector: PMFBY vs KCC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setClaimType('PMFBY_INSURANCE')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                claimType === 'PMFBY_INSURANCE'
                  ? 'bg-[#EBF4F0] border-[#153E32] shadow-sm ring-1 ring-[#153E32]'
                  : 'bg-white border-stone-200 hover:bg-stone-50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-[#153E32] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-[#3B7C61]" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900 font-display">
                  {language === 'te' ? 'పీఎమ్‌ఎఫ్‌బీవై పంట భీమా క్లెయిమ్ డ్రాఫ్ట్' : 'PMFBY Crop Insurance Claim Draft'}
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  {language === 'te'
                    ? 'స్థానిక ప్రకృతి వైపరీత్యాల (Localized Calamities) నిబంధనల ప్రకారం క్లెయిమ్'
                    : 'Grounded under PMFBY Section 19.3: Inundation and localized severe crop loss'}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setClaimType('KCC_LOAN_RELIEF')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                claimType === 'KCC_LOAN_RELIEF'
                  ? 'bg-[#EBF4F0] border-[#153E32] shadow-sm ring-1 ring-[#153E32]'
                  : 'bg-white border-stone-200 hover:bg-stone-50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-[#153E32] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900 font-display">
                  {language === 'te' ? 'కేసీసీ రుణ రీస్ట్రక్చరింగ్ & మారటోరియం పిటిషన్' : 'KCC Loan Restructuring & Moratorium Petition'}
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  {language === 'te'
                    ? 'ఆర్బీఐ ప్రకృతి విపత్తు మార్గదర్శకాల ప్రకారం బ్యాంకుకు రుణ ఉపశమన దరఖాస్తు'
                    : 'Under RBI Master Directions for relief measures by banks in calamity-affected areas'}
                </p>
              </div>
            </button>
          </div>

          {/* Submission Success Banner */}
          {submittedToBankSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl flex items-center justify-between text-xs text-emerald-900 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <span className="font-bold block text-sm">
                    {language === 'te' ? 'బ్యాంకుకు విజయవంతంగా సమర్పించబడింది!' : 'Successfully Submitted to Bank Portal!'}
                  </span>
                  <span>
                    {language === 'te'
                      ? `కేసు నెం. ${activeAssessment.id} మీ బ్యాంకు సమీక్ష క్యూలోకి చేరింది.`
                      : `Case Ref ${activeAssessment.id} is now queued for authorized credit officer verification.`}
                  </span>
                </div>
              </div>
              <button
                onClick={onNavigateToApplications}
                className="font-bold text-[#153E32] underline hover:text-black cursor-pointer"
              >
                {language === 'te' ? 'నా దరఖాస్తులలో చూడండి →' : 'View in My Applications →'}
              </button>
            </div>
          )}

          {/* Workspace Body: Document Preview & Checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Document Draft Paper (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 space-y-4">
              {/* Document Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-300">
                    OFFICIAL DRAFT
                  </span>
                  <span className="text-xs text-stone-600 font-mono">
                    REF: {activeAssessment.id}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <button
                      type="button"
                      onClick={handleSaveEdits}
                      className="px-3 py-1.5 rounded-lg bg-[#153E32] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#1a4a3c] cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{language === 'te' ? 'భద్రపరచండి' : 'Save Text'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-stone-50 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{language === 'te' ? 'సవరించండి' : 'Edit Draft'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="px-3.5 py-1.5 rounded-lg bg-[#3B7C61] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#2e624d] cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{language === 'te' ? 'PDF డౌన్‌లోడ్' : 'Download PDF'}</span>
                  </button>
                </div>
              </div>

              {/* Editable or Static Document Content */}
              {isGenerating ? (
                <div className="p-12 text-center text-stone-600 text-xs space-y-2">
                  <span className="w-6 h-6 border-2 border-[#153E32] border-t-transparent rounded-full animate-spin inline-block" />
                  <p className="font-semibold">
                    Synthesizing formal petition using Gemini and field evidence...
                  </p>
                </div>
              ) : isEditing ? (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Editable Dossier Text:
                  </label>
                  <textarea
                    rows={16}
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full p-4 text-xs font-mono bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#153E32] leading-relaxed"
                  />
                </div>
              ) : (
                <div className="bg-[#FAF8F5] p-5 rounded-xl border border-stone-200/90 text-xs leading-relaxed font-mono whitespace-pre-wrap text-stone-800 shadow-inner max-h-[520px] overflow-y-auto">
                  {claimDraft?.content || editedContent}
                </div>
              )}

              {/* Bottom Submit to Bank CTA */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-200">
                <span className="text-[11px] text-stone-600">
                  {language === 'te'
                    ? 'ఈ డ్రాఫ్ట్ మీ బ్యాంక్ మేనేజర్ లేదా వ్యవసాయ అధికారికి సమర్పించడానికి అధికారికంగా చెల్లుబాటు అవుతుంది.'
                    : 'This dossier is calibrated for submission to your agricultural loan officer or local PMFBY helpdesk.'}
                </span>

                <button
                  type="button"
                  onClick={handleSubmitToBank}
                  disabled={activeAssessment.status === 'SUBMITTED_TO_BANK'}
                  className="bg-[#153E32] hover:bg-[#1a4a3c] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    {activeAssessment.status === 'SUBMITTED_TO_BANK'
                      ? language === 'te'
                        ? 'ఇప్పటికే సమర్పించబడింది'
                        : 'Already Submitted to Bank'
                      : language === 'te'
                      ? 'బ్యాంక్ సమీక్షకు సమర్పించండి'
                      : 'Submit Dossier to Bank'}
                  </span>
                </button>
              </div>
            </div>

            {/* Right: Document Completeness Checklist & Bank Routing (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Document Checklist */}
              <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                    {language === 'te' ? 'పత్రాల తనిఖీ జాబితా' : 'Document Completeness Checklist'}
                  </h4>
                  <span className="text-[11px] font-bold text-[#3B7C61]">
                    {checklist.filter((c) => c.submitted).length}/{checklist.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                        item.submitted
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.submitted}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-[#153E32] focus:ring-0 cursor-pointer"
                      />
                      <div className="flex-1">
                        <span className="font-semibold block">
                          {language === 'te' ? item.labelTe : item.labelEn}
                        </span>
                        {item.required && (
                          <span className="text-[10px] text-amber-700 font-bold">
                            {language === 'te' ? 'తప్పనిసరి పత్రం' : 'Mandatory Document'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions on Where to Continue Official Submission */}
              <div className="bg-[#FAF8F5] rounded-2xl border border-stone-200 p-5 space-y-3 text-xs text-stone-700 leading-relaxed">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4 text-[#3B7C61]" />
                  <span>
                    {language === 'te' ? 'అధికారిక సమర్పణ మార్గదర్శకం' : 'Official Submission Instructions'}
                  </span>
                </h4>
                <p>
                  {language === 'te'
                    ? '1. పై "PDF డౌన్‌లోడ్" బటన్ ద్వారా మీ క్లెయిమ్ పత్రాన్ని సేవ్ చేసుకోండి.'
                    : '1. Download the generated dossier PDF using the button above.'}
                </p>
                <p>
                  {language === 'te'
                    ? '2. మీ గ్రామ వ్యవసాయ అధికారి (AEO) లేదా స్థానిక తెలంగాణ గ్రామీణ బ్యాంక్ / కోఆపరేటివ్ సొసైటీ శాఖలో అందజేయండి.'
                    : '2. Submit the printout along with Dharani 1B land record to your Agriculture Extension Officer (AEO) or disbursing bank branch.'}
                </p>
                <p>
                  {language === 'te'
                    ? '3. అధికారిక పీఎమ్‌ఎఫ్‌బీవై పోర్టల్ (pmfby.gov.in) లేదా బ్యాంక్ మొబైల్ యాప్‌లో రిఫరెన్స్ నెంబరును భద్రపరచుకోండి.'
                    : '3. Track external progress through official PMFBY grievance toll-free (1800 200 5142) or your bank portal.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
