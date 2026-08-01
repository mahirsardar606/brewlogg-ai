"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ingredientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["malt", "hops", "yeast", "other"]),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  unit: z.string().min(1, "Unit is required"),
  reorder_level: z.coerce.number().min(0, "Reorder level cannot be negative"),
});

export type IngredientFormState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

export async function createIngredient(
  prevState: IngredientFormState,
  formData: FormData
): Promise<IngredientFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "You must be logged in.", success: false };
  }

  const validated = ingredientSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    quantity: formData.get("quantity"),
    unit: formData.get("unit"),
    reorder_level: formData.get("reorder_level"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Invalid form data.",
      success: false,
    };
  }

  const { error } = await supabase
    .from("ingredients")
    .insert({
      user_id: user.id,
      ...validated.data,
    } as never);

  if (error) {
    return { message: error.message, success: false };
  }

  revalidatePath("/inventory");
  return { success: true, message: "Ingredient added!" };
}

export async function updateIngredient(
  ingredientId: string,
  prevState: IngredientFormState,
  formData: FormData
): Promise<IngredientFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "You must be logged in.", success: false };
  }

  const validated = ingredientSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    quantity: formData.get("quantity"),
    unit: formData.get("unit"),
    reorder_level: formData.get("reorder_level"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Invalid form data.",
      success: false,
    };
  }

  const { error } = await supabase
    .from("ingredients")
    .update(validated.data as never)
    .eq("id", ingredientId)
    .eq("user_id", user.id);

  if (error) {
    return { message: error.message, success: false };
  }

  revalidatePath("/inventory");
  return { success: true, message: "Ingredient updated!" };
}

export async function deleteIngredient(ingredientId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Not authenticated" };
  }

  const { error } = await supabase
    .from("ingredients")
    .delete()
    .eq("id", ingredientId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/inventory");
  return { success: true };
}
