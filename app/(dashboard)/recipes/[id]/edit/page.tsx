import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { RecipeForm } from "@/components/recipes/RecipeForm";
import { updateRecipe } from "@/lib/actions/recipe-actions";
import type { Recipe } from "@/types";

interface EditRecipePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: recipeRaw } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  const recipe = recipeRaw as Recipe | null;
  if (!recipe) notFound();

  const updateAction = updateRecipe.bind(null, id);

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <RecipeForm
        recipe={recipe}
        action={updateAction as unknown as (prevState: unknown, formData: FormData) => Promise<Record<string, unknown>>}
      />
    </div>
  );
}

