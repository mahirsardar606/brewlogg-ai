import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TeamManagement } from "@/components/team/TeamManagement";
import type { UserRole } from "@/types";

export default async function TeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get current user's profile
  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const profile = profileRaw as Record<string, unknown> | null;
  if (!profile) redirect("/login");

  const breweryId = profile.brewery_id as string | null;
  const currentUserRole = profile.role as UserRole;

  // Get all members of this brewery
  const { data: membersRaw } = breweryId
    ? await supabase
        .from("profiles")
        .select("*")
        .eq("brewery_id", breweryId)
        .order("created_at", { ascending: true })
    : { data: null };

  const members = ((membersRaw ?? []) as Record<string, unknown>[]).map(
    (m) => ({
      id: m.id as string,
      email: m.email as string,
      role: m.role as UserRole,
      brewery_name: (m.brewery_name as string) ?? null,
      created_at: m.created_at as string,
    })
  );

  const breweryName = profile.brewery_name as string | null;

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Team</h1>
        <p className="text-sm text-muted-foreground">
          {breweryName ? `${breweryName} -` : ""}
          {members.length} member{members.length !== 1 ? "s" : ""}
        </p>
      </div>

      <TeamManagement
        members={members}
        currentUserId={user.id}
        currentUserRole={currentUserRole}
      />
    </div>
  );
}
