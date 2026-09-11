"use client";

import Image from "next/image";
import { ChevronRight, ShieldCheck, X } from "lucide-react";
import { Wallet, wallets } from "./phantom-connect";

interface WalletListViewProps {
  busy: boolean;
  firstWallet: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onSelect: (wallet: Wallet) => void;
}

export function WalletListView({
  busy,
  firstWallet,
  onClose,
  onSelect,
}: WalletListViewProps) {
  return (
    <>
      <header className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2
            id="wallet-picker-title"
            className="text-xl font-semibold tracking-tight text-slate-950"
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
          onClick={onClose}
          className="grid size-10 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-sky-400"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </header>

      <ul className="space-y-3">
        {wallets.map((wallet, index) => (
          <li key={wallet.name}>
            <button
              ref={index === 0 ? firstWallet : undefined}
              type="button"
              disabled={busy}
              onClick={() => onSelect(wallet)}
              className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition enabled:hover:border-blue-200 enabled:hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Image
                src={wallet.logo}
                alt={`${wallet.name} logo`}
                width={48}
                height={48}
                className="size-12 shrink-0 rounded-xl object-cover"
              />

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-900">
                  {wallet.name}
                </span>

                <span className="mt-1 block text-xs text-slate-500">
                  {wallet.description}
                </span>
              </span>

              <ChevronRight
                className="size-5 shrink-0 text-slate-400"
                aria-hidden="true"
              />
            </button>
          </li>
        ))}
      </ul>

      <footer className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-center gap-2 text-center text-[10px] text-slate-500">
        <ShieldCheck
          className="size-4 shrink-0 text-blue-600"
          aria-hidden="true"
        />
        <span>
          Protected by <strong>AES-256 Bit Encryption</strong> &{" "}
          <strong>MPC Security Protocol</strong>.
        </span>
      </footer>
    </>
  );
}
