"use client";

import { useState } from "react";
import {
  Bot,
  ChevronRight,
  GitBranch,
  Plus,
  Activity,
  Layers,
} from "lucide-react";

const features = [
  {
    title: "Create your bots",
    description:
      "Start with pre-built bot templates you can customize or build your own custom bots from scratch.",
    points: [
      "100% no code",
      "Flexible risk controls",
      "Options and equities",
      "Easily customizable",
      "One-click cloning",
      "Personalize your bots",
    ],
  },
  {
    title: "Add automations",
    description:
      "Automations tell the bot when to take action, what to look for, when to open positions, when to exit positions, and much more.",
    points: [
      "Scan for opportunities",
      "Automated management",
      "Run on schedules",
      "Use custom inputs",
      "Edit, save and reuse anything",
      "Instant validation testing",
    ],
  },
  {
    title: "Monitor bot activity",
    description:
      "Keep complete visibility and control over everything happening inside your bot, all in one place.",
    points: [
      "Override trades manually",
      "Edit position limits",
      "View detailed bot logs",
      "Adjust capital allocation",
      "Track performance stats",
      "Complete position history",
    ],
  },
  {
    title: "Scale your portfolio",
    description:
      "Run multiple systems and strategies at the same time without the headache of watching every market tick by tick.",
    points: [
      "Personal bot dashboard",
      "One-click bot cloning",
      "Clear performance metrics",
      "Easily turn bots on or off",
      "View all active positions",
      "Free up your time",
    ],
  },
];

const card =
  "rounded-xl border border-slate-200/80 bg-white shadow-[0_12px_35px_-18px_rgba(15,23,42,0.25)]";

function BotPreview({ variant }: { variant: number }) {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full max-w-[560px] pb-12 pt-4 text-[10px] text-slate-600 sm:text-xs"
    >
      <div
        className={`${card} overflow-hidden ${variant !== 3 ? "ml-6 sm:ml-10" : ""}`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-4">
          <span className="flex items-center gap-2 font-semibold text-slate-900">
            <Bot className="size-5 text-blue-500" />
            {variant === 3
              ? "My bots"
              : variant === 1
                ? "Automation builder"
                : "Follow the Trend"}
          </span>
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-medium text-emerald-600">
            {variant === 1 ? "Saved" : "Paper trading"}
          </span>
        </div>
        <div className="flex gap-5 border-b border-slate-200 px-4 py-3 text-[10px] font-medium">
          <span className="text-blue-600">
            {variant === 1 ? "Editor" : "Dashboard"}
          </span>
          <span>Positions</span>
          <span>Activity</span>
          <span>Settings</span>
        </div>
        <div className="bg-slate-50/80 p-4">
          {variant === 1 ? (
            <div className="space-y-4 py-3 pb-16">
              <p className="text-[9px] uppercase tracking-wider text-slate-400">
                Start automation
              </p>
              {[
                "Scan selected symbols",
                "Price is above 200-day average",
                "Check position limits",
                "Open a new position",
                "Track and manage position",
              ].map((step, index) => (
                <div
                  key={step}
                  style={{ marginLeft: `${index * 5}%` }}
                  className="relative border-l border-blue-200 pl-3"
                >
                  <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white p-2.5 shadow-xs">
                    <GitBranch className="size-3 shrink-0 text-blue-500" />
                    <span>{step}</span>
                    <ChevronRight className="ml-auto size-3 shrink-0 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ["Allocation", "$8,000"],
                  ["Active bots", "6"],
                  ["Open positions", "12"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-md border border-slate-200 bg-white p-2.5"
                  >
                    <p className="text-[9px] text-slate-400">{label}</p>
                    <p className="mt-2 font-semibold text-slate-800">{value}</p>
                  </div>
                ))}
              </div>
              {variant === 3 ? (
                <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
                  {[
                    "Follow the Trend",
                    "Buy the Dip",
                    "Income Strategy",
                    "Market Hedge",
                    "Weekly Accumulation",
                    "Momentum Bot",
                  ].map((name, index) => (
                    <div
                      key={name}
                      className="flex items-center gap-3 border-b border-slate-100 px-3 py-3 last:border-0"
                    >
                      <span
                        className={`rounded-lg p-2 ${index % 2 ? "bg-violet-50 text-violet-500" : "bg-blue-50 text-blue-500"}`}
                      >
                        <Bot className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-800">{name}</p>
                        <p className="mt-1 text-[9px] text-slate-400">
                          {index % 2 ? "Scanning" : "Monitoring"}
                        </p>
                      </div>
                      <span className="text-[10px]">$1,000</span>
                      <span className="h-4 w-7 rounded-full bg-blue-500 p-0.5">
                        <span className="ml-auto block size-3 rounded-full bg-white" />
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4 pb-14">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-800">
                      {variant === 0 ? "Bot overview" : "Performance"}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      Last 30 days
                    </span>
                  </div>
                  <svg
                    viewBox="0 0 400 150"
                    className="mt-5 w-full"
                    fill="none"
                  >
                    <path
                      d="M0 30H400M0 75H400M0 120H400"
                      stroke="#e2e8f0"
                      strokeDasharray="4 4"
                    />
                    <path
                      d="M0 130L22 118L40 127L58 94L76 105L95 89L115 102L138 68L160 79L185 61L204 72L228 39L250 51L273 24L292 40L317 20L342 31L369 8L400 17"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {variant !== 3 && (
        <div className={`${card} absolute bottom-0 left-0 w-[64%] p-4 sm:p-5`}>
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 font-semibold text-slate-800">
            {variant === 0 ? (
              <Plus className="size-4 text-blue-500" />
            ) : variant === 1 ? (
              <Layers className="size-4 text-blue-500" />
            ) : (
              <Activity className="size-4 text-blue-500" />
            )}
            {["Create a bot", "Position settings", "Recent activity"][variant]}
          </div>
          {(variant === 0
            ? [
                ["Name", "Follow the Trend"],
                ["Account", "Paper trading"],
                ["Allocation", "$2,500"],
              ]
            : variant === 1
              ? [
                  ["Position size", "Up to $400"],
                  ["Expiration", "30 days"],
                  ["Exit rules", "Custom conditions"],
                ]
              : [
                  ["Trend Bot", "Position opened"],
                  ["Income Strategy", "Scan completed"],
                  ["Market Hedge", "Rules checked"],
                ]
          ).map(([label, value]) => (
            <div
              key={label}
              className="mb-3 flex items-center justify-between gap-2"
            >
              <span className="text-[9px] text-slate-400">{label}</span>
              <span className="rounded border border-slate-100 bg-slate-50 px-2 py-1.5 text-[10px]">
                {value}
              </span>
            </div>
          ))}
          {variant === 0 && (
            <div className="mt-4 rounded-md bg-blue-600 py-2 text-center font-medium text-white">
              Create bot
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function BotFeaturesSection() {
  const [activeStep, setActiveStep] = useState(0);
  const stepNames = ["Step one", "Step two", "Step three", "Step four"];

  return (
    <div
      id="bot-features"
      role="region"
      aria-label="Build your bot in four steps"
      aria-roledescription="carousel"
      className="relative overflow-hidden"
    >
      <div className="absolute inset-x-0 top-5 z-10 flex justify-center gap-2 px-4 lg:inset-x-auto lg:right-4 lg:top-1/2 lg:-translate-y-1/2 lg:flex-col">
        {stepNames.map((name, index) => (
          <button
            key={name}
            type="button"
            onClick={() => setActiveStep(index)}
            aria-label={`${name}: ${features[index].title}`}
            aria-current={activeStep === index ? "step" : undefined}
            aria-controls={`bot-slide-${index}`}
            className={`min-h-11 rounded-full border px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 ${activeStep === index ? "border-blue-600 bg-blue-600 text-white shadow-sm" : "border-neutral-200 bg-white/90 text-neutral-500 hover:border-blue-300 hover:text-blue-600"}`}
          >
            {name}
          </button>
        ))}
      </div>
      <div
        className="flex items-stretch transition-transform duration-500 ease-in-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${activeStep * 100}%)` }}
      >
        {features.map((feature, index) => (
          <section
            key={feature.title}
            id={`bot-slide-${index}`}
            role="group"
            aria-roledescription="slide"
            aria-hidden={activeStep !== index}
            inert={activeStep !== index}
            aria-labelledby={`bot-feature-${index}`}
            className={`relative isolate w-full shrink-0 overflow-hidden px-6 pb-12 pt-24 text-neutral-900 md:px-14 lg:py-24 lg:pr-32 ${index % 2 === 0 ? "bg-[#f7f7f7]" : "bg-white"}`}
          >
            {index % 2 === 0 && (
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 -z-10 h-[530px] w-full text-neutral-200/70"
                viewBox="0 0 1400 530"
                preserveAspectRatio="xMidYMid slice"
                fill="none"
              >
                {Array.from({ length: 7 }, (_, line) => (
                  <path
                    key={line}
                    d={`M ${90 + line * 18} 530 C 250 ${170 + line * 20}, 850 ${250 + line * 20}, ${1090 + line * 28} -70`}
                    stroke="currentColor"
                  />
                ))}
              </svg>
            )}
            <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className={index % 2 === 0 ? "lg:order-2" : ""}>
                <h2
                  id={`bot-feature-${index}`}
                  className="text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl lg:text-[42px]"
                >
                  {feature.title}
                </h2>
                <p className="mt-6 text-base leading-7 text-neutral-500 sm:text-lg">
                  {feature.description}
                </p>
                <ul className="mt-8 grid sm:grid-cols-2">
                  {feature.points.map((point, pointIndex) => (
                    <li
                      key={point}
                      className={`flex items-start gap-3 py-4 text-sm leading-6 text-neutral-700 sm:text-base ${pointIndex < 4 ? "border-b border-neutral-200/80" : ""}`}
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-sky-500"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={index % 2 === 0 ? "lg:order-1" : ""}>
                <BotPreview variant={index} />
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
