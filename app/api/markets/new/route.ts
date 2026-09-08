import { z } from "zod";

const profilesSchema = z.array(
  z.object({
    chainId: z.string(),
    tokenAddress: z.string(),
    description: z.string().nullish(),
    icon: z.string().nullish(),
  }),
);
const pairsSchema = z.array(
  z.object({
    chainId: z.string(),
    pairAddress: z.string(),
    liquidity: z.object({ usd: z.number().optional() }).nullish(),
    baseToken: z.object({
      address: z.string(),
      symbol: z.string(),
      name: z.string(),
    }),
    quoteToken: z.object({ symbol: z.string() }),
    priceUsd: z.string().nullish(),
    marketCap: z.number().nullish(),
    priceChange: z
      .object({ h1: z.number().optional(), h24: z.number().optional() })
      .nullish(),
  }),
);
async function get(path: string) {
  const response = await fetch(`https://api.dexscreener.com/${path}`, {
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Provider unavailable");
  return response.json();
}
export async function GET() {
  try {
    const profiles = profilesSchema.parse(
      await get("token-profiles/latest/v1"),
    );
    const unique = [
      ...new Map(
        profiles.map((profile) => [
          `${profile.chainId}:${profile.tokenAddress}`,
          profile,
        ]),
      ).values(),
    ].slice(0, 12);
    const results = await Promise.allSettled(
      unique.map(async (profile) => {
        const pairs = pairsSchema.parse(
          await get(
            `token-pairs/v1/${encodeURIComponent(profile.chainId)}/${encodeURIComponent(profile.tokenAddress)}`,
          ),
        );
        const matching = pairs
          .filter(
            (pair) =>
              pair.chainId === profile.chainId &&
              (profile.tokenAddress.startsWith("0x")
                ? pair.baseToken.address.toLowerCase() ===
                  profile.tokenAddress.toLowerCase()
                : pair.baseToken.address === profile.tokenAddress) &&
              Number.isFinite(Number(pair.priceUsd)) &&
              Number(pair.priceUsd) > 0,
          )
          .sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0));
        return matching
          .slice(0, 1)
          .map((pair) => ({
            ...pair,
            description: profile.description,
            icon: profile.icon,
          }));
      }),
    );
    const pairs = results.flatMap((result) =>
      result.status === "fulfilled" ? result.value : [],
    );
    const markets = [
      ...new Map(
        pairs.map((pair) => [
          `${pair.chainId}:${pair.baseToken.address}`,
          pair,
        ]),
      ).values(),
    ]
      .slice(0, 9)
      .map((pair) => ({
        description: pair.description ?? null,
        icon: pair.icon ?? null,
        marketCap: pair.marketCap ?? null,
        h1: pair.priceChange?.h1 ?? null,
        h24: pair.priceChange?.h24 ?? null,
        name: pair.baseToken.name,
        symbol: pair.baseToken.symbol,
        quote: pair.quoteToken.symbol,
        chain: pair.chainId,
        address: pair.baseToken.address,
        price: Number(pair.priceUsd),
        url: `https://dexscreener.com/${encodeURIComponent(pair.chainId)}/${encodeURIComponent(pair.pairAddress)}`,
      }));
    if (
      results.length &&
      results.every((result) => result.status === "rejected")
    )
      throw new Error("Provider unavailable");
    return Response.json({ markets });
  } catch {
    return Response.json(
      { error: "Unable to load recent assets." },
      { status: 502 },
    );
  }
}
