import assert from "node:assert";
import http from "node:http";
import jwt from "jsonwebtoken";
import { app } from "../dist/app.js";
import { connectRecruiterDB } from "../dist/config/db.js";
import { ENV } from "../dist/config/env.js";
import { Recruiter } from "../dist/models/Recruiter.model.js";

async function testTokens() {
  console.log("=================================================");
  console.log("  ANSOYAL AI — RECRUITER TOKEN LIFECYCLE TEST   ");
  console.log("=================================================");

  await connectRecruiterDB();

  const server = http.createServer(app);
  const testPort = 5098;
  await new Promise((resolve) => server.listen(testPort, resolve));
  const baseUrl = `http://127.0.0.1:${testPort}`;

  const suffix = Date.now();
  const testEmail = `token_tester_${suffix}@enterprise.com`;
  const testPass = "SecurePass123!";

  try {
    // 1. Register and verify tokens in response
    console.log("\n[1] Registering recruiter and verifying dual tokens...");
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Token Specialist",
        email: testEmail,
        password: testPass,
        companyName: "Enterprise Ltd",
      }),
    });
    assert.strictEqual(regRes.status, 201);
    const regData = await regRes.json();
    assert.strictEqual(regData.success, true);
    assert.ok(regData.data.accessToken, "Should have accessToken");
    assert.ok(regData.data.refreshToken, "Should have refreshToken");
    assert.strictEqual(regData.data.expiresIn, "1d");

    // Verify accessToken signed with ACCESS_TOKEN_SECRET
    const decodedAccess = jwt.verify(regData.data.accessToken, ENV.ACCESS_TOKEN_SECRET);
    assert.strictEqual(decodedAccess.email, testEmail);

    // Verify refreshToken signed with REFRESH_TOKEN_SECRET
    const decodedRefresh = jwt.verify(regData.data.refreshToken, ENV.REFRESH_TOKEN_SECRET);
    assert.strictEqual(decodedRefresh.email, testEmail);
    console.log("✓ PASS: Both access token and refresh token created & cryptographically verified");

    // 2. Call protected route using access token
    console.log("\n[2] Calling protected endpoint /api/auth/me with access token...");
    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${regData.data.accessToken}` },
    });
    assert.strictEqual(meRes.status, 200);
    const meData = await meRes.json();
    assert.strictEqual(meData.data.recruiter.email, testEmail);
    console.log("✓ PASS: Protected route authenticated successfully");

    // 3. Refresh the token using POST /api/auth/refresh
    console.log("\n[3] Exchanging refresh token for new access token...");
    const refreshRes = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: regData.data.refreshToken }),
    });
    assert.strictEqual(refreshRes.status, 200);
    const refreshData = await refreshRes.json();
    assert.strictEqual(refreshData.success, true);
    assert.ok(refreshData.data.accessToken, "Should return new access token");
    assert.ok(refreshData.data.refreshToken, "Should return rotated refresh token");

    // New access token should work
    const newMeRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${refreshData.data.accessToken}` },
    });
    assert.strictEqual(newMeRes.status, 200);
    console.log("✓ PASS: New access token authenticated successfully after refresh");

    // 4. Test old refresh token rejection (rotation safety)
    console.log("\n[4] Verifying old refresh token rejection after rotation...");
    const staleRefreshRes = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: regData.data.refreshToken }),
    });
    assert.strictEqual(staleRefreshRes.status, 401);
    console.log("✓ PASS: Stale refresh token rejected (anti-replay/rotation)");

    // 5. Test Logout and revocation
    console.log("\n[5] Testing logout and token revocation...");
    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${refreshData.data.accessToken}` },
    });
    assert.strictEqual(logoutRes.status, 200);

    const revokedRecruiter = await Recruiter.findOne({ email: testEmail });
    assert.strictEqual(revokedRecruiter.refreshToken, "");
    console.log("✓ PASS: Logout cleared refresh token in DB");

    console.log("\n=================================================");
    console.log("  ALL TOKEN LIFECYCLE TESTS PASSED!              ");
    console.log("=================================================\n");
  } finally {
    server.close();
    process.exit(0);
  }
}

testTokens().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
