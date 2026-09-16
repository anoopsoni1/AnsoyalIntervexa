import assert from "node:assert";
import { StudentPlatformService } from "../dist/services/StudentPlatformService.js";

async function testResilience() {
  console.log("=================================================");
  console.log("  STUDENT SERVICE RESILIENCE & FAILURE HANDLING   ");
  console.log("=================================================");

  // Create an instance configured to a dead port to simulate service outage
  const deadService = new StudentPlatformService();
  deadService.client.defaults.baseURL = "http://127.0.0.1:59999/api/v1/recruiter";

  console.log("\n[TEST] Querying unreachable Student Platform service...");
  try {
    await deadService.getCandidates({ page: 1 });
    assert.fail("Should have thrown error for unreachable service");
  } catch (err) {
    assert.strictEqual(err.statusCode, 503);
    assert.strictEqual(err.code, "CANDIDATE_SERVICE_UNAVAILABLE");
    console.log("✓ PASS: Correctly caught network failure and mapped to 503 CANDIDATE_SERVICE_UNAVAILABLE");
  }

  console.log("\n✓ ALL RESILIENCE TESTS PASSED!\n");
}

testResilience().catch((err) => {
  console.error("Resilience test failed:", err);
  process.exit(1);
});
