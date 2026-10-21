import { getSupabase } from "./supabase";
import bcrypt from "bcryptjs";
import crypto from "crypto";

function getSecret() {
  const secret = process.env.AUTH_SECRET || process.env.SUPABASE_SERVICE_KEY;
  if (!secret) {
    throw new Error("Missing authentication secret in environment");
  }
  return secret;
}

export async function createUser(email, password) {
  const supabase = getSupabase();
  const cleanEmail = email.toLowerCase().trim();
  const hash = await bcrypt.hash(password, 12);
  const { data, error } = await supabase
    .from("users")
    .insert({ email: cleanEmail, password_hash: hash })
    .select("id, email, created_at")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function verifyUser(email, password) {
  const supabase = getSupabase();
  const cleanEmail = email.toLowerCase().trim();
  const { data, error } = await supabase
    .from("users")
    .select("id, email, password_hash, is_blocked, created_at")
    .eq("email", cleanEmail)
    .single();

  if (error || !data) throw new Error("Invalid email or password");
  if (data.is_blocked) throw new Error("Your account has been blocked");

  const match = await bcrypt.compare(password, data.password_hash);
  if (!match) throw new Error("Invalid email or password");

  return { id: data.id, email: data.email, created_at: data.created_at };
}

export function generateUserToken(user) {
  const secret = getSecret();
  const payload = JSON.stringify({
    id: user.id,
    email: user.email,
    iat: Date.now(),
  });
  const encodedPayload = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("hex");

  return `${encodedPayload}.${signature}`;
}

export function validateUserToken(token) {
  if (!token || typeof token !== "string") return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;
    const secret = getSecret();

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(encodedPayload)
      .digest("hex");

    const sigA = Buffer.from(signature);
    const sigB = Buffer.from(expectedSignature);

    if (sigA.length !== sigB.length || !crypto.timingSafeEqual(sigA, sigB)) {
      return null;
    }

    const data = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf-8"));
    const age = Date.now() - Number(data.iat);
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

    if (age < 0 || age > maxAge) return null;
    return { id: data.id, email: data.email };
  } catch {
    return null;
  }
}
