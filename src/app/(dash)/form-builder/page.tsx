// app/form-builder/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formTemplateSchema } from "@/lib/schema";
import { z } from "zod";
import  FormTabsCard from "@/components/formBuilder/formClient";
type FormTemplate = z.infer<typeof formTemplateSchema>;
export default async function FormBuilderPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="text-center py-8">
        <h1 className="text-xl font-bold">Unauthorized</h1>
        <p>Please sign in to access the form builder.</p>
      </div>
    );
  }

  const res = await fetch(`http://localhost:3000/api/form-templates`, {
    cache: "no-store", // avoid stale data
    headers: {
      Cookie: "", // in case you pass auth cookies
    },
  });

  const formTemplates: FormTemplate[] = await res.json();

  const mentorTemplates = formTemplates.filter(t => t.type === "mentor");
  const menteeTemplates = formTemplates.filter(t => t.type === "mentee");

  return (
    <div className="space-y-6 mt-16 mb-16">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Form Builder</h1>
          <p className="text-sm text-gray-500">Create and customize onboarding forms for mentors and mentees</p>
        </div>
      </div>

      <FormTabsCard mentorTemplates={mentorTemplates} menteeTemplates={menteeTemplates} />

    </div>
  );
}
