import { Suspense } from "react";
import { AuthTypewriter } from "@/components/auth/auth-typewriter";
import Image from "next/image";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <main className="flex min-h-svh items-center bg-white p-4 text-neutral-950 sm:p-6">
      <div className="mx-auto grid w-full max-w-[1100px] rounded-[36px] bg-white p-4 shadow-[0_12px_50px_-12px_rgba(15,23,42,0.22)] items-stretch gap-8 lg:grid-cols-2 lg:gap-8">
        <div className="mx-auto flex w-full max-w-lg flex-col justify-center px-3 py-6 sm:px-8 lg:py-5">
          <Link
            href="/"
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
            Back to home
          </Link>
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Sign Up
            </h1>
            <p className="mt-3 text-[15px] md:text-base text-neutral-600">
              Create your account and explore your next opportunity.
            </p>
          </div>
          <Suspense>
            <SignUpForm />
          </Suspense>
          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="ml-1 font-semibold text-[#603b58] hover:underline"
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
