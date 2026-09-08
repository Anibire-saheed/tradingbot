"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about-us" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

function OptionAlphaLogo() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/omnilog.png"
        alt="Option Alpha"
        width={220}
        height={56}
        priority
        className="h-25 w-auto"
      />
    </div>
  );
}

export function OptionAlphaNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative border-b bg-white shadow-sm">
      <div className="flex h-20 items-center justify-between px-5 md:px-14">
        <OptionAlphaLogo />
        <nav className="hidden items-center gap-10 text-lg text-slate-700 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition hover:text-blue-700"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-12 rounded-md px-7 text-base font-semibold shadow-sm",
            )}
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className={cn(
              buttonVariants(),
              "h-12 rounded-md bg-blue-600 px-7 text-base font-semibold text-white hover:bg-blue-700",
            )}
          >
            Get Started
          </Link>
        </div>
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          className="text-slate-700 lg:hidden"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X className="size-7" /> : <Menu className="size-7" />}
        </Button>
      </div>

      {isMenuOpen ? (
        <div className="absolute right-0 top-20 z-50 w-72 max-w-[calc(100vw-2rem)] border-b border-l  px-5 py-5 bg-white shadow-lg lg:hidden">
          <div className="grid gap-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md px-3 py-2 text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-12 w-full rounded-md text-base font-semibold",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className={cn(
                buttonVariants(),
                "h-12 w-full rounded-md bg-blue-600 text-base font-semibold text-white hover:bg-blue-700",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
