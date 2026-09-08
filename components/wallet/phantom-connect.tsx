"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/sonner";

type PublicKey = { toString(): string };
type Provider = {
  isPhantom?: boolean;
  publicKey?: PublicKey | null;
  isConnected?: boolean;
  connect(): Promise<{ publicKey: PublicKey }>;
  disconnect(): Promise<void>;
  on(event: string, callback: (key?: PublicKey | null) => void): void;
  removeListener(
    event: string,
    callback: (key?: PublicKey | null) => void,
  ): void;
};
function provider() {
  const value = (window as Window & { phantom?: { solana?: Provider } }).phantom
    ?.solana;
  return value?.isPhantom ? value : undefined;
}

export function PhantomConnect() {
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const bound = useRef<Provider | null>(null);
  const cleanup = useRef<(() => void) | null>(null);
  function bind(wallet: Provider) {
    if (bound.current === wallet) return;
    cleanup.current?.();
    const changed = (key?: PublicKey | null) =>
      setAddress(key?.toString() ?? "");
    const disconnected = () => setAddress("");
    wallet.on("accountChanged", changed);
    wallet.on("disconnect", disconnected);
    bound.current = wallet;
    cleanup.current = () => {
      wallet.removeListener("accountChanged", changed);
      wallet.removeListener("disconnect", disconnected);
    };
  }
  useEffect(() => () => cleanup.current?.(), []);

  async function connect() {
    if (busy) return;
    const wallet = provider();
    if (!wallet) {
      const mobile =
        /Android|iPhone|iPad|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      if (mobile) {
        if (window.location.pathname === "/connect-wallet") {
          toast.info(
            "Open this page inside Phantom’s browser, then tap Connect wallet.",
          );
          return;
        }
        const target = `${window.location.origin}/connect-wallet`;
        window.location.assign(
          `https://phantom.app/ul/browse/${encodeURIComponent(target)}?ref=${encodeURIComponent(window.location.origin)}`,
        );
      } else {
        toast.info(
          "Install the Phantom browser extension, then reload this page.",
          {
            action: {
              label: "Get Phantom",
              onClick: () =>
                window.open(
                  "https://phantom.com/download",
                  "_blank",
                  "noopener,noreferrer",
                ),
            },
          },
        );
      }
      return;
    }
    setBusy(true);
    try {
      bind(wallet);
      const result = await wallet.connect();
      setAddress(result.publicKey.toString());
      toast.success("Phantom wallet connected");
    } catch (error) {
      const code =
        typeof error === "object" && error !== null && "code" in error
          ? error.code
          : undefined;
      toast.error(
        code === 4001
          ? "Wallet connection cancelled."
          : "Could not connect to Phantom. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function disconnect() {
    setBusy(true);
    try {
      await bound.current?.disconnect();
      setAddress("");
      toast.success("Wallet disconnected");
    } catch {
      toast.error("Could not disconnect. Try again in Phantom.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="w-full sm:w-auto">
      {address ? (
        <div className="rounded-xl bg-white/80 p-3 text-sm">
          <p className="font-medium text-blue-900" title={address}>
            Phantom · {address.slice(0, 4)}…{address.slice(-4)}
          </p>
          <button
            type="button"
            onClick={disconnect}
            disabled={busy}
            className="mt-1 min-h-9 text-xs text-neutral-600 underline"
          >
            {busy ? "Disconnecting…" : "Disconnect"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={connect}
          disabled={busy}
          className="min-h-11 w-full rounded-xl bg-linear-to-r from-sky-600 to-blue-700 px-4 py-3 text-sm font-medium text-white shadow-sm disabled:opacity-60 sm:w-auto"
        >
          {busy ? "Connecting…" : "Connect wallet"}
        </button>
      )}
    </div>
  );
}
