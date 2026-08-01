import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IngredientList } from "@/components/inventory/IngredientList";
import { PlusCircle, ArrowLeft } from "lucide-react";
import type { Ingredient } from "@/types";

export default async function InventoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get brewery_id for brewery-scoped inventory view
  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("brewery_id")
    .eq("id", user.id)
    .maybeSingle();

  const profile = profileRaw as { brewery_id: string } | null;

  // Fetch ingredients from all brewery members
  let ingredients: Ingredient[] = [];
  if (profile?.brewery_id) {
    const { data: members } = await supabase
      .from("profiles")
      .select("id")
      .eq("brewery_id", profile.brewery_id);

    const memberIds = (members ?? []).map((m: { id: string }) => m.id);

    const { data: ingredientsRaw } = await supabase
      .from("ingredients")
      .select("*")
      .in("user_id", memberIds)
      .order("name", { ascending: true });

    ingredients = (ingredientsRaw ?? []) as Ingredient[];
  }
  const lowStockCount = ingredients.filter(
    (i) => i.quantity <= i.reorder_level
  ).length;

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
          <h1 className="text-2xl font-bold mt-2">Inventory</h1>
          <p className="text-sm text-muted-foreground">
            {ingredients.length} ingredient{ingredients.length !== 1 ? "s" : ""}
            {lowStockCount > 0
              ? ` · ${lowStockCount} below reorder level`
              : ""}
          </p>
        </div>
        <Link href="/inventory/new">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Ingredient
          </Button>
        </Link>
      </div>

      <IngredientList ingredients={ingredients} />
    </div>
  );
}

