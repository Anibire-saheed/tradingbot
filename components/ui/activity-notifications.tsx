"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/sonner";

/** Display server-action redirect messages once, across all routes. */
export function ActivityNotifications() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Read the live URL so Strict Mode's repeated effect cannot replay a message.
    const url = new URL(window.location.href);
    const error = url.searchParams.get("error");
    const message = url.searchParams.get("message");

    if (!url.searchParams.has("error") && !url.searchParams.has("message")) return;

    if (error) toast.error(error);
    else if (message) toast.success(message);

    url.searchParams.delete("error");
    url.searchParams.delete("message");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [searchParams]);

  return null;
}
