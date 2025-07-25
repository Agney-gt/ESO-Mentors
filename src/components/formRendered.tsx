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
    await fetch(`${window.location.origin}/api/forms/${formType}/${formId}/submit`, {
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

      {/* Text, Email, Number */}
      {["text", "email", "number"].includes(field.type) && (
        <input
          type={field.type}
          placeholder={field.placeholder}
          required={field.required}
          value={formData[field.id] || ""}
          onChange={(e) => handleChange(field.id, e.target.value)}
          className="w-full border p-2 rounded"
        />
      )}

      {/* Textarea */}
      {field.type === "textarea" && (
        <textarea
          placeholder={field.placeholder}
          required={field.required}
          value={formData[field.id] || ""}
          onChange={(e) => handleChange(field.id, e.target.value)}
          className="w-full border p-2 rounded h-28"
        />
      )}

      {/* Select */}
      {field.type === "select" && (
        <select
          required={field.required}
          value={formData[field.id] || ""}
          onChange={(e) => handleChange(field.id, e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select...</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

{field.type === "multiselect" && (
  <div className="w-full border p-2 rounded">
    <div className="flex flex-wrap gap-2 mb-2">
      {(formData[field.id] || []).map((val: string) => {
        const option = field.options?.find((o) => o.value === val);
        return (
          <span
            key={val}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
          >
            {option?.label}
            <button
              type="button"
              onClick={() =>
                handleChange(
                  field.id,
                  (formData[field.id] || []).filter((v: string) => v !== val)
                )
              }
              className="ml-1 text-xs text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </span>
        );
      })}
    </div>
    <div className="grid grid-cols-2 gap-2">
      {field.options?.map((option) => {
        const isSelected = (formData[field.id] || []).includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              const currentValues = formData[field.id] || [];
              const newValues = isSelected
                ? currentValues.filter((v: string) => v !== option.value)
                : [...currentValues, option.value];
              handleChange(field.id, newValues);
            }}
            className={`border rounded px-2 py-1 text-left ${
              isSelected
                ? "bg-blue-600 text-white border-blue-600"
                : "hover:bg-gray-100"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  </div>
)}


      {/* Radio */}
      {field.type === "radio" && (
        <div className="space-y-1">
          {field.options?.map((option) => (
            <label key={option.value} className="block">
              <input
                type="radio"
                name={field.id}
                value={option.value}
                checked={formData[field.id] === option.value}
                onChange={() => handleChange(field.id, option.value)}
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      )}

      {/* Checkbox (single) */}
      {field.type === "checkbox" && !field.options && (
        <input
          type="checkbox"
          checked={formData[field.id] || false}
          onChange={(e) => handleChange(field.id, e.target.checked)}
          className="mr-2"
        />
      )}

      {/* Checkbox (multiple)
      {field.type === "checkbox" && field.options && (
        <div className="space-y-1">
          {field.options.map((option) => (
            <label key={option.value} className="block">
              <input
                type="checkbox"
                value={option.value}
                checked={formData[field.id]?.includes(option.value)}
                onChange={(e) => {
                  const valueArray = formData[field.id] || [];
                  const newValues = e.target.checked
                    ? [...valueArray, option.value]
                    : valueArray.filter((v) => v !== option.value);
                  handleChange(field.id, newValues);
                }}
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      )} */}
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
