import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";
// GET: Fetch a form template by type and ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: number; type: string }> }
) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error("Missing Supabase environment variables");
      }
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );  
  const { id, type } = await params;
  

  const { data, error } = await supabase
    .from("ESO_form_templates")
    .select("*")
    .eq("id", id)
    .eq("type", type)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

// POST: Add a new response to a form template
export async function POST(
  
  req: NextRequest,
  { params }: { params: Promise<{ id: number; type: string }> }
) {
  console.log("ere")
    const { id, type } = await params;
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error("Missing Supabase environment variables");
      }
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );  
 

  const body = await req.json();
  const newResponse = body.response;

  // Fetch form template
  const { data: existing, error: fetchError } = await supabase
    .from("ESO_form_templates")
    .select("responses")
    .eq("id", id)
    .eq("type", type)
    .single();
  
  if (fetchError || !existing) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const updatedResponses = [...(existing.responses || []), newResponse];
  console.log(updatedResponses)
  const { error: updateError } = await supabase
    .from("ESO_form_templates")
    .update({ responses: updatedResponses })
    .eq("id", id)
    .eq("type", type);

  if (updateError) {
    console.log(updateError)
    return NextResponse.json({ error: "Failed to update responses" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
