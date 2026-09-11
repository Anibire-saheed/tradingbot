import { useEffect, useState } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const RPC_ENDPOINTS = [
  "https://api.mainnet-beta.solana.com",
  "https://rpc.ankr.com/solana",
  "https://solana-rpc.publicnode.com",
];

export function useSolanaBalance(address?: string) {
  const [balance, setBalance] = useState<number | null>(null);
  // Derive initial loading state dynamically from whether address exists
  const [loading, setLoading] = useState<boolean>(Boolean(address));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Guard against missing or undefined address early
    if (!address) {
      return;
    }

    let isMounted = true;

    async function fetchBalance() {
      // TypeScript safety: ensure address is non-null string inside async function
      const targetAddress = address;
      if (!targetAddress) return;

      let success = false;

      for (const endpoint of RPC_ENDPOINTS) {
        if (!isMounted) break;
        try {
          const connection = new Connection(endpoint, "confirmed");

          // Fixed TypeScript Error: Type check ensures targetAddress is a valid string
          const pubKey = new PublicKey(targetAddress);

          const lamports = await connection.getBalance(pubKey);

          // State updates occur after async boundary (await)
          if (isMounted) {
            setBalance(lamports / LAMPORTS_PER_SOL);
            setError(null);
            success = true;
          }
          break;
        } catch (err) {
          console.warn(`RPC node failed [${endpoint}], trying fallback...`);
        }
      }

      // Fixed Cascading Render Warning: Update loading inside async completion callback
      if (isMounted) {
        if (!success) {
          setError("Failed to fetch balance from available RPC nodes.");
        }
        setLoading(false);
      }
    }

    fetchBalance();

    return () => {
      isMounted = false;
    };
  }, [address]);

  return { balance, loading, error };
}
