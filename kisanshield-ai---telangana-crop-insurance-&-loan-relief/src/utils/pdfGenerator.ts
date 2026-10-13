import { jsPDF } from 'jspdf';
import type { Assessment, ClaimDraft } from '../types';

export function exportClaimPdf(assessment: Assessment, claim: ClaimDraft) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header Bar (Forest Green)
  doc.setFillColor(21, 62, 50); // #153E32
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('KISANSHIELD AI — EVIDENCE-BACKED RELIEF DOSSIER', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('TELANGANA STATE AGRICULTURAL DISASTER & CREDIT ADVISORY SYSTEM', 14, 18);

  // Reference & Metadata box
  y = 30;
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`CASE FILE NO: ${assessment.id}`, 14, y);
  doc.text(`DATE OF ISSUANCE: ${new Date().toLocaleDateString('en-IN')}`, 130, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(90, 90, 90);
  doc.text(`INTEGRITY HASH (SHA-256): ${assessment.integrityHash.slice(0, 40)}...`, 14, y);

  y += 6;
  doc.setDrawColor(200, 200, 200);
  doc.line(14, y, pageWidth - 14, y);

  // Document Title
  y += 8;
  doc.setTextColor(21, 62, 50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(claim.title.toUpperCase(), 14, y);

  // Section 1: Farmer & Farm Profile
  y += 9;
  doc.setFillColor(235, 244, 240); // #EBF4F0
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setTextColor(21, 62, 50);
  doc.setFontSize(9.5);
  doc.text('1. APPLICANT & LAND PROFILE', 17, y + 5);

  y += 11;
  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);

  const col1X = 16;
  const col2X = 110;

  doc.setFont('helvetica', 'bold');
  doc.text('Farmer Name:', col1X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${assessment.farmerName}`, col1X + 28, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Aadhaar (Masked):', col2X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${claim.farmerAadhaarMasked}`, col2X + 32, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Farm Name:', col1X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${assessment.farmName}`, col1X + 28, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Disbursing Bank:', col2X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${claim.targetBank}`, col2X + 32, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Location:', col1X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`Village ${assessment.village}, District ${assessment.district}, Telangana`, col1X + 28, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Coordinates:', col2X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${assessment.latitude.toFixed(4)}°N, ${assessment.longitude.toFixed(4)}°E`, col2X + 32, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Crop & Stage:', col1X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${assessment.cropType} | Stage: ${assessment.cropStage}`, col1X + 28, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Total Area:', col2X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${assessment.acres} Acres (Damaged: ${assessment.affectedAcres} Acres)`, col2X + 32, y);

  // Section 2: Meteorological & Remote Sensing Evidence
  y += 10;
  doc.setFillColor(235, 244, 240);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setTextColor(21, 62, 50);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('2. SCIENTIFIC EVIDENCE AUDIT (OPEN-METEO & SENTINEL-2)', 17, y + 5);

  y += 11;
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(8.5);

  doc.setFont('helvetica', 'bold');
  doc.text('Event Type & Date:', col1X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${assessment.eventType.toUpperCase()} on ${assessment.eventDate}`, col1X + 34, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Precipitation Recorded:', col2X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${assessment.weatherEvidence.dailyRainfallMm} mm (Anomaly: +${assessment.weatherEvidence.anomalyPct}%)`, col2X + 42, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Satellite Sensor:', col1X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${assessment.satelliteEvidence.sensor}`, col1X + 34, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Vegetation Drop (NDVI):', col2X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`-${assessment.satelliteEvidence.ndviDropPct}% (Pre: ${assessment.satelliteEvidence.preEventNdvi} → Post: ${assessment.satelliteEvidence.postEventNdvi})`, col2X + 42, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Assessed Severity:', col1X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${assessment.damageSeverityPct}% loss | Confidence: ${assessment.confidencePct}%`, col1X + 34, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Estimated Input Loss:', col2X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`INR ${claim.estimatedLossInr.toLocaleString('en-IN')}`, col2X + 42, y);

  // Section 3: Grounded Petition Content
  y += 10;
  doc.setFillColor(235, 244, 240);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setTextColor(21, 62, 50);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('3. FORMAL RELIEF PETITION BODY', 17, y + 5);

  y += 11;
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  const splitText = doc.splitTextToSize(claim.content, pageWidth - 32);
  doc.text(splitText.slice(0, 24), 16, y);

  // Section 4: Attachments & Document Checklist
  y += Math.min(65, splitText.length * 3.8 + 4);
  doc.setFillColor(235, 244, 240);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setTextColor(21, 62, 50);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('4. VERIFIED EVIDENCE CHECKLIST & AUDIT LOG', 17, y + 5);

  y += 11;
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);

  claim.checklist.forEach((item) => {
    const statusMark = item.submitted ? '[ X ] VERIFIED' : '[   ] PENDING SUBMISSION';
    doc.setFont('helvetica', item.submitted ? 'bold' : 'normal');
    doc.text(`${statusMark} — ${item.labelEn}`, 16, y);
    y += 5;
  });

  // Evidence Files
  if (assessment.evidenceFiles && assessment.evidenceFiles.length > 0) {
    y += 2;
    doc.setFont('helvetica', 'bold');
    doc.text('Evidence Locker Cryptographic Fingerprints:', 16, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    assessment.evidenceFiles.forEach((file) => {
      doc.text(`• ${file.name} (SHA-256: ${file.sha256Hash.slice(0, 32)}...)`, 18, y);
      y += 4;
    });
  }

  // Signatures Area
  y = Math.max(y + 6, 255);
  doc.setDrawColor(180, 180, 180);
  doc.line(16, y, 65, y);
  doc.line(80, y, 130, y);
  doc.line(145, y, 195, y);

  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text('Applicant Farmer Signature', 16, y + 4);
  doc.text('Agriculture Officer (AEO) Seal', 80, y + 4);
  doc.text('Bank Branch Manager Endorsement', 145, y + 4);

  // Official Footer / Disclaimer
  y += 12;
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(
    'DISCLAIMER: Prepared via KisanShield AI for crop damage assessment and KCC loan-relief assistance. This draft relies on calibrated Open-Meteo & Copernicus Sentinel-2 satellite data and is subject to official joint revenue/agriculture field survey verification.',
    14,
    y,
    { maxWidth: pageWidth - 28 }
  );

  doc.save(`${assessment.id}_${claim.type}_DRAFT.pdf`);
}
