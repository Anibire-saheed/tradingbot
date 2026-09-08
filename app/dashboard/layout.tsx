import type { ReactNode } from "react";
import { CommunityActivity } from "@/components/sections/community-activity";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <CommunityActivity />
    </>
  );
}
