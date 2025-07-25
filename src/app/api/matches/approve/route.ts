
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
  
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const body = await req.json();
      const { matchId } = body;
      const { error } = await supabase
      .from("ESO_matches")
      .update({ status: "approved" })
      .eq("id", matchId);
      if (error) {
        return NextResponse.json({ message: "Error", error }, { status: 500 });
      }
      return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    if (err) {
      return NextResponse.json({ message: "Invalid request", errors: err }, { status: 400 });
    }

    console.error("Error sending invitations:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

