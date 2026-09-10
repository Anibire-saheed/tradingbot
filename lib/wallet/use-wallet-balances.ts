"use client";

import { useEffect, useState } from "react";
import { usePhantomAddress } from "@/lib/wallet/phantom";
import type { WalletBalances } from "@/lib/wallet/balances";

export function useWalletBalances() {
  const address = usePhantomAddress();
  const [state, setState] = useState<{
    address: string;
    data?: WalletBalances;
    error?: string;
    loading: boolean;
  }>({ address: "", loading: false });

  useEffect(() => {
    if (!address) return;
    const controller = new AbortController();
    let busy = false;
    async function refresh() {
      if (
        busy ||
        controller.signal.aborted ||
        document.visibilityState === "hidden"
      )
        return;
      busy = true;
      setState((previous) => ({
        address,
        data: previous.address === address ? previous.data : undefined,
        loading: true,
      }));
      try {
        const response = await fetch(
          `/api/wallet/balances?address=${encodeURIComponent(address)}`,
          { cache: "no-store", signal: controller.signal },
        );
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error ?? "Could not load wallet balances.");
        if (!controller.signal.aborted && data.address === address)
          setState({ address, data, loading: false });
      } catch (error) {
        if (!controller.signal.aborted)
          setState((previous) => ({
            address,
            data: previous.address === address ? previous.data : undefined,
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "Could not load wallet balances.",
          }));
      } finally {
        busy = false;
      }
    }
    void refresh();
    const interval = setInterval(() => void refresh(), 30000);
    window.addEventListener("wallet-balances-refresh", refresh);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      controller.abort();
      clearInterval(interval);
      window.removeEventListener("wallet-balances-refresh", refresh);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [address]);

  return {
    address,
    data: state.address === address && address ? state.data : undefined,
    error: state.address === address && address ? state.error : undefined,
    loading: Boolean(address) && (state.address !== address || state.loading),
    refresh: () => window.dispatchEvent(new Event("wallet-balances-refresh")),
  };
}
