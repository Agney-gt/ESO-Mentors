import { FormRenderer } from "@/components/formRendered"
import { notFound } from "next/navigation"

type PageProps = {
  params: Promise<{
    type: "mentor" | "mentee"
    id: string
  }>
}

export default async function FormPage({ params }: PageProps) {
  const { type, id } = await params

  const res = await fetch(`http://localhost:3000/api/forms/${type}/${id}/submit`, {
    cache: "no-store",
  })

  if (!res.ok) return notFound()

  const data = await res.json()

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{data.name}</h1>
      <FormRenderer formType={type} formId={id} fields={data.fields} />
    </div>
  )
}
