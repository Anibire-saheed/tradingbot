"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ArrowDownToLine, Wallet, X } from "lucide-react";

export function DepositButton({ className }: { className?: string }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className={className}>
        <ArrowDownToLine className="size-5" />
        Deposit
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm" />
        <Dialog.Popup
          data-dashboard
          className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-32px)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-white p-6 text-neutral-900 shadow-2xl outline-none"
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-xl font-semibold">
              Deposit funds
            </Dialog.Title>
            <Dialog.Close
              aria-label="Close deposit"
              className="grid size-10 place-items-center rounded-full hover:bg-neutral-100"
            >
              <X className="size-5" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="mt-3 text-sm leading-6 text-neutral-500">
            Add funds to your OmniBot account once deposit services are
            connected.
          </Dialog.Description>
          <div className="my-6 rounded-2xl bg-blue-50 p-5">
            <Wallet className="mb-3 size-8 text-blue-500" />
            <h2 className="font-semibold text-blue-900">
              Deposit setup pending
            </h2>
            <p className="mt-2 text-sm leading-6 text-blue-800">
              A receiving address and supported network are not available yet.
              Connecting Phantom alone does not deposit money into OmniBot.
            </p>
          </div>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Receiving address</dt>
              <dd>Not assigned</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Network and fees</dt>
              <dd>Not configured</dd>
            </div>
          </dl>
          <Dialog.Close className="mt-6 min-h-11 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700">
            Done
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
