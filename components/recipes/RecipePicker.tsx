"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat } from "lucide-react";
import { toast } from "sonner";
import type { Recipe } from "@/types";

interface RecipePickerProps { recipes: Recipe[]; }

export function RecipePicker({ recipes }: RecipePickerProps) {
  const [selectedId, setSelectedId] = useState("");
  const selected = recipes.find((r) => r.id === selectedId);

  const applyRecipe = useCallback((recipe: Recipe) => {
    const setInputValue = (id: string, value: string) => {
      const input = document.getElementById(id) as HTMLInputElement | null;
      if (!input) return;
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
      nativeSetter?.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    };
    if (recipe.target_og) setInputValue("og", recipe.target_og.toString());
    if (recipe.target_fg) setInputValue("fg", recipe.target_fg.toString());
    toast.success(`"${recipe.name}" targets applied to form`);
  }, []);

  const handleSelect = (recipeId: string) => {
    setSelectedId(recipeId);
    const recipe = recipes.find((r) => r.id === recipeId);
    if (recipe) applyRecipe(recipe);
  };

  useEffect(() => { if (selectedId && selected) applyRecipe(selected); }, [selectedId, selected, applyRecipe]);

  if (recipes.length === 0) return null;

  return (
    <Card className="border border-border/50 shadow-card">
      <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ChefHat className="h-5 w-5 text-amber-600" />
          Pre-fill from Recipe
        </CardTitle>
        <CardDescription>Select a recipe to auto-populate OG, FG, and ABV targets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <select value={selectedId} onChange={(e) => handleSelect(e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <option value="">Select a recipe...</option>
            {recipes.map((r) => (
              <option key={r.id} value={r.id}>{r.name}{r.style ? ` (${r.style})` : ""}</option>
            ))}
          </select>
          {selected && (
            <div className="flex flex-wrap gap-2 pt-1">
              {selected.target_og && <Badge variant="secondary" className="text-xs font-medium">OG {selected.target_og}</Badge>}
              {selected.target_fg && <Badge variant="secondary" className="text-xs font-medium">FG {selected.target_fg}</Badge>}
              {selected.target_abv && <Badge className="text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-0">{selected.target_abv}% ABV</Badge>}
              {selected.target_ibu && <Badge variant="secondary" className="text-xs font-medium">{selected.target_ibu} IBU</Badge>}
              {selected.yeast && <Badge variant="secondary" className="text-xs font-medium">{selected.yeast}</Badge>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
