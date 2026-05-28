import { NextResponse } from "next/server";
import { verifyUser, generateUserToken } from "@/lib/userAuth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password)
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });

    const user = await verifyUser(email, password);
    const token = generateUserToken(user);

    return NextResponse.json({ user: { id: user.id, email: user.email }, token });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Invalid credentials" }, { status: 401 });
  }
}
