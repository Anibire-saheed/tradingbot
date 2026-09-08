"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

type NewMarket = {
  description: string | null;
  icon: string | null;
  marketCap: number | null;
  h1: number | null;
  h24: number | null;
  symbol: string;
  name: string;
  quote: string;
  chain: string;
  address: string;
  price: number;
  url: string;
};
export function NewMarkets() {
  const [showAll, setShowAll] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [failedIcons, setFailedIcons] = useState<string[]>([]);
  const change = (value: number | null) => (
    <span
      className={
        value === null
          ? "text-neutral-400"
          : value >= 0
            ? "text-emerald-600"
            : "text-rose-600"
      }
    >
      {value === null
        ? "—"
        : `${value >= 0 ? "↗" : "↘"}${Math.abs(value).toFixed(2)}%`}
    </span>
  );
  const money = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumSignificantDigits: 5,
    }).format(value);
  const [markets, setMarkets] = useState<NewMarket[]>([]);
  const [selected, setSelected] = useState<NewMarket | null>(null);
  const [status, setStatus] = useState("Loading recently added assets…");
  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    async function update() {
      try {
        const response = await fetch("/api/markets/new", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        setMarkets(data.markets);
        setStatus(
          data.markets.length
            ? "Updated every minute"
            : "No priced assets found in the latest profiles.",
        );
      } catch {
        if (!controller.signal.aborted)
          setStatus(
            "Could not refresh recent assets. Any displayed data may be out of date.",
          );
      } finally {
        if (!controller.signal.aborted) timer = setTimeout(update, 60000);
      }
    }
    void update();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, []);
  return (
    <section className="mt-9" aria-labelledby="new-markets-title">
      <h2 id="new-markets-title" className="text-2xl font-semibold">
        Recently added assets
      </h2>
      <p className="mt-2 text-xs leading-6 text-neutral-500">
        Assets from Dexscreener’s latest token profiles. Profile recency does
        not indicate a new token launch or a quality rating.
      </p>
      <p role="status" className="mt-1 text-xs text-neutral-400">
        {status}
      </p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {(showAll ? markets : markets.slice(0, 4)).map((market) => (
          <article
            key={market.url}
            className="rounded-[26px] border border-neutral-200/80 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-blue-50 text-xl font-semibold text-blue-600">
                {market.icon &&
                market.icon.startsWith("https://cdn.dexscreener.com/") &&
                !failedIcons.includes(market.url) ? (
                  <Image
                    src={market.icon}
                    alt=""
                    width={64}
                    height={64}
                    unoptimized
                    className="size-full object-cover"
                    onError={() =>
                      setFailedIcons((current) => [...current, market.url])
                    }
                  />
                ) : (
                  market.symbol.slice(0, 2)
                )}
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm font-semibold">{change(market.h24)}</p>
                <p className="mt-1 text-xl font-semibold tracking-tight">
                  {money(market.price)}
                </p>
              </div>
              <button
                type="button"
                aria-label={`${favorites.includes(market.url) ? "Unstar" : "Star"} ${market.name}`}
                aria-pressed={favorites.includes(market.url)}
                onClick={() =>
                  setFavorites((current) =>
                    current.includes(market.url)
                      ? current.filter((url) => url !== market.url)
                      : [...current, market.url],
                  )
                }
                className="grid size-10 shrink-0 place-items-center rounded-full hover:bg-neutral-50"
              >
                <Star
                  className={`size-6 ${favorites.includes(market.url) ? "fill-amber-400 text-amber-400" : "text-slate-500"}`}
                />
              </button>
            </div>
            <button
              onClick={() => setSelected(market)}
              className="mt-6 text-left text-xl font-semibold tracking-tight hover:text-blue-600"
            >
              {market.name}{" "}
              <span className="font-medium text-neutral-400">
                {market.symbol}
              </span>
            </button>
            <p className="mt-2 line-clamp-3 min-h-[72px] break-words text-sm leading-6 text-neutral-500">
              {market.description ||
                "No asset description is available from Dexscreener."}
            </p>
            <p className="mt-3 truncate text-xs text-neutral-400">
              {market.chain} · {market.address.slice(0, 6)}…
              {market.address.slice(-4)}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-neutral-200 pt-4 sm:grid-cols-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                  Mkt cap
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {market.marketCap === null
                    ? "—"
                    : new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        notation: "compact",
                        maximumFractionDigits: 1,
                      }).format(market.marketCap)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                  1 hour
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {change(market.h1)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                  24 hour
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {change(market.h24)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                  1 week
                </p>
                <p
                  title="Weekly change is not supplied by this API"
                  className="mt-1 text-lg text-neutral-400"
                >
                  —
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
      {markets.length > 4 && (
        <button
          type="button"
          onClick={() => setShowAll((current) => !current)}
          aria-expanded={showAll}
          className="mt-4 min-h-11 rounded-lg px-1 text-sm font-semibold text-blue-600 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-blue-500"
        >
          {showAll ? "Show less" : `Show more (${markets.length - 4})`}
        </button>
      )}
      {selected && (
        <div className="mt-5 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between p-4">
            <h3 className="text-sm font-semibold">
              {selected.symbol} / {selected.quote}
            </h3>
            <button
              onClick={() => setSelected(null)}
              className="min-h-10 px-3 text-xs text-neutral-500"
            >
              Close chart
            </button>
          </div>
          <iframe
            title={`${selected.symbol} price chart`}
            src={`${selected.url}?embed=1&theme=light&info=0&trades=0`}
            className="h-[500px] w-full border-0"
            loading="lazy"
          />
        </div>
      )}
    </section>
  );
}
