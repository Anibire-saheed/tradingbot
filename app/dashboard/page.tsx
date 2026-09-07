import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";
import {
  TrendingUp,
  Wallet,
  Eye,
  LogOut,
  LayoutGrid,
  CircleDot,
  ArrowDownToLine,
  Link2,
} from "lucide-react";

export const metadata = {
  title: "Dashboard | OmniBot",
  description: "Your OmniBot trading dashboard.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Derive display handle from email prefix
  const emailPrefix = user.email?.split("@")[0] ?? "trader";

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* ── Top nav ── */}
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4 md:px-10">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-[#1db89e]">
            <LayoutGrid className="size-5 text-white" strokeWidth={2} />
          </div>
          <span className="text-lg font-bold tracking-tight">OmniBot</span>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </form>
      </header>

      {/* ── Main content ── */}
      <main className="mx-auto max-w-5xl px-6 py-10 md:px-10">
        {/* Greeting */}
        <div className="mb-2 flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-xl bg-[#1db89e]">
            <LayoutGrid className="size-6 text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-white/70">
              Hi <span className="font-semibold text-white">{emailPrefix}</span>!
            </p>
          </div>
        </div>
        <p className="mb-8 text-sm text-white/50">
          Topup your account or connect your wallet to start trading.
        </p>

        {/* ── Stats cards ── */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Balance card */}
          <div className="rounded-2xl bg-[#161616] p-6">
            <div className="mb-4 grid size-10 place-items-center rounded-xl bg-[#1db89e]">
              <Wallet className="size-5 text-white" />
            </div>
            <p className="mb-1 text-xs text-white/50">USD Balance</p>
            <div className="mb-6 flex items-center gap-2">
              <span className="text-4xl font-bold">$0.00</span>
              <button
                type="button"
                aria-label="Toggle balance visibility"
                className="text-white/40 hover:text-white/70"
              >
                <Eye className="size-5" />
              </button>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1db89e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#18a88f]"
              >
                <ArrowDownToLine className="size-4" />
                Deposit
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#7c3aed] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6d28d9]"
              >
                <Link2 className="size-4" />
                Connect Wallet
              </button>
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                <CircleDot className="size-3" />
                Bot Trading Disabled
              </span>
            </div>
          </div>

          {/* Transactions card */}
          <div className="relative rounded-2xl bg-[#161616] p-6">
            <div className="mb-4 grid size-10 place-items-center rounded-xl bg-[#1db89e]">
              <TrendingUp className="size-5 text-white" />
            </div>
            <p className="mb-1 text-xs text-white/50">Total Transactions</p>
            <p className="text-4xl font-bold">0</p>
            {/* Subtle pulse dot */}
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <span className="relative flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1db89e] opacity-60" />
                <span className="relative inline-flex size-3 rounded-full bg-[#1db89e]" />
              </span>
            </span>
          </div>
        </div>

        {/* ── Recent Transactions ── */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Recent Transactions</h2>
            <button
              type="button"
              className="rounded-lg border border-white/10 px-4 py-1.5 text-xs text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              View All
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl bg-[#161616]">
            {/* Table header */}
            <div className="grid grid-cols-4 bg-[#1db89e] px-6 py-3 text-xs font-semibold text-white">
              <span>VSN</span>
              <span className="text-center">Type</span>
              <span className="text-center">Status</span>
              <span className="text-right">Amount</span>
            </div>
            {/* Empty state */}
            <div className="px-6 py-12 text-center text-sm text-white/40">
              No recent transactions
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
