"use client";

import { useSyncExternalStore } from "react";
import { mobileWalletAddress } from "@/lib/wallet/phantom-mobile";
import type { VersionedTransaction } from "@solana/web3.js";

type Key = { toString(): string };
export type PhantomProvider = {
  isPhantom?: boolean;
  publicKey?: Key | null;
  isConnected?: boolean;
  connect(options?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: Key }>;
  disconnect(): Promise<void>;
  signAndSendTransaction(transaction: VersionedTransaction): Promise<{ signature: string }>;
  on(event: string, callback: (key?: Key | null) => void): void;
  removeListener(event: string, callback: (key?: Key | null) => void): void;
};
export function getPhantom() {
  if (typeof window === "undefined") return undefined;
  const wallet = (window as Window & { phantom?: { solana?: PhantomProvider } }).phantom?.solana;
  return wallet?.isPhantom ? wallet : undefined;
}
let address = "";
const listeners = new Set<() => void>();
let bound: PhantomProvider | undefined;
let cleanup: (() => void) | undefined;
export function syncWallet(value: string) {
  address = value;
  listeners.forEach((listener) => listener());
}
function bind() {
  const wallet = getPhantom();
  if (!wallet) {
    const mobileAddress = mobileWalletAddress();
    if (address !== mobileAddress) syncWallet(mobileAddress);
    return;
  }
  if (wallet === bound) return;
  cleanup?.();
  bound = wallet;
  const changed = (key?: Key | null) => syncWallet(key?.toString() ?? "");
  const disconnected = () => syncWallet("");
  wallet.on("connect", changed);
  wallet.on("accountChanged", changed);
  wallet.on("disconnect", disconnected);
  cleanup = () => {
    wallet.removeListener("connect", changed);
    wallet.removeListener("accountChanged", changed);
    wallet.removeListener("disconnect", disconnected);
  };
  if (wallet.isConnected && wallet.publicKey) syncWallet(wallet.publicKey.toString());
  else void wallet.connect({ onlyIfTrusted: true }).then((result) => syncWallet(result.publicKey.toString())).catch(() => {});
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  bind();
  const timer = setInterval(bind, 1000);
  return () => {
    clearInterval(timer);
    listeners.delete(listener);
    if (!listeners.size) { cleanup?.(); cleanup = undefined; bound = undefined; }
  };
}
export function usePhantomAddress() {
  return useSyncExternalStore(subscribe, () => address, () => "");
}
