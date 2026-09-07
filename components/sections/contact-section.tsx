"use client";

import { toast } from "@/components/ui/sonner";
import { type FormEvent } from "react";
import { ChartNoAxesCombined, Handshake, Mail, ShieldCheck, Wallet, WandSparkles } from "lucide-react";

const fieldClass = "min-h-12 w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm font-normal text-neutral-900 shadow-sm outline-none placeholder:text-neutral-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const features = [
  { title: "Getting started", description: "Ask about your account and taking your first steps.", icon: Wallet },
  { title: "Trading insights", description: "Learn more about the platform’s market and portfolio tools.", icon: ChartNoAxesCombined },
  { title: "Weekly rewards", description: "Find out more about the rewards program and eligibility.", icon: WandSparkles },
  { title: "Partnerships", description: "Explore opportunities to collaborate with OmniBot.", icon: Handshake },
];

export function ContactSection({ email }: { email?: string }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`OmniBot enquiry: ${data.get("role")}`);
    const body = encodeURIComponent(`Name: ${data.get("firstName")} ${data.get("lastName")}\nEmail: ${data.get("email")}\nCountry: ${data.get("country") || "Not specified"}\nRole: ${data.get("role")}\n\n${data.get("message")}`);
    toast.info("Continue in your email app to send your message.");
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }

  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative isolate overflow-hidden rounded-b-[32px] bg-[#f7f7f7] px-6 py-16 text-neutral-900 md:px-14 lg:py-24">
      <svg aria-hidden="true" className="pointer-events-none absolute left-0 top-0 -z-10 h-[530px] w-full text-neutral-200/70" viewBox="0 0 1400 530" preserveAspectRatio="xMidYMid slice" fill="none">
        {Array.from({ length: 7 }, (_, index) => <path key={index} d={`M ${90 + index * 18} 530 C 250 ${170 + index * 20}, 850 ${250 + index * 20}, ${1090 + index * 28} -70`} stroke="currentColor" />)}
      </svg>
      <div className="mx-auto max-w-6xl">
        <div className="grid items-start gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div className="lg:pt-1">
            <div aria-hidden="true" className="mb-6 flex gap-1">
              {Array.from({ length: 18 }, (_, index) => <span key={index} className={`size-1.5 rotate-45 border border-neutral-800 ${index < 12 ? "bg-neutral-800" : "bg-transparent"}`} />)}
            </div>
            <h2 id="contact-heading" className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl xl:text-6xl">Let’s talk about<br />your next step<br />in crypto.</h2>
            <p className="mt-7 max-w-md text-lg leading-7 text-neutral-600">Questions about your account, trading tools, or rewards? Tell us what’s on your mind and connect with the OmniBot team.</p>
            <a href="#how-it-works" className="mt-6 inline-flex min-h-12 items-center rounded-xl border border-neutral-950 bg-neutral-800 px-5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] hover:bg-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-4">Learn More</a>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-x-3 gap-y-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">First Name<input name="firstName" autoComplete="given-name" required maxLength={100} placeholder="First name…" className={fieldClass} /></label>
              <label className="grid gap-2 text-sm font-semibold">Last Name<input name="lastName" autoComplete="family-name" required maxLength={100} placeholder="Last name…" className={fieldClass} /></label>
              <label className="grid gap-2 text-sm font-semibold">Email<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" className={fieldClass} /></label>
              <label className="grid gap-2 text-sm font-semibold">Country<input name="country" autoComplete="country-name" maxLength={100} placeholder="Your country" className={fieldClass} /></label>
            </div>
            <label className="mt-5 grid gap-2 text-sm font-semibold">Your Role<div className="relative"><select name="role" required defaultValue="" className={`${fieldClass} appearance-none pr-10`}><option value="" disabled>Select your role</option><option>New to crypto</option><option>Individual trader</option><option>Business or institution</option><option>Potential partner</option><option>Other</option></select><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"><path d="m6 9 6 6 6-6"/></svg></div></label>
            <label className="mt-5 grid gap-2 text-sm font-semibold">Message<textarea name="message" required minLength={10} maxLength={2000} rows={3} placeholder="Enter your message…" className={`${fieldClass} min-h-28 resize-y`} /></label>
            <div className="mt-5 flex justify-end"><button type="submit" disabled={!email} aria-describedby="contact-delivery-note" className="min-h-12 rounded-2xl border border-blue-700 bg-blue-500 px-5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50">Contact Us</button></div>
            <p id="contact-delivery-note" className="mt-2 text-right text-xs leading-5 text-neutral-500">{email ? "Opens your email app with a draft ready to send." : "Contact enquiries will be available soon."}</p>
          </form>
        </div>
        <div className="mt-8 grid gap-6 border-y border-neutral-200 py-6 md:grid-cols-2 md:gap-12">
          <div className="flex items-center gap-4"><div className="grid size-12 shrink-0 place-items-center rounded-full bg-white"><Mail aria-hidden="true" className="size-5 text-blue-600" /></div><div><p className="text-sm font-semibold">Prefer to email us directly?</p>{email && <a href={`mailto:${email}`} className="break-all text-sm text-neutral-600 underline underline-offset-4 hover:text-blue-600">{email}</a>}</div></div>
          <div className="flex items-center gap-4"><div className="grid size-12 shrink-0 place-items-center rounded-full bg-white"><ShieldCheck aria-hidden="true" className="size-5 text-blue-600" /></div><p className="text-sm leading-6 text-neutral-600">Keep your account details safe. Never share passwords, private keys, or wallet recovery phrases.</p></div>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, description, icon: Icon }) => <div key={title}><Icon aria-hidden="true" className="mb-4 size-6 text-blue-600" strokeWidth={2.3} /><h3 className="text-lg font-semibold tracking-tight">{title}</h3><p className="mt-2 text-base leading-6 text-neutral-600">{description}</p></div>)}
        </div>
      </div>
    </section>
  );
}
