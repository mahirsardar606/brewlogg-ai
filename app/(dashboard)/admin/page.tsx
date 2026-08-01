import { createClient, createAdminClient } from "@/lib/supabase/server";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { logAudit } from "@/lib/actions/audit-actions";
import { approveUser, rejectUser, approveVerification, rejectVerification } from "@/lib/actions/admin-actions";

async function getUsers() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("id, email, role, plan_tier, approval_status, verification_status, created_at")
    .order("created_at", { ascending: false });

  return users ?? [];
}

async function getVerifications() {
  const supabase = await createClient();
  const { data: verifications } = await supabase
    .from("verifications")
    .select("id, user_id, company_name, company_number, business_type, status, submitted_at")
    .order("submitted_at", { ascending: false });

  return verifications ?? [];
}

export default async function AdminPage() {
  const users = await getUsers();
  const verifications = await getVerifications();
  const verificationMap = new Map(verifications.map(v => [v.user_id, v]));

  return (
    <AdminGuard>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage users, verifications, and subscriptions</p>
          </div>
        </div>

        {/* Users Table */}
        <Card className="overflow-hidden mb-8">
          <div className="px-4 py-3 border-b border-border/60 bg-muted/30">
            <h2 className="font-semibold">Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Role</th>
                  <th className="text-left px-4 py-3 font-medium">Plan</th>
                  <th className="text-left px-4 py-3 font-medium">Approval</th>
                  <th className="text-left px-4 py-3 font-medium">Verification</th>
                  <th className="text-left px-4 py-3 font-medium">Joined</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const verification = verificationMap.get(user.id);
                  return (
                    <tr key={user.id} className="border-t hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium">{user.email}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={user.plan_tier === "pro" ? "default" : "outline"} className="capitalize">
                          {user.plan_tier}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            user.approval_status === "approved" ? "default" :
                            user.approval_status === "rejected" ? "destructive" :
                            "secondary"
                          }
                          className="capitalize"
                        >
                          {user.approval_status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {verification ? (
                          <Badge
                            variant={
                              verification.status === "approved" ? "default" :
                              verification.status === "rejected" ? "destructive" :
                              "secondary"
                            }
                            className="capitalize"
                          >
                            {verification.status.replace("_", " ")}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {user.approval_status === "pending" && (
                            <>
                              <form action={approveUser.bind(null, user.id)}>
                                <Button type="submit" size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-white">
                                  Approve
                                </Button>
                              </form>
                              <form action={rejectUser.bind(null, user.id)}>
                                <Button type="submit" variant="destructive" size="sm" className="h-8">
                                  Reject
                                </Button>
                              </form>
                            </>
                          )}
                          <form action={async () => {
                            const supabase = createAdminClient();
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const adminAuth = supabase.auth.admin as any;
                            const { error } = await adminAuth.resetPasswordForEmail(user.email, {
                              redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
                            });
                            if (error) {
                              toast.error(error.message);
                            } else {
                              await logAudit(user.id, "admin.password_reset", { targetEmail: user.email });
                              toast.success("Password reset email sent");
                            }
                          }}>
                            <Button type="submit" variant="ghost" size="sm" className="h-8">
                              Reset Password
                            </Button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Verifications Table */}
        <Card className="overflow-hidden">
          <div className="px-4 py-3 border-b border-border/60 bg-muted/30">
            <h2 className="font-semibold">Business Verifications</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Company</th>
                  <th className="text-left px-4 py-3 font-medium">Company #</th>
                  <th className="text-left px-4 py-3 font-medium">Type</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Submitted</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {verifications.map((verification) => (
                  <tr key={verification.id} className="border-t hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{verification.company_name}</td>
                    <td className="px-4 py-3 font-mono text-xs">{verification.company_number}</td>
                    <td className="px-4 py-3 capitalize">{verification.business_type}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          verification.status === "approved" ? "default" :
                          verification.status === "rejected" ? "destructive" :
                          "secondary"
                        }
                        className="capitalize"
                      >
                        {verification.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(verification.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {verification.status === "pending" && (
                        <div className="flex items-center justify-end gap-2">
                          <form action={approveVerification.bind(null, verification.id)}>
                            <Button type="submit" size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-white">
                              Approve
                            </Button>
                          </form>
                          <form action={rejectVerification.bind(null, verification.id)}>
                            <Button type="submit" variant="destructive" size="sm" className="h-8">
                              Reject
                            </Button>
                          </form>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminGuard>
  );
}
