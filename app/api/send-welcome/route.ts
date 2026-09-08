import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendWelcomeEmail } from "@/lib/send-welcome-email";

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
    const accessToken = authorization?.match(/^Bearer\s+(\S+)$/i)?.[1];

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !user?.email) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    if (!user.email_confirmed_at) {
      return NextResponse.json(
        { error: "Please verify your email first" },
        { status: 403 },
      );
    }

    await sendWelcomeEmail(user.email);

    return NextResponse.json({ success: true });
  } catch {
    console.error("Welcome email delivery failed.");
    return NextResponse.json(
      { error: "Unable to send welcome email" },
      { status: 500 },
    );
  }
}
