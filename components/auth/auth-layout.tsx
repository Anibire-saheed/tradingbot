import Image from "next/image";
import type { ReactNode } from "react";
import { AuthHeading } from "@/components/auth/auth-heading";
import Link from "next/link";

function AuthIllustration() {
  return (
    <div className="relative hidden min-h-0 overflow-hidden rounded-[26px] bg-blue-700 lg:block">
      <Image
        src="/auth_bg.png"
        alt="A crypto coin parachuting toward a phone held by a robotic hand"
        fill
        sizes="(min-width: 1024px) 520px, 100vw"
        className="object-cover"
        priority
      />
    </div>
  );
}

export function AuthLayout({ children, mode }: { children: ReactNode; mode: "login" | "sign-up" }) {
  const isLogin = mode === "login";
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#e7e7e7] p-3 sm:p-5">
      <div className="grid w-full max-w-[1100px] lg:min-h-[min(620px,calc(100svh-40px))] rounded-[32px] bg-white p-3 shadow-[0_12px_50px_-12px_rgba(15,23,42,0.22)] text-slate-950 lg:grid-cols-2">
        <div className={`mx-auto flex w-full max-w-[500px] flex-col px-5 sm:px-10 xl:px-14 ${isLogin ? "py-5 sm:py-6" : "py-3 sm:py-4"}`}>
          <AuthHeading key={mode} isLogin={isLogin} />
          {children}
          <p className={`mt-auto text-sm text-neutral-500 ${isLogin ? "pt-6" : "pt-4"}`}>
            {isLogin ? "Don’t have an account? " : "Already have an account? "}
            <Link href={isLogin ? "/sign-up" : "/login"} className="font-semibold text-violet-600 hover:text-violet-800 hover:underline">{isLogin ? "Sign Up" : "Sign In"}</Link>
          </p>
        </div>
        <AuthIllustration />
      </div>
    </main>
  );
}
