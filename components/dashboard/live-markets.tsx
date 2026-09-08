"use client";

import { useEffect, useState } from "react";

type Market = {
  symbol: string;
  chain: string;
  address: string;
  name: string;
  price: number;
  change: number | null;
  quote: string;
  url: string;
};

export function LiveMarkets({ query }: { query: string }) {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");
  const searchQuery = search.trim() || query.trim();
  const [status, setStatus] = useState("Loading Dexscreener markets…");
  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    async function update() {
      try {
        const response = await fetch(
          `/api/markets${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`,
          {
            signal: controller.signal,
          },
        );
        if (!response.ok) throw new Error();
        const data = await response.json();
        setMarkets(data.markets);
        setStatus(
          data.partial
            ? "Some markets are unavailable. Refreshes every 30 seconds."
            : "Dexscreener · refreshes every 30 seconds",
        );
      } catch {
        if (!controller.signal.aborted)
          setStatus(
            "Unable to refresh prices. Previously loaded prices may be out of date.",
          );
      } finally {
        if (!controller.signal.aborted) timer = setTimeout(update, 30000);
      }
    }
    timer = setTimeout(() => void update(), 400);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [searchQuery]);
  const market = markets.find((item) => item.url === selected) ?? markets[0];
  const visible = markets.slice(0, 3);
  if (market && !visible.some((item) => item.url === market.url)) {
    visible[visible.length - 1] = market;
  }
  return (
    <section className="mt-8" aria-labelledby="live-markets-title">
      <h2 id="live-markets-title" className="text-2xl font-semibold">
        Live crypto markets
      </h2>
      <label className="mt-4 flex flex-wrap items-center gap-3 text-sm font-medium">
        Search all Dexscreener assets
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Token name, symbol, or contract address"
          aria-label="Search Dexscreener tokens"
          className="min-h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm focus:ring-2 focus:ring-blue-300"
        />
        <select
          aria-label="Select from all available crypto assets"
          value={market?.url ?? ""}
          onChange={(event) => setSelected(event.target.value)}
          disabled={markets.length === 0}
          className="min-h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 sm:w-auto sm:max-w-sm"
        >
          {markets.length === 0 && <option value="">No assets loaded</option>}
          {markets.map((item) => (
            <option key={item.url} value={item.url}>
              {item.name} ({item.symbol}/{item.quote}) · {item.chain} ·{" "}
              {item.address.slice(0, 6)}…{item.address.slice(-4)}
            </option>
          ))}
        </select>
      </label>
      <p role="status" className="mt-2 text-xs text-neutral-500">
        {status}
      </p>
      <p className="mt-1 text-xs leading-5 text-neutral-400">
        Search by name, symbol, or contract address across Dexscreener. Results
        are ranked by pool liquidity; verify the chain and token address.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {visible.map((item) => (
          <button
            key={item.url}
            onClick={() => setSelected(item.url)}
            aria-pressed={market?.url === item.url}
            className={`rounded-2xl border bg-white p-4 text-left ${market?.url === item.url ? "border-blue-500" : "border-transparent"}`}
          >
            <span className="text-sm font-semibold">
              {item.symbol} / {item.quote}
            </span>
            <span className="mt-1 block text-xs text-neutral-500">
              {item.chain} · {item.address.slice(0, 6)}…{item.address.slice(-4)}
            </span>
            <span className="mt-3 block text-lg font-semibold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 2,
              }).format(item.price)}
            </span>
            <span
              className={`mt-1 block text-xs ${item.change !== null && item.change >= 0 ? "text-emerald-600" : "text-rose-500"}`}
            >
              {item.change === null
                ? "24h change unavailable"
                : `${item.change >= 0 ? "+" : ""}${item.change.toFixed(2)}% · 24h`}
            </span>
          </button>
        ))}
      </div>
      {markets.length > 0 && visible.length === 0 && (
        <p className="py-4 text-sm text-neutral-500">No matching markets.</p>
      )}
      {market && (
        <div className="mt-5 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between gap-3 p-4">
            <h3 className="text-sm font-semibold">
              {market.symbol} / {market.quote}
            </h3>
          </div>
          <iframe
            key={market.url}
            title={`${market.symbol} Dexscreener price chart`}
            src={`${market.url}?embed=1&theme=light&info=0&trades=0`}
            className="h-[500px] w-full border-0"
            loading="lazy"
            allowFullScreen
          />
        </div>
      )}
    </section>
  );
}
