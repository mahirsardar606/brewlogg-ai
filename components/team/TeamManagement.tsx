"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  Mail,
  UserMinus,
  UserCog,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { inviteBrewer, removeTeamMember } from "@/lib/actions/team-actions";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/types";

interface TeamMember {
  id: string;
  email: string;
  role: UserRole;
  brewery_name: string | null;
  created_at: string;
}

interface TeamManagementProps {
  members: TeamMember[];
  currentUserId: string;
  currentUserRole: UserRole;
}

export function TeamManagement({
  members,
  currentUserId,
  currentUserRole,
}: TeamManagementProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const isOwner = currentUserRole === "owner";

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSending(true);
    const formData = new FormData();
    formData.set("email", email);
    const result = await inviteBrewer(formData);
    if (result.success) {
      toast.success(result.message);
      setEmail("");
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setSending(false);
  };

  const handleRemove = async (memberId: string, memberEmail: string) => {
    if (
      !confirm(
        `Remove ${memberEmail} from the brewery? Their batches and data will be deleted.`
      )
    )
      return;

    setRemovingId(memberId);
    const result = await removeTeamMember(memberId);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setRemovingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Team Members List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-amber-600" />
            Team Members
          </CardTitle>
          <CardDescription>
            Everyone with access to your brewery&apos;s data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map((member) => {
              const isCurrentUser = member.id === currentUserId;
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                      <User className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {member.email}
                        {isCurrentUser && (
                          <span className="text-xs text-muted-foreground ml-2">
                            (you)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        member.role === "owner"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      }`}
                    >
                      {member.role}
                    </span>
                    {isOwner && !isCurrentUser && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive h-8 w-8 p-0"
                        onClick={() => handleRemove(member.id, member.email)}
                        disabled={removingId === member.id}
                        title="Remove from team"
                      >
                        {removingId === member.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <UserMinus className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Invite Form — only visible to owners */}
      {isOwner && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-amber-600" />
              Invite a Brewer
            </CardTitle>
            <CardDescription>
              Send an email invitation. Brewers can log and view batches but
              cannot access billing or manage the team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="invite-email" className="sr-only">
                  Email address
                </Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="brewer@brewery.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={sending}
                />
              </div>
              <Button
                type="submit"
                disabled={sending || !email}
                className="bg-amber-600 hover:bg-amber-700 text-white shrink-0"
              >
                {sending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                Send Invite
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Brewer permissions info */}
      {isOwner && (
        <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Brewer permissions:</strong> Can create and view batches,
            manage inventory. Cannot access billing, account settings, or
            invite other team members.
          </p>
        </div>
      )}
    </div>
  );
}
