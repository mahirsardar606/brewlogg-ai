"use client";

import { useState } from "react";
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
import { Loader2, Book } from "lucide-react";
import { toast } from "sonner";
import type { Recipe } from "@/types";

interface RecipeFormProps {
  recipe?: Recipe;
  action: (prevState: unknown, formData: FormData) => Promise<Record<string, unknown>>;
}

export function RecipeForm({ recipe, action }: RecipeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await action(null, formData);

    if (result.success) {
      toast.success(result.message as string);
      router.push("/recipes");
      router.refresh();
    } else {
      toast.error((result.message as string) || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5 text-amber-600" />
          {recipe ? "Edit Recipe" : "New Recipe"}
        </CardTitle>
        <CardDescription>
          {recipe ? `Editing ${recipe.name}` : "Create a new beer recipe"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name + Style */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
              <Input id="name" name="name" placeholder="e.g. Galaxy IPA" defaultValue={recipe?.name ?? ""} required disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Input id="style" name="style" placeholder="e.g. American IPA" defaultValue={recipe?.style ?? ""} disabled={loading} />
            </div>
          </div>

          {/* Malt Bill */}
          <div className="space-y-2">
            <Label htmlFor="malt_bill">Malt Bill</Label>
            <Textarea id="malt_bill" name="malt_bill" placeholder="e.g. 5kg Pale Malt, 0.5kg Crystal 60..." defaultValue={recipe?.malt_bill ?? ""} disabled={loading} rows={3} className="resize-none" />
          </div>

          {/* Hop Schedule */}
          <div className="space-y-2">
            <Label htmlFor="hop_schedule">Hop Schedule</Label>
            <Textarea id="hop_schedule" name="hop_schedule" placeholder="e.g. 30g Cascade @ 60min, 20g Citra @ 5min..." defaultValue={recipe?.hop_schedule ?? ""} disabled={loading} rows={3} className="resize-none" />
          </div>

          {/* Yeast */}
          <div className="space-y-2">
            <Label htmlFor="yeast">Yeast</Label>
            <Input id="yeast" name="yeast" placeholder="e.g. Safale US-05" defaultValue={recipe?.yeast ?? ""} disabled={loading} />
          </div>

          {/* Targets row */}
          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-2">
              <Label htmlFor="target_og">Target OG</Label>
              <Input id="target_og" name="target_og" type="number" step="0.001" placeholder="1.050" defaultValue={recipe?.target_og?.toString() ?? ""} disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target_fg">Target FG</Label>
              <Input id="target_fg" name="target_fg" type="number" step="0.001" placeholder="1.010" defaultValue={recipe?.target_fg?.toString() ?? ""} disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target_abv">Target ABV %</Label>
              <Input id="target_abv" name="target_abv" type="number" step="0.01" placeholder="5.5" defaultValue={recipe?.target_abv?.toString() ?? ""} disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target_ibu">Target IBU</Label>
              <Input id="target_ibu" name="target_ibu" type="number" step="0.1" placeholder="40" defaultValue={recipe?.target_ibu?.toString() ?? ""} disabled={loading} />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Mash schedule, fermentation notes, etc." defaultValue={recipe?.notes ?? ""} disabled={loading} rows={3} className="resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {recipe ? "Save Changes" : "Create Recipe"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
