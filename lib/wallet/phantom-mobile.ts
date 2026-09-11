"use client";

import bs58 from "bs58";
import nacl from "tweetnacl";
import { PublicKey, VersionedTransaction } from "@solana/web3.js";
import { z } from "zod";

const sessionKey = "omnibot-phantom-mobile";
const pendingKey = "omnibot-phantom-request:";
const sessionSchema = z.object({
  address: z.string(),
  session: z.string(),
  secretKey: z.string(),
  phantomKey: z.string(),
  expires: z.number(),
});
const pendingSchema = z.object({
  secretKey: z.string(),
  expires: z.number(),
  kind: z.enum(["connect", "transfer"]),
  phantomKey: z.string().optional(),
  message: z.string().optional(),
});

function readSession() {
  if (typeof window === "undefined") return null;
  try {
    const parsed = sessionSchema.safeParse(
      JSON.parse(localStorage.getItem(sessionKey) ?? "null"),
    );
    if (!parsed.success || parsed.data.expires < Date.now()) return null;
    return parsed.data;
  } catch {
    return null;
  }
}
export function mobileWalletAddress() {
  return readSession()?.address ?? "";
}

function launch(
  kind: "connect" | "transfer",
  secretKey: Uint8Array,
  params: Record<string, string>,
  extra = {},
) {
  const state = crypto.randomUUID();
  localStorage.setItem(
    pendingKey + state,
    JSON.stringify({
      kind,
      secretKey: bs58.encode(secretKey),
      expires: Date.now() + 5 * 60 * 1000,
      ...extra,
    }),
  );
  const callback = new URL("/connect-wallet", window.location.origin);
  callback.searchParams.set("state", state);
  const url = new URL(
    `https://phantom.app/ul/v1/${kind === "connect" ? "connect" : "signTransaction"}`,
  );
  url.search = new URLSearchParams({
    ...params,
    redirect_link: callback.toString(),
  }).toString();
  window.location.assign(url.toString());
}

export function connectMobileWallet() {
  const key = nacl.box.keyPair();
  launch("connect", key.secretKey, {
    app_url: window.location.origin,
    dapp_encryption_public_key: bs58.encode(key.publicKey),
    cluster: "mainnet-beta",
  });
}

export function signMobileTransfer(transaction: string, address: string) {
  const session = readSession();
  if (!session || session.address !== address)
    throw new Error("Reconnect Phantom before withdrawing.");
  const bytes = Uint8Array.from(atob(transaction), (character) =>
    character.charCodeAt(0),
  );
  const decoded = VersionedTransaction.deserialize(bytes);
  if (decoded.message.staticAccountKeys[0].toBase58() !== address)
    throw new Error("Wallet account changed.");
  const secret = bs58.decode(session.secretKey);
  const key = nacl.box.keyPair.fromSecretKey(secret);
  const nonce = nacl.randomBytes(24);
  const payload = nacl.box(
    new TextEncoder().encode(
      JSON.stringify({
        transaction: bs58.encode(bytes),
        session: session.session,
      }),
    ),
    nonce,
    bs58.decode(session.phantomKey),
    secret,
  );
  launch(
    "transfer",
    secret,
    {
      dapp_encryption_public_key: bs58.encode(key.publicKey),
      nonce: bs58.encode(nonce),
      payload: bs58.encode(payload),
    },
    {
      phantomKey: session.phantomKey,
      message: bs58.encode(decoded.message.serialize()),
    },
  );
}

export function finishMobileRequest(params: URLSearchParams): {
  address: string;
  transaction?: string;
} {
  const state = params.get("state");
  if (!state || !z.uuid().safeParse(state).success)
    throw new Error(
      "Invalid wallet return link. Connect again from your dashboard.",
    );
  const raw = localStorage.getItem(pendingKey + state);
  const parsed = pendingSchema.safeParse(JSON.parse(raw ?? "null"));
  if (!parsed.success || parsed.data.expires < Date.now()) {
    throw new Error(
      "Return to the browser where you signed in and connect again. This connection request is missing or expired.",
    );
  }
  const pending = parsed.data;
  if (params.has("errorCode")) {
    localStorage.removeItem(pendingKey + state);
    throw new Error(
      "Phantom request cancelled. You can return to your dashboard.",
    );
  }
  const phantomKey =
    pending.kind === "connect"
      ? params.get("phantom_encryption_public_key")
      : pending.phantomKey;
  if (!phantomKey || !params.get("nonce") || !params.get("data"))
    throw new Error("Incomplete response from Phantom.");
  const decrypted = nacl.box.open(
    bs58.decode(params.get("data")!),
    bs58.decode(params.get("nonce")!),
    bs58.decode(phantomKey),
    bs58.decode(pending.secretKey),
  );
  if (!decrypted)
    throw new Error(
      "Could not verify the Phantom response. Please connect again.",
    );
  const data = JSON.parse(new TextDecoder().decode(decrypted));
  if (pending.kind === "connect") {
    const result = z
      .object({ public_key: z.string(), session: z.string().min(1) })
      .parse(data);
    const address = new PublicKey(result.public_key).toBase58();
    localStorage.setItem(
      sessionKey,
      JSON.stringify({
        address,
        session: result.session,
        secretKey: pending.secretKey,
        phantomKey,
        expires: Date.now() + 12 * 60 * 60 * 1000,
      }),
    );
    localStorage.removeItem(pendingKey + state);
    return { address };
  }
  const result = z.object({ transaction: z.string() }).parse(data);
  const transaction = VersionedTransaction.deserialize(
    bs58.decode(result.transaction),
  );
  if (bs58.encode(transaction.message.serialize()) !== pending.message)
    throw new Error("The signed transaction does not match your withdrawal.");
  localStorage.removeItem(pendingKey + state);
  return {
    address: transaction.message.staticAccountKeys[0].toBase58(),
    transaction: result.transaction,
  };
}
