import { IngredientCard } from "./IngredientCard";
import type { Ingredient } from "@/types";

interface IngredientListProps {
  ingredients: Ingredient[];
}

export function IngredientList({ ingredients }: IngredientListProps) {
  const lowStock = ingredients.filter(
    (i) => i.quantity <= i.reorder_level
  ).length;

  if (ingredients.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-6xl">📦</div>
        <h3 className="text-lg font-semibold">No ingredients yet</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Add your first ingredient to start tracking inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {lowStock > 0 && (
        <div className="p-3 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <p className="text-sm text-red-700 dark:text-red-300">
            {lowStock} ingredient{lowStock !== 1 ? "s" : ""} below reorder level
          </p>
        </div>
      )}
      {ingredients.map((ingredient) => (
        <IngredientCard key={ingredient.id} ingredient={ingredient} />
      ))}
    </div>
  );
}
