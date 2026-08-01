import { RecipeForm } from "@/components/recipes/RecipeForm";
import { createRecipe } from "@/lib/actions/recipe-actions";

export default function NewRecipePage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <RecipeForm action={createRecipe as unknown as (prevState: unknown, formData: FormData) => Promise<Record<string, unknown>>} />
    </div>
  );
}
