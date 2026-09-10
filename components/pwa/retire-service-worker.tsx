"use client";

import { useEffect } from "react";

// Remove the previous PWA registration for returning visitors.
export function RetireServiceWorker() {
  useEffect(() => {
    async function cleanup() {
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => {
          const worker = registration.active ?? registration.waiting ?? registration.installing;
          if (worker && new URL(worker.scriptURL).pathname === "/sw.js") {
            return registration.unregister();
          }
        }));
      }
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.filter((key) => key.startsWith("omnibot-public-")).map((key) => caches.delete(key)));
      }
    }
    void cleanup().catch(() => {});
  }, []);
  return null;
}
