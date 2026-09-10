"use client";

import { DepositButton } from "@/components/dashboard/deposit-button";

import { WithdrawButton } from "@/components/dashboard/withdraw-button";

import { useState } from "react";
import { useWalletBalances } from "@/lib/wallet/use-wallet-balances";
import { balanceTotal } from "@/lib/wallet/balances";
import { PhantomConnect } from "@/components/wallet/phantom-connect";
import {
  Activity,
  CalendarDays,
  Coins,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Wallet,
} from "lucide-react";

const card = "rounded-[22px] border border-neutral-100 bg-white p-6 shadow-sm";
const action =
  "inline-flex min-h-11 items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700";

export function PortfolioView() {
  const [period, setPeriod] = useState("1M");
  const [hidden, setHidden] = useState(false);
  const { address, data, error, loading, refresh } = useWalletBalances();
  const assets = data?.assets ?? [];
  const money = (value: number | null | undefined) => hidden ? "••••" : value == null ? "—" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
  const totals = [
    ["Cryptocurrencies", data ? balanceTotal(assets.filter((asset) => !asset.stablecoin)) : null],
    ["Trading bots", 0],
    ["Cash & stablecoins", data ? balanceTotal(assets.filter((asset) => asset.stablecoin)) : null],
  ] as const;
  return (
    <section aria-labelledby="portfolio-title">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-500">
        Your workspace
      </p>
      <h1
        id="portfolio-title"
        className="text-3xl font-semibold tracking-tight"
      >
        Portfolio
      </h1>
      <div className="mt-7 flex items-center gap-3">
        <p className="text-5xl font-semibold tracking-tight">
          {money(data ? balanceTotal(assets) : null)}
        </p>
        <button
          onClick={() => setHidden(!hidden)}
          aria-label={hidden ? "Show balances" : "Hide balances"}
          className="grid size-10 place-items-center text-neutral-400"
        >
          {hidden ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </div>
      <p className="mt-2 text-sm text-neutral-400">Connected wallet value · Solana</p>
      <div className="mt-6 flex gap-3">
        <DepositButton className={action} />
        <WithdrawButton className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium" />
      </div>
      <div
        className="mt-8 flex flex-wrap justify-end gap-1"
        aria-label="Chart time range"
      >
        {["1W", "1M", "3M", "6M", "1Y", "ALL"].map((item) => (
          <button
            key={item}
            onClick={() => setPeriod(item)}
            aria-pressed={period === item}
            className={`min-h-10 rounded-full px-3 text-xs font-medium ${period === item ? "bg-white text-blue-600 shadow-sm" : "text-neutral-500"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="relative my-5 flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-blue-100/60 bg-[linear-gradient(to_right,#e4ecf7_1px,transparent_1px),linear-gradient(to_bottom,#e4ecf7_1px,transparent_1px)] bg-size-[20%_25%]">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 h-px bg-blue-400"
        />
        <p className="z-10 rounded-full bg-[#f6f8fb] px-5 py-2 text-xs text-neutral-500">
          No portfolio history for{" "}
          {period === "ALL" ? "this account" : `the selected ${period} period`}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {totals.map(
          ([title, value]) => (
            <div key={title} className={card}>
              <div
                className="mb-8 grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-500"
              >
                <Coins className="size-5" />
              </div>
              <p className="text-xs text-neutral-500">{title}</p>
              <p className="mt-1 font-semibold">{money(value)}</p>
            </div>
          ),
        )}
      </div>
      <p className="mt-3 text-xs text-neutral-500">Draft bots do not hold funds. Stablecoins include USDC and USDT.</p>
      <div className="mb-4 mt-9 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Your balances</h2>
        {address && <button onClick={refresh} disabled={loading} className="min-h-10 text-sm font-medium text-blue-600 disabled:opacity-50">{loading ? "Refreshing…" : "Refresh balances"}</button>}
      </div>
      {error && <p role="alert" className="mb-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">{error}{data ? " Showing the last successful balance update." : ""}</p>}
      {!address ? (
        <div className={`${card} text-center`}>
          <Wallet className="mx-auto mb-3 size-8 text-blue-300" />
          <p className="font-medium">Connect your wallet to see your balances</p>
          <p className="mt-2 text-sm text-neutral-500">Deposits to your connected Phantom wallet appear here after network confirmation.</p>
          <div className="mt-5 flex justify-center"><PhantomConnect /></div>
        </div>
      ) : !data ? (
        <div className={card} role="status">{loading ? "Loading wallet balances…" : "Wallet balances are unavailable. Try refreshing."}</div>
      ) : (
        <div className={card}>
          <p className="mb-4 break-all text-xs text-neutral-500">Phantom · {address}</p>
          <div className="divide-y divide-neutral-100">
            {assets.map((asset) => (
              <div key={asset.mint} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="font-medium">{asset.symbol}</p>
                  {asset.mint !== "native" && <a href={`https://explorer.solana.com/address/${asset.mint}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600" title={asset.mint}>{asset.mint.slice(0, 6)}…{asset.mint.slice(-6)}</a>}
                </div>
                <div className="min-w-0 text-right">
                  <p className="break-all font-medium">{hidden ? "••••" : asset.amount} {asset.symbol}</p>
                  <p className="mt-1 text-sm text-neutral-500">{money(asset.usdValue)}{!hidden && asset.usdValue === null ? " · Price unavailable" : ""}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-neutral-500">Updated {new Date(data.updatedAt).toLocaleTimeString()} · Refreshes every 30 seconds</p>
          {assets.some((asset) => asset.usdValue === null) && <p className="mt-2 text-xs text-neutral-500">Some prices are unavailable. Dollar totals are shown only when all included assets have a price.</p>}
          {assets.every((asset) => Number(asset.amount) === 0) && <p className="mt-3 text-sm text-neutral-500">No funds yet. Deposits will appear after network confirmation.</p>}
        </div>
      )}
    </section>
  );
}

export function ActivityView() {
  const [asset, setAsset] = useState("All assets");
  const [type, setType] = useState("All types");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const invalidDates = Boolean(start && end && start > end);
  return (
    <section aria-labelledby="activity-title">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-500">
        Stay in the loop
      </p>
      <h1 id="activity-title" className="text-3xl font-semibold tracking-tight">
        Activity & orders
      </h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          {
            title: "Recurring orders",
            text: "Build a consistent routine with scheduled purchases.",
            icon: CalendarDays,
          },
          {
            title: "Custom orders",
            text: "Plan your next move with your own price targets.",
            icon: SlidersHorizontal,
          },
        ].map(({ title, text, icon: Icon }) => (
          <div key={title} className={card}>
            <Icon className="mb-5 size-8 text-blue-500" />
            <h2 className="text-xl font-medium">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">{text}</p>
            <span className="mt-5 inline-block rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600">
              Coming soon
            </span>
          </div>
        ))}
      </div>
      <h2 className="mb-5 mt-10 text-2xl font-semibold">Transactions</h2>
      <div className="mb-5 flex flex-wrap items-end gap-3 text-xs text-neutral-500">
        <label className="grid gap-2">
          Asset
          <select
            value={asset}
            onChange={(event) => setAsset(event.target.value)}
            className="min-h-11 rounded-xl bg-white px-3 text-neutral-800"
          >
            {["All assets", "Bitcoin", "Ethereum", "Solana"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          Type
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="min-h-11 rounded-xl bg-white px-3 text-neutral-800"
          >
            {["All types", "Buy", "Sell", "Deposit", "Withdraw"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          Start date
          <input
            type="date"
            value={start}
            max={end || undefined}
            onChange={(event) => setStart(event.target.value)}
            className="min-h-11 rounded-xl bg-white px-3"
          />
        </label>
        <label className="grid gap-2">
          End date
          <input
            type="date"
            value={end}
            min={start || undefined}
            onChange={(event) => setEnd(event.target.value)}
            className="min-h-11 rounded-xl bg-white px-3"
          />
        </label>
        <button
          onClick={() => {
            setAsset("All assets");
            setType("All types");
            setStart("");
            setEnd("");
          }}
          className="min-h-11 px-2 font-medium text-blue-600"
        >
          Reset filters
        </button>
      </div>
      {invalidDates && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          End date must be on or after the start date.
        </p>
      )}
      <div
        className={`${card} flex min-h-80 flex-col items-center justify-center text-center`}
      >
        <div className="mb-6 grid size-20 place-items-center rounded-3xl bg-linear-to-br from-blue-100 to-sky-50">
          <Activity className="size-10 text-blue-500" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-semibold">Your next chapter starts here</h3>
        <p className="mt-3 max-w-md text-sm leading-6 text-neutral-500">
          {asset !== "All assets" || type !== "All types" || start || end
            ? "No transactions match these filters."
            : "No transactions yet. Your deposits, trades, and withdrawals will appear here."}
        </p>
      </div>
    </section>
  );
}
