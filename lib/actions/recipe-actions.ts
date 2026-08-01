"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const recipeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  style: z.string().nullable().optional(),
  malt_bill: z.string().nullable().optional(),
  hop_schedule: z.string().nullable().optional(),
  yeast: z.string().nullable().optional(),
  target_og: z.coerce.number().positive().nullable().optional(),
  target_fg: z.coerce.number().positive().nullable().optional(),
  target_abv: z.coerce.number().min(0).max(100).nullable().optional(),
  target_ibu: z.coerce.number().min(0).nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function createRecipe(
  prevState: unknown,
  formData: FormData
): Promise<Record<string, unknown>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Not authenticated" };

  const validated = recipeSchema.safeParse({
    name: formData.get("name"),
    style: formData.get("style") || null,
    malt_bill: formData.get("malt_bill") || null,
    hop_schedule: formData.get("hop_schedule") || null,
    yeast: formData.get("yeast") || null,
    target_og: formData.get("target_og") || null,
    target_fg: formData.get("target_fg") || null,
    target_abv: formData.get("target_abv") || null,
    target_ibu: formData.get("target_ibu") || null,
    notes: formData.get("notes") || null,
  });

  if (!validated.success) {
    return { success: false, message: "Invalid form data", errors: validated.error.flatten().fieldErrors };
  }

  const { error } = await supabase.from("recipes").insert({
    user_id: user.id,
    ...validated.data,
  } as never);

  if (error) return { success: false, message: error.message };

  revalidatePath("/recipes");
  return { success: true, message: "Recipe created!" };
}

export async function updateRecipe(
  recipeId: string,
  prevState: unknown,
  formData: FormData
): Promise<Record<string, unknown>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Not authenticated" };

  const validated = recipeSchema.safeParse({
    name: formData.get("name"),
    style: formData.get("style") || null,
    malt_bill: formData.get("malt_bill") || null,
    hop_schedule: formData.get("hop_schedule") || null,
    yeast: formData.get("yeast") || null,
    target_og: formData.get("target_og") || null,
    target_fg: formData.get("target_fg") || null,
    target_abv: formData.get("target_abv") || null,
    target_ibu: formData.get("target_ibu") || null,
    notes: formData.get("notes") || null,
  });

  if (!validated.success) {
    return { success: false, message: "Invalid form data", errors: validated.error.flatten().fieldErrors };
  }

  const { error } = await supabase
    .from("recipes")
    .update(validated.data as never)
    .eq("id", recipeId)
    .eq("user_id", user.id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/recipes");
  return { success: true, message: "Recipe updated!" };
}

export async function deleteRecipe(recipeId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Not authenticated" };

  const { error } = await supabase
    .from("recipes")
    .delete()
    .eq("id", recipeId)
    .eq("user_id", user.id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/recipes");
  return { success: true };
}
