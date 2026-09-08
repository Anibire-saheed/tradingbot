"use client";

import { Popover } from "@base-ui/react/popover";
import { ArrowDownToLine, ArrowUpDown, ChevronDown } from "lucide-react";
import { WithdrawButton } from "@/components/dashboard/withdraw-button";
import { toast } from "@/components/ui/sonner";

const itemClass =
  "flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-500";

export function TransferMenu() {
  return (
    <Popover.Root>
      <Popover.Trigger className="hidden min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold shadow-sm hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-600 sm:inline-flex">
        <ArrowUpDown className="size-4 text-blue-600" />
        Transfer
        <ChevronDown className="size-3.5 text-neutral-400" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner align="end" sideOffset={8} className="z-40">
          <Popover.Popup className="w-52 rounded-2xl border border-neutral-200 bg-white p-2 text-neutral-900 shadow-xl outline-none">
            <Popover.Title className="sr-only">Transfer funds</Popover.Title>
            <button
              type="button"
              className={itemClass}
              onClick={() => toast.info("Deposits are not connected yet.")}
            >
              <ArrowDownToLine className="size-5 text-blue-600" />
              Deposit
            </button>
            <WithdrawButton className={itemClass} />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
