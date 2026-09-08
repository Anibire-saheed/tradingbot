"use client";

import { DepositButton } from "@/components/dashboard/deposit-button";

import { PhantomConnect } from "@/components/wallet/phantom-connect";
import { TransferMenu } from "@/components/dashboard/transfer-menu";
import { SupportView } from "@/components/dashboard/support-view";
import { NewMarkets } from "@/components/dashboard/new-markets";
import { LiveMarkets } from "@/components/dashboard/live-markets";
import { WithdrawButton } from "@/components/dashboard/withdraw-button";

import { GettingStartedView } from "@/components/dashboard/getting-started-view";
import { BotsView } from "@/components/dashboard/bots-view";
import { useState } from "react";
import { ProfileMenu } from "@/components/dashboard/profile-menu";
import { useRouter } from "next/navigation";
import {
  PortfolioView,
  ActivityView,
} from "@/components/dashboard/dashboard-views";
import Link from "next/link";
import {
  Activity,
  Bell,
  Bot,
  CalendarDays,
  ChevronLeft,
  CircleHelp,
  Coins,
  Home,
  Menu,
  Percent,
  Search,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

const assets = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    mark: "₿",
    color: "bg-orange-500",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    mark: "Ξ",
    color: "bg-blue-800",
  },
  {
    name: "Solana",
    symbol: "SOL",
    mark: "◎",
    color: "bg-neutral-900",
  },
];
const button =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold shadow-sm transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";
const unavailable = () =>
  toast.info("Funding and trading are not available yet.", {
    description:
      "You can explore the dashboard while we finish connecting these services.",
  });

export function TradingDashboard({
  name,
  view = "Home",
  initialQuery = "",
  programDetails = false,
}: {
  name: string;
  initialQuery?: string;
  programDetails?: boolean;
  view?:
    | "Home"
    | "Portfolio"
    | "Explore"
    | "Activity"
    | "Earn"
    | "Bots"
    | "Workspace"
    | "Automation"
    | "Support";
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [tab, setTab] = useState("Buy");
  const [asset, setAsset] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [repeat, setRepeat] = useState(false);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const selected = assets.find((item) => item.symbol === asset)!;
  const cards = [
    {
      title: "Meet your trading workspace",
      text: "Everything you need, in one place.",
      icon: ShieldCheck,
      href: "/dashboard/workspace",
    },
    {
      title: "Explore the rewards program",
      text: "Learn how OmniBot rewards work.",
      icon: Percent,
      href: "/dashboard/earn/program",
    },
    {
      title: "Start your automation journey",
      text: "Discover a more consistent trading routine.",
      icon: CalendarDays,
      href: "/dashboard/automation",
    },
  ];

  return (
    <div
      data-dashboard
      className="min-h-screen bg-[#f6f8fb] text-[#202027] selection:bg-blue-200"
    >
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed bottom-4 left-4 top-4 z-40 flex flex-col rounded-[22px] bg-white p-4 transition-all ${collapsed ? "w-20" : "w-48"} ${mobileOpen ? "flex" : "hidden lg:flex"}`}
      >
        <Link
          href="/dashboard"
          aria-label="OmniBot home"
          className="mb-7 flex h-11 items-center gap-2 px-2 font-bold tracking-tight text-blue-600"
        >
          <Bot className="size-8 shrink-0" />
          {!collapsed && "OmniBot"}
        </Link>
        <nav aria-label="Dashboard navigation" className="space-y-1">
          {[
            ["Home", Home, "/dashboard"],
            ["Portfolio", Wallet, "/dashboard/portfolio"],
            ["Explore", Search, "/dashboard/explore"],
            ["Earn", Percent, "/dashboard/earn"],
            ["Activity", Activity, "/dashboard/activity"],
            ["Trading bots", Bot, "/dashboard/bots"],
          ].map(([label, Icon, href]) => {
            const NavIcon = Icon as typeof Home;
            return (
              <Link
                key={String(label)}
                href={String(href)}
                title={String(label)}
                onClick={() => setMobileOpen(false)}
                aria-current={
                  label === view ||
                  (label === "Trading bots" && view === "Bots")
                    ? "page"
                    : undefined
                }
                className={`flex min-h-11 items-center gap-3 rounded-xl px-2 text-sm font-medium hover:bg-blue-50 ${label === view || (label === "Trading bots" && view === "Bots") ? "bg-blue-50 text-blue-600" : "text-neutral-700"}`}
              >
                <NavIcon className="size-5 shrink-0" />
                {!collapsed && String(label)}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-2 pt-8">
          <button
            className="hidden min-h-10 w-full items-center gap-3 px-2 text-sm lg:flex"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              className={`size-5 ${collapsed ? "rotate-180" : ""}`}
            />
            {!collapsed && "Collapse"}
          </button>
          <Link
            href="/dashboard/support"
            className="flex min-h-10 items-center gap-3 px-2 text-sm"
            title="Help"
          >
            <CircleHelp className="size-5" />
            {!collapsed && "Help"}
          </Link>
        </div>
      </aside>

      <div className={`transition-all ${collapsed ? "lg:ml-28" : "lg:ml-60"}`}>
        <header className="flex items-center gap-3 px-5 py-5 md:px-8">
          <button
            className="lg:hidden"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <Menu />
          </button>
          <div className="relative mx-auto w-full max-w-xl">
            <Search className="absolute left-4 top-4 size-5 text-neutral-400" />
            <input
              aria-label="Search markets"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && view !== "Explore") {
                  router.push(
                    `/dashboard/explore?q=${encodeURIComponent(query)}`,
                  );
                }
              }}
              placeholder="Search for assets, markets & more"
              className="h-13 w-full rounded-2xl bg-white pl-12 pr-4 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <TransferMenu />
          <button
            onClick={() =>
              toast.info("You’re all caught up. No new notifications.")
            }
            aria-label="Notifications"
            className="grid size-11 shrink-0 place-items-center rounded-full text-neutral-500 hover:bg-white"
          >
            <Bell className="size-5" />
          </button>
          <ProfileMenu name={name} />
        </header>

        <main
          id="overview"
          className="grid gap-7 px-5 pb-10 md:px-8 xl:grid-cols-[minmax(0,1fr)_350px] 2xl:grid-cols-[minmax(0,1fr)_390px]"
        >
          <div className="min-w-0">
            {view === "Earn" && !programDetails && (
              <section>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
                  Grow with OmniBot
                </p>
                <h1 className="mt-2 text-3xl font-semibold">Rewards</h1>
                <div className="mt-6 rounded-3xl bg-white p-8">
                  <Percent className="mb-5 size-10 text-blue-500" />
                  <h2 className="text-xl font-semibold">
                    Your rewards journey starts here
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-neutral-500">
                    Explore the rewards program and learn about participation
                    and eligibility.
                  </p>
                  <Link
                    href="/dashboard/earn/program"
                    className="mt-6 inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white"
                  >
                    View program details
                  </Link>
                </div>
              </section>
            )}
            {programDetails && (
              <section aria-labelledby="program-title">
                <Link
                  href="/dashboard/earn"
                  className="text-sm font-medium text-blue-600"
                >
                  ← Back to rewards
                </Link>
                <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-blue-500">
                  OmniBot rewards
                </p>
                <h1 id="program-title" className="mt-2 text-3xl font-semibold">
                  Program details
                </h1>
                <div className="mt-6 space-y-6 rounded-3xl bg-white p-8">
                  <div>
                    <h2 className="text-xl font-semibold">Weekly rewards</h2>
                    <p className="mt-3 text-sm leading-7 text-neutral-500">
                      The rewards program is designed around participation in
                      crypto transactions on OmniBot.
                    </p>
                  </div>
                  <div className="border-t border-neutral-100 pt-6">
                    <h2 className="font-semibold">
                      Eligibility and reward calculations
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-neutral-500">
                      Eligibility requirements, qualifying transactions, rates,
                      and payout timing have not been published yet.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-blue-50 p-5">
                    <h2 className="font-semibold text-blue-900">
                      Your reward activity
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-blue-800">
                      No reward activity is available yet. Your earned rewards
                      will appear here when the program is connected.
                    </p>
                  </div>
                </div>
              </section>
            )}
            {view === "Support" && <SupportView />}
            {view === "Workspace" && <GettingStartedView />}
            {view === "Automation" && <GettingStartedView automation />}
            {view === "Bots" && <BotsView />}
            {view === "Portfolio" && <PortfolioView />}
            {view === "Activity" && <ActivityView />}
            <div hidden={view !== "Home"}>
              <div className="flex flex-wrap items-center gap-4 rounded-[22px] bg-[#e8f0fc] p-5">
                <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-sky-200 via-blue-300 to-blue-600 shadow-inner">
                  <Coins className="size-10 text-white" strokeWidth={1.4} />
                </div>
                <div className="flex-1">
                  <h1 className="font-semibold text-blue-950">
                    Add money to buy crypto
                  </h1>
                  <p className="mt-1 text-sm leading-6 text-blue-900/80">
                    Your next opportunity starts with OmniBot.
                  </p>
                </div>
                <PhantomConnect />
              </div>

              <section id="portfolio" className="py-9">
                <p className="text-sm underline decoration-dotted underline-offset-4">
                  Portfolio value
                </p>
                <p className="mt-2 text-5xl font-semibold tracking-tight">
                  <span className="text-neutral-400">$</span>0.00
                </p>
                <div className="mt-6 flex gap-3">
                  <DepositButton className={button} />
                  <WithdrawButton className={button} />
                </div>
              </section>

              <section aria-labelledby="for-you">
                <h2
                  id="for-you"
                  className="mb-4 text-xs font-semibold uppercase tracking-wide text-neutral-400"
                >
                  For you
                </h2>
                <div className="grid gap-3 md:grid-cols-3">
                  {cards
                    .filter((item) => !dismissed.includes(item.title))
                    .map(({ title, text, icon: Icon, href }) => (
                      <div
                        key={title}
                        className="relative rounded-2xl bg-white p-5"
                      >
                        <button
                          onClick={() => setDismissed([...dismissed, title])}
                          aria-label={`Dismiss ${title}`}
                          className="absolute right-2 top-2 grid size-8 place-items-center text-neutral-400 hover:text-neutral-800"
                        >
                          <X className="size-4" />
                        </button>
                        <Icon className="mb-4 size-7 text-blue-500" />
                        <Link
                          href={href}
                          className="text-sm font-semibold hover:text-blue-600"
                        >
                          {title}
                        </Link>
                        <p className="mt-1 text-xs leading-5 text-neutral-500">
                          {text}
                        </p>
                      </div>
                    ))}
                </div>
              </section>
            </div>
            {view === "Explore" && (
              <section className="mb-7">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-500">
                  Find your next opportunity
                </p>
                <h1 className="text-3xl font-semibold tracking-tight">
                  Explore markets
                </h1>
                <p className="mt-2 text-sm text-neutral-500">
                  Discover assets, compare examples, and make your watchlist
                  your own.
                </p>
                <div className="relative mt-6 overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 to-blue-900 p-8 text-white">
                  <Coins
                    aria-hidden="true"
                    className="absolute -right-5 top-4 size-40 rotate-12 text-blue-400/20"
                  />
                  <p className="text-xs font-medium uppercase tracking-widest text-blue-300">
                    Built around your strategy
                  </p>
                  <h2 className="relative mt-4 max-w-xs text-2xl font-semibold">
                    Less guesswork.
                    <br />
                    More possibility.
                  </h2>
                  <p className="relative mt-3 max-w-sm text-sm leading-6 text-blue-200">
                    Discover how automated bots can help you build a consistent
                    trading routine.
                  </p>
                  <Link
                    href="/dashboard/bots"
                    className="relative mt-5 inline-flex rounded-full bg-white px-5 py-3 text-xs font-semibold text-blue-900"
                  >
                    Explore trading bots →
                  </Link>
                </div>
              </section>
            )}
            <div hidden={view !== "Home" && view !== "Explore"}>
              <LiveMarkets query={query} />
              <NewMarkets />
            </div>
            <section
              hidden={view !== "Home"}
              id="activity"
              className="mt-6 rounded-[22px] bg-white p-5"
            >
              <h2 className="font-semibold">Recent activity</h2>
              <p className="py-7 text-center text-sm text-neutral-400">
                No transactions yet.
              </p>
            </section>
          </div>

          <aside
            aria-label="Trade crypto"
            className="h-fit rounded-[26px] bg-white p-5 xl:sticky xl:top-6"
          >
            <div className="mb-4 inline-flex rounded-xl bg-[#eef2f6] p-1">
              {["Buy", "Sell", "Convert"].map((option) => (
                <button
                  key={option}
                  aria-pressed={tab === option}
                  onClick={() => setTab(option)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium ${tab === option ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="rounded-2xl bg-[#f7f7f8] p-4">
              <div className="flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 rounded-xl bg-[#e2e8f0] px-3 py-2">
                  <span
                    className={`grid size-6 place-items-center rounded-full text-white ${selected.color}`}
                  >
                    {selected.mark}
                  </span>
                  <select
                    aria-label="Asset to trade"
                    value={asset}
                    onChange={(event) => setAsset(event.target.value)}
                    className="min-w-0 bg-transparent text-sm font-medium outline-none"
                  >
                    {assets.map((item) => (
                      <option key={item.symbol} value={item.symbol}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
                <span className="text-xs text-neutral-500">
                  {tab === "Convert" ? "Convert from" : `${tab} now`}
                </span>
              </div>
              <div className="flex items-center gap-2 pb-14 pt-6">
                <input
                  aria-label={`Amount of ${selected.name}`}
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="w-full min-w-0 bg-transparent text-6xl font-light text-neutral-700 outline-none placeholder:text-neutral-400"
                />
                <span className="text-xs text-neutral-400">{asset}</span>
              </div>
            </div>
            {tab === "Convert" ? (
              <label className="mt-4 block rounded-2xl bg-[#f7f7f8] p-5 text-sm text-neutral-500">
                Convert to
                <select
                  aria-label="Conversion destination"
                  className="mt-3 block w-full rounded-lg bg-white p-3"
                  defaultValue="USD"
                >
                  <option value="USD">US Dollar (USD)</option>
                </select>
              </label>
            ) : (
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#f7f7f8] p-5 text-sm text-neutral-500">
                Repeat
                <button
                  type="button"
                  role="switch"
                  aria-checked={repeat}
                  aria-label="Repeat trade weekly"
                  onClick={() => setRepeat(!repeat)}
                  className={`h-5 w-9 rounded-full p-0.5 ${repeat ? "bg-blue-600" : "bg-neutral-300"}`}
                >
                  <span
                    className={`block size-4 rounded-full bg-white transition-transform ${repeat ? "translate-x-4" : ""}`}
                  />
                </button>
                {repeat && <span className="text-xs">Weekly</span>}
              </div>
            )}
            <p className="mb-3 mt-5 text-xs text-neutral-500">
              {tab === "Buy" ? "Pay with" : "Available balance"}
            </p>
            <button
              onClick={unavailable}
              className="rounded-xl bg-[#e2e8f0] px-4 py-3 text-sm font-medium"
            >
              {tab === "Buy" ? "Select a payment method" : `0 ${asset}`}
            </button>
            <p className="mt-8 text-xs leading-5 text-neutral-400">
              Trading is not connected yet. No orders will be placed.
            </p>
            <button
              disabled
              className="mt-4 min-h-12 w-full cursor-not-allowed rounded-xl bg-linear-to-r from-sky-300 to-blue-300 font-medium text-white"
            >
              Review
            </button>
          </aside>
        </main>
      </div>
    </div>
  );
}
