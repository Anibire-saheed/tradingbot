"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Bot, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { botSchema, type SavedBot } from "@/lib/bots";
import { createSavedBot, deleteSavedBot, listSavedBots } from "@/app/actions/bots";
import { toast } from "@/components/ui/sonner";

const field =
  "mt-2 min-h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-300";

export function BotsView() {
  const [bots, setBots] = useState<SavedBot[]>([]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadBots() {
      try {
        const result = await listSavedBots();
        if (cancelled) return;
        if (result.error) setLoadError(result.error);
        else setBots(result.bots ?? []);
      } catch {
        if (!cancelled) setLoadError("Could not load your bots. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadBots();
    return () => { cancelled = true; };
  }, [loadAttempt]);

  async function createBot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const result = botSchema.safeParse(
      Object.fromEntries(new FormData(event.currentTarget)),
    );
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const saved = await createSavedBot(result.data);
      if (saved.error || !saved.bot) {
        setError(saved.error ?? "Could not save your bot. Please try again.");
        return;
      }
      const bot = saved.bot;
      setBots((current) => [...current, bot]);
      setCreating(false);
      toast.success("Bot saved to your account. No trades will be placed.");
    } catch {
      setError("Could not save your bot. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function removeBot(id: string) {
    if (deleting) return;
    setDeleting(id);
    try {
      const result = await deleteSavedBot(id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setBots((current) => current.filter((bot) => bot.id !== id));
      toast.success("Bot deleted from your account.");
    } catch {
      toast.error("Could not delete your bot. Please try again.");
    } finally {
      setDeleting(null);
    }
  }
  return (
    <section aria-labelledby="bots-title">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
            Your automated workspace
          </p>
          <h1
            id="bots-title"
            className="mt-2 text-3xl font-semibold tracking-tight"
          >
            Trading bots
          </h1>
        </div>
        <button
          onClick={() => setCreating(!creating)}
          disabled={loading || Boolean(loadError) || saving}
          aria-expanded={creating}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="size-4" />
          Create bot
        </button>
      </div>
      <div className="mt-6 flex gap-3 rounded-2xl bg-blue-100/60 p-5 text-sm leading-6 text-blue-900">
        <ShieldCheck className="mt-1 size-5 shrink-0" />
        <p>
          Build a strategy and review its settings. Trading is not connected, so
          these bots do not scan markets or place orders. Bots are saved to your
          account and stay there until deleted.
        </p>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["Bots", bots.length],
          [
            "Allocation",
            `$${bots.reduce((total, bot) => total + bot.budget, 0).toLocaleString()}`,
          ],
          ["Live positions", "0"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white p-5">
            <p className="text-xs text-neutral-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
      {creating && (
        <form
          onSubmit={createBot}
          noValidate
          className="mt-6 rounded-3xl bg-white p-6"
        >
          <h2 className="text-xl font-semibold">Set up your bot</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Bot name
              <input
                name="name"
                placeholder="My trend bot"
                maxLength={60}
                className={field}
                required
              />
            </label>
            <label className="text-sm font-medium">
              Strategy
              <select name="strategy" className={field}>
                {[
                  "Trend following",
                  "Dollar-cost averaging",
                  "Buy the dip",
                ].map((strategy) => (
                  <option key={strategy}>{strategy}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Asset
              <select name="asset" className={field}>
                {["BTC", "ETH", "SOL"].map((asset) => (
                  <option key={asset}>{asset}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Allocation (USD)
              <input
                name="budget"
                type="number"
                min="10"
                max="1000000"
                step="0.01"
                defaultValue="1000"
                className={field}
              />
            </label>
            <label className="text-sm font-medium">
              Stop loss (%)
              <input
                name="stopLoss"
                type="number"
                min="1"
                max="50"
                step="0.1"
                defaultValue="5"
                className={field}
              />
            </label>
          </div>
          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="min-h-11 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white"
            >
              {saving ? "Saving…" : "Create bot"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setCreating(false);
                setError("");
              }}
              className="min-h-11 px-4 text-sm text-neutral-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <h2 className="mb-4 mt-8 text-xl font-semibold">Your bots</h2>
      {loading ? (
        <p role="status" className="rounded-3xl bg-white p-6 text-neutral-500">Loading your bots…</p>
      ) : loadError ? (
        <div role="alert" className="rounded-3xl bg-white p-6">
          <p className="text-red-600">{loadError}</p>
          <button className="mt-3 text-blue-600" onClick={() => {
            setLoadError("");
            setLoading(true);
            setLoadAttempt((attempt) => attempt + 1);
          }}>Try again</button>
        </div>
      ) : bots.length === 0 ? (
        <div className="rounded-3xl bg-white px-6 py-14 text-center">
          <Bot className="mx-auto mb-5 size-14 text-blue-300" />
          <h3 className="text-lg font-semibold">
            Put your strategy into motion
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-neutral-500">
            Create your first bot to choose an asset, set an allocation, and
            define a risk limit.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bots.map((bot) => (
            <article key={bot.id} className="rounded-2xl bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-blue-50 p-3 text-blue-500">
                  <Bot className="size-5" />
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold">{bot.name}</h3>
                  <p className="mt-1 text-xs text-neutral-500">
                    {bot.strategy} · {bot.asset}
                  </p>
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  Draft
                </span>
                <button
                  aria-label={`Delete ${bot.name}`}
                  onClick={() => removeBot(bot.id)}
                  disabled={deleting !== null}
                  aria-busy={deleting === bot.id}
                  className="grid size-10 place-items-center text-neutral-400 hover:text-red-500"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-neutral-100 pt-4 text-xs text-neutral-500">
                <p>
                  Allocation
                  <span className="mt-1 block text-sm font-medium text-neutral-900">
                    ${bot.budget.toLocaleString()}
                  </span>
                </p>
                <p>
                  Stop loss
                  <span className="mt-1 block text-sm font-medium text-neutral-900">
                    {bot.stopLoss}%
                  </span>
                </p>
                <p>
                  Trades
                  <span className="mt-1 block text-sm font-medium text-neutral-900">
                    0
                  </span>
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
