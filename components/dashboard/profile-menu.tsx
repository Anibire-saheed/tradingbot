"use client";

import { Popover } from "@base-ui/react/popover";
import {
  Bell,
  Building2,
  ChevronDown,
  FileText,
  Laptop,
  LogOut,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { toast } from "@/components/ui/sonner";

export function ProfileMenu({ name }: { name: string }) {
  const initials =
    name
      .split(/[\s._-]+/)
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "OB";
  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label="Open profile menu"
        className="flex shrink-0 items-center gap-1.5 rounded-full p-1 outline-none hover:bg-blue-100/60 focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <span className="grid size-10 place-items-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
          {initials}
        </span>
        <ChevronDown className="size-3.5 text-neutral-500" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={12} align="end" className="z-50">
          <Popover.Popup className="max-h-[calc(100dvh-100px)] w-[min(360px,calc(100vw-32px))] overflow-y-auto rounded-[24px] border border-neutral-200 bg-white p-4 text-neutral-800 shadow-2xl outline-none">
            <div className="mb-5 flex items-center gap-4 px-2 py-3">
              <span className="grid size-16 shrink-0 place-items-center rounded-full bg-blue-100 text-2xl font-semibold text-blue-600">
                {initials}
              </span>
              <div className="min-w-0">
                <Popover.Title className="break-words text-xl font-semibold tracking-tight text-neutral-900">
                  {name}
                </Popover.Title>
                <Popover.Description className="mt-1 text-xs text-neutral-500">
                  Your OmniBot account
                </Popover.Description>
              </div>
            </div>
            <div className="space-y-1">
              {[
                {
                  label: "Account",
                  icon: UserRound,
                  message: `Signed in as ${name}. Account editing is not available yet.`,
                },
                {
                  label: "Payment methods",
                  icon: Building2,
                  message:
                    "No payment methods connected. Payment setup is coming soon.",
                },
                {
                  label: "Security",
                  icon: ShieldCheck,
                  message: "Security settings are not available yet.",
                },
                {
                  label: "Notifications",
                  icon: Bell,
                  message: "You’re all caught up. No new notifications.",
                },
                {
                  label: "Device management",
                  icon: Laptop,
                  message: "Device management is not available yet.",
                },
                {
                  label: "Documents",
                  icon: FileText,
                  message: "No account documents are available yet.",
                },
              ].map(({ label, icon: Icon, message }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => toast.info(message)}
                  className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-400"
                >
                  <Icon className="size-5 shrink-0 text-neutral-500" />
                  {label}
                </button>
              ))}
            </div>
            <form
              action={signOut}
              className="mt-4 border-t border-neutral-100 pt-4"
            >
              <button
                type="submit"
                className="flex min-h-12 w-full items-center gap-3 rounded-xl bg-neutral-50 px-3 text-sm font-semibold hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-blue-400"
              >
                <LogOut className="size-5" />
                Sign out
              </button>
            </form>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
