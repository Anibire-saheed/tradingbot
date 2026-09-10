import type { CookieOptions } from "@supabase/ssr";

export const REMEMBER_COOKIE = "omnibot-remember-session";
export const REMEMBER_SECONDS = 30 * 24 * 60 * 60;

export function sessionCookieOptions(
  options: CookieOptions,
  remembered: boolean,
): CookieOptions {
  // Preserve deletion cookies so sign-out and token chunk cleanup still work.
  if (options.maxAge === 0) return options;
  const next = { ...options };
  delete next.expires;
  delete next.maxAge;
  if (remembered) next.maxAge = REMEMBER_SECONDS;
  return next;
}
