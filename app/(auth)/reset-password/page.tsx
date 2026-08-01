"use client";

import { useState, useEffect } from "react";
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
import { Loader2, Lock, ArrowLeft } from "lucide-react";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validSession, setValidSession] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setValidSession(!!session);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) { toast.error(error.message); return; }
      toast.success("Password updated successfully");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch {
      toast.error("An unexpected error occurred");
    } finally { setLoading(false); }
  };

  if (!validSession) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
          <Lock className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Invalid or expired link</h3>
          <p className="text-sm text-muted-foreground">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
        </div>
        <Link href="/forgot-password">
          <Button className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white">
            Request new link
          </Button>
        </Link>
        <p className="text-sm text-muted-foreground">
          <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium transition-colors">
            <ArrowLeft className="h-4 w-4 inline mr-1" />
            Back to login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">New password</Label>
        <div className="relative group/input">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/input:text-amber-600 transition-colors" />
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} disabled={loading} className="pl-9 h-12 rounded-xl border-border/60 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 transition-all" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</Label>
        <div className="relative group/input">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/input:text-amber-600 transition-colors" />
          <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} disabled={loading} className="pl-9 h-12 rounded-xl border-border/60 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 transition-all" />
        </div>
      </div>

      <Button type="submit" className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-lg shadow-amber-600/20 font-medium text-base hover:scale-[1.01] transition-transform" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Update password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <Card className="border border-border/60 shadow-2xl rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-orange-500 px-8 py-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2)_0%,_transparent_60%)]" />
          <div className="relative">
            <h1 className="text-2xl font-bold text-white">Set new password</h1>
            <p className="text-amber-100 text-sm mt-1">Choose a strong password</p>
          </div>
        </div>
        <CardContent className="pt-8 pb-8 px-8">
          <ResetPasswordForm />
          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium transition-colors">
              <ArrowLeft className="h-4 w-4 inline mr-1" />
              Back to login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
