import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TradingDashboard } from "@/components/dashboard/trading-dashboard";

export async function DashboardScreen({
  view = "Home",
  initialQuery = "",
  programDetails = false,
}: {
  view?:
    | "Home"
    | "Portfolio"
    | "Explore"
    | "Activity"
    | "Earn"
    | "Bots"
    | "Workspace"
    | "Automation"
    | "Support";
  initialQuery?: string;
  programDetails?: boolean;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const name =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : (user.email?.split("@")[0] ?? "Trader");
  return (
    <TradingDashboard
      name={name}
      view={view}
      initialQuery={initialQuery}
      programDetails={programDetails}
    />
  );
}
