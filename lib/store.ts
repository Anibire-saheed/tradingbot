"use client";

import { useSyncExternalStore } from "react";

export interface WalletData {
  name: string;
  logo?: string;
  description?: string;
  address?: string;
}

const STORAGE_KEY = "connected_wallet_info";
const CUSTOM_EVENT_KEY = "wallet_store_update";

// ---------------------------------------------------------------------------
// Unified External Store & Listener Registry
// ---------------------------------------------------------------------------
const listeners = new Set<() => void>();

function subscribeWalletStore(callback: () => void) {
  listeners.add(callback);

  // 1. Listen for changes originating from OTHER tabs
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      invalidateCache();
      callback();
    }
  };

  // 2. Listen for changes originating inside the SAME tab
  const handleCustomEvent = () => {
    invalidateCache();
    callback();
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
    window.addEventListener(CUSTOM_EVENT_KEY, handleCustomEvent);
  }

  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(CUSTOM_EVENT_KEY, handleCustomEvent);
    }
  };
}

export function notifyWalletStore() {
  if (typeof window !== "undefined") {
    // Fire event for current tab
    window.dispatchEvent(new Event(CUSTOM_EVENT_KEY));
  }
}

// ---------------------------------------------------------------------------
// Reference-Stable Snapshot Cache
// ---------------------------------------------------------------------------
let cachedRawValue: string | null | undefined = undefined;
let cachedWallet: WalletData | null = null;

function invalidateCache() {
  cachedRawValue = undefined;
}

/**
 * Ensures getSnapshot returns a STABLE reference when localStorage has not changed.
 */
export function getConnectedWallet(): WalletData | null {
  if (typeof window === "undefined") return null;

  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);

    // Return existing cached reference if raw string is identical
    if (rawValue === cachedRawValue && cachedRawValue !== undefined) {
      return cachedWallet;
    }

    // Parse and update cache reference
    cachedRawValue = rawValue;
    cachedWallet = rawValue ? JSON.parse(rawValue) : null;
    return cachedWallet;
  } catch {
    cachedRawValue = null;
    cachedWallet = null;
    return null;
  }
}

// ---------------------------------------------------------------------------
// Store Actions
// ---------------------------------------------------------------------------
export function saveConnectedWallet(wallet: WalletData) {
  if (typeof window === "undefined") return;

  const rawValue = JSON.stringify(wallet);
  localStorage.setItem(STORAGE_KEY, rawValue);

  // Directly update cache so the upcoming render cycle sees it immediately
  cachedRawValue = rawValue;
  cachedWallet = wallet;

  notifyWalletStore();
}

export function removeConnectedWallet() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);

  cachedRawValue = null;
  cachedWallet = null;

  notifyWalletStore();
}

// ---------------------------------------------------------------------------
// React Hooks
// ---------------------------------------------------------------------------
export function useConnectedWallet(): WalletData | null {
  return useSyncExternalStore(
    subscribeWalletStore,
    getConnectedWallet,
    () => null, // Server-side snapshot fallback
  );
}

export function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function formatAddress(addr?: string | null): string | null {
  if (!addr) return null;
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}
