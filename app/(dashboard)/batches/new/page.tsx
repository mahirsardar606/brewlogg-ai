import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BatchForm } from "@/components/batches/BatchForm";
import { RecipePicker } from "@/components/recipes/RecipePicker";
import { createBatch } from "@/lib/actions/batch-actions";
import type { Recipe } from "@/types";

export default async function NewBatchPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("brewery_id")
    .eq("id", user.id)
    .maybeSingle();

  const profile = profileRaw as { brewery_id: string } | null;

  if (!profile) {
    redirect("/login");
  }

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
    <div className="container max-w-3xl mx-auto px-4 py-8 space-y-6">
      {recipes.length > 0 && <RecipePicker recipes={recipes} />}
      <BatchForm action={createBatch} />
    </div>
  );
}
