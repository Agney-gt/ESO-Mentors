import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function PUT(req: NextRequest) {
  const body = await req.json();
  console.log(body)
  const { organization_name, location, about,email } = body;

  if (!email || !organization_name || !location || !about) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("ESO")
      .update({
        organization_name,
        location,
        about,
      })
      .eq("user_id", email).select();;
    console.log(data, error)
    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Organization updated successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Unexpected error", error: err },
      { status: 500 }
    );
  }
}
