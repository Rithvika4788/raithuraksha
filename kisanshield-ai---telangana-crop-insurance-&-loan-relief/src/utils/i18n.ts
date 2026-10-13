// Bilingual Internationalization Engine (English & Telugu)

export type Language = 'en' | 'te';

export const TRANSLATIONS = {
  en: {
    appTitle: 'రైతు రక్ష (Rythu Raksha)',
    tagline: 'పంట నష్టం నుంచి ఆర్థిక భరోసా వరకు',
    taglineSub: 'From Crop Damage to Financial Assurance',
    telanganaFocus: 'Telangana State Crop Relief & Bank Audit System',
    farmerLogin: 'Farmer Login',
    bankLogin: 'Bank Login',
    farmerSignUp: 'Farmer Sign-up',
    bankSignUp: 'Bank Sign-up',
    logout: 'Log Out',
    welcomeBack: 'Welcome back',
    language: 'Language',
    telugu: 'తెలుగు',
    english: 'English',

    // Nav
    navHome: 'Home (రైతు రక్ష)',
    navCheckDamage: 'Check Damage',
    navPrepareClaim: 'Claim & Loan Relief',
    navMyFarms: 'My Farms',
    navApplications: 'My Applications',
    navBankQueue: 'Review Queue',
    navAuditTrail: 'Audit Trail',
    navClimateRisk: 'Telangana Risk Map',

    // Quick Actions
    actionCheckDamage: 'Check Crop Damage',
    actionCheckDamageSub: 'Analyze weather & satellite field impact',
    actionPrepareClaim: 'Prepare a Claim',
    actionPrepareClaimSub: 'Generate evidence-backed draft for insurance & bank',
    actionMyFarms: 'My Farms',
    actionMyFarmsSub: 'Manage field parcels and crop stages',
    actionMyApplications: 'My Applications',
    actionMyApplicationsSub: 'Track workflow status & bank requests',
    speakAssistant: 'Speak to KisanShield',
    speakAssistantSub: 'Voice guidance in Telugu & English',

    // Weather widget
    weatherInVillage: 'Live Village Weather & Agro-Advisory',
    rainfallAlert: 'Rainfall Alert',
    stationSource: 'Source: Open-Meteo ERA5 Reanalysis & IMD Gridded Data',
    
    // Damage Assessment Flow
    assessmentTitle: 'Crop Damage Assessment',
    step1SelectFarm: '1. Select Farm',
    step2EventDetails: '2. Climate Event & Date',
    step3UploadEvidence: '3. Field Evidence & Photos',
    step4ReviewResults: '4. Evidence-Backed Analysis',

    eventFlood: 'Flood / Water Inundation',
    eventHeavyRain: 'Excessive / Unseasonal Rainfall',
    eventDrought: 'Prolonged Drought / Dry Spell',
    eventHeatwave: 'Extreme Heatwave',

    cropStageVegetative: 'Vegetative',
    cropStageFlowering: 'Flowering / Tillering',
    cropStageMaturity: 'Maturity / Harvesting',
    cropStageGermination: 'Germination / Seedling',

    runAnalysis: 'Analyze Field Damage',
    analyzingText: 'Querying Open-Meteo & Sentinel-2 vegetation indicators...',
    
    // Results
    damageSeverity: 'Estimated Damage Severity',
    affectedArea: 'Estimated Affected Area',
    confidenceScore: 'Evidence Confidence',
    dataQuality: 'Data Quality Index',
    whyEstimate: 'Why This Estimate? (Deterministic Model Reasoning)',
    weatherEvidenceHeading: 'Atmospheric Evidence Timeline',
    satelliteEvidenceHeading: 'Copernicus Sentinel-2 Vegetation Change (NDVI)',
    hearReportTelugu: 'Hear Report in Telugu',
    viewEvidenceLocker: 'View Evidence Locker',
    prepareDraftClaim: 'Prepare Insurance Claim Draft',
    prepareLoanRelief: 'Prepare KCC Loan Relief Request',
    saveAssessment: 'Save Assessment to Case File',
    illustrativeNotice: 'Illustrative field estimate calibrated with meteorological records — subject to official on-site survey verification.',

    // Statuses
    statusDRAFT: 'Draft',
    statusREADY_TO_SUBMIT: 'Ready for Review',
    statusSUBMITTED_TO_BANK: 'Submitted to Bank',
    statusINFO_REQUESTED: 'More Info Requested',
    statusUNDER_REVIEW: 'Under Bank Review',
    statusAPPROVED: 'Relief Recommended',
    statusREJECTED: 'Claim Not Recommended',
    statusREFERRED: 'Referred for Joint Survey',

    // Bank
    bankDashboardTitle: 'Agricultural Credit & Insurance Review Portal',
    bankSubtitle: 'Auditable decision support grounded in satellite & meteorological ground truth',
    totalCases: 'Total Submissions',
    pendingReviews: 'Pending Action',
    infoRequestedCount: 'Inquiries Raised',
    approvedCount: 'Relief Endorsed',
    recordDecision: 'Record Decision',
    requestMoreInfo: 'Request Additional Documents',
    addInternalNote: 'Add Review Note',
    referForSurvey: 'Refer for Joint Field Survey',
    auditTrailTitle: 'Append-Only Case Audit Trail',
    integrityHash: 'Cryptographic Integrity Checksum (SHA-256)',
  },
  te: {
    appTitle: 'రైతు రక్ష',
    tagline: 'పంట నష్టం నుంచి ఆర్థిక భరోసా వరకు',
    taglineSub: 'రైతు రక్ష డిజిటల్ భరోసా వేదిక',
    telanganaFocus: 'తెలంగాణ రాష్ట్ర పంట నష్ట సహాయం & బ్యాంక్ ఆడిట్ వ్యవస్థ',
    farmerLogin: 'రైతు లాగిన్',
    bankLogin: 'బ్యాంక్ లాగిన్',
    farmerSignUp: 'రైతు నమోదు',
    bankSignUp: 'బ్యాంక్ నమోదు',
    logout: 'లాగ్ అవుట్',
    welcomeBack: 'స్వాగతం',
    language: 'భాష',
    telugu: 'తెలుగు',
    english: 'English',

    // Nav
    navHome: 'ప్రధాన పేజీ',
    navCheckDamage: 'పంట నష్టం తనిఖీ',
    navPrepareClaim: 'క్లెయిమ్ & రుణ సహాయం',
    navMyFarms: 'నా పొలాలు',
    navApplications: 'నా దరఖాస్తులు',
    navBankQueue: 'కేసుల సమీక్ష',
    navAuditTrail: 'ఆడిట్ రికార్డు',
    navClimateRisk: 'తెలంగాణ రిస్క్ మ్యాప్',

    // Quick Actions
    actionCheckDamage: 'పంట నష్టాన్ని లెక్కించండి',
    actionCheckDamageSub: 'వాతావరణం & ఉపగ్రహ ఆధారాలతో నష్టం అంచనా',
    actionPrepareClaim: 'క్లెయిమ్ దరఖాస్తు తయారు చేయండి',
    actionPrepareClaimSub: 'భీమా & బ్యాంక్ రుణ ఉపశమనం కోసం పత్రం సిద్ధం చేయండి',
    actionMyFarms: 'నా పొలాలు',
    actionMyFarmsSub: 'పంట రకం మరియు సర్వే వివరాలను నమోదు చేయండి',
    actionMyApplications: 'నా దరఖాస్తులు',
    actionMyApplicationsSub: 'బ్యాంక్ సమీక్ష స్థితి మరియు సందేశాలు చూడండి',
    speakAssistant: 'కిసాన్‌షీల్డ్‌తో మాట్లాడండి',
    speakAssistantSub: 'తెలుగు వాయిస్ అసిస్టెంట్ సహాయం తీసుకోండి',

    // Weather widget
    weatherInVillage: 'గ్రామ వాతావరణం & వ్యవసాయ సూచన',
    rainfallAlert: 'వర్షపాత హెచ్చరిక',
    stationSource: 'మూలం: ఓపెన్-మెటియో & ఐఎండి వాతావరణ డేటా',

    // Damage Assessment Flow
    assessmentTitle: 'పంట నష్టం అంచనా',
    step1SelectFarm: '1. పొలాన్ని ఎంచుకోండి',
    step2EventDetails: '2. ప్రకృతి వైపరీత్యం & తేదీ',
    step3UploadEvidence: '3. పొలం ఫోటోలు / ఆధారాలు',
    step4ReviewResults: '4. ఆధారాలతో కూడిన విశ్లేషణ',

    eventFlood: 'వరదలు / నీరు నిలవడం',
    eventHeavyRain: 'అకాల / అధిక వర్షపాతం',
    eventDrought: 'తీవ్ర వర్షాభావం / కరువు',
    eventHeatwave: 'తీవ్ర వడగాలులు',

    cropStageVegetative: 'శాకీయ దశ (ఎదుగుదల)',
    cropStageFlowering: 'పూత / పిలకల దశ',
    cropStageMaturity: 'పక్వ దశ / కోత సమయం',
    cropStageGermination: 'మొలక దశ',

    runAnalysis: 'పంట నష్టాన్ని విశ్లేషించండి',
    analyzingText: 'ఓపెన్-మెటియో మరియు సెంటినెల్-2 ఉపగ్రహ ఆధారాలను తనిఖీ చేస్తోంది...',

    // Results
    damageSeverity: 'అంచనా వేసిన నష్టం శాతం',
    affectedArea: 'దెబ్బతిన్న విస్తీర్ణం',
    confidenceScore: 'ఆధారాల విశ్వసనీయత',
    dataQuality: 'డేటా నాణ్యత సూచిక',
    whyEstimate: 'ఈ అంచనా ఎందుకు వచ్చింది? (విశ్లేషణ వివరణ)',
    weatherEvidenceHeading: 'వాతావరణ సాక్ష్యాధారాలు',
    satelliteEvidenceHeading: 'సెంటినెల్-2 ఉపగ్రహ పంట పచ్చదనం (NDVI) మార్పు',
    hearReportTelugu: 'తెలుగులో నివేదిక వినండి',
    viewEvidenceLocker: 'ఆధారాల లాకర్ చూడండి',
    prepareDraftClaim: 'భీమా క్లెయిమ్ దరఖాస్తు రాయండి',
    prepareLoanRelief: 'కేసీసీ రుణ రీస్ట్రక్చరింగ్ పత్రం రాయండి',
    saveAssessment: 'కేసు ఫైల్‌లో భద్రపరచండి',
    illustrativeNotice: 'వాతావరణ మరియు ఉపగ్రహ రికార్డులతో లెక్కించిన సూచిక అంచనా — అధికారిక క్షేత్ర స్థాయి సర్వేకు లోబడి ఉంటుంది.',

    // Statuses
    statusDRAFT: 'చిత్తు ప్రతి (Draft)',
    statusREADY_TO_SUBMIT: 'సమర్పణకు సిద్ధం',
    statusSUBMITTED_TO_BANK: 'బ్యాంకుకు సమర్పించబడింది',
    statusINFO_REQUESTED: 'అదనపు పత్రాలు కోరబడ్డాయి',
    statusUNDER_REVIEW: 'బ్యాంక్ సమీక్షలో ఉంది',
    statusAPPROVED: 'సహాయం సిఫార్సు చేయబడింది',
    statusREJECTED: 'సిఫార్సు చేయబడలేదు',
    statusREFERRED: 'సంయుక్త సర్వేకు సూచించబడింది',

    // Bank
    bankDashboardTitle: 'వ్యవసాయ రుణాలు & భీమా సమీక్ష పోర్టల్',
    bankSubtitle: 'ఉపగ్రహ మరియు వాతావరణ ఆధారాలతో నమ్మకమైన ఆడిట్ సమీక్ష',
    totalCases: 'మొత్తం సమర్పించిన కేసులు',
    pendingReviews: 'పరిశీలించాల్సినవి',
    infoRequestedCount: 'కోరిన పత్రాలు',
    approvedCount: 'ఆమోదించిన సహాయం',
    recordDecision: 'నిర్ణయాన్ని నమోదు చేయండి',
    requestMoreInfo: 'మరిన్ని పత్రాలు కోరండి',
    addInternalNote: 'నోట్ నమోదు చేయండి',
    referForSurvey: 'ప్రత్యక్ష పరిశీలనకు పంపండి',
    auditTrailTitle: 'కేసు ఆడిట్ చరిత్ర',
    integrityHash: 'డిజిటల్ సమగ్రత హాష్ (SHA-256)',
  }
};
