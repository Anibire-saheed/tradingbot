"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PhantomConnect } from "@/components/wallet/phantom-connect";
import { finishMobileRequest } from "@/lib/wallet/phantom-mobile";
import { syncWallet, usePhantomAddress } from "@/lib/wallet/phantom";
import { broadcastSignedTransfer } from "@/app/actions/wallet";

export function WalletReturn({ signedIn }: { signedIn: boolean }) {
  const router = useRouter();
  const address = usePhantomAddress();
  const handled = useRef(false);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  useEffect(() => {
    if (handled.current) return;
    const params = new URLSearchParams(window.location.search);
    if (!params.has("state")) return;
    handled.current = true;
    async function finish() {
      setProcessing(true);
      try {
        if (!signedIn)
          throw new Error(
            "Open OmniBot in the browser where you signed in. Phantom’s browser has a separate login session.",
          );
        const result = finishMobileRequest(params);
        window.history.replaceState(null, "", "/connect-wallet");
        syncWallet(result.address);
        if (result.transaction) {
          const sent = await broadcastSignedTransfer(result.transaction);
          if (sent.error) throw new Error(sent.error);
          router.replace(
            `/dashboard/portfolio?message=${encodeURIComponent("Withdrawal submitted. Network confirmation is pending.")}`,
          );
        } else {
          router.replace("/dashboard");
        }
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Could not complete the wallet connection.",
        );
      } finally {
        setProcessing(false);
      }
    }
    void finish();
  }, [router, signedIn]);

  return (
    <>
      {signedIn ? (
        <>
          {!processing && <PhantomConnect />}
          <p className="mt-5 text-sm text-neutral-500">
            {processing
              ? "Finishing your Phantom request…"
              : address
                ? "Wallet connected. Your OmniBot account is still signed in."
                : "Connect Phantom, then return to your dashboard."}
          </p>
          <button
            disabled={processing}
            onClick={() => {
              router.push("/dashboard");
              router.refresh();
            }}
            className="mt-5 text-sm text-blue-600 disabled:opacity-50"
          >
            Go to dashboard →
          </button>
        </>
      ) : (
        <p className="text-sm leading-7 text-neutral-600">
          Return to the browser where you signed in to OmniBot and tap Connect
          wallet again. The updated connection will return you to that browser’s
          dashboard.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}
    </>
  );
}
