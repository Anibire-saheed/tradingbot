"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { passwordSchema } from "@/lib/password-schema";
import { createClient } from "@/lib/supabase/server";

export type PasswordState = { error?: string; success?: string };

export async function requestPasswordReset(
  _previous: PasswordState,
  form: FormData,
): Promise<PasswordState> {
  const email = z.email().safeParse(String(form.get("email") ?? "").trim());
  if (!email.success) return { error: "Enter a valid email address." };
  try {
    const requestHeaders = await headers();
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL || requestHeaders.get("origin");
    if (!origin)
      return { error: "Could not create a reset link. Please try again." };
    const callback = new URL("/auth/callback", origin);
    callback.searchParams.set("next", "/reset-password");
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.data, {
      redirectTo: callback.toString(),
    });
    if (error)
      return {
        error:
          "Could not send the reset email. Please wait a moment and try again.",
      };
    return {
      success:
        "If an account exists for that email, you’ll receive a password reset link. Check your inbox and spam folder, and open the link in this browser.",
    };
  } catch {
    return { error: "Could not send the reset email. Please try again." };
  }
}

export async function resetPassword(
  _previous: PasswordState,
  form: FormData,
): Promise<PasswordState> {
  const password = passwordSchema.safeParse(form.get("password"));
  if (!password.success)
    return { error: password.error.issues[0].message };
  if (password.data !== form.get("confirmPassword"))
    return { error: "Passwords do not match." };
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return {
        error:
          "Your reset session has expired. Request a new password reset link.",
      };
    const { error } = await supabase.auth.updateUser({
      password: password.data,
    });
    if (error)
      return {
        error:
          error.code === "same_password"
            ? "Choose a password different from your current password."
            : "Could not update your password. Use a stronger password or request a new reset link.",
      };
    return {
      success:
        "Your password has been updated. You can use it the next time you sign in.",
    };
  } catch {
    return { error: "Could not update your password. Please try again." };
  }
}
