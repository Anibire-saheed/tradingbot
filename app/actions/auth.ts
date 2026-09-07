"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
    },
  });

  if (error) {
    redirect(`/sign-up?error=${encodeURIComponent(error.message)}`);
  }

  // If email confirmation is enabled, Supabase does not create an active session immediately.
  // Instead, it sends a token (OTP) to the user's email via Pingram/Supabase SMTP.
  if (!data.session) {
    redirect(
      `/verify-otp?email=${encodeURIComponent(
        email
      )}&message=${encodeURIComponent(
        "Account created! Please check your email for the confirmation token."
      )}`
    );
  }

  redirect("/dashboard");
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      redirect(
        `/verify-otp?email=${encodeURIComponent(
          email
        )}&error=${encodeURIComponent(
          "Your email is not confirmed yet. Please enter the token sent to your email."
        )}`
      );
    }
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function verifyOtp(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim();
  const token = (formData.get("token") as string)?.trim();
  const type = (formData.get("type") as string) || "signup";

  if (!email || !token) {
    redirect(
      `/verify-otp?email=${encodeURIComponent(
        email || ""
      )}&error=${encodeURIComponent("Please provide both email and token.")}`
    );
  }

  // Try verifying with the requested type first (signup or email)
  let { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: type === "email" ? "email" : "signup",
  });

  // If type 'signup' didn't work, attempt 'email' (for OTP sign-ins)
  if (error && type !== "email") {
    const retry = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    if (!retry.error) {
      error = null;
    }
  }

  if (error) {
    redirect(
      `/verify-otp?email=${encodeURIComponent(
        email
      )}&error=${encodeURIComponent(error.message)}`
    );
  }

  redirect("/dashboard");
}

export async function resendOtp(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim();

  if (!email) {
    redirect(
      `/verify-otp?error=${encodeURIComponent("Please provide an email address.")}`
    );
  }

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });

  if (error) {
    // If resending signup fails, try sending an OTP signin
    const retry = await supabase.auth.signInWithOtp({ email });
    if (retry.error) {
      redirect(
        `/verify-otp?email=${encodeURIComponent(
          email
        )}&error=${encodeURIComponent(error.message)}`
      );
    }
  }

  redirect(
    `/verify-otp?email=${encodeURIComponent(
      email
    )}&message=${encodeURIComponent("A new verification token has been sent to your email.")}`
  );
}

export async function sendLoginOtp(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim();

  if (!email) {
    redirect(`/login?error=${encodeURIComponent("Please enter your email.")}`);
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(
    `/verify-otp?email=${encodeURIComponent(
      email
    )}&type=email&message=${encodeURIComponent(
      "Login token sent! Please check your email and enter the code."
    )}`
  );
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
