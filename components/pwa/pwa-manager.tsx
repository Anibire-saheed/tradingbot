"use client";

import { useEffect } from "react";
import { toast } from "@/components/ui/sonner";

export function PwaManager() {
  useEffect(() => {
    function offline() {
      toast.warning("You’re offline", {
        id: "network-status",
        description:
          "Reconnect to use account actions and refresh market data.",
        duration: Infinity,
      });
    }
    function online() {
      toast.dismiss("network-status");
      toast.success("You’re back online");
    }
    window.addEventListener("offline", offline);
    window.addEventListener("online", online);
    if (!navigator.onLine) offline();
    let disposed = false;
    let reloading = false;
    let registration: ServiceWorkerRegistration | undefined;
    const hadController = Boolean(navigator.serviceWorker?.controller);
    function controllerChange() {
      if (hadController && !reloading) {
        reloading = true;
        window.location.reload();
      }
    }
    function offerUpdate() {
      if (disposed || !registration?.waiting) return;
      toast("An OmniBot update is ready", {
        id: "pwa-update",
        duration: Infinity,
        action: {
          label: "Update",
          onClick: () =>
            registration?.waiting?.postMessage({ type: "ACTIVATE_UPDATE" }),
        },
      });
    }
    function updateFound() {
      const worker = registration?.installing;
      worker?.addEventListener("statechange", () => {
        if (worker.state === "installed" && navigator.serviceWorker.controller)
          offerUpdate();
      });
    }
    function checkUpdate() {
      if (navigator.onLine && document.visibilityState === "visible")
        void registration?.update().catch(() => {});
    }
    if (window.isSecureContext && "serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener(
        "controllerchange",
        controllerChange,
      );
      void navigator.serviceWorker
        .register(
          process.env.NODE_ENV === "production" ? "/sw.js" : "/sw.js?dev=1",
          { scope: "/", updateViaCache: "none" },
        )
        .then((value) => {
          if (disposed) return;
          registration = value;
          offerUpdate();
          value.addEventListener("updatefound", updateFound);
        })
        .catch(() => console.error("Service worker registration failed."));
      document.addEventListener("visibilitychange", checkUpdate);
    }
    return () => {
      disposed = true;
      window.removeEventListener("offline", offline);
      window.removeEventListener("online", online);
      document.removeEventListener("visibilitychange", checkUpdate);
      navigator.serviceWorker?.removeEventListener(
        "controllerchange",
        controllerChange,
      );
      registration?.removeEventListener("updatefound", updateFound);
    };
  }, []);
  return null;
}
