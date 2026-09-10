import { WalletReturn } from "@/components/wallet/wallet-return";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Connect Phantom | OmniBot" };
export default async function ConnectWalletPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <main className="grid min-h-svh place-items-center bg-[#f6f8fb] p-6">
      <section className="w-full max-w-md rounded-3xl bg-white p-8">
        <h1 className="text-2xl font-semibold">Connect to Phantom</h1>
        <p className="my-5 text-sm leading-7 text-neutral-500">
          Share your public Solana wallet address with OmniBot. This connection
          does not request a transaction or move any funds.
        </p>
        <WalletReturn signedIn={Boolean(user)} />
      </section>
    </main>
  );
}
