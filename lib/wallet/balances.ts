export type WalletAsset = {
  mint: string;
  symbol: string;
  amount: string;
  usdValue: number | null;
  stablecoin: boolean;
};

export type WalletBalances = {
  address: string;
  assets: WalletAsset[];
  updatedAt: string;
};

export function decimalAmount(raw: bigint, decimals: number) {
  const digits = raw.toString().padStart(decimals + 1, "0");
  if (!decimals) return digits;
  return `${digits.slice(0, -decimals)}.${digits.slice(-decimals)}`.replace(
    /\.?0+$/,
    "",
  );
}

export function balanceTotal(assets: WalletAsset[]): number | null {
  if (assets.some((asset) => asset.usdValue === null)) return null;
  return assets.reduce((sum, asset) => sum + (asset.usdValue ?? 0), 0);
}
