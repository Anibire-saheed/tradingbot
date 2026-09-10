"use server";

import bs58 from "bs58";

import { Connection, PublicKey, SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export async function broadcastSignedTransfer(encoded: string): Promise<{ signature?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in before submitting a withdrawal." };
  if (!z.string().min(1).max(2000).safeParse(encoded).success) return { error: "Invalid signed transaction." };
  try {
    const bytes = bs58.decode(encoded);
    const transaction = VersionedTransaction.deserialize(bytes);
    if (transaction.signatures.some((signature) => signature.every((byte) => byte === 0))) return { error: "Phantom did not sign the transaction." };
    const connection = new Connection(process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com", { commitment: "confirmed", disableRetryOnRateLimit: true });
    const signature = await connection.sendRawTransaction(bytes, { skipPreflight: false, maxRetries: 2 });
    return { signature };
  } catch {
    return { error: "Could not confirm transaction submission. Check your Phantom activity before trying again." };
  }
}

const input = z.object({ from: z.string(), to: z.string(), amount: z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,9})?$/, "Use up to 9 decimal places.") });
export async function prepareWalletTransfer(values: { from: string; to: string; amount: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in before preparing a withdrawal." };
  const result = input.safeParse(values);
  if (!result.success) return { error: result.error.issues[0].message };
  try {
    const from = new PublicKey(result.data.from);
    const to = new PublicKey(result.data.to);
    if (from.equals(to)) return { error: "Choose a different recipient address." };
    const [whole, fraction = ""] = result.data.amount.split(".");
    const lamports = BigInt(whole) * BigInt(1000000000) + BigInt(fraction.padEnd(9, "0"));
    if (lamports <= BigInt(0) || lamports > BigInt(Number.MAX_SAFE_INTEGER)) return { error: "Enter a valid positive SOL amount." };
    const connection = new Connection(process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com", { commitment: "confirmed", disableRetryOnRateLimit: true });
    const [balance, latest] = await Promise.all([connection.getBalance(from), connection.getLatestBlockhash()]);
    const message = new TransactionMessage({ payerKey: from, recentBlockhash: latest.blockhash, instructions: [SystemProgram.transfer({ fromPubkey: from, toPubkey: to, lamports })] }).compileToV0Message();
    const fee = (await connection.getFeeForMessage(message)).value;
    if (fee === null) return { error: "Could not estimate the network fee. Please try again." };
    if (BigInt(balance) < lamports + BigInt(fee)) return { error: "Insufficient SOL for the amount and network fee." };
    return { transaction: Buffer.from(new VersionedTransaction(message).serialize()).toString("base64"), fee: fee / 1e9, balance: balance / 1e9 };
  } catch {
    return { error: "Could not prepare the transfer. Check the Solana address and try again. The network provider may be unavailable." };
  }
}
