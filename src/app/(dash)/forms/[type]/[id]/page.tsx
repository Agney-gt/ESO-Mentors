// app/forms/[type]/[id]/page.tsx

import { FormRenderer } from "@/components/formRendered";
import { notFound } from "next/navigation";

export default async function FormPage({ params }: { params: { type:"mentor"|"mentee", id: string } }) {
    const { type, id } = await params;
    const res = await fetch(`http://localhost:3000/api/forms/${type}/${id}/submit`);
    const data = await res.json();
    console.log(data)

  if (!data) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{data.name}</h1>
      {<FormRenderer formType = {type} formId={id} fields={data.fields} />}
    </div>
  );
}
