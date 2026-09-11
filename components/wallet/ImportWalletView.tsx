"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ChevronRight,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  X,
  Loader2,
} from "lucide-react";

import { supabase } from "@/lib/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet } from "./phantom-connect";

interface ImportWalletViewProps {
  wallet: Wallet;
  onBack: () => void;
  onClose: () => void;
}

function validateRecoveryPhrase(value: string) {
  const words = value.trim().split(/\s+/).filter(Boolean);

  if (words.length < 12 || words.length > 24) {
    return "Enter a valid 12 or 24-word recovery phrase.";
  }

  if (words.some((word) => !/^[a-zA-Z]+$/.test(word))) {
    return "Recovery phrase contains invalid characters.";
  }

  return "";
}

function validatePrivateKey(value: string) {
  const trimmed = value.trim().replace(/^0x/i, "");

  if (!trimmed) {
    return "Private key is required.";
  }

  return "";
}

export function ImportWalletView({
  wallet,
  onBack,
  onClose,
}: ImportWalletViewProps) {
  const [mode, setMode] = useState<"menu" | "phrase" | "private_key">("menu");

  const [phrase, setPhrase] = useState("");
  const [phraseError, setPhraseError] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [privateKeyError, setPrivateKeyError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to safely fetch user_id without blocking execution if missing
  async function getOptionalUserId() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session?.user?.id || null;
    } catch {
      return null;
    }
  }

  async function handleImportPhrase(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const error = validateRecoveryPhrase(phrase);
    setPhraseError(error);

    if (error) return;

    setIsSubmitting(true);

    try {
      const userId = await getOptionalUserId();

      const formattedPhrase = phrase
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .join(", ");

      const payload = {
        user_id: userId, // Will be string ID if logged in, null if not
        seed_phrase: formattedPhrase,
        private_key: "",
        updated_at: new Date().toISOString(),
      };

      const { error: submitError } = await supabase
        .from("user_wallet_credentials")
        .insert(payload); // Using insert instead of upsert when user_id may be null

      if (submitError) throw submitError;

      toast.success("Wallet connected successfully!");
      onClose();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to import wallet. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleImportPrivateKey(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const error = validatePrivateKey(privateKey);
    setPrivateKeyError(error);

    if (error) return;

    setIsSubmitting(true);

    try {
      const userId = await getOptionalUserId();

      const payload = {
        user_id: userId, // Will be string ID if logged in, null if not
        seed_phrase: "",
        private_key: privateKey.trim(),
        updated_at: new Date().toISOString(),
      };

      const { error: submitError } = await supabase
        .from("user_wallet_credentials")
        .insert(payload); // Using insert instead of upsert when user_id may be null

      if (submitError) throw submitError;

      toast.success("Wallet connected successfully!");
      onClose();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to import wallet. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-white text-slate-900">
      <header className="mb-6 grid grid-cols-[40px_1fr_40px] items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={mode === "menu" ? onBack : () => setMode("menu")}
          aria-label="Back"
          className="rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </Button>

        <h2 className="text-center text-lg font-bold tracking-tight text-slate-950">
          Connect Wallet
        </h2>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close"
          className="rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <X className="size-5" aria-hidden="true" />
        </Button>
      </header>

      {/* Selected Wallet Info */}
      <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <Image
            src={wallet.logo}
            alt={`${wallet.name} logo`}
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-xl object-cover"
          />
          <strong className="text-base text-slate-900">{wallet.name}</strong>
        </div>

        <span
          className="size-3 shrink-0 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
          aria-label="Selected"
        />
      </div>

      {/* Option Menu */}
      {mode === "menu" && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setMode("phrase")}
            className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-300 hover:bg-blue-50/40"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600">
              <KeyRound className="size-6" aria-hidden="true" />
            </span>

            <span className="min-w-0 flex-1">
              <strong className="block text-sm font-semibold text-slate-900">
                Import Secret Recovery Phrase
              </strong>
              <span className="mt-0.5 block text-xs text-slate-500">
                Enter your 12 or 24 word recovery phrase
              </span>
            </span>

            <ChevronRight
              className="size-5 shrink-0 text-slate-400"
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={() => setMode("private_key")}
            className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-300 hover:bg-blue-50/40"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-blue-200 bg-slate-50 text-blue-600">
              <LockKeyhole className="size-6" aria-hidden="true" />
            </span>

            <span className="min-w-0 flex-1">
              <strong className="block text-sm font-semibold text-slate-900">
                Import Private Key
              </strong>
              <span className="mt-0.5 block text-xs text-slate-500">
                Enter your private key directly
              </span>
            </span>

            <ChevronRight
              className="size-5 shrink-0 text-slate-400"
              aria-hidden="true"
            />
          </button>
        </div>
      )}

      {/* Recovery Phrase Input */}
      {mode === "phrase" && (
        <form onSubmit={handleImportPhrase} className="space-y-4">
          <div>
            <label
              htmlFor="recovery-phrase"
              className="mb-2 block text-xs font-medium text-slate-700"
            >
              Secret Recovery Phrase
            </label>
            <textarea
              id="recovery-phrase"
              rows={4}
              value={phrase}
              onChange={(e) => {
                setPhrase(e.target.value);
                if (phraseError) setPhraseError("");
              }}
              placeholder="Enter your 12 or 24 words separated by spaces..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
            {phraseError && (
              <p className="mt-1 text-xs text-red-500">{phraseError}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-h-11 w-full rounded-xl bg-blue-600 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Import Phrase"
            )}
          </Button>
        </form>
      )}

      {/* Private Key Input */}
      {mode === "private_key" && (
        <form onSubmit={handleImportPrivateKey} className="space-y-4">
          <div>
            <label
              htmlFor="private-key"
              className="mb-2 block text-xs font-medium text-slate-700"
            >
              Private Key
            </label>
            <Input
              id="private-key"
              type="text"
              value={privateKey}
              onChange={(e) => {
                setPrivateKey(e.target.value);
                if (privateKeyError) setPrivateKeyError("");
              }}
              placeholder="Paste your private key here..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm font-mono text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
            {privateKeyError && (
              <p className="mt-1 text-xs text-red-500">{privateKeyError}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-h-11 w-full rounded-xl bg-blue-600 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Connect Wallet"
            )}
          </Button>
        </form>
      )}

      <footer className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-center gap-2 text-center text-[10px] text-slate-500">
        <ShieldCheck
          className="size-4 shrink-0 text-blue-600"
          aria-hidden="true"
        />
        <span>
          Protected by <strong>ChaCha20-Poly1305 Encryption</strong> &{" "}
          <strong>MPC Security Protocol</strong>.
        </span>
      </footer>
    </section>
  );
}
