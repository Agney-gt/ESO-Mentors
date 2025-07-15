// app/api/register/route.ts (or pages/api/register.ts)
import { createClient } from "@supabase/supabase-js";
import { NextResponse, NextRequest } from "next/server"; // use 'res' for pages/api
//import { formTemplateSchema } from "@/lib/schema";
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
    try {
      const { data, error } = await supabase
        .from("ESO_form_templates")
        .select("*");
  
      if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json({ message: "Failed to fetch templates" }, { status: 500 });
      }
    
    //   const validated = formTemplateSchema.safeParse(data);
    //   console.log(validated)
  
    //   if (!validated.success) {
    //     console.error("Validation error:", validated.error);
    //     return NextResponse.json({ message: "Invalid template structure" }, { status: 422 });
    //   }
    //   console.log(validated.data)
  
      return NextResponse.json(data, { status: 200 });
    } catch (err) {
      console.error("API error:", err);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }

  export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
  
      const { name, type, organization_id, fields } = body;
  
      if (!name || !type || !organization_id || !fields) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
      }
  
      const { data, error } = await supabase
        .from("ESO_form_templates")
        .insert([{ name, type, organization_id, fields }])
        .select()
        .single();
  
      if (error) {
        console.error("Insert error:", error);
        return NextResponse.json({ message: "Failed to create form" }, { status: 500 });
      }
  
      return NextResponse.json(data, { status: 201 });
    } catch (err) {
      console.error("API error:", err);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }

  