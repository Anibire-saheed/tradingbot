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
    <main className="flex min-h-screen items-center justify-center bg-[#f7f9fd] p-4 sm:p-6">
      <div className="w-full max-w-[480px]">
        <div className="mb-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Back to login
          </Link>
        </div>

        <div className="rounded-[32px] sm:rounded-[36px] bg-white p-8 sm:p-12 shadow-[0_20px_50px_-20px_rgba(25,33,61,0.08)] border border-[#eef2f8]">
          <Suspense
            fallback={
              <div className="py-16 text-center text-sm text-slate-400">
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
