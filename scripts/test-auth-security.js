const assert = require("node:assert/strict");
const { encryptToken, decryptToken } = require("../dist-test/crypto.js");

async function run() {
  const token = "canvas-secret-token";
  const encryptedA = encryptToken(token);
  const encryptedB = encryptToken(token);

  assert.notEqual(encryptedA, token, "Encrypted token should not equal plaintext");
  assert.notEqual(encryptedA, encryptedB, "Encrypting the same token twice should yield different ciphertext");
  assert.equal(decryptToken(encryptedA), token,"Decrypted token should match original plaintext");

  const baseUrl = process.env.TEST_BASE_URL || "http://localhost:3000";

  const unauthWeek = await fetch(`${baseUrl}/api/assignments/week`);
  assert.equal(unauthWeek.status, 401, "Unauthenticated weekly route should return 401");

  const signupResponse = await fetch(`${baseUrl}/api/auth/signup`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: `dennis-test-${Date.now()}@example.com`,
      password: "SuperSecure123",
    }),
  });

  assert.equal(signupResponse.status, 201, "Signup should succeed");
  const setCookie = signupResponse.headers.get("set-cookie");
  assert.ok(setCookie, "Signup should set a session cookie");

  const authCookie = setCookie.split(";")[0];

  const currentUserResponse = await fetch(`${baseUrl}/api/auth/current-user`, {
    headers: { cookie: authCookie },
  });
  assert.equal(currentUserResponse.status, 200, "Current user route should succeed");

  const saveTokenResponse = await fetch(`${baseUrl}/api/canvas-token`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: authCookie,
    },
    body: JSON.stringify({ token: "abc123canvas" }),
  });
  assert.equal(saveTokenResponse.status, 200, "Canvas token storage should succeed");

  console.log("Auth/security checks passed.");
}

run().catch((error) => {console.error(error); process.exit(1); });
