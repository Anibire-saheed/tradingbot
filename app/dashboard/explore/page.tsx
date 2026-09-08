import { DashboardScreen } from "@/components/dashboard/dashboard-screen";

export const metadata = { title: "Explore | OmniBot" };

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return <DashboardScreen view="Explore" initialQuery={q ?? ""} />;
}
