import { createServerClient } from "@supabase/ssr";
import {
  REMEMBER_COOKIE,
  sessionCookieOptions,
} from "@/lib/supabase/session-options";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(
                name,
                value,
                sessionCookieOptions(
                  options,
                  cookieStore.get(REMEMBER_COOKIE)?.value === "true",
                ),
              ),
            );
          } catch {
            // setAll called from a Server Component — cookies will be set
            // by the middleware instead.
          }
        },
      },
    },
  );
}
