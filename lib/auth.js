import crypto from "crypto";

function getSecret() {
  const secret = process.env.AUTH_SECRET || process.env.SUPABASE_SERVICE_KEY || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("Missing authentication secret in environment");
  }
  return secret;
}

export function verifyAdminPassword(inputPassword) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || !inputPassword || typeof inputPassword !== "string") {
    return false;
  }

  // Constant-time comparison using SHA-256 to prevent timing attacks
  const a = crypto.createHash("sha256").update(inputPassword).digest();
  const b = crypto.createHash("sha256").update(adminPassword).digest();
  return crypto.timingSafeEqual(a, b);
}

export function generateToken() {
  const secret = getSecret();
  const payload = JSON.stringify({
    role: "admin",
    iat: Date.now(),
  });
  const encodedPayload = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("hex");

  return `${encodedPayload}.${signature}`;
}

export function validateToken(token) {
  if (!token || typeof token !== "string") return false;

  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const [encodedPayload, signature] = parts;
    const secret = getSecret();

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(encodedPayload)
      .digest("hex");

    const sigA = Buffer.from(signature);
    const sigB = Buffer.from(expectedSignature);

    if (sigA.length !== sigB.length || !crypto.timingSafeEqual(sigA, sigB)) {
      return false;
    }

    const data = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf-8"));
    if (data.role !== "admin") return false;

    const age = Date.now() - Number(data.iat);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    return age >= 0 && age < maxAge;
  } catch {
    return false;
  }
}
