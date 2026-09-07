import Link from "next/link";
import Image from "next/image";

import { OptionAlphaNavbar } from "@/components/navbar/option-alpha-navbar";
import { RotatingWord } from "@/components/hero/rotating-word";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function OptionAlphaHero() {
  return (
    <div className="">
      <div className="bg-gradient-to-r from-blue-600 to-violet-500 px-4 py-3 text-center text-sm font-medium text-white sm:text-base">
        Get Access to Omni <strong>100% FREE</strong> by connecting your Wallet,
        Phantom or Metamask!{" "}
        <a href="#" className="underline underline-offset-2">
          Learn more.
        </a>
      </div>

      <OptionAlphaNavbar />

      <main className="relative overflow-hidden bg-white">
        <section className="relative z-10 mx-auto grid max-w-7xl gap-15 lg:gap-0 items-start px-5 py-16 md:px-8 lg:grid-cols-2  lg:py-22">
          <div className="max-w-xl lg:pt-10">
            <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-blue-500">
              A gateway to memecoin trading.
            </p>
            <h1 className="font-heading text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-[4.0rem]">
              Crypto Trading, <RotatingWord /> Than Ever.
            </h1>
            <div className="mt-9 flex flex-col items-start gap-6">
              <p className="max-w-2xl text-xl leading-8 text-slate-700">
                Buy, sell and withdraw instantly. Zero commission fees,
                real-time prices, and seamless withdrawals.
              </p>
              <Link
                href="/sign-up"
                className={cn(
                  buttonVariants(),
                  "h-16 rounded-md bg-blue-600 px-9 text-xl font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700",
                )}
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="relative min-h-[300px] lg:-mr-20 lg:min-h-[500px]">
            <div className="absolute inset-0 rounded-full bg-blue-200/50 blur-3xl" />
            <Image
              src="/heroImage.png"
              alt="Crypto trading dashboard preview"
              width={1536}
              height={1024}
              priority
              className="relative z-10 h-full max-h-[760px] w-full scale-110 object-contain lg:scale-110"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
