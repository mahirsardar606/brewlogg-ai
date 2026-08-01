import { BatchCard } from "./BatchCard";
import type { Batch } from "@/types";
import { Beer } from "lucide-react";

interface BatchListProps {
  batches: Batch[];
}

export function BatchList({ batches }: BatchListProps) {
  if (batches.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/20 flex items-center justify-center mx-auto ring-1 ring-amber-200/50 dark:ring-amber-700/30">
          <Beer className="h-9 w-9 text-amber-600 dark:text-amber-400" />
        </div>
        <h3 className="text-lg font-semibold">No batches yet</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Your first batch is waiting. Log it now and start building your
          brewing history.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {batches.map((batch) => (
        <BatchCard key={batch.id} batch={batch} />
      ))}
    </div>
  );
}
