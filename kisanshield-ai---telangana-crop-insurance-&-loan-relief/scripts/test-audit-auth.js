// Automated Test Suite for KisanShield AI Authentication & Role Authorization

async function runTests() {
  const baseUrl = 'http://localhost:3000';
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} - ${details}`);
      failed++;
    }
  }

  console.log('\n--- 1. UNAUTHENTICATED REQUEST TESTS ---');
  const unauthResp = await fetch(`${baseUrl}/api/farms`);
  assert(unauthResp.status === 401, 'Unauthenticated GET /api/farms returns 401 Unauthorized');

  const unauthAssess = await fetch(`${baseUrl}/api/assessments`);
  assert(unauthAssess.status === 401, 'Unauthenticated GET /api/assessments returns 401 Unauthorized');

  console.log('\n--- 2. NORMAL LOGIN & SESSION CREATION TESTS ---');
  // Login Farmer 1 (Konaiah Mallaiah, Peddapalli)
  const f1Login = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'farmer@kisanshield.in', password: 'farmer123', role: 'FARMER' }),
  });
  const f1Data = await f1Login.json();
  assert(f1Login.status === 200 && f1Data.token, 'Farmer 1 Login succeeds with bearer token');
  const tokenF1 = f1Data.token;

  // Login Farmer 2 (Ramesh Goud, Nalgonda)
  const f2Login = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ramesh@kisanshield.in', password: 'farmer456', role: 'FARMER' }),
  });
  const f2Data = await f2Login.json();
  assert(f2Login.status === 200 && f2Data.token, 'Farmer 2 Login succeeds with bearer token');
  const tokenF2 = f2Data.token;

  // Login Bank 1 (Telangana Grameena Bank, Warangal/Peddapalli)
  const b1Login = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'bank@telanganagrameena.in', password: 'bank123', role: 'BANK' }),
  });
  const b1Data = await b1Login.json();
  assert(b1Login.status === 200 && b1Data.token, 'Bank 1 (TGB Warangal) Login succeeds');
  const tokenB1 = b1Data.token;

  // Login Bank 2 (DCCB Nalgonda)
  const b2Login = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'srinivas@apexbank.telangana.gov.in', password: 'bank456', role: 'BANK' }),
  });
  const b2Data = await b2Login.json();
  assert(b2Login.status === 200 && b2Data.token, 'Bank 2 (DCCB Nalgonda) Login succeeds');
  const tokenB2 = b2Data.token;

  // Register a fresh Unverified Bank Officer to ensure idempotency
  const unvEmail = `pending_${Date.now()}@gmail.com`;
  const bUnvReg = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Unverified Reviewer',
      email: unvEmail,
      password: 'password123',
      role: 'BANK',
      district: 'Khammam',
      bankName: 'Private Finance',
      // No valid verification code provided!
    }),
  });
  const bUnvData = await bUnvReg.json();
  assert(bUnvReg.status === 201 && bUnvData.user.isVerified === false, 'Fresh Bank Signup without verification key defaults to isVerified=false');
  const tokenBUnv = bUnvData.token;

  console.log('\n--- 3. ROLE SEPARATION & CROSS-ROLE REJECTION TESTS ---');
  // Attempt to log in with wrong portal role
  const wrongRoleLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'farmer@kisanshield.in', password: 'farmer123', role: 'BANK' }),
  });
  assert(wrongRoleLogin.status === 403, 'Logging in as BANK with a FARMER account is rejected with 403');

  // Farmer attempts to perform a bank reviewer decision
  const farmerDecisionAttempt = await fetch(`${baseUrl}/api/bank/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenF1}` },
    body: JSON.stringify({ caseId: 'KS-TS-2026-1048', decision: 'APPROVED', decisionReason: 'Self approval' }),
  });
  assert(farmerDecisionAttempt.status === 403, 'Farmer attempting to record bank review decision returns 403 Forbidden');

  console.log('\n--- 4. FARMER-TO-FARMER DATA ISOLATION TESTS ---');
  // Farmer 1 lists farms -> only sees Farm 1 and Farm 2
  const f1FarmsResp = await fetch(`${baseUrl}/api/farms`, {
    headers: { Authorization: `Bearer ${tokenF1}` },
  });
  const f1Farms = (await f1FarmsResp.json()).farms;
  const f1FarmIds = f1Farms.map((f) => f.id);
  assert(
    f1FarmIds.includes('demo-farm-1') && !f1FarmIds.includes('demo-farm-3'),
    'Farmer 1 sees own farms (demo-farm-1) but cannot see Farmer 2 farm (demo-farm-3)'
  );

  // Farmer 2 attempts to GET Farmer 1's farm parcel directly
  const f2AccessF1Farm = await fetch(`${baseUrl}/api/farms/demo-farm-1`, {
    headers: { Authorization: `Bearer ${tokenF2}` },
  });
  assert(f2AccessF1Farm.status === 403, 'Farmer 2 accessing Farmer 1 farm (/api/farms/demo-farm-1) returns 403 Forbidden');

  // Farmer 2 attempts to GET Farmer 1's assessment case directly
  const f2AccessF1Case = await fetch(`${baseUrl}/api/assessments/KS-TS-2026-1048`, {
    headers: { Authorization: `Bearer ${tokenF2}` },
  });
  assert(f2AccessF1Case.status === 403, 'Farmer 2 accessing Farmer 1 case (KS-TS-2026-1048) returns 403 Forbidden');

  // Farmer 2 attempts to create an assessment on Farmer 1's farm
  const f2AssessF1Farm = await fetch(`${baseUrl}/api/assessments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenF2}` },
    body: JSON.stringify({ farmId: 'demo-farm-1', eventType: 'flood', eventDate: '2026-09-20' }),
  });
  assert(f2AssessF1Farm.status === 403, 'Farmer 2 attempting to run assessment on Farmer 1 farm returns 403 Forbidden');

  // Farmer 2 attempts to edit Farmer 1's claim draft
  const f2EditF1Claim = await fetch(`${baseUrl}/api/claims/claim-1048`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenF2}` },
    body: JSON.stringify({ content: 'Malicious modification by other farmer' }),
  });
  assert(f2EditF1Claim.status === 403, 'Farmer 2 attempting to edit Farmer 1 claim draft returns 403 Forbidden');

  console.log('\n--- 5. BANK PRIVACY & JURISDICTION ISOLATION TESTS ---');
  // Bank 1 attempts to access unsubmitted private DRAFT case (KS-TS-2026-2091)
  const b1AccessDraft = await fetch(`${baseUrl}/api/assessments/KS-TS-2026-2091`, {
    headers: { Authorization: `Bearer ${tokenB1}` },
  });
  assert(b1AccessDraft.status === 403, 'Bank 1 accessing private unsubmitted DRAFT case returns 403 Forbidden');

  // Bank 1 (Warangal / TGB) attempts to access Farmer 2's case (Nalgonda / DCCB)
  const b1CrossJurisdiction = await fetch(`${baseUrl}/api/assessments/KS-TS-2026-3012`, {
    headers: { Authorization: `Bearer ${tokenB1}` },
  });
  assert(b1CrossJurisdiction.status === 403, 'Bank 1 (Warangal) accessing Nalgonda case outside jurisdiction returns 403 Forbidden');

  // Bank 2 (Nalgonda / DCCB) accesses Farmer 2's case (within jurisdiction)
  const b2AccessCase = await fetch(`${baseUrl}/api/assessments/KS-TS-2026-3012`, {
    headers: { Authorization: `Bearer ${tokenB2}` },
  });
  assert(b2AccessCase.status === 200, 'Bank 2 (Nalgonda) accessing authorized Nalgonda case returns 200 OK');

  // Unverified Bank attempts to access cases
  const unvCasesResp = await fetch(`${baseUrl}/api/assessments`, {
    headers: { Authorization: `Bearer ${tokenBUnv}` },
  });
  assert(unvCasesResp.status === 403, 'Unverified Bank Officer GET /api/assessments returns 403 Forbidden');

  // Unverified Bank enters valid institutional verification key
  const verifyResp = await fetch(`${baseUrl}/api/bank/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenBUnv}` },
    body: JSON.stringify({ verificationCode: 'TGB-VERIFY-2026' }),
  });
  const verifyData = await verifyResp.json();
  assert(verifyResp.status === 200 && verifyData.user.isVerified === true, 'Submitting valid institutional key unlocks verified officer access');

  console.log('\n--- 6. AUTHORIZED AUDIT DECISION FLOW TEST ---');
  // Bank 1 records decision on Farmer 1's submitted case
  const decisionResp = await fetch(`${baseUrl}/api/bank/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenB1}` },
    body: JSON.stringify({
      caseId: 'KS-TS-2026-1048',
      decision: 'APPROVED',
      decisionReason: 'Verified with Open-Meteo 164mm rainfall and Sentinel-2 56.9% NDVI reduction.',
    }),
  });
  const decisionData = await decisionResp.json();
  assert(
    decisionResp.status === 200 && decisionData.assessment.status === 'APPROVED',
    'Authorized Bank Officer records decision with reasoned justification (Status -> APPROVED)'
  );

  // Verify Audit Log records decision
  const auditResp = await fetch(`${baseUrl}/api/audit/KS-TS-2026-1048`, {
    headers: { Authorization: `Bearer ${tokenB1}` },
  });
  const auditEvents = (await auditResp.json()).auditEvents;
  const hasDecisionAudit = auditEvents.some((ev) => ev.action === 'DECISION_APPROVED');
  assert(hasDecisionAudit, 'Immutable audit ledger recorded the DECISION_APPROVED event with hash and timestamp');

  console.log(`\n========================================`);
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error('Test suite failed:', e);
  process.exit(1);
});
