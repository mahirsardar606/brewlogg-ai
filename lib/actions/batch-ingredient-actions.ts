"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addIngredientToBatch(
  batchId: string,
  ingredientId: string,
  quantityUsed: number
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Not authenticated" };
  }

  // Validate that the batch belongs to the user
  const { data: batch } = await supabase
    .from("batches")
    .select("id")
    .eq("id", batchId)
    .eq("user_id", user.id)
    .single();

  if (!batch) {
    return { success: false, message: "Batch not found" };
  }

  // Validate ingredient belongs to user and has enough stock
  const { data: ingredient } = await supabase
    .from("ingredients")
    .select("id, name, quantity")
    .eq("id", ingredientId)
    .eq("user_id", user.id)
    .single();

  if (!ingredient) {
    return { success: false, message: "Ingredient not found" };
  }

  if (ingredient.quantity < quantityUsed) {
    return {
      success: false,
      message: `Not enough ${ingredient.name} in stock (have ${ingredient.quantity}, need ${quantityUsed})`,
    };
  }

  const { error } = await supabase.from("batch_ingredients").insert({
    batch_id: batchId,
    ingredient_id: ingredientId,
    quantity_used: quantityUsed,
  } as never);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath(`/batches/${batchId}`);
  revalidatePath("/inventory");
  return { success: true, message: "Ingredient added to batch" };
}

export async function removeIngredientFromBatch(
  batchIngredientId: string,
  batchId: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Not authenticated" };
  }

  const { error } = await supabase
    .from("batch_ingredients")
    .delete()
    .eq("id", batchIngredientId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath(`/batches/${batchId}`);
  revalidatePath("/inventory");
  return { success: true, message: "Ingredient removed from batch" };
}
