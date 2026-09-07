import Link from "next/link";
import { ArrowRight } from "lucide-react";

function CryptoGift() {
  return (
    <svg
      viewBox="0 0 600 540"
      fill="none"
      role="img"
      aria-label="An open blue gift box with gold Bitcoin and Ethereum coins"
      className="mx-auto w-full max-w-[560px]"
    >
      <defs>
        <linearGradient
          id="gift-front"
          x1="170"
          y1="280"
          x2="320"
          y2="490"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient
          id="gift-side"
          x1="330"
          y1="290"
          x2="460"
          y2="440"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#1E3A8A" />
        </linearGradient>
        <linearGradient
          id="gift-gold"
          x1="0"
          y1="0"
          x2="100"
          y2="110"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFF3B0" />
          <stop offset="0.45" stopColor="#FBD35D" />
          <stop offset="1" stopColor="#D99014" />
        </linearGradient>
        <linearGradient
          id="gift-ribbon"
          x1="240"
          y1="180"
          x2="340"
          y2="470"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FEF3C7" />
          <stop offset="0.5" stopColor="#FCD34D" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
        <radialGradient id="gift-glow">
          <stop stopColor="#DBEAFE" stopOpacity="0.85" />
          <stop offset="1" stopColor="#EFF6FF" stopOpacity="0" />
        </radialGradient>
        <filter id="gift-shadow" x="-40%" y="-40%" width="180%" height="200%">
          <feDropShadow
            dx="0"
            dy="14"
            stdDeviation="12"
            floodColor="#1E40AF"
            floodOpacity="0.14"
          />
        </filter>
      </defs>
      <ellipse cx="300" cy="290" rx="240" ry="225" fill="url(#gift-glow)" />
      <ellipse
        cx="307"
        cy="490"
        rx="145"
        ry="15"
        fill="#DBEAFE"
        opacity="0.55"
      />
      <g filter="url(#gift-shadow)">
        <path d="M156 310L292 259L455 311L318 371Z" fill="#1E3A8A" />
        <path d="M174 310L293 271L435 312L316 357Z" fill="#172554" />
        <path
          d="M156 310L318 365V484L164 426Q156 423 156 413Z"
          fill="url(#gift-front)"
        />
        <path
          d="M318 365L455 311V420Q455 429 446 433L318 484Z"
          fill="url(#gift-side)"
        />
        <path d="M220 332L260 345V462L220 447Z" fill="url(#gift-ribbon)" />
        <path d="M372 344L403 332V451L372 463Z" fill="#FBBF24" />
      </g>
      <g transform="translate(140 169) rotate(-12)" filter="url(#gift-shadow)">
        <path d="M0 32L137 -10L292 39L154 91Z" fill="#93C5FD" />
        <path d="M0 32L154 83V111L0 61Z" fill="#3B82F6" />
        <path d="M154 83L292 39V66L154 111Z" fill="#1D4ED8" />
        <path d="M59 13L96 1L250 52L213 64Z" fill="#FDE68A" />
        <path d="M64 53L104 67V95L64 82Z" fill="#FBBF24" />
        <path d="M64 53L204 11L244 24L104 67Z" fill="#FCD34D" />
        <path
          d="M144 35C88 28 77 -19 101 -26C127 -34 149 11 144 35Z"
          stroke="#FBBF24"
          strokeWidth="15"
          strokeLinejoin="round"
        />
        <path
          d="M146 35C155 -17 199 -35 208 -12C217 12 176 33 146 35Z"
          stroke="#FCD34D"
          strokeWidth="15"
          strokeLinejoin="round"
        />
        <ellipse cx="145" cy="34" rx="17" ry="12" fill="#F59E0B" />
      </g>
      <g
        transform="translate(355 92) rotate(16 48 48)"
        filter="url(#gift-shadow)"
      >
        <circle cx="52" cy="50" r="48" fill="#D58B12" />
        <circle
          cx="47"
          cy="47"
          r="47"
          fill="url(#gift-gold)"
          stroke="#FDE68A"
          strokeWidth="2"
        />
        <circle cx="47" cy="47" r="37" stroke="#D69A28" strokeWidth="2" />
        <text
          x="47"
          y="64"
          textAnchor="middle"
          fill="#A96B09"
          fontSize="54"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          ₿
        </text>
      </g>
      <g
        transform="translate(232 239) rotate(-15 39 39)"
        filter="url(#gift-shadow)"
      >
        <circle cx="42" cy="41" r="39" fill="#D58B12" />
        <circle
          cx="39"
          cy="39"
          r="39"
          fill="url(#gift-gold)"
          stroke="#FDE68A"
          strokeWidth="2"
        />
        <circle cx="39" cy="39" r="30" stroke="#D69A28" strokeWidth="1.5" />
        <path d="M39 13L24 39L39 48L54 39Z" fill="#A96B09" />
        <path d="M39 13V48L54 39Z" fill="#D99E2B" />
        <path d="M24 43L39 65L54 43L39 52Z" fill="#A96B09" />
      </g>
      <g strokeLinecap="round" strokeWidth="4">
        <path
          d="M127 97V115M118 106H136M468 240V258M459 249H477"
          stroke="#FBBF24"
        />
        <path
          d="M195 57L201 69M470 161L480 153M115 283L106 293"
          stroke="#60A5FA"
        />
        <path d="M337 55L344 43M489 342L498 349" stroke="#FBBF24" />
      </g>
      <circle cx="99" cy="209" r="5" fill="#93C5FD" />
      <circle cx="432" cy="68" r="4" fill="#FCD34D" />
      <circle cx="499" cy="292" r="5" fill="#93C5FD" />
    </svg>
  );
}

export function RewardsSection() {
  return (
    <section
      id="rewards"
      aria-labelledby="rewards-heading"
      className="relative overflow-hidden bg-white px-6 py-8 text-slate-950 md:px-14 lg:py-"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(13,148,136,0.12)_1px,transparent_1px)] [background-size:72px_72px]"
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
            Rewards program
          </p>
          <h2
            id="rewards-heading"
            className="mt-6 font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            Earn weekly rewards{" "}
            <span className="text-blue-600">
              as
              <br className="hidden sm:block" /> you trade
            </span>
          </h2>
        </div>
        <div className="mt-2 grid items-center gap-8 md:mt-4 md:grid-cols-2 md:gap-12 lg:gap-0">
          <CryptoGift />
          <div className="pb-4 text-center md:text-left">
            <h3 className="font-heading text-3xl font-bold tracking-tight lg:text-4xl">
              Earn weekly rewards
            </h3>
            <p className="mx-auto mt-7 max-w-lg text-lg leading-8 text-slate-600 md:mx-0 lg:text-xl lg:leading-9">
              Amplify Your Profits with Weekly Rewards as You Engage in Crypto
              Transactions, Making Every Trade Count Towards Your Financial
              Growth.
            </p>
            <Link
              href="/sign-up"
              className="mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-full border-2 border-blue-600 px-8 text-base font-bold text-blue-700 transition-colors hover:bg-blue-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600"
            >
              <ArrowRight aria-hidden="true" className="size-5" />
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
