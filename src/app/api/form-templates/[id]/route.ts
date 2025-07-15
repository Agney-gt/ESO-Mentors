// PUT /api/form-templates/:id
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formId = parseInt(params.id);
    if (isNaN(formId)) {
      return NextResponse.json({ message: "Invalid form ID" }, { status: 400 });
    }

    const body = await req.json();
    const { name, type, organization_id, fields } = body;

    if (!name || !type || !organization_id || !fields) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("ESO_form_templates")
      .update({ name, type, organization_id, fields })
      .eq("id", formId)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json({ message: "Failed to update form" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
