import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/account/ProfileForm";
import { SubscriptionCard } from "@/components/account/SubscriptionCard";
import { ExportForm } from "@/components/export/ExportForm";
import { VerificationForm } from "@/components/account/VerificationForm";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { Profile, UserRole } from "@/types";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const profile = profileRaw as Profile | null;
  const isOwner = (profileRaw as { role: UserRole } | null)?.role === "owner";

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Account</h1>
        <p className="text-sm text-muted-foreground">
          {isOwner
            ? "Manage your brewery profile and subscription"
            : "Your profile"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Account Status:</span>
        <Badge variant={profile.approval_status === "approved" ? "default" : "secondary"}>
          {profile.approval_status}
        </Badge>
        <Badge variant={profile.verification_status === "approved" ? "default" : "outline"}>
          {profile.verification_status}
        </Badge>
      </div>

      <ProfileForm profile={profile} />

      {isOwner && (
        <>
          <Separator />
          <SubscriptionCard planTier={profile.plan_tier} userId={profile.id} />
          <Separator />
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Business Verification</h2>
            <VerificationForm />
          </div>
          <Separator />
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Export</h2>
            <ExportForm />
          </div>
        </>
      )}

      {!isOwner && (
        <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Billing and export are managed by the brewery owner. Contact
            them for subscription changes or reports.
          </p>
        </div>
      )}
    </div>
  );
}

