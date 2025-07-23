"use client";

import { useState} from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, GripVertical, Save } from "lucide-react";
import { QuestionTypeSelect, FormPreviewField } from "./question-types";
import { formFieldSchema, formTemplateSchema } from "@/lib/schema";
import { z } from "zod";
type FormTemplate = z.infer<typeof formTemplateSchema>;
type FormField = z.infer<typeof formFieldSchema>;

interface FormEditorProps {
  formType: "mentor" | "mentee";
  forms: { name: string; fields: FormField[] }[];
  index: number;
}

const defaultMentorFields: FormField[] = [
  { id: "name", label: "Full Name", type: "text", required: true },
  { id: "email", label: "Email Address", type: "email", required: true },
  { id: "title", label: "Job Title", type: "text", required: false },
  { id: "organization", label: "Organization", type: "text", required: false },
  { id: "bio", label: "Short Bio", type: "textarea", required: false },
  { id: "industry", label: "Industry", type: "text", required: false },
  { id: "expertise", label: "Areas of Expertise", type: "multiselect", options: [
      { value: "javascript", label: "JavaScript" },
      { value: "react", label: "React" },
      { value: "nodejs", label: "Node.js" },
      { value: "agile", label: "Agile" },
      { value: "scrum", label: "Scrum" },
      { value: "leadership", label: "Leadership" }
    ], required: true },
  { id: "availability", label: "Availability", type: "multiselect", options: [
      { value: "weekdays", label: "Weekdays" },
      { value: "weekends", label: "Weekends" },
      { value: "mornings", label: "Mornings" },
      { value: "evenings", label: "Evenings" }
    ], required: true },
  { id: "booking_link", label: "Booking Link (e.g., Calendly)", type: "textarea", required: false },
  { id: "preferred_meeting_format", label: "Preferred Meeting Format", type: "select", options: [
      { value: "virtual", label: "Virtual" },
      { value: "in-person", label: "In-Person" }
    ], required: true },
  { id: "years_of_experience", label: "Years of Experience", type: "number", required: false },
  { id: "goals", label: "Why do you want to be a mentor?", type: "textarea", required: true },
  { id: "interests", label: "Topics You’re Interested in Mentoring", type: "multiselect", options: [
      { value: "frontend", label: "Frontend" },
      { value: "leadership", label: "Leadership" },
      { value: "strategy", label: "Strategy" },
      { value: "execution", label: "Execution" }
    ], required: true },
];
const defaultMenteeFields: FormField[] = [
  { id: "name", label: "Full Name", type: "text", required: true },
  { id: "email", label: "Email Address", type: "email", required: true },
  { id: "background", label: "Brief Background (e.g., education, work experience)", type: "textarea", required: true },
  { id: "goals", label: "What are your goals for seeking a mentor?", type: "textarea", required: true },
  { id: "industry", label: "Industry of Interest", type: "text", required: true },
  { id: "interests", label: "Topics You’re Interested in Learning", type: "multiselect", options: [
      { value: "react", label: "React" },
      { value: "web-development", label: "Web Development" },
      { value: "agile", label: "Agile" },
      { value: "product-strategy", label: "Product Strategy" },
      { value: "leadership", label: "Leadership" }
    ], required: true },
  { id: "availability", label: "Availability", type: "multiselect", options: [
      { value: "weekdays", label: "Weekdays" },
      { value: "weekends", label: "Weekends" },
      { value: "mornings", label: "Mornings" },
      { value: "evenings", label: "Evenings" }
    ], required: true },
  { id: "preferred_meeting_format", label: "Preferred Meeting Format", type: "select", options: [
      { value: "virtual", label: "Virtual" },
      { value: "in-person", label: "In-Person" }
    ], required: true },
];

export default function FormEditor({ formType, forms, index }: FormEditorProps) {
  const selectedForm = forms[index];

  const [formName, setFormName] = useState<string>(selectedForm?.name ?? `${formType.charAt(0).toUpperCase() + formType.slice(1)} Onboarding Form`);
  const [fields, setFields] = useState<FormField[]>(
    selectedForm?.fields ??
      (formType === "mentor"
        ? defaultMentorFields
        : formType === "mentee"
        ? defaultMenteeFields
        : [])
  );
  const [isDragging, setIsDragging] = useState(false);
  const [draggedField, setDraggedField] = useState<FormField | null>(null);
  const [saving, setSaving] = useState(false);

  const saveForm = async () => {
    setSaving(true);
    try {
      const formData = {
        name: formName,
        type: formType,
        organization_id: 101,
        fields,
      };
  
      // 1. Check if form with the same name exists
      const checkRes = await fetch(`/api/form-templates`, {
        method: "GET",
      });
  
      if (!checkRes.ok) throw new Error("Failed to fetch existing templates");
  
      const existingForms = await checkRes.json();
      const existingForm = existingForms.find((f: FormTemplate) => f.name === formName);
  
      // 2. If exists, update (PUT)
      if (existingForm) {
        const updateRes = await fetch(`/api/form-templates/${existingForm.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
  
        if (!updateRes.ok) throw new Error("Failed to update form");
        alert("Form updated successfully");
      } else {
        // 3. If not exists, create (POST)
        const createRes = await fetch(`/api/form-templates`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
  
        if (!createRes.ok) throw new Error("Failed to create form");
        alert("Form created successfully");
      }
  
      console.log("Saved form:", formData);
    } catch (err) {
      console.error(err);
      alert("Error saving form");
    } finally {
      setSaving(false);
    }
  };
  

  const addField = () => {
    const newField: FormField = {
      id: Math.random().toString(36).substring(2, 11),
      type: "text",
      label: "New Question",
      placeholder: "",
      required: false,
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const handleDragStart = (field: FormField) => {
    setIsDragging(true);
    setDraggedField(field);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (!draggedField) return;

    const newFields = [...fields];
    const fromIndex = fields.findIndex((f) => f.id === draggedField.id);
    if (fromIndex === index) return;

    newFields.splice(fromIndex, 1);
    newFields.splice(index, 0, draggedField);
    setFields(newFields);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedField(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Input
          className="max-w-md"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="Form Name"
        />
        <Button onClick={saveForm} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Form"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Questions</CardTitle>
        </CardHeader>
        <CardContent>
          {fields.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
                <PlusCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No questions added</h3>
              <p className="mt-1 text-sm text-gray-500">Add your first question below.</p>
              <div className="mt-6">
                <Button onClick={addField}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  draggable
                  onDragStart={() => handleDragStart(field)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white p-4 rounded-md shadow border ${
                    isDragging && draggedField?.id === field.id
                      ? "border-primary border-dashed opacity-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <GripVertical className="mr-2 h-5 w-5 text-gray-400 cursor-move" />
                      <h4 className="font-medium text-gray-800">{field.label}</h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(field.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Field Editing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`label-${field.id}`}>Question Text</Label>
                      <Input
                        id={`label-${field.id}`}
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`type-${field.id}`}>Question Type</Label>
                      <QuestionTypeSelect
                        id={`type-${field.id}`}
                        value={field.type}
                        onChange={(val) => updateField(field.id, { type: val as FormField["type"] })}
                      />
                    </div>
                  </div>

                  {(field.type === "select" ||
                    field.type === "multiselect" ||
                    field.type === "radio" ||
                    field.type === "checkbox") && (
                    <div className="mt-3">
                      <Label>Options</Label>
                      <div className="space-y-2">
                        {(field.options || []).map((opt, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <Input
                              value={opt.label}
                              onChange={(e) => {
                                const newOptions = [...(field.options || [])];
                                newOptions[optIndex] = {
                                  value: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                                  label: e.target.value,
                                };
                                updateField(field.id, { options: newOptions });
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newOptions = [...(field.options || [])];
                                newOptions.splice(optIndex, 1);
                                updateField(field.id, { options: newOptions });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newOptions = [...(field.options || [])];
                            newOptions.push({
                              value: `option-${newOptions.length + 1}`,
                              label: `Option ${newOptions.length + 1}`,
                            });
                            updateField(field.id, { options: newOptions });
                          }}
                        >
                          Add Option
                        </Button>
                      </div>
                    </div>
                  )}

                  {(field.type === "text" ||
                    field.type === "textarea" ||
                    field.type === "email" ||
                    field.type === "number") && (
                    <div className="mt-3">
                      <Label>Placeholder Text</Label>
                      <Input
                        value={field.placeholder || ""}
                        onChange={(e) =>
                          updateField(field.id, { placeholder: e.target.value })
                        }
                      />
                    </div>
                  )}

                  <div className="flex items-center mt-3">
                    <Checkbox
                      id={`required-${field.id}`}
                      checked={field.required}
                      onCheckedChange={(val) =>
                        updateField(field.id, { required: !!val })
                      }
                    />
                    <Label htmlFor={`required-${field.id}`} className="ml-2">
                      Required
                    </Label>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-md border">
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Preview</div>
                    <FormPreviewField field={field} />
                  </div>
                </div>
              ))}

              <Button onClick={addField} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
