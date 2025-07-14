// app/api/register/route.ts (or pages/api/register.ts)
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs"; // Use bcryptjs for compatibility with Next.js
import { NextResponse } from "next/server"; // use 'res' for pages/api

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();
  const { email, username, password } = body;

  if (!email || !username || !password) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("ESO")
      .select("user_id")
      .eq("user_id", email)
      .single();

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert into Supabase
    const { error } = await supabase.from("ESO").insert([
      {
        user_id: email,
        username,
        password_hash: passwordHash,
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
