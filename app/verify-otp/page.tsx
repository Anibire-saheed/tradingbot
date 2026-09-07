import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { VerifyOtpForm } from "@/components/auth/verify-otp-form";

export const metadata = {
  title: "Verify your email | OmniBot",
  description: "Enter your 6-digit verification code to confirm your email and log in.",
};

export default function VerifyOtpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#edf4ff] via-[#f0f6ff] to-[#e6f0fe] p-4 sm:p-6">
      <div className="w-full max-w-[480px]">
        <div className="mb-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="size-3.5 text-blue-600" />
            Back to login
          </Link>
        </div>

        <div className="rounded-[32px] sm:rounded-[36px] bg-white p-8 sm:p-12 shadow-[0_24px_60px_-15px_rgba(37,99,235,0.14)] border border-blue-100/90">
          <Suspense
            fallback={
              <div className="py-16 text-center text-sm text-blue-400">
                Loading verification form…
              </div>
            }
          >
            <VerifyOtpForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
