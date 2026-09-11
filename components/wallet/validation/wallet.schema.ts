import { z } from "zod";

export const recoveryPhraseSchema = z.object({
  phrase: z
    .string()
    .trim()
    .min(1, "Recovery phrase is required")
    .refine(
      (val) => {
        const words = val.trim().split(/\s+/).filter(Boolean);
        return words.length === 12 || words.length === 24;
      },
      { message: "Recovery phrase must contain exactly 12 or 24 words" },
    ),
});

export const privateKeySchema = z.object({
  privateKey: z
    .string()
    .trim()
    .min(1, "Private key is required")
    .refine(
      (val) => {
        const cleanKey = val.startsWith("0x") ? val.slice(2) : val;
        // Base58 (Solana ~87-88 chars) or Hex (EVM 64 chars) format check
        return (
          /^[0-9a-fA-F]{64}$/.test(cleanKey) ||
          /^[1-9A-HJ-NP-Za-km-z]{87,88}$/.test(cleanKey)
        );
      },
      { message: "Please enter a valid Hex (64 chars) or Base58 private key" },
    ),
});

export type RecoveryPhraseInput = z.infer<typeof recoveryPhraseSchema>;
export type PrivateKeyInput = z.infer<typeof privateKeySchema>;
