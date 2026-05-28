import { getSupabase } from "./supabase";
import bcrypt from "bcryptjs";

export async function createUser(email, password) {
  const supabase = getSupabase();
  const hash = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from("users")
    .insert({ email, password_hash: hash })
    .select("id, email, created_at")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function verifyUser(email, password) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase().trim())
    .single();
  if (error || !data) throw new Error("Invalid email or password");
  if (data.is_blocked) throw new Error("Your account has been blocked");
  const match = await bcrypt.compare(password, data.password_hash);
  if (!match) throw new Error("Invalid email or password");
  return { id: data.id, email: data.email, created_at: data.created_at };
}

export function generateUserToken(user) {
  const raw = `${user.id}:${user.email}:${Date.now()}`;
  return Buffer.from(raw).toString("base64");
}

export function validateUserToken(token) {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [id, email, timestamp] = decoded.split(":");
    const age = Date.now() - parseInt(timestamp);
    if (age > 7 * 24 * 60 * 60 * 1000) return null;
    return { id, email };
  } catch {
    return null;
  }
}
