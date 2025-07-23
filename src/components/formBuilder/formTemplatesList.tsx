import { useState } from "react";
import FormEditor from "@/components/formBuilder/formEditor"; // Adjust path if needed
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formTemplateSchema } from "@/lib/schema";
import {z} from "zod";
type FormTemplate = z.infer<typeof formTemplateSchema>;
interface FormTemplatesListProps {
    templates: FormTemplate[];
    formType: "mentor" | "mentee";
  }
  
export function FormTemplatesList({ templates, formType }: FormTemplatesListProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  if (showEditor && selectedTemplateId !== null ) {
    return (
      <FormEditor
        formType={formType}
        forms={templates ?? undefined}
        index={selectedTemplateId}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => {
          setSelectedTemplateId(templates.length + 1); // New form
          setShowEditor(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Form
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template,index) => (
          <div
            key={template.id}
            className="border rounded-lg p-4 hover:border-primary transition-colors block cursor-pointer"
            onClick={() => {
              setSelectedTemplateId(index);
              setShowEditor(true);
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{template.name}</h3>
                <p className="text-sm text-gray-500">
                  {Array.isArray(template.fields) ? template.fields.length : 0} questions
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Last updated:{" "}
                  {template.updated_at
                    ? new Date(template.updated_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div className="space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/forms/${template.type}/${template.id}`;
                    navigator.clipboard.writeText(url);
                    alert("Link copied to clipboard!");
                  }}
                >
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-gray-500 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("Delete coming soon.");
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
