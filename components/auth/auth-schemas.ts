import * as z from "zod";

export const signInFormSchema = z.object({
  email: z.string().trim().min(1, { message: "Email is required." }).email({
    message: "Please enter a valid email address (e.g. name@example.com).",
  }),
  password: z
    .string()
    .min(1, { message: "Password is required." })
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const signUpFormSchema = signInFormSchema
  .extend({
    name: z
      .string()
      .trim()
      .min(1, { message: "Full name is required." })
      .min(2, { message: "Full name must be at least 2 characters." }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match.",
  });

export const verifyOtpFormSchema = z.object({
  email: z.string().trim().min(1, { message: "Email is required." }).email({
    message: "Please enter a valid email address.",
  }),
  token: z
    .string()
    .trim()
    .min(1, { message: "Verification token is required." })
    .min(6, { message: "Token must be at least 6 characters." }),
});

export type SignInFormData = z.infer<typeof signInFormSchema>;
export type SignUpFormData = z.infer<typeof signUpFormSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpFormSchema>;

type FieldErrors<T extends Record<string, unknown>> = Partial<
  Record<keyof T, string>
>;

function collectErrors<T extends Record<string, unknown>>(
  result: z.ZodSafeParseError<T>
) {
  const errors: FieldErrors<T> = {};

  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof T;

    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }

  return errors;
}

export function validateSignInForm(data: SignInFormData) {
  const result = signInFormSchema.safeParse(data);

  if (result.success) {
    return {};
  }

  return collectErrors(result);
}

export function validateSignUpForm(data: SignUpFormData) {
  const result = signUpFormSchema.safeParse(data);

  if (result.success) {
    return {};
  }

  return collectErrors(result);
}

export function validateVerifyOtpForm(data: VerifyOtpFormData) {
  const result = verifyOtpFormSchema.safeParse(data);

  if (result.success) {
    return {};
  }

  return collectErrors(result);
}
