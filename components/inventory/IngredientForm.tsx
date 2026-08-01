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
import { Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import type { Ingredient, IngredientType } from "@/types";

interface IngredientFormProps {
  ingredient?: Ingredient;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (prevState: unknown, formData: FormData) => Promise<Record<string, unknown>>;
}

const INGREDIENT_TYPES: { value: IngredientType; label: string }[] = [
  { value: "malt", label: "Malt" },
  { value: "hops", label: "Hops" },
  { value: "yeast", label: "Yeast" },
  { value: "other", label: "Other" },
];

const UNITS = ["kg", "g", "lb", "oz", "L", "mL", "gal", "each", "pkg"];

export function IngredientForm({ ingredient, action }: IngredientFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    // Select inputs don't automatically get values in FormData when using shadcn select
    const typeSelect = e.currentTarget.querySelector(
      "[name=type]"
    ) as HTMLSelectElement | null;
    if (typeSelect?.value) {
      formData.set("type", typeSelect.value);
    }
    const unitSelect = e.currentTarget.querySelector(
      "[name=unit]"
    ) as HTMLSelectElement | null;
    if (unitSelect?.value) {
      formData.set("unit", unitSelect.value);
    }

    const result = await action(null, formData);

    if (result.success) {
      toast.success((result.message as string) || "Saved!");
      router.push("/inventory");
      router.refresh();
    } else {
      toast.error((result.message as string) || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-amber-600" />
          {ingredient ? "Edit Ingredient" : "New Ingredient"}
        </CardTitle>
        <CardDescription>
          {ingredient
            ? `Editing ${ingredient.name}`
            : "Add an ingredient to your inventory"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Pale Ale Malt"
              defaultValue={ingredient?.name ?? ""}
              required
              disabled={loading}
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">
              Type <span className="text-destructive">*</span>
            </Label>
            <select
              id="type"
              name="type"
              defaultValue={ingredient?.type ?? "malt"}
              required
              disabled={loading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {INGREDIENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity + Unit side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">
                Quantity <span className="text-destructive">*</span>
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                step="0.01"
                min="0"
                placeholder="0"
                defaultValue={ingredient?.quantity?.toString() ?? "0"}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">
                Unit <span className="text-destructive">*</span>
              </Label>
              <select
                id="unit"
                name="unit"
                defaultValue={ingredient?.unit ?? "kg"}
                required
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reorder Level */}
          <div className="space-y-2">
            <Label htmlFor="reorder_level">Reorder Level</Label>
            <Input
              id="reorder_level"
              name="reorder_level"
              type="number"
              step="0.01"
              min="0"
              placeholder="0"
              defaultValue={ingredient?.reorder_level?.toString() ?? "0"}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              You&apos;ll be alerted when stock drops below this level
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {ingredient ? "Save Changes" : "Add Ingredient"}
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
