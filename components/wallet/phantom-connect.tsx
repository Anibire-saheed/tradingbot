"use client";

import { useEffect, useRef, useState } from "react";
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

export function PhantomConnect() {
  const address = usePhantomAddress();

  const [busy] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const firstWallet = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const modal = dialog.current;

    if (!open || address || !modal) {
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
  }, [open, address]);

  function openWalletPicker() {
    setSelectedWallet(null);
    setOpen(true);
  }

  function closeWalletPicker() {
    setSelectedWallet(null);
    setOpen(false);
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

      {open && !address && (
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
              />
            ) : (
              <WalletListView
                busy={busy}
                firstWallet={firstWallet}
                onClose={closeWalletPicker}
                onSelect={setSelectedWallet}
              />
            )}
          </div>
        </dialog>
      )}
    </div>
  );
}
