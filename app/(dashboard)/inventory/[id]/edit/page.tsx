import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { IngredientForm } from "@/components/inventory/IngredientForm";
import { updateIngredient } from "@/lib/actions/inventory-actions";
import type { Ingredient } from "@/types";

interface EditIngredientPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditIngredientPage({
  params,
}: EditIngredientPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: ingredientRaw } = await supabase
    .from("ingredients")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  const ingredient = ingredientRaw as Ingredient | null;

  if (!ingredient) notFound();

  const updateAction = updateIngredient.bind(null, id);

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <IngredientForm ingredient={ingredient} action={updateAction as unknown as (prevState: unknown, formData: FormData) => Promise<Record<string, unknown>>} />
    </div>
  );
}

