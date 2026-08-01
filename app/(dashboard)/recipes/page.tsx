import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RecipeList } from "@/components/recipes/RecipeList";
import { PlusCircle } from "lucide-react";
import type { Recipe } from "@/types";

export default async function RecipesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get brewery_id
  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("brewery_id")
    .eq("id", user.id)
    .maybeSingle();

  const profile = profileRaw as { brewery_id: string } | null;

  if (!profile?.brewery_id) {
    redirect("/dashboard");
  }

  // Fetch all brewery recipes
  let recipes: Recipe[] = [];
  if (profile?.brewery_id) {
    const { data: members } = await supabase
      .from("profiles")
      .select("id")
      .eq("brewery_id", profile.brewery_id);

    const memberIds = (members ?? []).map((m: { id: string }) => m.id);

    const { data: recipesRaw } = await supabase
      .from("recipes")
      .select("*")
      .in("user_id", memberIds)
      .order("name", { ascending: true });

    recipes = (recipesRaw ?? []) as Recipe[];
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Recipes</h1>
          <p className="text-sm text-muted-foreground">
            {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/recipes/new">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Recipe
          </Button>
        </Link>
      </div>

      <RecipeList recipes={recipes} />
    </div>
  );
}

