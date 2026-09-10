import { PublicKey } from "@solana/web3.js";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { decimalAmount, type WalletAsset } from "@/lib/wallet/balances";

const wrappedSol = "So11111111111111111111111111111111111111112";
const known: Record<string, { symbol: string; stablecoin: boolean }> = {
  [wrappedSol]: { symbol: "SOL", stablecoin: false },
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
    symbol: "USDC",
    stablecoin: true,
  },
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: {
    symbol: "USDT",
    stablecoin: true,
  },
};
const tokenResult = z.object({
  value: z.array(
    z.object({
      account: z.object({
        data: z.object({
          parsed: z.object({
            info: z.object({
              mint: z.string(),
              tokenAmount: z.object({
                amount: z.string().regex(/^\d+$/),
                decimals: z.number().int().min(0).max(255),
              }),
            }),
          }),
        }),
      }),
    }),
  ),
});
const pairSchema = z.array(
  z.object({
    chainId: z.string(),
    baseToken: z.object({ address: z.string(), symbol: z.string() }),
    priceUsd: z.string().nullish(),
    liquidity: z.object({ usd: z.number().optional() }).nullish(),
  }),
);

async function rpc(method: string, params: unknown[]) {
  const response = await fetch(
    process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    },
  );
  if (!response.ok) throw new Error("Balance provider unavailable");
  const data = await response.json();
  if (data.error || !data.result)
    throw new Error("Balance provider unavailable");
  return data.result;
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return Response.json(
      { error: "Sign in to view wallet balances." },
      { status: 401 },
    );
  let address: string;
  try {
    address = new PublicKey(
      new URL(request.url).searchParams.get("address") ?? "",
    ).toBase58();
  } catch {
    return Response.json(
      { error: "Invalid Solana wallet address." },
      { status: 400 },
    );
  }
  try {
    const [solResult, ...tokenResults] = await Promise.all([
      rpc("getBalance", [address, { commitment: "confirmed" }]),
      ...[
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
      ].map((programId) =>
        rpc("getTokenAccountsByOwner", [
          address,
          { programId },
          { encoding: "jsonParsed", commitment: "confirmed" },
        ]),
      ),
    ]);
    const sol = z
      .object({ value: z.number().int().nonnegative().safe() })
      .parse(solResult).value;
    const amounts = new Map<string, { raw: bigint; decimals: number }>();
    for (const result of tokenResults) {
      for (const account of tokenResult.parse(result).value) {
        const { mint, tokenAmount } = account.account.data.parsed.info;
        const raw = BigInt(tokenAmount.amount);
        if (raw === BigInt(0)) continue;
        const previous = amounts.get(mint);
        if (previous && previous.decimals !== tokenAmount.decimals)
          throw new Error("Invalid token decimals");
        amounts.set(mint, {
          raw: (previous?.raw ?? BigInt(0)) + raw,
          decimals: tokenAmount.decimals,
        });
      }
    }
    // Bound price-provider requests; all token quantities are still returned.
    const mints = [...new Set([wrappedSol, ...amounts.keys()])].slice(0, 60);
    const priceResults = await Promise.allSettled(
      [mints.slice(0, 30), mints.slice(30)]
        .filter((batch) => batch.length)
        .map(async (batch) => {
          const response = await fetch(
            `https://api.dexscreener.com/tokens/v1/solana/${batch.join(",")}`,
            {
              next: { revalidate: 30 },
              signal: AbortSignal.timeout(8000),
            },
          );
          if (!response.ok) throw new Error("Prices unavailable");
          return pairSchema.parse(await response.json());
        }),
    );
    const prices = new Map<string, { price: number; symbol: string }>();
    const pairs = priceResults
      .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
      .sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0));
    for (const pair of pairs) {
      const price = Number(pair.priceUsd);
      if (
        pair.chainId === "solana" &&
        Number.isFinite(price) &&
        price > 0 &&
        !prices.has(pair.baseToken.address)
      ) {
        prices.set(pair.baseToken.address, {
          price,
          symbol: pair.baseToken.symbol,
        });
      }
    }
    function asset(mint: string, amount: string, native = false): WalletAsset {
      const quote = prices.get(native ? wrappedSol : mint);
      const value =
        Number(amount) === 0 ? 0 : quote ? Number(amount) * quote.price : null;
      return {
        mint,
        amount,
        symbol: native
          ? "SOL"
          : mint === wrappedSol
            ? "WSOL"
            : (known[mint]?.symbol ?? quote?.symbol ?? "Unknown token"),
        stablecoin: known[mint]?.stablecoin ?? false,
        usdValue: value !== null && Number.isFinite(value) ? value : null,
      };
    }
    const assets = [
      asset("native", decimalAmount(BigInt(sol), 9), true),
      ...[...amounts].map(([mint, value]) =>
        asset(mint, decimalAmount(value.raw, value.decimals)),
      ),
    ];
    return Response.json(
      { address, assets, updatedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch {
    return Response.json(
      { error: "Could not load wallet balances. Please refresh to try again." },
      { status: 502 },
    );
  }
}
