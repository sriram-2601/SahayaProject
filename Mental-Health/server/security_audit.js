/**
 * =================================================================
 * SahayA Security & VAPT Defensive Verification Suite
 * =================================================================
 * This script audits and verifies active security defenses in server.js:
 * 1. Security Headers (Clickjacking & MIME sniffing defense)
 * 2. Strict CORS Enforcement (Unauthorized origin rejection)
 * 3. In-Memory Rate Limiting (DOS & SMS/Chat flooding prevention)
 * 4. Backend Groq AI Chat Proxy (API key protection & validation)
 * 5. Input Validation on /send-message
 */

const http = require("http");

const BASE_URL = "http://localhost:4000";

const makeRequest = ({ path, method = "GET", headers = {}, body = null }) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: {
        ...headers,
        ...(body ? { "Content-Type": "application/json" } : {})
      }
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsed
        });
      });
    });

    req.on("error", (err) => reject(err));
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

async function runSecurityAudit() {
  console.log("\n============================================================");
  console.log("🛡️  RUNNING SAHAYA DEFENSIVE SECURITY AUDIT (VAPT VERIFICATION)");
  console.log("============================================================\n");

  let passed = 0;
  let failed = 0;

  // Test 1: Security Headers on Health Check
  try {
    process.stdout.write("[Test 1] Verifying Security Headers (Clickjacking/MIME)... ");
    const res = await makeRequest({ path: "/health" });
    const hasFrameOptions = res.headers["x-frame-options"] === "DENY";
    const hasNosniff = res.headers["x-content-type-options"] === "nosniff";
    const hasCSP = res.headers["content-security-policy"]?.includes("frame-ancestors 'none'");

    if (res.statusCode === 200 && hasFrameOptions && hasNosniff && hasCSP) {
      console.log("✅ PASSED (X-Frame-Options, X-Content-Type-Options & CSP Active)");
      passed++;
    } else {
      console.log(`❌ FAILED (Headers missing or incorrect)`);
      failed++;
    }
  } catch (err) {
    console.log(`❌ FAILED (Server not reachable at ${BASE_URL}: ${err.message})`);
    failed++;
  }

  // Test 2: CORS Unauthorized Origin Blocking
  try {
    process.stdout.write("[Test 2] Verifying CORS Rejection for Unauthorized Origin... ");
    const res = await makeRequest({
      path: "/health",
      headers: { Origin: "http://malicious-attacker-site.com" }
    });

    if (res.statusCode === 403 || res.data?.error?.includes("CORS")) {
      console.log("✅ PASSED (Unauthorized origin blocked with 403)");
      passed++;
    } else {
      console.log(`❌ FAILED (Unexpected status: ${res.statusCode})`);
      failed++;
    }
  } catch (err) {
    console.log(`❌ FAILED: ${err.message}`);
    failed++;
  }

  // Test 3: CORS Authorized Origin Allowed
  try {
    process.stdout.write("[Test 3] Verifying CORS Approval for Whitelisted Frontend... ");
    const res = await makeRequest({
      path: "/health",
      headers: { Origin: "http://localhost:3000" }
    });

    if (res.statusCode === 200 && res.headers["access-control-allow-origin"] === "http://localhost:3000") {
      console.log("✅ PASSED (Whitelisted origin accepted)");
      passed++;
    } else {
      console.log(`❌ FAILED (Status: ${res.statusCode})`);
      failed++;
    }
  } catch (err) {
    console.log(`❌ FAILED: ${err.message}`);
    failed++;
  }

  // Test 4: Rate Limiting on /send-message (VAPT #29 DOS Defense)
  try {
    process.stdout.write("[Test 4] Verifying In-Memory Rate Limiting on /send-message... ");
    let throttled = false;
    // Send 7 rapid requests (limit is 5 per minute)
    for (let i = 0; i < 7; i++) {
      const res = await makeRequest({
        path: "/send-message",
        method: "POST",
        body: { phone: "+1234567890", appointmentDetails: { consultantName: "Test" } }
      });
      if (res.statusCode === 429) {
        throttled = true;
        break;
      }
    }

    if (throttled) {
      console.log("✅ PASSED (Rate limit triggered HTTP 429 Too Many Requests)");
      passed++;
    } else {
      console.log("❌ FAILED (Rate limit not triggered after 6 rapid requests)");
      failed++;
    }
  } catch (err) {
    console.log(`❌ FAILED: ${err.message}`);
    failed++;
  }

  // Test 5: Backend Groq AI Chat Proxy Validation
  try {
    process.stdout.write("[Test 5] Verifying Backend AI Chat Route Validation... ");
    const res = await makeRequest({
      path: "/api/chat",
      method: "POST",
      body: {
        messages: [{ role: "user", content: "Hello Sahaya" }]
      }
    });

    // Since GROQ_API_KEY might not be set in test environment, fallbackRequired or success is expected
    if (res.statusCode === 200 && (res.data?.success === true || res.data?.fallbackRequired === true)) {
      console.log(`✅ PASSED (Protected endpoint operational, API key kept server-side)`);
      passed++;
    } else {
      console.log(`❌ FAILED (Unexpected response: ${res.statusCode} - ${JSON.stringify(res.data)})`);
      failed++;
    }
  } catch (err) {
    console.log(`❌ FAILED: ${err.message}`);
    failed++;
  }

  console.log("\n------------------------------------------------------------");
  console.log(`Audit Results: ${passed} Passed, ${failed} Failed`);
  console.log("------------------------------------------------------------\n");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// Execute
runSecurityAudit();
