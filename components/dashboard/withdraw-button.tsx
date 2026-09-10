"use client";

import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowUpFromLine, X } from "lucide-react";
import { getPhantom, usePhantomAddress } from "@/lib/wallet/phantom";
import { PhantomConnect } from "@/components/wallet/phantom-connect";
import { prepareWalletTransfer } from "@/app/actions/wallet";

const field = "mt-2 min-h-12 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm focus:ring-2 focus:ring-blue-300";
export function WithdrawButton({ className }: { className?: string }) {
  const address = usePhantomAddress();
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [review, setReview] = useState<{ from: string; to: string; amount: string; fee: number } | null>(null);
  const [signature, setSignature] = useState("");
  async function prepare() {
    setBusy(true);setError("");
    try {
      const result = await prepareWalletTransfer({ from: address, to: recipient.trim(), amount: amount.trim() });
      if (result.error) setError(result.error);
      else if (result.fee !== undefined) setReview({ from: address, to: recipient.trim(), amount: amount.trim(), fee: result.fee });
    } catch { setError("Could not reach the network. Please try again."); }
    finally { setBusy(false); }
  }
  async function send() {
    if (!review || busy) return;
    const wallet = getPhantom();
    if (!wallet || wallet.publicKey?.toString() !== review.from || address !== review.from) { setReview(null);setError("Wallet account changed. Review your withdrawal again.");return; }
    setBusy(true);setError("");
    try {
      const prepared = await prepareWalletTransfer(review);
      if (prepared.error || !prepared.transaction) { setError(prepared.error || "Could not prepare transaction.");return; }
      if (prepared.fee !== review.fee) { setReview({ ...review, fee: prepared.fee! });setError("Network fee changed. Review the updated fee before continuing.");return; }
      if (wallet.publicKey?.toString() !== review.from) throw new Error("Account changed");
      const { VersionedTransaction } = await import("@solana/web3.js");
      const transaction = VersionedTransaction.deserialize(Uint8Array.from(atob(prepared.transaction), (char) => char.charCodeAt(0)));
      const result = await wallet.signAndSendTransaction(transaction);
      setSignature(result.signature);setReview(null);
    } catch { setError("Transfer was cancelled or its status could not be verified. Check Phantom activity before retrying to avoid sending twice."); }
    finally { setBusy(false); }
  }
  return <Dialog.Root onOpenChange={(open) => { if (!open && !busy) {setError("");setReview(null);setSignature("");setAmount("");setRecipient("");} }}><Dialog.Trigger className={className}><ArrowUpFromLine className="size-5 text-blue-600" />Withdraw</Dialog.Trigger><Dialog.Portal><Dialog.Backdrop className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm" /><Dialog.Popup data-dashboard className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-32px)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-white p-6 text-neutral-900 shadow-2xl outline-none"><div className="flex items-center justify-between"><Dialog.Title className="text-xl font-semibold">Withdraw from wallet</Dialog.Title><Dialog.Close disabled={busy} aria-label="Close withdrawal" className="grid size-10 place-items-center"><X className="size-5" /></Dialog.Close></div><Dialog.Description className="mt-2 text-sm leading-6 text-neutral-500">Send SOL from Phantom. You’ll review the details here and approve the transfer in your wallet.</Dialog.Description>{signature ? <div className="mt-6 rounded-xl bg-blue-50 p-5"><h2 className="font-semibold">Transaction submitted</h2><p className="mt-2 text-sm">Network confirmation is pending. Check the transaction before sending again.</p><a href={`https://explorer.solana.com/tx/${encodeURIComponent(signature)}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm text-blue-700 underline">View transaction status</a></div> : !address ? <div className="mt-6"><PhantomConnect /></div> : review ? <div className="mt-5 space-y-4 text-sm"><p>Network: <strong>Solana mainnet</strong></p><p className="break-all">From: {review.from}</p><p className="break-all">To: {review.to}</p><p>Amount: <strong>{review.amount} SOL</strong></p><p>Estimated network fee: {review.fee} SOL</p><button disabled={busy || address !== review.from} onClick={send} className="min-h-12 w-full rounded-xl bg-blue-600 font-semibold text-white disabled:opacity-50">{busy ? "Waiting for Phantom…" : "Approve in Phantom"}</button><button disabled={busy} onClick={() => setReview(null)} className="min-h-10 w-full text-neutral-500">Edit details</button></div> : <form onSubmit={(event) => {event.preventDefault();void prepare();}} className="mt-5 space-y-4"><label className="block text-sm font-medium">Withdraw from<select className={field}><option>Phantom · {address.slice(0,4)}…{address.slice(-4)}</option></select></label><p className="rounded-xl bg-blue-50 p-3 text-sm text-blue-900">SOL · Solana network</p><label className="block text-sm font-medium">Amount (SOL)<input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" placeholder="0.00" required disabled={busy} className={field} /></label><label className="block text-sm font-medium">Recipient Solana address<input value={recipient} onChange={(event) => setRecipient(event.target.value)} autoComplete="off" spellCheck={false} required disabled={busy} className={field} /></label><button disabled={busy} className="min-h-12 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Checking balance and fees…" : "Review withdrawal"}</button></form>}{error && <p role="alert" className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900">{error}</p>}</Dialog.Popup></Dialog.Portal></Dialog.Root>;
}
