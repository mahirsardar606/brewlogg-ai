"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Trash2, Package } from "lucide-react";
import { toast } from "sonner";
import type { BatchIngredientWithName, Ingredient } from "@/types";
import { addIngredientToBatch, removeIngredientFromBatch } from "@/lib/actions/batch-ingredient-actions";

interface BatchIngredientPanelProps {
  batchId: string;
  ingredients: Ingredient[];
  batchIngredients: BatchIngredientWithName[];
}

const TYPE_COLORS: Record<string, string> = {
  malt: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
  hops: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
  yeast: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};

export function BatchIngredientPanel({ batchId, ingredients: allIngredients, batchIngredients }: BatchIngredientPanelProps) {
  const [selectedIngredientId, setSelectedIngredientId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!selectedIngredientId || !quantity) { toast.error("Select an ingredient and enter quantity"); return; }
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) { toast.error("Quantity must be a positive number"); return; }
    setAdding(true);
    const result = await addIngredientToBatch(batchId, selectedIngredientId, qty);
    if (result.success) { toast.success(result.message); setSelectedIngredientId(""); setQuantity(""); }
    else { toast.error(result.message); }
    setAdding(false);
  };

  const handleRemove = async (biId: string) => {
    setRemovingId(biId);
    const result = await removeIngredientFromBatch(biId, batchId);
    if (!result.success) toast.error(result.message);
    setRemovingId(null);
  };

  const usedIngredientIds = new Set(batchIngredients.map((bi) => bi.ingredient_id));
  const availableIngredients = allIngredients.filter((i) => !usedIngredientIds.has(i.id));

  return (
    <Card className="border border-border/50 shadow-card">
      <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="h-5 w-5 text-amber-600" />
          Ingredients Used
        </CardTitle>
        <CardDescription>Ingredients consumed in this batch. Stock is auto-decremented.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {batchIngredients.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">No ingredients recorded for this batch yet.</p>
        ) : (
          <div className="space-y-2">
            {batchIngredients.map((bi) => (
              <div key={bi.id} className="flex items-center justify-between p-3 rounded-xl border bg-muted/30 border-border/50">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className={`text-xs font-medium ${TYPE_COLORS[bi.ingredient_type] || ""}`}>
                    {bi.ingredient_type}
                  </Badge>
                  <span className="text-sm font-medium">{bi.ingredient_name}</span>
                  <span className="text-sm text-muted-foreground">{bi.quantity_used} {bi.ingredient_unit}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0 rounded-lg" onClick={() => handleRemove(bi.id)} disabled={removingId === bi.id}>
                  {removingId === bi.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </Button>
              </div>
            ))}
          </div>
        )}

        <Separator />

        {availableIngredients.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Add Ingredient</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="ingredient-select">Ingredient</Label>
                <select id="ingredient-select" value={selectedIngredientId} onChange={(e) => setSelectedIngredientId(e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="">Select...</option>
                  {availableIngredients.map((ing) => (
                    <option key={ing.id} value={ing.id}>{ing.name} ({ing.quantity} {ing.unit} in stock)</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ingredient-qty">Quantity Used</Label>
                <Input id="ingredient-qty" type="number" step="0.01" min="0.01" placeholder="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="rounded-lg" />
              </div>
            </div>
            <Button onClick={handleAdd} disabled={adding || !selectedIngredientId || !quantity} size="sm" className="rounded-lg">
              {adding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Add to Batch
            </Button>
          </div>
        )}

        {availableIngredients.length === 0 && allIngredients.length > 0 && (
          <p className="text-sm text-muted-foreground">All ingredients have been added to this batch.</p>
        )}
      </CardContent>
    </Card>
  );
}
