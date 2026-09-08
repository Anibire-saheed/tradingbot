"use client";

import { useEffect } from "react";
import { Toaster, toast } from "@/components/ui/sonner";

const examples = [
  "George Martin registered with OmniBot.",
  "Hannah completed a withdrawal with OmniBot.",
  "Raj connected a wallet to OmniBot.",
];

/** Preview notifications until a verified, consented activity feed is connected. */
export function CommunityActivity() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let previous = -1;
    let toastId: string | number | undefined;

    function schedule(delay = 20_000) {
      timer = setTimeout(() => {
        if (document.visibilityState === "visible") {
          const choices = examples
            .map((_, index) => index)
            .filter((index) => index !== previous);
          const index = choices[Math.floor(Math.random() * choices.length)];
          previous = index;
          toastId = toast("Activity · Notification", {
            description: examples[index],
            toasterId: "community-activity",
            duration: 6000,
          });
        }
        schedule();
      }, delay);
    }

    schedule();
    return () => {
      clearTimeout(timer);
      if (toastId !== undefined) toast.dismiss(toastId);
    };
  }, []);

  return (
    <Toaster id="community-activity" position="bottom-left" visibleToasts={1} />
  );
}
