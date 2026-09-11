"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CheckCircle2 } from "lucide-react";

import { usePhantomAddress } from "@/lib/wallet/phantom";
import { WalletListView } from "./WalletListView";
import { ImportWalletView } from "./ImportWalletView";

export const wallets = [
  {
    name: "Phantom",
    logo: "/Phantom.jpeg",
    description: "Solana wallet",
  },
  {
    name: "MetaMask",
    logo: "/metamask.jpeg",
    description: "Crypto wallet",
  },
  {
    name: "Trust Wallet",
    logo: "/trustwallet.jpeg",
    description: "Multi-chain wallet",
  },
  {
    name: "Coinbase Wallet",
    logo: "/coinbase.jpeg",
    description: "Crypto wallet",
  },
  {
    name: "WalletConnect",
    logo: "/Connectwallet.jpeg",
    description: "Wallet connectivity",
  },
] as const;

export type Wallet = (typeof wallets)[number];

const STORAGE_KEY = "connected_wallet_info";

// 1. Module-level variables to cache the snapshot reference
let cachedRawValue: string | null = null;
let cachedWallet: Wallet | null = null;

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

// 2. Return cached reference if the raw localStorage string hasn't changed
function getClientSnapshot(): Wallet | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === cachedRawValue) {
      return cachedWallet;
    }

    cachedRawValue = saved;
    cachedWallet = saved ? JSON.parse(saved) : null;
    return cachedWallet;
  } catch {
    cachedRawValue = null;
    cachedWallet = null;
    return null;
  }
}

function getServerSnapshot(): Wallet | null {
  return null;
}

export function PhantomConnect() {
  const address = usePhantomAddress();

  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  const storedWallet = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const firstWallet = useRef<HTMLButtonElement>(null);

  const isConnected = Boolean(address || storedWallet);

  useEffect(() => {
    const modal = dialog.current;

    if (!open || isConnected || !modal) {
      return;
    }

    const triggerButton = trigger.current;

    if (!modal.open) {
      modal.showModal();
    }

    firstWallet.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      if (modal.open) {
        modal.close();
      }

      document.body.style.overflow = previousOverflow;
      triggerButton?.focus();
    };
  }, [open, isConnected]);

  function openWalletPicker() {
    setSelectedWallet(null);
    setOpen(true);
  }

  function closeWalletPicker() {
    setSelectedWallet(null);
    setOpen(false);
  }

  function handleConnectSuccess(wallet: Wallet) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
    window.dispatchEvent(new Event("storage"));
    setBusy(false);
    closeWalletPicker();
  }

  function handleDisconnect() {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <div className="w-full sm:w-auto">
      {isConnected ? (
        <div
          onClick={handleDisconnect}
          className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-800 transition hover:bg-blue-100"
          title="Click to disconnect"
        >
          <CheckCircle2 className="size-4 shrink-0 text-blue-600" />
          <span>{storedWallet?.name ?? "Phantom"} Connected</span>
          {address && (
            <span className="text-xs text-blue-600">
              {address.slice(0, 4)}…{address.slice(-4)}
            </span>
          )}
        </div>
      ) : (
        <button
          ref={trigger}
          type="button"
          onClick={openWalletPicker}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="wallet-picker"
          disabled={busy}
          className="min-h-11 w-full rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:from-sky-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {busy ? "Connecting…" : "Connect wallet"}
        </button>
      )}

      {open && !isConnected && (
        <dialog
          ref={dialog}
          id="wallet-picker"
          aria-labelledby="wallet-picker-title"
          aria-describedby="wallet-picker-description"
          onCancel={(event) => {
            event.preventDefault();
            closeWalletPicker();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeWalletPicker();
            }
          }}
          className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-3xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50 backdrop:backdrop-blur-sm"
        >
          <div className="p-5 sm:p-6">
            {selectedWallet ? (
              <ImportWalletView
                wallet={selectedWallet}
                onBack={() => setSelectedWallet(null)}
                onClose={closeWalletPicker}
                onSuccess={() => handleConnectSuccess(selectedWallet)}
              />
            ) : (
              <WalletListView
                busy={busy}
                firstWallet={firstWallet}
                onClose={closeWalletPicker}
                onSelect={(wallet) => {
                  setSelectedWallet(wallet);
                }}
              />
            )}
          </div>
        </dialog>
      )}
    </div>
  );
}
