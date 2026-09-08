import { PhantomConnect } from "@/components/wallet/phantom-connect";
import Link from "next/link";

export const metadata = { title: "Connect Phantom | OmniBot" };
export default function ConnectWalletPage() {
  return (
    <main className="grid min-h-svh place-items-center bg-[#f6f8fb] p-6">
      <section className="w-full max-w-md rounded-3xl bg-white p-8">
        <h1 className="text-2xl font-semibold">Connect to Phantom</h1>
        <p className="my-5 text-sm leading-7 text-neutral-500">
          Share your public Solana wallet address with OmniBot. This connection
          does not request a transaction or move any funds.
        </p>
        <PhantomConnect />
        <p className="mt-5 text-xs leading-6 text-neutral-500">
          The connection stays in this browser. It does not link the wallet to
          your OmniBot account or sign you in.
        </p>
        <Link
          href="/dashboard"
          className="mt-5 inline-block text-sm text-blue-600"
        >
          Go to dashboard →
        </Link>
      </section>
    </main>
  );
}
