import Link from "next/link";
import { PasswordForm } from "@/components/auth/password-form";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Reset password | OmniBot" };

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <main className="grid min-h-svh place-items-center bg-[#f6f8fb] p-6 text-neutral-950">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Set a new password</h1>
        <p className="mb-6 mt-3 text-sm leading-6 text-neutral-500">
          Choose a new password for your OmniBot account.
        </p>
        {user ? (
          <PasswordForm reset />
        ) : (
          <div role="alert">
            <p className="mb-4 text-sm text-neutral-600">
              Open the link from your reset email in the browser where you
              requested it. If it has expired, request a new one.
            </p>
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-blue-600"
            >
              Request a password reset
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
