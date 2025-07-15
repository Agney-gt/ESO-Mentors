import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Await the params since they're now a Promise in Next.js 15
    const params = await context.params
    const formId = Number.parseInt(params.id)

    if (isNaN(formId)) {
      return NextResponse.json({ message: "Invalid form ID" }, { status: 400 })
    }

    const body = await req.json()
    const { name, type, organization_id, fields } = body

    if (!name || !type || !organization_id || !Array.isArray(fields)) {
      return NextResponse.json({ message: "Missing or invalid fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("ESO_form_templates")
      .update({
        name,
        type,
        organization_id,
        fields,
        updated_at: new Date().toISOString(),
      })
      .eq("id", formId)
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ message: "Failed to update form" }, { status: 500 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    console.error("PUT /form-templates/[id] error:", err)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
