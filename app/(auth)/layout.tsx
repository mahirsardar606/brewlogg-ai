import { Navbar } from "@/components/layout/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50/30 via-background to-background dark:from-amber-950/20 dark:via-background dark:to-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        {children}
      </main>
    </div>
  );
}
