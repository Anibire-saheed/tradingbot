import { Suspense } from "react";
import { AuthTypewriter } from "@/components/auth/auth-typewriter";
import Image from "next/image";
import Link from "next/link";
import { VerifyOtpForm } from "@/components/auth/verify-otp-form";

export const metadata = {
  title: "Verify Email | OmniBot",
  description: "Enter your 6-digit verification code to confirm your email and log in.",
};

export default function VerifyOtpPage() {
  return (
    <main className="flex min-h-svh items-center bg-white p-4 text-neutral-950 sm:p-6">
      <div className="mx-auto grid w-full max-w-[1100px] rounded-[36px] bg-white p-4 shadow-[0_12px_50px_-12px_rgba(15,23,42,0.22)] items-stretch gap-8 lg:grid-cols-2 lg:gap-8">
        <div className="mx-auto flex w-full max-w-lg flex-col justify-center px-3 py-6 sm:px-8 lg:py-5">
          <Link
            href="/login"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5" />
              <path d="m12 5-7 7 7 7" />
            </svg>
            Back to login
          </Link>

          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-neutral-900">
              Verify Email
            </h1>
            <p className="mt-3 text-[15px] md:text-base text-neutral-600">
              Your 6-digit code was sent to you via email.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="py-8 text-center text-sm text-slate-400">
                Loading verification form…
              </div>
            }
          >
            <VerifyOtpForm />
          </Suspense>

          <p className="mt-6 text-center text-sm text-neutral-600">
            Need to sign in with a different account?{" "}
            <Link
              href="/login"
              className="ml-1 font-semibold text-blue-600 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>

        <div className="relative hidden h-[min(620px,calc(100svh-48px))] min-h-[480px] overflow-hidden rounded-[36px] bg-[#101b38] lg:block">
          <Image
            src="/auth_bg.png"
            alt="A crypto coin parachuting toward a phone held by a robotic hand"
            fill
            sizes="(min-width: 1024px) 520px, 100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-slate-950/85 via-slate-950/10 to-slate-950/40" />
          <AuthTypewriter />
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 h-14 w-16 rounded-br-[36px] bg-white"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-0 right-0 h-14 w-16 rounded-tl-[36px] bg-white"
          />
        </div>
      </div>
    </main>
  );
}
