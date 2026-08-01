"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [breweryName, setBreweryName] = useState(profile.brewery_name ?? "");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ brewery_name: breweryName } as never)
      .eq("id", profile.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile updated");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your brewery information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed here
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="brewery-name">Brewery Name</Label>
            <Input
              id="brewery-name"
              type="text"
              placeholder="Your Brewery Name"
              value={breweryName}
              onChange={(e) => setBreweryName(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
