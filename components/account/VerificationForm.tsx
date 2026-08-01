"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
import { Loader2, Building2 } from "lucide-react";

export function VerificationForm() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [companyNumber, setCompanyNumber] = useState("");
  const [businessType, setBusinessType] = useState("llc");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to verify");
        return;
      }

      const { error } = await supabase.from("verifications").insert({
        user_id: user.id,
        company_name: companyName,
        company_number: companyNumber,
        business_type: businessType,
        status: "pending",
      } as never);

      if (error) {
        toast.error(error.message);
        return;
      }

      await supabase.from("profiles").update({
        verification_status: "pending",
      } as never).eq("id", user.id);

      toast.success("Verification submitted! Admin will review shortly.");
      router.refresh();
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-amber-600" />
          <div>
            <CardTitle>Business Verification</CardTitle>
            <CardDescription>
              Verify your business to unlock all features
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Legal Name</Label>
            <Input
              id="company-name"
              type="text"
              placeholder="e.g. Hoppy Trails Brewing Co."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-number">Company Registration Number</Label>
            <Input
              id="company-number"
              type="text"
              placeholder="e.g. LLC-123456"
              value={companyNumber}
              onChange={(e) => setCompanyNumber(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business-type">Business Type</Label>
            <select
              id="business-type"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              disabled={loading}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="llc">LLC</option>
              <option value="corporation">Corporation</option>
              <option value="sole_proprietorship">Sole Proprietorship</option>
              <option value="partnership">Partnership</option>
              <option value="other">Other</option>
            </select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Building2 className="mr-2 h-4 w-4" />
            )}
            Submit for Verification
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
