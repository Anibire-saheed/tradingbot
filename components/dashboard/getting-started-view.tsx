import Link from "next/link";
import { ArrowRight, Bot, ShieldCheck } from "lucide-react";

export function GettingStartedView({
  automation = false,
}: {
  automation?: boolean;
}) {
  const steps = automation
    ? [
        {
          title: "Choose a strategy",
          text: "Start with trend following, dollar-cost averaging, or buying the dip. Choose an approach you understand before setting up a bot.",
          href: "/dashboard/bots",
          action: "Explore bot setup",
        },
        {
          title: "Set your limits",
          text: "Select an asset, a allocation, and a stop-loss percentage. These are draft settings; no funds are committed.",
          href: "/dashboard/bots",
          action: "Create a bot",
        },
        {
          title: "Review your draft",
          text: "Check your bot’s settings before moving on. bots do not scan markets, run backtests, or place trades, and drafts reset when you leave the page.",
          href: "/dashboard/bots",
          action: "Open trading bots",
        },
      ]
    : [
        {
          title: "Know your portfolio",
          text: "See your balance overview and asset categories. Your account starts empty, and funding is not connected yet.",
          href: "/dashboard/portfolio",
          action: "Open portfolio",
        },
        {
          title: "Build your watchlist",
          text: "Search supported assets and star your favorites. Market prices are illustrative examples, not live quotes.",
          href: "/dashboard/explore",
          action: "Explore markets",
        },
        {
          title: "Follow your activity",
          text: "Find your transaction history and filter by asset, type, or date. Completed transactions will appear here once trading services are connected.",
          href: "/dashboard/activity",
          action: "View activity",
        },
        {
          title: "Discover automation",
          text: "Learn how to put together a strategy with an allocation and risk limits.",
          href: "/dashboard/automation",
          action: "Get started with bots",
        },
      ];
  const Icon = automation ? Bot : ShieldCheck;
  return (
    <section aria-labelledby="guide-title">
      <Link
        href="/dashboard"
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        ← Back to dashboard
      </Link>
      <div className="mt-6 rounded-3xl bg-linear-to-br from-blue-100 to-sky-50 p-7 sm:p-9">
        <Icon className="mb-5 size-10 text-blue-600" />
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
          {automation ? "Build your routine" : "Welcome to OmniBot"}
        </p>
        <h1
          id="guide-title"
          className="mt-3 text-3xl font-semibold tracking-tight"
        >
          {automation
            ? "Start your automation journey"
            : "Meet your trading workspace"}
        </h1>
        <p className="mt-4 text-sm leading-7 text-neutral-600">
          {automation
            ? "Turn an idea into a bot, one step at a time."
            : "Get familiar with the tools and find your way around your dashboard."}
        </p>
      </div>
      <div className="mt-6 space-y-4">
        {steps.map((step, index) => (
          <article
            key={step.title}
            className="flex gap-4 rounded-2xl border border-neutral-100 bg-white p-6"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
              {index + 1}
            </span>
            <div>
              <h2 className="text-lg font-semibold">{step.title}</h2>
              <p className="mt-2 text-sm leading-7 text-neutral-500">
                {step.text}
              </p>
              <Link
                href={step.href}
                className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
              >
                {step.action}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
