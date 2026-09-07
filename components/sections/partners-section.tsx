import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const partners = [
  { name: "Phantom", category: "Crypto wallet", logo: "/Phantom.jpeg" },
  { name: "MetaMask", category: "Crypto wallet", logo: "/metamask.jpeg" },
  { name: "Trust Wallet", category: "Crypto wallet", logo: "/trustwallet.jpeg" },
  { name: "Coinbase Wallet", category: "Crypto wallet", logo: "/coinbase.jpeg" },
  { name: "WalletConnect", category: "Wallet connectivity", logo: "/Connectwallet.jpeg" },
  { name: "Dexscreener", category: "Market analytics", logo: "/Dexscreener.jpeg" },
];

export function PartnersSection() {
  return (
    <section
      id="partners"
      aria-labelledby="partners-heading"
      className="relative isolate overflow-hidden bg-[#f7f7f7] px-6 py-16 text-slate-950 md:px-14 lg:py-20"
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 -z-10 h-[530px] w-full text-neutral-200/70"
        viewBox="0 0 1400 530"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {Array.from({ length: 7 }, (_, index) => (
          <path
            key={index}
            d={`M ${90 + index * 18} 530 C 250 ${170 + index * 20}, 850 ${250 + index * 20}, ${1090 + index * 28} -70`}
            stroke="currentColor"
          />
        ))}
      </svg>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
            Our partners
          </p>
          <h2 id="partners-heading" className="mt-5 font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Building connections.<br />
            <span className="text-blue-600">Creating possibilities.</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            A place for the collaborations that help shape the next chapter of OmniBot.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <li key={partner.name} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-blue-200 hover:bg-blue-50/40">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-white">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight">{partner.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{partner.category}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-8 text-center">
          <a href="#contact" className="inline-flex min-h-12 items-center justify-center gap-2 font-semibold text-blue-600 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
            Become a partner <ArrowUpRight aria-hidden="true" className="size-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
