"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  getPhantom,
  syncWallet,
  usePhantomAddress,
} from "@/lib/wallet/phantom";
import { connectMobileWallet } from "@/lib/wallet/phantom-mobile";
import { CheckCircle2, ChevronRight, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const wallets = [
  {
    name: "Phantom",
    logo: "/Phantom.jpeg",
    description: "Solana wallet",
    available: true,
  },
  {
    name: "MetaMask",
    logo: "/metamask.jpeg",
    description: "Crypto wallet",
    available: false,
  },
  {
    name: "Trust Wallet",
    logo: "/trustwallet.jpeg",
    description: "Multi-chain wallet",
    available: false,
  },
  {
    name: "Coinbase Wallet",
    logo: "/coinbase.jpeg",
    description: "Crypto wallet",
    available: false,
  },
  {
    name: "WalletConnect",
    logo: "/Connectwallet.jpeg",
    description: "Wallet connectivity",
    available: false,
  },
];

export function PhantomConnect() {
  const address = usePhantomAddress();
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const firstWallet = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const modal = dialog.current;
    if (!open || address || !modal) return;
    const triggerButton = trigger.current;
    modal.showModal();
    firstWallet.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      modal.close();
      document.body.style.overflow = previousOverflow;
      triggerButton?.focus();
    };
  }, [open, address]);

  async function connect() {
    if (busy) return;
    setOpen(false);
    const wallet = getPhantom();
    if (!wallet) {
      const mobile =
        /Android|iPhone|iPad|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      if (mobile) {
        try {
          connectMobileWallet();
        } catch {
          toast.error(
            "Could not start Phantom. Allow browser storage and try again.",
          );
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
      setOpen(false);
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
        <div
          className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-800"
          title={address}
        >
          <CheckCircle2 className="size-4 shrink-0 text-blue-600" />
          <span>Phantom connected</span>
          <span className="text-xs text-blue-600">
            {address.slice(0, 4)}…{address.slice(-4)}
          </span>
        </div>
      ) : (
        <button
          type="button"
          ref={trigger}
          onClick={() => setOpen((current) => !current)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="wallet-picker"
          disabled={busy}
          className="min-h-11 w-full rounded-xl bg-linear-to-r from-sky-600 to-blue-700 px-4 py-3 text-sm font-medium text-white shadow-sm disabled:opacity-60 sm:w-auto"
        >
          {busy ? "Connecting…" : "Connect wallet"}
        </button>
      )}
      {open && !address && (
        <dialog
          ref={dialog}
          id="wallet-picker"
          aria-labelledby="wallet-picker-title"
          aria-describedby="wallet-picker-description"
          onCancel={() => setOpen(false)}
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
          className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-3xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50 backdrop:backdrop-blur-sm"
        >
          <div className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2
                  id="wallet-picker-title"
                  className="text-xl font-semibold tracking-tight"
                >
                  Connect Your Wallet
                </h2>
                <p
                  id="wallet-picker-description"
                  className="mt-1 text-sm text-slate-500"
                >
                  Choose a wallet to get started.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close wallet picker"
                onClick={() => {
                  setOpen(false);
                  trigger.current?.focus();
                }}
                className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-sky-400"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <ul className="space-y-3">
              {wallets.map((wallet) => (
                <li key={wallet.name}>
                  <button
                    ref={wallet.available ? firstWallet : undefined}
                    type="button"
                    disabled={!wallet.available || busy}
                    onClick={() => void connect()}
                    className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-colors enabled:hover:border-blue-200 enabled:hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed"
                  >
                    <Image
                      src={wallet.logo}
                      alt=""
                      width={48}
                      height={48}
                      className="size-12 shrink-0 rounded-xl object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">
                        {wallet.name}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {wallet.available
                          ? busy
                            ? "Connecting…"
                            : wallet.description
                          : "Coming soon"}
                      </span>
                    </span>
                    {wallet.available && (
                      <ChevronRight
                        className="size-5 shrink-0 text-slate-400"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </dialog>
      )}
    </div>
  );
}
