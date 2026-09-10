"use server";

import { z } from "zod";
import { botSchema, type SavedBot } from "@/lib/bots";
import { createClient } from "@/lib/supabase/server";

const columns = "id, name, strategy, asset, budget, stopLoss:stop_loss";

export async function listSavedBots(): Promise<{ bots?: SavedBot[]; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to view your bots." };

  const { data, error } = await supabase.from("bots").select(columns)
    .eq("user_id", user.id).order("created_at", { ascending: true });
  if (error) return { error: "Could not load your saved bots. Please try again." };
  return { bots: data as SavedBot[] };
}

export async function createSavedBot(values: unknown): Promise<{ bot?: SavedBot; error?: string }> {
  const result = botSchema.safeParse(values);
  if (!result.success) return { error: result.error.issues[0].message };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to create a bot." };

  const { stopLoss, ...settings } = result.data;
  // The database trigger fills creator identity from the authenticated account.
  const { data, error } = await supabase.from("bots").insert({
    ...settings,
    stop_loss: stopLoss,
    user_id: user.id,
  }).select(columns).single();
  if (error) return { error: "Could not save your bot. Please try again." };
  return { bot: data as SavedBot };
}

export async function deleteSavedBot(id: string): Promise<{ error?: string }> {
  if (!z.uuid().safeParse(id).success) return { error: "Invalid bot ID." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to delete a bot." };

  const { error } = await supabase.from("bots").delete()
    .eq("id", id).eq("user_id", user.id);
  if (error) return { error: "Could not delete your bot. Please try again." };
  return {};
}
