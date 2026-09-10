import { z } from "zod";

export const botSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter a bot name with at least 2 characters.")
    .max(60),
  strategy: z.enum(["Trend following", "Dollar-cost averaging", "Buy the dip"]),
  asset: z.enum(["BTC", "ETH", "SOL"]),
  budget: z.coerce
    .number()
    .min(10, "Allocation must be at least $10.")
    .max(1000000),
  stopLoss: z.coerce
    .number()
    .min(1, "Stop loss must be between 1% and 50%.")
    .max(50, "Stop loss must be between 1% and 50%."),
});
export type SavedBot = z.infer<typeof botSchema> & { id: string };
