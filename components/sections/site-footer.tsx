import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";

const footerGroups = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Rewards", href: "/#rewards" },
      { label: "Our partners", href: "/#partners" },
      { label: "Get started", href: "/sign-up" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Support", href: "/#contact" },
      { label: "Sign in", href: "/login" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/#about-us" },
      { label: "Contact", href: "/#contact" },
      { label: "Become a partner", href: "/#partners" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden rounded-b-[32px] bg-white px-5 pt-10 text-neutral-500 sm:px-8 lg:px-14">
      <div className="relative z-10 mx-auto max-w-7xl rounded-[28px] border border-neutral-200 bg-white px-6 py-9 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.12)] sm:rounded-[40px] sm:px-10 sm:py-12 lg:px-16 lg:py-14">
        <div className="grid gap-12 pb-10 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div>
            <Link href="/" aria-label="OmniBot home" className="inline-block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
              <Image src="/icons/omnibotlogo.png" alt="OmniBot" width={2168} height={725} className="h-auto w-36 max-w-full object-contain sm:w-44" />
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 sm:text-base">
              Explore crypto opportunities with trading insights and portfolio tools — helping you make sense of the market and take your next step.
            </p>
            <a href="mailto:support@omnidev.co" className="mt-6 inline-flex items-center gap-3 rounded-sm text-sm text-neutral-700 transition-colors hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
              <Mail aria-hidden="true" className="size-5" />
              support@omnidev.co
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-base font-semibold text-neutral-950">{group.title}</h2>
                <ul className="mt-5 space-y-3.5 text-sm">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="rounded-sm transition-colors hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-4 border-t border-neutral-200 pt-7 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} OmniBot. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <Link href="/#faq" className="underline underline-offset-4 hover:text-blue-600">Help & FAQ</Link>
            <Link href="/#contact" className="underline underline-offset-4 hover:text-blue-600">Contact support</Link>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none mx-auto -mb-[0.14em] mt-2 max-w-7xl select-none overflow-hidden bg-linear-to-b from-neutral-200/70 to-white bg-clip-text text-center text-[clamp(5rem,19vw,19rem)] font-bold leading-[1.1] tracking-[-0.07em] text-transparent">
        OmniBot
      </div>
    </footer>
  );
}
