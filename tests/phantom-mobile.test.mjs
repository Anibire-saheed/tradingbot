import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";
import { webcrypto } from "node:crypto";
import ts from "typescript";
import nacl from "tweetnacl";
import bs58 from "bs58";
import {
  Keypair,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
const require = createRequire(import.meta.url);

function harness() {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  let destination;
  const exports = {};
  const code = ts.transpileModule(
    fs.readFileSync("lib/wallet/phantom-mobile.ts", "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    },
  ).outputText;
  vm.runInNewContext(code, {
    exports,
    require,
    localStorage: storage,
    window: {
      location: {
        origin: "https://omnibot.example",
        assign: (url) => {
          destination = url;
        },
      },
    },
    crypto: webcrypto,
    URL,
    URLSearchParams,
    TextEncoder,
    TextDecoder,
    Uint8Array,
    atob,
  });
  return { api: exports, values, destination: () => new URL(destination) };
}
function response(h, capture = {}) {
  h.api.connectMobileWallet();
  const url = h.destination();
  const callback = new URL(url.searchParams.get("redirect_link"));
  const phantom = nacl.box.keyPair();
  capture.phantom = phantom;
  const nonce = nacl.randomBytes(24);
  const data = new TextEncoder().encode(
    JSON.stringify({
      public_key: capture.address ?? "11111111111111111111111111111111",
      session: "opaque-wallet-session",
    }),
  );
  const encrypted = nacl.box(
    data,
    nonce,
    bs58.decode(url.searchParams.get("dapp_encryption_public_key")),
    phantom.secretKey,
  );
  callback.searchParams.set(
    "phantom_encryption_public_key",
    bs58.encode(phantom.publicKey),
  );
  callback.searchParams.set("nonce", bs58.encode(nonce));
  callback.searchParams.set("data", bs58.encode(encrypted));
  return callback.searchParams;
}

test("uses connect deep link and returns to the original website without login credentials", () => {
  const h = harness();
  h.api.connectMobileWallet();
  const url = h.destination();
  assert.equal(url.origin + url.pathname, "https://phantom.app/ul/v1/connect");
  assert.equal(
    new URL(url.searchParams.get("redirect_link")).origin,
    "https://omnibot.example",
  );
  assert.equal(url.searchParams.get("cluster"), "mainnet-beta");
  assert.equal(url.searchParams.has("access_token"), false);
  assert.equal(url.searchParams.has("secretKey"), false);
});
test("decrypts the wallet response and restores connection on reload", () => {
  const h = harness();
  const params = response(h);
  const result = h.api.finishMobileRequest(params);
  assert.equal(result.address, "11111111111111111111111111111111");
  assert.equal(h.api.mobileWalletAddress(), result.address);
  assert.throws(() => h.api.finishMobileRequest(params), /missing or expired/);
});
test("rejects a callback opened in a different browser", () => {
  const h = harness();
  const params = response(h);
  assert.throws(
    () => harness().api.finishMobileRequest(params),
    /browser where you signed in/,
  );
});
test("rejects expired requests and forged ciphertext", () => {
  const h = harness();
  const params = response(h);
  const key = [...h.values.keys()].find((key) => key.includes("request:"));
  const pending = JSON.parse(h.values.get(key));
  h.values.set(key, JSON.stringify({ ...pending, expires: 0 }));
  assert.throws(() => h.api.finishMobileRequest(params), /expired/);
  h.values.set(key, JSON.stringify(pending));
  params.set("data", bs58.encode(new Uint8Array(50)));
  assert.throws(() => h.api.finishMobileRequest(params), /verify/);
  assert.equal(h.api.mobileWalletAddress(), "");
});
test("cancelled connections do not connect a wallet and cannot be replayed", () => {
  const h = harness();
  const params = response(h);
  params.set("errorCode", "4001");
  assert.throws(() => h.api.finishMobileRequest(params), /cancelled/);
  assert.equal(h.api.mobileWalletAddress(), "");
  assert.throws(() => h.api.finishMobileRequest(params), /missing or expired/);
});

function transferCallback(h, transaction, phantom) {
  const url = h.destination();
  assert.equal(url.pathname, "/ul/v1/signTransaction");
  const callback = new URL(url.searchParams.get("redirect_link"));
  const nonce = nacl.randomBytes(24);
  const payload = nacl.box(
    new TextEncoder().encode(
      JSON.stringify({ transaction: bs58.encode(transaction.serialize()) }),
    ),
    nonce,
    bs58.decode(url.searchParams.get("dapp_encryption_public_key")),
    phantom.secretKey,
  );
  callback.searchParams.set("nonce", bs58.encode(nonce));
  callback.searchParams.set("data", bs58.encode(payload));
  return callback.searchParams;
}
function transferSetup() {
  const h = harness();
  const payer = Keypair.generate();
  const capture = { address: payer.publicKey.toBase58() };
  h.api.finishMobileRequest(response(h, capture));
  const transaction = new VersionedTransaction(
    new TransactionMessage({
      payerKey: payer.publicKey,
      recentBlockhash: "11111111111111111111111111111111",
      instructions: [
        SystemProgram.transfer({
          fromPubkey: payer.publicKey,
          toPubkey: Keypair.generate().publicKey,
          lamports: 10,
        }),
      ],
    }).compileToV0Message(),
  );
  h.api.signMobileTransfer(
    Buffer.from(transaction.serialize()).toString("base64"),
    capture.address,
  );
  transaction.sign([payer]);
  return { h, transaction, capture };
}
test("mobile withdrawals return the exact reviewed transaction", () => {
  const { h, transaction, capture } = transferSetup();
  const result = h.api.finishMobileRequest(
    transferCallback(h, transaction, capture.phantom),
  );
  assert.equal(result.transaction, bs58.encode(transaction.serialize()));
  assert.equal(result.address, capture.address);
});
test("rejects a modified withdrawal before broadcasting", () => {
  const { h, transaction, capture } = transferSetup();
  transaction.message.recentBlockhash = Keypair.generate().publicKey.toBase58();
  assert.throws(
    () =>
      h.api.finishMobileRequest(
        transferCallback(h, transaction, capture.phantom),
      ),
    /does not match/,
  );
});
