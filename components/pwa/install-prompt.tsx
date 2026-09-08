"use client";

import { useEffect, useRef, useState } from "react";
import { Download, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPrompt() {
  const dismissed = useRef(false);
  const [event, setEvent] = useState<InstallEvent | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);
  const [browserName, setBrowserName] = useState("your browser");
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const standalone = () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const timer = setTimeout(() => {
      if (standalone() || !window.isSecureContext) return;
      if (dismissed.current) return;
      const isIos =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      const ua = navigator.userAgent;
      const embedded = /FBAN|FBAV|Instagram|Line\/|; wv\)/i.test(ua);
      const chrome = /CriOS|Chrome\//.test(ua);
      const samsung = /SamsungBrowser/.test(ua);
      const firefox = /Firefox|FxiOS/.test(ua);
      setBrowserName(
        embedded
          ? "in-app browser"
          : samsung
            ? "Samsung Internet"
            : firefox
              ? "Firefox"
              : chrome
                ? "Chrome"
                : isIos
                  ? "Safari"
                  : "your browser",
      );
      setSteps(
        embedded
          ? [
              "Open this site in Safari on iPhone, or Chrome on Android, using the app’s menu.",
              "Then choose Add to Home Screen from the browser’s Share or menu options.",
            ]
          : isIos
            ? [
                "Tap the browser’s Share button.",
                "Scroll down and tap Add to Home Screen.",
                "Leave Open as Web App enabled if shown, then tap Add.",
              ]
            : /Android/.test(ua)
              ? [
                  "Open your browser’s menu.",
                  "Choose Install app or Add to Home screen, if available.",
                  "Confirm to add OmniBot to your home screen.",
                ]
              : [
                  "Open your browser’s menu and look for Install app or an install icon in the address bar.",
                  "If installation is unavailable, you can keep using OmniBot in this browser.",
                ],
      );
      setShowHelp(true);
    }, 3000);
    function available(event: Event) {
      event.preventDefault();
      if (window.matchMedia("(display-mode: standalone)").matches) return;
      if (dismissed.current) return;
      setEvent(event as InstallEvent);
    }
    function installed() {
      dismissed.current = true;
      clearTimeout(timer);
      setShowHelp(false);
      setEvent(null);
    }
    window.addEventListener("beforeinstallprompt", available);
    window.addEventListener("appinstalled", installed);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", available);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  function dismiss() {
    dismissed.current = true;
    setShowHelp(false);
    setEvent(null);
  }

  async function install() {
    if (!event || installing) return;
    setInstalling(true);
    try {
      await event.prompt();
      const result = await event.userChoice;
      if (result.outcome === "dismissed") dismiss();
      else {
        setEvent(null);
        setShowHelp(false);
      }
    } catch {
      setEvent(null);
      toast.info("Use your browser’s menu to install OmniBot.");
    } finally {
      setInstalling(false);
    }
  }

  if (!event && !showHelp) return null;
  return (
    <aside
      aria-label="Install OmniBot app"
      className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-blue-100 bg-white p-5 text-neutral-900 shadow-xl sm:left-auto sm:right-5 sm:w-80"
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
      {event ? (
        <p className="mt-3 text-sm leading-6 text-neutral-500">
          Keep your workspace one tap away on your home screen.
        </p>
      ) : (
        <>
          <p className="mt-3 text-sm font-medium text-neutral-700">
            Add OmniBot using {browserName}
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-neutral-500">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="mt-3 text-xs leading-5 text-neutral-400">
            No install option? Open the link in Safari on iPhone or Chrome on
            Android. Browser and device support varies.
          </p>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  `${window.location.origin}/`,
                );
                toast.success("App link copied");
              } catch {
                toast.info(
                  "Copy the website address from your browser’s address bar.",
                );
              }
            }}
            className="mt-4 min-h-11 w-full rounded-xl bg-blue-50 px-4 text-sm font-semibold text-blue-700"
          >
            Copy app link
          </button>
        </>
      )}
      {event && (
        <button
          type="button"
          onClick={install}
          disabled={installing}
          className="mt-4 min-h-11 w-full rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {installing ? "Opening installer…" : "Install app"}
        </button>
      )}
    </aside>
  );
}
