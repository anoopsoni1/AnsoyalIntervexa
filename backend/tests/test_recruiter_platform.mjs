import assert from "node:assert";
import http from "node:http";
import mongoose from "mongoose";
import { app } from "../dist/app.js";
import { connectRecruiterDB } from "../dist/config/db.js";
import { Company } from "../dist/models/Company.model.js";
import { Recruiter } from "../dist/models/Recruiter.model.js";
import { Shortlist } from "../dist/models/Shortlist.model.js";
import { RecruiterNote } from "../dist/models/RecruiterNote.model.js";

async function runTests() {
  console.log("=================================================");
  console.log("  ANSOYAL AI — RECRUITER PLATFORM TEST SUITE     ");
  console.log("=================================================");

  await connectRecruiterDB();

  const server = http.createServer(app);
  const testPort = 5099;
  await new Promise((resolve) => server.listen(testPort, resolve));
  const baseUrl = `http://127.0.0.1:${testPort}`;
  console.log(`Test server running at ${baseUrl}`);

  let companyA_Token = "";
  let companyA_Id = "";
  let recruiterA_Id = "";

  let companyB_Token = "";
  let companyB_Id = "";
  let recruiterB_Id = "";

  const uniqueSuffix = Date.now();

  try {
    // -------------------------------------------------------------
    // TEST 1: Health check
    // -------------------------------------------------------------
    console.log("\n[TEST 1] Checking Health Endpoint...");
    const healthRes = await fetch(`${baseUrl}/health`);
    assert.strictEqual(healthRes.status, 200);
    const healthData = await healthRes.json();
    assert.strictEqual(healthData.status, "ok");
    console.log("✓ PASS: Health endpoint returned 200 OK");

    // -------------------------------------------------------------
    // TEST 2: Register Recruiter for Company A
    // -------------------------------------------------------------
    console.log("\n[TEST 2] Registering Recruiter for Company A...");
    const regResA = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Alice Recruiter",
        email: `alice_${uniqueSuffix}@techcorp.com`,
        password: "Password123!",
        companyName: "TechCorp Global",
        designation: "Lead Technical Recruiter",
      }),
    });
    assert.strictEqual(regResA.status, 201);
    const regDataA = await regResA.json();
    assert.strictEqual(regDataA.success, true);
    assert.ok(regDataA.data.token);
    companyA_Token = regDataA.data.token;
    companyA_Id = regDataA.data.company.id;
    recruiterA_Id = regDataA.data.recruiter.id;
    console.log("✓ PASS: Registered Recruiter for Company A");

    // -------------------------------------------------------------
    // TEST 3: Register Recruiter for Company B
    // -------------------------------------------------------------
    console.log("\n[TEST 3] Registering Recruiter for Company B...");
    const regResB = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Bob Recruiter",
        email: `bob_${uniqueSuffix}@innovateinc.org`,
        password: "Password123!",
        companyName: "Innovate Inc",
        designation: "Senior Hiring Manager",
      }),
    });
    assert.strictEqual(regResB.status, 201);
    const regDataB = await regResB.json();
    assert.strictEqual(regDataB.success, true);
    companyB_Token = regDataB.data.token;
    companyB_Id = regDataB.data.company.id;
    recruiterB_Id = regDataB.data.recruiter.id;
    console.log("✓ PASS: Registered Recruiter for Company B");

    // -------------------------------------------------------------
    // TEST 4: Recruiter Login
    // -------------------------------------------------------------
    console.log("\n[TEST 4] Testing Recruiter Login...");
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: `alice_${uniqueSuffix}@techcorp.com`,
        password: "Password123!",
      }),
    });
    assert.strictEqual(loginRes.status, 200);
    const loginData = await loginRes.json();
    assert.strictEqual(loginData.success, true);
    assert.ok(loginData.data.token);
    console.log("✓ PASS: Login successful with valid JWT");

    // -------------------------------------------------------------
    // TEST 5: Protected Route - Reject without Token
    // -------------------------------------------------------------
    console.log("\n[TEST 5] Testing Unauthorized Protected Route Access...");
    const unauthRes = await fetch(`${baseUrl}/api/candidates`);
    assert.strictEqual(unauthRes.status, 401);
    console.log("✓ PASS: Access rejected without token (401)");

    // -------------------------------------------------------------
    // TEST 6: Candidate Discovery from Student Platform API
    // -------------------------------------------------------------
    console.log("\n[TEST 6] Discovering Candidates via Student Platform API...");
    const candidatesRes = await fetch(`${baseUrl}/api/candidates`, {
      headers: { Authorization: `Bearer ${companyA_Token}` },
    });
    assert.strictEqual(candidatesRes.status, 200);
    const candidatesData = await candidatesRes.json();
    assert.strictEqual(candidatesData.success, true);
    assert.ok(Array.isArray(candidatesData.data.candidates));
    assert.ok(candidatesData.data.candidates.length > 0);
    const firstCandidate = candidatesData.data.candidates[0];
    console.log(`✓ PASS: Retrieved ${candidatesData.data.candidates.length} candidates.`);
    console.log(`  Sample: ${firstCandidate.name} (${firstCandidate.role}), Credibility: ${firstCandidate.credibility.overallScore}`);

    // -------------------------------------------------------------
    // TEST 7: Candidate Full Profile & Credibility Breakdown
    // -------------------------------------------------------------
    console.log("\n[TEST 7] Fetching Candidate Profile & Credibility Breakdown...");
    const candidateId = firstCandidate.id;
    const profileRes = await fetch(`${baseUrl}/api/candidates/${candidateId}`, {
      headers: { Authorization: `Bearer ${companyA_Token}` },
    });
    assert.strictEqual(profileRes.status, 200);
    const profileData = await profileRes.json();
    assert.strictEqual(profileData.success, true);
    assert.strictEqual(profileData.data.id, candidateId);
    assert.ok(profileData.data.credibility);
    assert.ok(profileData.data.credibility.breakdown);
    assert.ok("codingAbility" in profileData.data.credibility.breakdown);
    assert.ok("communication" in profileData.data.credibility.breakdown);
    console.log("✓ PASS: Candidate profile contains source-of-truth credibility score breakdown");

    // -------------------------------------------------------------
    // TEST 8: Shortlist Candidate (Company A)
    // -------------------------------------------------------------
    console.log("\n[TEST 8] Adding Candidate to Company A Shortlist...");
    const shortlistRes = await fetch(`${baseUrl}/api/shortlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${companyA_Token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        candidateId,
        status: "SHORTLISTED",
        tags: ["High Priority", "Frontend"],
        notes: "Excellent GitHub and coding metrics.",
      }),
    });
    assert.strictEqual(shortlistRes.status, 201);
    const shortlistData = await shortlistRes.json();
    assert.strictEqual(shortlistData.success, true);
    const shortlistId = shortlistData.data._id;
    console.log("✓ PASS: Candidate shortlisted by Company A");

    // -------------------------------------------------------------
    // TEST 9: Company Isolation & IDOR Protection
    // Company B must NOT be able to see or edit Company A's shortlist!
    // -------------------------------------------------------------
    console.log("\n[TEST 9] IDOR Protection: Company B attempts to modify Company A shortlist...");
    const idorRes = await fetch(`${baseUrl}/api/shortlists/${shortlistId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${companyB_Token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "REJECTED" }),
    });
    assert.strictEqual(idorRes.status, 404); // Or 403, must be blocked
    console.log("✓ PASS: IDOR prevented. Company B cannot modify Company A's shortlist");

    // -------------------------------------------------------------
    // TEST 10: Private Recruiter Notes & Isolation
    // -------------------------------------------------------------
    console.log("\n[TEST 10] Testing Private Recruiter Notes...");
    const noteRes = await fetch(`${baseUrl}/api/notes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${companyA_Token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        candidateId,
        note: "Discussed with hiring manager: schedule coding round next week.",
        isPrivateToAuthor: false,
      }),
    });
    assert.strictEqual(noteRes.status, 201);
    console.log("✓ PASS: Private note added to candidate");

    // Verify Company B cannot see Company A's notes
    const compBNotesRes = await fetch(`${baseUrl}/api/notes/${candidateId}`, {
      headers: { Authorization: `Bearer ${companyB_Token}` },
    });
    const compBNotes = await compBNotesRes.json();
    assert.strictEqual(compBNotes.data.length, 0);
    console.log("✓ PASS: Company B cannot see Company A's notes (Isolated)");

    // -------------------------------------------------------------
    // TEST 11: Contact Candidate Workflow
    // -------------------------------------------------------------
    console.log("\n[TEST 11] Testing Contact Candidate Relay...");
    const contactRes = await fetch(`${baseUrl}/api/candidates/${candidateId}/contact`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${companyA_Token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: "Senior Frontend Engineer Opportunity",
        message: "We were impressed by your verified coding projects on Ansoyal.",
        roleTitle: "Senior Frontend Engineer",
      }),
    });
    assert.strictEqual(contactRes.status, 200);
    const contactData = await contactRes.json();
    assert.strictEqual(contactData.success, true);
    assert.strictEqual(contactData.data.status, "DELIVERED");
    console.log("✓ PASS: Contact request routed and recorded successfully");

    // -------------------------------------------------------------
    // TEST 12: Recruiter Dashboard Metrics
    // -------------------------------------------------------------
    console.log("\n[TEST 12] Testing Dashboard Analytics...");
    const dashRes = await fetch(`${baseUrl}/api/dashboard/metrics`, {
      headers: { Authorization: `Bearer ${companyA_Token}` },
    });
    assert.strictEqual(dashRes.status, 200);
    const dashData = await dashRes.json();
    assert.strictEqual(dashData.success, true);
    assert.ok(dashData.data.totalAvailableCandidates > 0);
    assert.ok(dashData.data.shortlistedCount >= 1);
    assert.ok(dashData.data.contactedCount >= 1);
    assert.ok(Array.isArray(dashData.data.recommendedCandidates));
    console.log("✓ PASS: Dashboard returned live pipeline and candidate metrics");

    console.log("\n=================================================");
    console.log("  ALL 12 RECRUITER PLATFORM TESTS PASSED!        ");
    console.log("=================================================\n");
  } finally {
    server.close();
    await mongoose.disconnect();
  }
}

runTests().catch((err) => {
  console.error("Test Suite Failed:", err);
  process.exit(1);
});
