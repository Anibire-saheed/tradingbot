import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function TradingSimplifiedSection() {
  return (
    <section id="about-us" className="relative overflow-hidden bg-slate-50 px-5 py-20 text-slate-950 md:px-8 lg:py-18">
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(15,118,110,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,118,110,0.08)_1px,transparent_1px)] [background-size:96px_96px]" />
      <div className="absolute inset-0 [background-image:radial-gradient(rgba(15,118,110,0.22)_1.5px,transparent_1.5px)] [background-size:112px_112px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.45em] text-blue-700 sm:text-[0.8rem]">
            Why traders choose us
          </p>
          <h2 className="mx-auto mt-10 max-w-6xl font-heading text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-4xl">
            The most trusted cryptocurrency trading <br />
            and arbitrage platform
          </h2>
          <p className="mx-auto mt-8 max-w-4xl text-lg font-medium leading-8 text-slate-600 sm:text-lg">
            Traders who rely on us for unlocking lucrative arbitrage
            opportunities safely and securely.
          </p>
        </div>

        <div className="relative mt-14 border-t border-blue-700/20 pt-20 text-center">
          <div className="absolute left-1/2 top-0 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400" />
          <h2 className="font-heading text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-4xl">
            Trading simplified.
            <br />
            A world of opportunity,
            <br />
            <span className="text-blue-600">within reach.</span>
          </h2>
          <p className="mx-auto mt-2 max-w-3xl text-md font-medium leading-8 text-slate-600 sm:text-lg">
            Whether you&apos;re just getting started or you&apos;re an expert,
            our platform is designed for everyone.
          </p>
          <Link
            href="/sign-up"
            className="mx-auto mt-4 inline-flex h-14 items-center justify-center gap-4 rounded-full border-2 border-blue-600 px-8 text-lg font-bold text-blue-700 transition hover:bg-blue-600 hover:text-white"
          >
            <ArrowRight className="size-5" />
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}
