import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle } from "lucide-react";
import type { Ingredient } from "@/types";

const TYPE_COLORS: Record<string, string> = {
  malt: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
  hops: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
  yeast: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};

export function IngredientCard({ ingredient }: { ingredient: Ingredient }) {
  const isLow = ingredient.quantity <= ingredient.reorder_level;

  return (
    <Link href={`/inventory/${ingredient.id}/edit`}>
      <Card className={`p-5 card-hover border border-border/50 ${isLow ? "border-red-200/50 dark:border-red-900/50" : ""}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
                <Package className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold truncate flex items-center gap-2">
                  {ingredient.name}
                  {isLow && <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />}
                </h3>
                <Badge variant="secondary" className={`text-xs font-medium mt-1 ${TYPE_COLORS[ingredient.type] || ""}`}>
                  {ingredient.type}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${isLow ? "text-red-600 dark:text-red-400" : ""}`}>
                {ingredient.quantity}
              </span>
              <span className="text-sm text-muted-foreground">{ingredient.unit}</span>
            </div>

            {isLow && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Below reorder level ({ingredient.reorder_level} {ingredient.unit})
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
