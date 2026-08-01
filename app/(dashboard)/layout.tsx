import { Metadata } from "next";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { MobileNav } from "@/components/layout/MobileNav";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Dashboard | BrewLog.ai",
};

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />
      <div className="md:pl-64">
        <DashboardNavbar />
        <main className="flex-1 pb-20 md:pb-8">{children}</main>
        <MobileNav />
      </div>
    </div>
  );
}
