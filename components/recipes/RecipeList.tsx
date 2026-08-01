import { RecipeCard } from "./RecipeCard";
import type { Recipe } from "@/types";

interface RecipeListProps {
  recipes: Recipe[];
}

export function RecipeList({ recipes }: RecipeListProps) {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-6xl">📖</div>
        <h3 className="text-lg font-semibold">No recipes yet</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Create your first recipe so you can quickly pre-fill batch targets
          when logging a new brew.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
