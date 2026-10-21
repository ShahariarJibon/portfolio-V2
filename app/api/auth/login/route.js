import { NextResponse } from "next/server";
import { verifyUser, generateUserToken } from "@/lib/userAuth";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const limiter = rateLimit(`user-login:${ip}`, 10, 60000);
    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in 1 minute." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    if (email.length > 255 || password.length > 72) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const user = await verifyUser(email, password);
    const token = generateUserToken(user);

    return NextResponse.json({ user: { id: user.id, email: user.email }, token });
  } catch (error) {
    const msg = error.message === "Your account has been blocked"
      ? "Your account has been blocked"
      : "Invalid email or password";
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}
