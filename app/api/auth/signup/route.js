import { NextResponse } from "next/server";
import { createUser, generateUserToken } from "@/lib/userAuth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password)
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    if (password.length < 6)
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });

    const user = await createUser(email, password);
    const token = generateUserToken(user);

    return NextResponse.json({ user: { id: user.id, email: user.email }, token });
  } catch (error) {
    if (error.message?.includes("duplicate"))
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    return NextResponse.json({ error: error.message || "Signup failed" }, { status: 500 });
  }
}
