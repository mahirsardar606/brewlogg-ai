import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto">
          <Clock className="h-10 w-10 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Account Pending Approval</h1>
          <p className="text-muted-foreground">
            Your account is awaiting admin approval. You&apos;ll gain access to the dashboard once approved.
          </p>
        </div>
        <div className="pt-4">
          <Link href="/">
            <Button variant="outline" className="rounded-full">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
