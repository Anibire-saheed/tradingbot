import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

function load(file, imports = {}, globals = {}) {
  const exports = {};
  const { outputText } = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });
  vm.runInNewContext(outputText, {
    exports,
    require: (name) => imports[name] ?? require(name),
    Response,
    Request,
    URL,
    AbortSignal,
    process,
    ...globals,
  });
  return exports;
}
const balances = load("lib/wallet/balances.ts");
const address = "11111111111111111111111111111111";
const usdc = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const wrappedSol = "So11111111111111111111111111111111111111112";
const token = (mint, amount, decimals = 6) => ({
  account: {
    data: { parsed: { info: { mint, tokenAmount: { amount, decimals } } } },
  },
});
const pair = (mint, priceUsd, liquidity = 1000) => ({
  chainId: "solana",
  baseToken: { address: mint, symbol: "TOKEN" },
  priceUsd,
  liquidity: { usd: liquidity },
});
function route({
  user = { id: "account" },
  lamports = 2000000000,
  tokens = [],
  extensionTokens = [],
  pairs = [pair(wrappedSol, "100"), pair(usdc, "0.999")],
  failRpc = false,
  failPrices = false,
} = {}) {
  let calls = 0;
  const api = load(
    "app/api/wallet/balances/route.ts",
    {
      "@/lib/wallet/balances": balances,
      "@/lib/supabase/server": {
        createClient: async () => ({
          auth: { getUser: async () => ({ data: { user } }) },
        }),
      },
    },
    {
      fetch: async (url, options) => {
        calls++;
        if (url.startsWith("https://api.dexscreener.com"))
          return Response.json(pairs, { status: failPrices ? 503 : 200 });
        if (failRpc)
          return Response.json({ error: { message: "unavailable" } });
        const { method, params } = JSON.parse(options.body);
        const value =
          method === "getBalance"
            ? lamports
            : params[1].programId.startsWith("Tokenz")
              ? extensionTokens
              : tokens;
        return Response.json({ result: { value } });
      },
    },
  );
  return {
    get: (wallet = address) =>
      api.GET(
        new Request(
          `https://example.test/api/wallet/balances?address=${wallet}`,
        ),
      ),
    calls: () => calls,
  };
}

test("exact decimal amounts retain tiny and large balances", () => {
  assert.equal(balances.decimalAmount(1n, 9), "0.000000001");
  assert.equal(balances.decimalAmount(1000000000n, 9), "1");
  assert.equal(balances.decimalAmount(0n, 9), "0");
  assert.equal(
    balances.decimalAmount(18446744073709551615n, 6),
    "18446744073709.551615",
  );
  assert.equal(balances.decimalAmount(100n, 0), "100");
});
test("requires authentication and a valid address before contacting providers", async () => {
  const anonymous = route({ user: null });
  assert.equal((await anonymous.get()).status, 401);
  assert.equal(anonymous.calls(), 0);
  const invalid = route();
  assert.equal((await invalid.get("not-a-wallet")).status, 400);
  assert.equal(invalid.calls(), 0);
});
test("aggregates accounts by mint and values SOL and stablecoins separately", async () => {
  const api = route({
    tokens: [token(usdc, "1500000"), token(usdc, "2500000")],
  });
  const response = await api.get();
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  const { assets } = await response.json();
  assert.equal(assets[0].amount, "2");
  assert.equal(assets[0].usdValue, 200);
  assert.equal(assets[1].amount, "4");
  assert.equal(assets[1].symbol, "USDC");
  assert.equal(assets[1].stablecoin, true);
  assert.equal(assets[1].usdValue, 3.996);
  assert.equal(balances.balanceTotal(assets), 203.996);
});
test("includes Token-2022 amounts without inventing dollar prices", async () => {
  const { assets } = await (
    await route({ extensionTokens: [token(address, "1", 9)] }).get()
  ).json();
  assert.equal(assets[1].amount, "0.000000001");
  assert.equal(assets[1].usdValue, null);
  assert.equal(balances.balanceTotal(assets), null);
});
test("price failures preserve quantities and unknown totals", async () => {
  const response = await route({ failPrices: true }).get();
  assert.equal(response.status, 200);
  const { assets } = await response.json();
  assert.equal(assets[0].amount, "2");
  assert.equal(assets[0].usdValue, null);
});
test("balance failures return an error, never an empty wallet", async () => {
  const response = await route({ failRpc: true }).get();
  assert.equal(response.status, 502);
  assert.equal((await response.json()).assets, undefined);
});
test("empty wallets are zero even if prices are unavailable", async () => {
  const { assets } = await (
    await route({ lamports: 0, failPrices: true }).get()
  ).json();
  assert.equal(balances.balanceTotal(assets), 0);
});
test("native SOL and wrapped SOL remain distinct holdings", async () => {
  const { assets } = await (
    await route({ tokens: [token(wrappedSol, "1000000000", 9)] }).get()
  ).json();
  assert.equal(assets[0].symbol, "SOL");
  assert.equal(assets[1].symbol, "WSOL");
  assert.equal(balances.balanceTotal(assets), 300);
});
