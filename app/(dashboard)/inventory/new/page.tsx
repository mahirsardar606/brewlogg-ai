import { IngredientForm } from "@/components/inventory/IngredientForm";
import { createIngredient } from "@/lib/actions/inventory-actions";

export default function NewIngredientPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <IngredientForm action={createIngredient as unknown as (prevState: unknown, formData: FormData) => Promise<Record<string, unknown>>} />
    </div>
  );
}
