import { createClient } from "@supabase/supabase-js";
import {  NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
 
  const organization_id = 101
  if (!organization_id) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("ESO")
      .select("user_id, username, organization_name,location, about"
      )
      .eq("organization_id", organization_id).select();;
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
