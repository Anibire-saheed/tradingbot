"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const dismissalKey = "omnibot-install-card-dismissed";

export function InstallPrompt() {
  const [event, setEvent] = useState<InstallEvent | null>(null);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    function available(event: Event) {
      event.preventDefault();
      if (window.matchMedia("(display-mode: standalone)").matches) return;
      try {
        if (localStorage.getItem(dismissalKey)) return;
      } catch {}
      setEvent(event as InstallEvent);
    }
    function installed() {
      setEvent(null);
    }
    window.addEventListener("beforeinstallprompt", available);
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("beforeinstallprompt", available);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(dismissalKey, "true");
    } catch {}
    setEvent(null);
  }

  async function install() {
    if (!event || installing) return;
    setInstalling(true);
    try {
      await event.prompt();
      const result = await event.userChoice;
      if (result.outcome === "dismissed") dismiss();
      else setEvent(null);
    } catch {
      setEvent(null);
      toast.info("Use your browser’s menu to install OmniBot.");
    } finally {
      setInstalling(false);
    }
  }

  if (!event) return null;
  return (
    <aside
      aria-label="Install OmniBot app"
      className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 rounded-2xl border border-blue-100 bg-white p-5 text-neutral-900 shadow-xl sm:left-auto sm:right-5 sm:w-80"
    >
      <button
        type="button"
        onClick={dismiss}
        disabled={installing}
        aria-label="Dismiss install prompt"
        className="absolute right-2 top-2 grid size-9 place-items-center rounded-full text-neutral-500 hover:bg-neutral-100"
      >
        <X className="size-4" />
      </button>
      <div className="flex items-center gap-3 pr-6">
        <Download className="size-6 shrink-0 text-blue-600" />
        <h2 className="font-semibold">Install OmniBot</h2>
      </div>
      <p className="mt-3 text-sm leading-6 text-neutral-500">
        Keep your workspace one tap away on your home screen.
      </p>
      <button
        type="button"
        onClick={install}
        disabled={installing}
        className="mt-4 min-h-11 w-full rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {installing ? "Opening installer…" : "Install app"}
      </button>
    </aside>
  );
}
