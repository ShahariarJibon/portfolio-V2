import { NextResponse } from "next/server";
import { createUser, generateUserToken } from "@/lib/userAuth";
import { rateLimit } from "@/lib/rateLimit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const limiter = rateLimit(`user-signup:${ip}`, 5, 300000); // 5 per 5 min
    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many signup attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail.length > 255 || !EMAIL_REGEX.test(cleanEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    if (password.length > 72) {
      return NextResponse.json({ error: "Password cannot exceed 72 characters" }, { status: 400 });
    }

    const user = await createUser(cleanEmail, password);
    const token = generateUserToken(user);

    return NextResponse.json({ user: { id: user.id, email: user.email }, token });
  } catch (error) {
    if (error.message?.includes("duplicate") || error.message?.includes("unique")) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Signup failed. Please try again." }, { status: 500 });
  }
}
