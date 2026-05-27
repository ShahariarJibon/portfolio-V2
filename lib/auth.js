export function verifyAdminPassword(password) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.warn("ADMIN_PASSWORD not set in environment variables");
    return false;
  }
  return password === adminPassword;
}

export function generateToken() {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const timestamp = Date.now();
  const raw = `${adminPassword}:${timestamp}`;
  return Buffer.from(raw).toString("base64");
}

export function validateToken(token) {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [password, timestamp] = decoded.split(":");
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (password !== adminPassword) return false;
    const age = Date.now() - parseInt(timestamp);
    return age < 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}
