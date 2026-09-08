"use client";

import { useState, type FormEvent } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowUpFromLine, X } from "lucide-react";
import { z } from "zod";

const withdrawalSchema = z.object({
  amount: z.coerce
    .number()
    .finite()
    .positive("Enter an amount greater than zero."),
  address: z
    .string()
    .trim()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Enter a valid Ethereum wallet address."),
});

export function WithdrawButton({ className }: { className?: string }) {
  const [error, setError] = useState("");
  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = withdrawalSchema.safeParse(
      Object.fromEntries(new FormData(event.currentTarget)),
    );
    setError(
      result.success
        ? "We cannot review this withdrawal yet. A verified balance and withdrawal provider must be connected first. No request has been submitted."
        : result.error.issues[0].message,
    );
  }
  return (
    <Dialog.Root onOpenChange={() => setError("")}>
      <Dialog.Trigger className={className}>
        <ArrowUpFromLine className="size-5 text-blue-600" />
        Withdraw
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm" />
        <Dialog.Popup data-dashboard className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-32px)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-white p-6 text-neutral-900 shadow-2xl outline-none">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-xl font-semibold">
              Withdraw crypto
            </Dialog.Title>
            <Dialog.Close
              aria-label="Close withdrawal form"
              className="grid size-10 place-items-center rounded-full hover:bg-neutral-100"
            >
              <X className="size-5" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="mt-2 text-sm leading-6 text-neutral-500">
            Enter your withdrawal details. Transfers are not available yet.
          </Dialog.Description>
          <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
            Available balance: not connected
          </div>
          <form onSubmit={review} noValidate className="mt-5 space-y-4">
            <label className="block text-sm font-medium">
              Asset and network
              <select className="mt-2 min-h-11 w-full rounded-xl border border-neutral-200 bg-white px-3">
                <option>Ethereum (ETH) · Ethereum network</option>
              </select>
            </label>
            <label className="block text-sm font-medium">
              Amount (ETH)
              <input
                name="amount"
                type="number"
                min="0"
                step="any"
                placeholder="0.00"
                className="mt-2 min-h-11 w-full rounded-xl border border-neutral-200 px-3 outline-none focus:ring-2 focus:ring-blue-300"
              />
            </label>
            <label className="block text-sm font-medium">
              Recipient wallet address
              <input
                name="address"
                autoComplete="off"
                spellCheck={false}
                placeholder="0x…"
                className="mt-2 min-h-11 w-full rounded-xl border border-neutral-200 px-3 outline-none focus:ring-2 focus:ring-blue-300"
              />
            </label>
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900"
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              className="min-h-12 w-full rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Review withdrawal
            </button>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
