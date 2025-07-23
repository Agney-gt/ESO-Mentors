"use client";

import { useState } from "react";
import { z } from "zod";
import { formFieldSchema } from "@/lib/schema";


type Field = z.infer<typeof formFieldSchema>;
type FormRendererProps = {
    formType: "mentor" | "mentee";
  formId: string;
  fields: Field[];
  existingResponses?: Record<string, string | number | boolean>[];
};

export function FormRenderer({ formType, formId, fields }: FormRendererProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});// eslint-disable-line @typescript-eslint/no-explicit-any
  const [submitting, setSubmitting] = useState(false);


  const handleChange = (id: string, value: any) => {// eslint-disable-line @typescript-eslint/no-explicit-any
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch(`http://localhost:3000/api/forms/${formType}/${formId}/submit`, {
        method: "POST",
        body: JSON.stringify({ response: formData }),
      });
      
    setSubmitting(false);

  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.id}>
          <label className="block font-medium mb-1">
            {field.label}
            {field.required && " *"}
          </label>

          {field.type === "text" || field.type === "email" || field.type === "number" ? (
            <input
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="w-full border p-2 rounded"
            />
          ) : field.type === "radio" ? (
            field.options?.map((option) => (
              <label key={option.value} className="block">
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={formData[field.id] === option.value}
                  onChange={() => handleChange(field.id, option.value)}
                />
                {option.label}
              </label>
            ))
          ) : field.type === "checkbox" ? (
            <input
              type="checkbox"
              checked={formData[field.id] || false}
              onChange={(e) => handleChange(field.id, e.target.checked)}
            />
          ) : null}
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
