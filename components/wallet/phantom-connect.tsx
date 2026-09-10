"use client";

import { useState } from "react";
import { getPhantom, syncWallet, usePhantomAddress } from "@/lib/wallet/phantom";
import { connectMobileWallet } from "@/lib/wallet/phantom-mobile";
import { CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export function PhantomConnect() {
  const address = usePhantomAddress();
  const [busy, setBusy] = useState(false);

  async function connect() {
    if (busy) return;
    const wallet = getPhantom();
    if (!wallet) {
      const mobile =
        /Android|iPhone|iPad|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      if (mobile) {
        try {
          connectMobileWallet();
        } catch {
          toast.error("Could not start Phantom. Allow browser storage and try again.");
        }
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
      const result = await wallet.connect();
      syncWallet(result.publicKey.toString());
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
  return (
    <div className="w-full sm:w-auto">
      {address ? (
        <div className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-800" title={address}>
          <CheckCircle2 className="size-4 shrink-0 text-blue-600" />
          <span>Phantom connected</span><span className="text-xs text-blue-600">{address.slice(0, 4)}…{address.slice(-4)}</span>
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
