import { z } from "zod";

// Match status enum from your Drizzle schema
export const matchStatusEnum = z.enum(["pending", "approved", "rejected"]);
export const formResponsesSchema = z.record(
    z.string(), // Specify the key schema as strings
    z.union([
      z.string(),
      z.array(z.string()),
      z.number(),
      z.boolean(),
      z.null()
    ])
  );
export const matchSchema = z.object({
  id: z.number().int().positive(), // ✅ required when reading from DB
  organizationId: z.number().int().positive(),
  mentorId: z.number().int().positive(),
  menteeId: z.number().int().positive(),
  matchScore: z.number().int().min(0).max(100).optional(),
  matchReasons: z.array(z.string()).optional(), // assuming array of reasons
  status: matchStatusEnum.optional(), // default is 'pending' if not passed
  adminId: z.number().int().positive().optional(),
  introEmailSent: z.boolean().optional(),
  followUpEmailSent: z.boolean().optional(),
  sessionScheduled: z.boolean().optional(),
});
export const mentorSchema = z.object({
    user_id: z.number().int().positive().optional(),
    organization_id: z.number().int().positive(),
    name: z.string().min(1),
    email: z.string().email(),
    title: z.string().optional(),
    organization: z.string().optional(),
    bio: z.string().optional(),
    industry: z.string().optional(),
    expertise: z.array(z.string()).optional(),
    availability: z.array(z.string()).optional(),
    bookingLink: z.string().url().optional(),
    preferredMeetingFormat: z.string().optional(),
    yearsOfExperience: z.string().optional(),
    active: z.boolean().optional(),
    approved: z.boolean().optional(),
    welcomeEmailSent: z.boolean().optional(),
    profileCompleted: z.boolean().optional(),
    formResponses: formResponsesSchema.optional(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
  });
export const menteeSchema = z.object({
    user_id: z.number().int().positive().optional(),
    organization_id: z.number().int().positive(),
    name: z.string().min(1),
    email: z.string().email(),
    background: z.string().optional(),
    goals: z.string().optional(),
    industry: z.string().optional(),
    interests: z.array(z.string()).optional(),
    availability: z.array(z.string()).optional(),
    preferredMeetingFormat: z.string().optional(),
    active: z.boolean().optional(),
    approved: z.boolean().optional(),
    welcomeEmailSent: z.boolean().optional(),
    profileCompleted: z.boolean().optional(),
    form_responses: formResponsesSchema.optional(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
  });
export const formFieldSchema = z.object({
    id: z.string(),
    type: z.enum(['text', 'textarea', 'select', 'multiselect', 'checkbox', 'radio', 'email', 'number']),
    label: z.string(),
    placeholder: z.string().optional(),
    required: z.boolean().default(false),
    options: z.array(z.object({
      value: z.string(),
      label: z.string(),
    })).optional(),
    defaultValue: z.union([z.string(), z.array(z.string()), z.boolean(), z.number()]).optional(),
  });

export const formTemplateSchema = z.object({
    id: z.number(),
    organizationId: z.number(),
    name: z.string(),
    type: z.enum(["mentor", "mentee"]),
    fields: z.array(formFieldSchema),
    createdAt: z.string().or(z.date()).optional(), // Accepts both for flexibility
    updatedAt: z.string().or(z.date()).optional(),
  });
  export const organizationSchema = z.object({
    id: z.number().int().optional(), // serial primary key, usually auto-generated
    name: z.string().min(1, "Name is required"),
    location: z.string().optional(),
    about: z.string().optional(),
    logo: z.string().url().optional(),
    primaryColor: z.string().default("#3B82F6"),
    secondaryColor: z.string().default("#8B5CF6"),
    accentColor: z.string().default("#10B981"),
    stripeCustomerId: z.string().optional(),
    stripeSubscriptionId: z.string().optional(),
    subscriptionStatus: z.string().optional(),
    subscriptionPlan: z.string().optional(),
    createdAt: z.date().optional(), // typically set by DB
  });

