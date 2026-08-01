import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Target } from "lucide-react";
import type { Recipe } from "@/types";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link href={`/recipes/${recipe.id}/edit`}>
      <Card className="p-5 card-hover border border-border/50">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
              <Book className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold truncate">{recipe.name}</h3>
              {recipe.style && <p className="text-xs text-muted-foreground">{recipe.style}</p>}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {recipe.target_og && <Badge variant="secondary" className="text-xs font-medium">OG {recipe.target_og}</Badge>}
            {recipe.target_fg && <Badge variant="secondary" className="text-xs font-medium">FG {recipe.target_fg}</Badge>}
            {recipe.target_abv && (
              <Badge className="text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-0">
                {recipe.target_abv}% ABV
              </Badge>
            )}
            {recipe.target_ibu && <Badge variant="secondary" className="text-xs font-medium">{recipe.target_ibu} IBU</Badge>}
          </div>

          {recipe.yeast && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Target className="h-3 w-3" /> Yeast: {recipe.yeast}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
