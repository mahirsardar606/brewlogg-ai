"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Save, Beer } from "lucide-react";
import { toast } from "sonner";
import type { Batch } from "@/types";

interface BatchFormProps {
  batch?: Batch;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (prevState: any, formData: FormData) => Promise<any>;
}

export function BatchForm({ batch, action }: BatchFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [og, setOg] = useState(batch?.og?.toString() ?? "");
  const [fg, setFg] = useState(batch?.fg?.toString() ?? "");

  const calculateABV = useCallback((ogVal: string, fgVal: string) => {
    const ogNum = parseFloat(ogVal);
    const fgNum = parseFloat(fgVal);
    if (!isNaN(ogNum) && !isNaN(fgNum) && ogNum > 0 && fgNum > 0) {
      return ((ogNum - fgNum) * 131.25).toFixed(2);
    }
    return "";
  }, []);

  const abv = calculateABV(og, fg);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    if (abv) {
      formData.set("abv", abv);
    }

    const result = await action(null, formData);

    if (result.success) {
      toast.success((result.message as string) || "Success!");
      window.location.href = "/dashboard";
    } else {
      toast.error((result.message as string) || "Something went wrong");
      const errors = result.errors as Record<string, string[]> | undefined;
      if (errors) {
        Object.values(errors).forEach((errs) => {
          errs.forEach((err) => toast.error(err));
        });
      }
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Beer className="h-5 w-5 text-amber-600" />
          {batch ? "Edit Batch" : "New Batch"}
        </CardTitle>
        <CardDescription>
          {batch
            ? `Editing ${batch.beer_name} (Batch #${batch.batch_number})`
            : "Log a new batch from the brewery floor"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">
              Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={
                batch?.date ?? new Date().toISOString().split("T")[0]
              }
              required
              disabled={loading}
              className="touch-manipulation"
            />
          </div>

          {/* Beer Name */}
          <div className="space-y-2">
            <Label htmlFor="beer_name">
              Beer Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="beer_name"
              name="beer_name"
              type="text"
              placeholder="e.g. Hoppy IPA"
              defaultValue={batch?.beer_name ?? ""}
              required
              disabled={loading}
            />
          </div>

          {/* Batch Number */}
          <div className="space-y-2">
            <Label htmlFor="batch_number">
              Batch # <span className="text-destructive">*</span>
            </Label>
            <Input
              id="batch_number"
              name="batch_number"
              type="number"
              min="1"
              placeholder="e.g. 42"
              defaultValue={batch?.batch_number.toString() ?? ""}
              required
              disabled={loading}
            />
          </div>

          {/* OG & FG side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="og">Original Gravity (OG)</Label>
              <Input
                id="og"
                name="og"
                type="number"
                step="0.001"
                placeholder="e.g. 1.050"
                value={og}
                onChange={(e) => setOg(e.target.value)}
                disabled={loading}
                inputMode="decimal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fg">Final Gravity (FG)</Label>
              <Input
                id="fg"
                name="fg"
                type="number"
                step="0.001"
                placeholder="e.g. 1.010"
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                disabled={loading}
                inputMode="decimal"
              />
            </div>
          </div>

          {/* ABV (auto-calc) */}
          <div className="space-y-2">
            <Label htmlFor="abv">ABV (%)</Label>
            <div className="relative">
              <Input
                id="abv"
                name="abv"
                type="number"
                step="0.01"
                placeholder="Auto-calculated from OG/FG"
                value={abv || batch?.abv?.toString() || ""}
                readOnly
                disabled={loading}
                className="bg-muted"
              />
              {abv && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-600 font-medium">
                  Auto
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              ABV is auto-calculated when both OG and FG are provided: (OG -
              FG) &times; 131.25
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Yeast, fermentation notes, tasting notes..."
              defaultValue={batch?.notes ?? ""}
              disabled={loading}
              rows={4}
              className="resize-none touch-manipulation"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {batch ? "Save Changes" : "Save Batch"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
