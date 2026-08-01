import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { BatchForm } from "@/components/batches/BatchForm";
import { BatchDetail } from "@/components/batches/BatchDetail";
import { BatchIngredientPanel } from "@/components/inventory/BatchIngredientPanel";
import { updateBatch } from "@/lib/actions/batch-actions";
import type { Batch, Ingredient, BatchIngredientWithName } from "@/types";

interface BatchPageProps {
  params: Promise<{ id: string }>;
}

export default async function BatchPage({ params }: BatchPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get current user's brewery_id
  const { data: currentProfileRaw } = await supabase
    .from("profiles")
    .select("brewery_id")
    .eq("id", user.id)
    .maybeSingle();

  const currentProfile = currentProfileRaw as { brewery_id: string } | null;

  // Look up batch by id, then verify it belongs to the same brewery
  const { data: batchRaw } = await supabase
    .from("batches")
    .select("*")
    .eq("id", id)
    .single();

  const batch = batchRaw as Batch | null;

  // Verify the batch belongs to a member of this user's brewery
  if (!batch || !currentProfile?.brewery_id) {
    notFound();
  }

  const { data: batchOwnerProfile } = await supabase
    .from("profiles")
    .select("brewery_id")
    .eq("id", batch.user_id)
    .single();

  const batchOwner = batchOwnerProfile as { brewery_id: string } | null;
  if (!batchOwner || batchOwner.brewery_id !== currentProfile.brewery_id) {
    notFound();
  }

  const canEdit = batch.user_id === user.id;
  const updateAction = canEdit ? updateBatch.bind(null, id) : null;

  // Get all member IDs in the brewery for ingredient fetching
  const { data: breweryMembers } = await supabase
    .from("profiles")
    .select("id")
    .eq("brewery_id", currentProfile.brewery_id);

  const memberIds = (breweryMembers ?? []).map((m: { id: string }) => m.id);

  // Fetch all brewery ingredients (not just the current user's)
  const { data: ingredientsRaw } = await supabase
    .from("ingredients")
    .select("*")
    .in("user_id", memberIds)
    .order("name", { ascending: true });

  const ingredients = (ingredientsRaw ?? []) as Ingredient[];

  // Fetch batch ingredients with ingredient details
  const { data: batchIngredientsRaw } = await supabase
    .from("batch_ingredients")
    .select(`
      id,
      batch_id,
      ingredient_id,
      quantity_used,
      created_at,
      ingredients!inner(name, type, unit)
    `)
    .eq("batch_id", id);

  const batchIngredients: BatchIngredientWithName[] = (batchIngredientsRaw ?? []).map(
    (bi: Record<string, unknown>) => ({
      id: bi.id as string,
      batch_id: bi.batch_id as string,
      ingredient_id: bi.ingredient_id as string,
      quantity_used: bi.quantity_used as number,
      created_at: bi.created_at as string,
      ingredient_name: ((bi.ingredients as Record<string, unknown>)?.name as string) ?? "",
      ingredient_type: ((bi.ingredients as Record<string, unknown>)?.type as string) as BatchIngredientWithName["ingredient_type"],
      ingredient_unit: ((bi.ingredients as Record<string, unknown>)?.unit as string) ?? "",
    })
  );

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 space-y-8">
      <BatchDetail batch={batch} />
      <BatchIngredientPanel
        batchId={batch.id}
        ingredients={ingredients}
        batchIngredients={batchIngredients}
      />
      {canEdit && (
        <div className="border-t pt-8">
          <h2 className="text-xl font-semibold mb-6">Edit Batch</h2>
          <BatchForm batch={batch} action={updateAction!} />
        </div>
      )}
    </div>
  );
}

