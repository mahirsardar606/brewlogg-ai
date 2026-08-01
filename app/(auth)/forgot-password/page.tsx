"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Mail, ArrowLeft } from "lucide-react";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) { toast.error(error.message); return; }
      setSent(true);
      toast.success("Check your email for a password reset link");
    } catch {
      toast.error("An unexpected error occurred");
    } finally { setLoading(false); }
  };

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
          <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Check your email</h3>
          <p className="text-sm text-muted-foreground">
            We sent a password reset link to <span className="font-medium">{email}</span>
          </p>
        </div>
        <Link href="/login">
          <Button variant="outline" className="mt-4 rounded-xl">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
        <div className="relative group/input">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/input:text-amber-600 transition-colors" />
          <Input id="email" type="email" placeholder="brewer@brewery.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} className="pl-9 h-12 rounded-xl border-border/60 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 transition-all" />
        </div>
      </div>

      <Button type="submit" className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-lg shadow-amber-600/20 font-medium text-base hover:scale-[1.01] transition-transform" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Send reset link
      </Button>
    </form>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <Card className="border border-border/60 shadow-2xl rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-orange-500 px-8 py-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2)_0%,_transparent_60%)]" />
          <div className="relative">
            <h1 className="text-2xl font-bold text-white">Reset password</h1>
            <p className="text-amber-100 text-sm mt-1">We&apos;ll send you a reset link</p>
          </div>
        </div>
        <CardContent className="pt-8 pb-8 px-8">
          <ForgotPasswordForm />
          <p className="text-center text-sm text-muted-foreground mt-6">
            Remember your password?{" "}
            <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium transition-colors">Log in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
