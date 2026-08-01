"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const batchSchema = z.object({
  date: z.string().min(1, "Date is required"),
  beer_name: z.string().min(1, "Beer name is required"),
  batch_number: z.coerce.number().int().positive("Batch number must be positive"),
  og: z.coerce.number().positive().nullable().optional(),
  fg: z.coerce.number().positive().nullable().optional(),
  abv: z.coerce.number().min(0).max(100).nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type BatchFormState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

export async function createBatch(
  prevState: BatchFormState,
  formData: FormData
): Promise<BatchFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "You must be logged in.", success: false };
  }

  const rawData = {
    date: formData.get("date"),
    beer_name: formData.get("beer_name"),
    batch_number: formData.get("batch_number"),
    og: formData.get("og") || null,
    fg: formData.get("fg") || null,
    abv: formData.get("abv") || null,
    notes: formData.get("notes") || null,
  };

  const validated = batchSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Invalid form data. Please check your inputs.",
      success: false,
    };
  }

  const { date, beer_name, batch_number, og, fg, abv, notes } =
    validated.data;

  // Auto-calculate ABV if OG and FG are present
  let calculatedAbv = abv ?? null;
  if (og && fg && !abv) {
    calculatedAbv = parseFloat(((og - fg) * 131.25).toFixed(2));
  }

  const { error } = await supabase.from("batches").insert({
    user_id: user.id,
    date,
    beer_name,
    batch_number,
    og: og ?? null,
    fg: fg ?? null,
    abv: calculatedAbv,
    notes: notes ?? null,
  } as never);

  if (error) {
    if (error.message.includes("Free plan limit reached")) {
      return {
        message:
          "Free trial limit reached (max 2 batches). Upgrade to Pro for unlimited batches.",
        success: false,
      };
    }
    return { message: error.message, success: false };
  }

  revalidatePath("/dashboard");
  return { success: true, message: "Batch created successfully!" };
}

export async function updateBatch(
  batchId: string,
  prevState: BatchFormState,
  formData: FormData
): Promise<BatchFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "You must be logged in.", success: false };
  }

  const rawData = {
    date: formData.get("date"),
    beer_name: formData.get("beer_name"),
    batch_number: formData.get("batch_number"),
    og: formData.get("og") || null,
    fg: formData.get("fg") || null,
    abv: formData.get("abv") || null,
    notes: formData.get("notes") || null,
  };

  const validated = batchSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Invalid form data.",
      success: false,
    };
  }

  const { date, beer_name, batch_number, og, fg, abv, notes } =
    validated.data;

  let calculatedAbv = abv ?? null;
  if (og && fg && !abv) {
    calculatedAbv = parseFloat(((og - fg) * 131.25).toFixed(2));
  }

  const { error } = await supabase
    .from("batches")
    .update({
      date,
      beer_name,
      batch_number,
      og: og ?? null,
      fg: fg ?? null,
      abv: calculatedAbv,
      notes: notes ?? null,
    } as never)
    .eq("id", batchId)
    .eq("user_id", user.id);

  if (error) {
    return { message: error.message, success: false };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/batches/${batchId}`);
  return { success: true, message: "Batch updated successfully!" };
}

export async function deleteBatch(batchId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("batches")
    .delete()
    .eq("id", batchId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

