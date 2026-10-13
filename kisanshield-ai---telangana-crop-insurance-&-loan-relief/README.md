# KisanShield AI — Telangana Crop Insurance & Loan Relief Platform

KisanShield AI is a full-stack agricultural fintech decision-support platform designed specifically for farmers and credit institutions in Telangana, India.

## Key Features

1. **Strictly Two User Roles (FARMER & BANK)**:
   - **Farmer Portal**: Mobile-first, voice-guided field damage assessment, saved farm parcels, claim draft generation, and workflow tracking.
   - **Bank Review Portal**: Enterprise review queue, scientific ground truth inspection, document requests, internal notes, reasoned decision logging, and append-only audit trail.

2. **Telangana State Geo-Restricted Interactive Map**:
   - Leaflet map centered on Telangana (`17.8749°N, 78.1008°E`).
   - Boundary checks enforcing Telangana latitude (15.80°–19.92°N) and longitude (77.20°–81.82°E).
   - District pins, farm marker, acreage polygon simulation, and Sentinel-2 NDVI spectral overlay.

3. **Multi-Source Meteorological & Satellite Ground Truth**:
   - **Open-Meteo Integration**: Querying ERA5 Land grid precipitation sums, temperatures, wind speed, and seasonal anomalies.
   - **Copernicus Sentinel-2 NDVI**: Multispectral vegetation vigor drop comparison (pre-event vs post-event) at 10m resolution.
   - Deterministic agronomic damage calculation based on crop sensitivity and crop growth stages.

4. **Bilingual Engine with Telugu Voice Assistant**:
   - Persistent language selector (English & తెలుగు).
   - Real Web Speech API recognition in Telugu (`te-IN`) & English (`en-IN`).
   - Spoken audio feedback using browser SpeechSynthesis with Telugu voice detection.
   - Safety guardrails: voice guidance never submits financial claims without user confirmation.

5. **AI Claim & Loan-Relief Workspace**:
   - Generates structured PMFBY Localized Calamity claim drafts or KCC Loan Restructuring petitions.
   - In-place text editor, document completeness checklist, and official PDF export via `jspdf`.

6. **Evidence Locker & Auditable Decision Trail**:
   - Cryptographic SHA-256 integrity checksums for all uploaded field photographs and documents.
   - Server-generated chronological audit history tracking every actor action.
   - Clear disclosure that model estimates provide decision support and require human survey verification.
