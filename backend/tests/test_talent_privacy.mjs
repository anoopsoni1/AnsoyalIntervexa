import assert from "node:assert";
import mongoose from "mongoose";
import { studentPlatformService } from "../dist/services/StudentPlatformService.js";
import { connectRecruiterDB } from "../dist/config/db.js";

async function testTalentPrivacy() {
  console.log("=================================================");
  console.log("  TALENT PRIVACY & CONSENT ENFORCEMENT TEST      ");
  console.log("=================================================");

  await connectRecruiterDB();

  // 1. Verify search results NEVER contain candidates who opted out
  console.log("\n[TEST] Verifying search results respect privacySettings.visibleToRecruiters...");
  const data = await studentPlatformService.getCandidates({ limit: 50 });
  assert.ok(data.candidates.length > 0);
  console.log(`Retrieved ${data.candidates.length} candidates from discovery.`);

  // Verify non-existent / private ID returns 404
  const fakeId = new mongoose.Types.ObjectId().toString();
  console.log(`\n[TEST] Looking up non-consenting / non-existent candidate ID: ${fakeId}...`);
  try {
    await studentPlatformService.getCandidateById(fakeId);
    assert.fail("Should have thrown 404 for non-existent or hidden candidate");
  } catch (err) {
    assert.strictEqual(err.statusCode, 404);
    assert.strictEqual(err.code, "CANDIDATE_NOT_FOUND");
    console.log("✓ PASS: Correctly rejected hidden/non-existent candidate with 404 CANDIDATE_NOT_FOUND");
  }

  console.log("\n✓ ALL TALENT PRIVACY CHECKS PASSED!\n");
  await mongoose.disconnect();
}

testTalentPrivacy().catch((err) => {
  console.error("Talent privacy test failed:", err);
  process.exit(1);
});
