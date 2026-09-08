import { z } from "zod";

export const contactRoles = [
  "New to crypto",
  "Individual trader",
  "Business or institution",
  "Potential partner",
  "Other",
] as const;

export const contactSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(100, "First name must be 100 characters or fewer."),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(100, "Last name must be 100 characters or fewer."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  country: z
    .string()
    .trim()
    .max(100, "Country must be 100 characters or fewer."),
  role: z.enum(contactRoles, { error: "Please select your role." }),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(2000, "Message must be 2,000 characters or fewer."),
});

export type ContactField = keyof z.infer<typeof contactSchema>;
