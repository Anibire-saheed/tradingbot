import { PasswordForm } from "@/components/auth/password-form";

export const metadata = { title: "Forgot password | OmniBot" };

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="grid min-h-svh place-items-center bg-[#f6f8fb] p-6 text-neutral-950">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Forgot password?</h1>
        <p className="mb-6 mt-3 text-sm leading-6 text-neutral-500">
          Enter your account email and we’ll send you a link to reset your
          password.
        </p>
        {error && (
          <p role="alert" className="mb-5 text-sm text-red-600">
            Your reset link is invalid or expired. Request a new one below.
          </p>
        )}
        <PasswordForm />
      </section>
    </main>
  );
}
