import { z } from "zod";

const tokens = [
  {
    symbol: "WBTC",
    chain: "ethereum",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  },
  {
    symbol: "WETH",
    chain: "ethereum",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  {
    symbol: "SOL",
    chain: "solana",
    address: "So11111111111111111111111111111111111111112",
  },
  {
    symbol: "LINK",
    chain: "ethereum",
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  },
  {
    symbol: "UNI",
    chain: "ethereum",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  },
  {
    symbol: "AAVE",
    chain: "ethereum",
    address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
  },
];
const pairsSchema = z.array(
  z.object({
    chainId: z.string(),
    pairAddress: z.string(),
    baseToken: z.object({
      address: z.string(),
      name: z.string(),
      symbol: z.string(),
    }),
    quoteToken: z.object({ symbol: z.string() }),
    priceUsd: z.string().nullish(),
    liquidity: z.object({ usd: z.number().optional() }).nullish(),
    priceChange: z.object({ h24: z.number().optional() }).nullish(),
  }),
);

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (query) {
    if (query.length > 120)
      return Response.json({ error: "Search is too long." }, { status: 400 });
    try {
      const response = await fetch(
        `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(query)}`,
        {
          next: { revalidate: 30 },
          signal: AbortSignal.timeout(10000),
        },
      );
      if (!response.ok) throw new Error("Search unavailable");
      const data = await response.json();
      const pairs = pairsSchema.parse(data.pairs ?? []);
      const markets = pairs
        .filter((pair) => Number(pair.priceUsd) > 0)
        .sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))
        .map((pair) => ({
          symbol: pair.baseToken.symbol,
          name: pair.baseToken.name,
          chain: pair.chainId,
          address: pair.baseToken.address,
          price: Number(pair.priceUsd),
          change: pair.priceChange?.h24 ?? null,
          quote: pair.quoteToken.symbol,
          url: `https://dexscreener.com/${encodeURIComponent(pair.chainId)}/${encodeURIComponent(pair.pairAddress)}`,
        }));
      return Response.json({ markets, partial: false });
    } catch {
      return Response.json(
        { error: "Dexscreener search is temporarily unavailable." },
        { status: 502 },
      );
    }
  }
  const results = await Promise.allSettled(
    tokens.map(async (token) => {
      const response = await fetch(
        `https://api.dexscreener.com/token-pairs/v1/${token.chain}/${token.address}`,
        { next: { revalidate: 30 }, signal: AbortSignal.timeout(10000) },
      );
      if (!response.ok) throw new Error("Market provider unavailable");
      const pairs = pairsSchema.parse(await response.json());
      const pair = pairs
        .filter(
          (pair) =>
            pair.chainId === token.chain &&
            pair.baseToken.address.toLowerCase() ===
              token.address.toLowerCase() &&
            Number(pair.priceUsd) > 0,
        )
        .sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0];
      if (!pair) throw new Error("No priced pool available");
      return {
        chain: pair.chainId,
        address: pair.baseToken.address,
        symbol: token.symbol,
        name: pair.baseToken.name,
        price: Number(pair.priceUsd),
        change: pair.priceChange?.h24 ?? null,
        quote: pair.quoteToken.symbol,
        url: `https://dexscreener.com/${token.chain}/${encodeURIComponent(pair.pairAddress)}`,
      };
    }),
  );
  const markets = results.flatMap((result) =>
    result.status === "fulfilled" ? [result.value] : [],
  );
  return Response.json(
    { markets, partial: markets.length !== tokens.length },
    { status: markets.length ? 200 : 503 },
  );
}
