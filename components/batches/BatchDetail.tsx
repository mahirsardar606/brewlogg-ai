"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Beer,
  Calendar,
  Hash,
  FileDown,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import type { Batch } from "@/types";
import { deleteBatch } from "@/lib/actions/batch-actions";
import { toast } from "sonner";
import { useState } from "react";

export function BatchDetail({ batch }: { batch: Batch }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this batch? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await deleteBatch(batch.id);
      toast.success("Batch deleted");
    } catch {
      toast.error("Failed to delete batch");
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to batches
        </Link>
        <div className="flex gap-2">
          <Link href={`/export/batch/${batch.id}`}>
            <Button variant="outline" size="sm" className="rounded-full">
              <FileDown className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-destructive hover:text-destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border border-border/50">
        <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-600" />
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                  <Beer className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  {batch.beer_name}
                  <p className="text-sm font-normal text-muted-foreground mt-1 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Hash className="h-3.5 w-3.5" />
                      Batch #{batch.batch_number}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(batch.date).toLocaleDateString("en-US", {
                        weekday: "long", year: "numeric", month: "long", day: "numeric",
                      })}
                    </span>
                  </p>
                </div>
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-muted/50 p-5 text-center border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">OG</p>
              <p className="text-2xl font-bold mt-1">{batch.og ?? "—"}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-5 text-center border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">FG</p>
              <p className="text-2xl font-bold mt-1">{batch.fg ?? "—"}</p>
            </div>
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/50 p-5 text-center border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-700 dark:text-amber-300 uppercase tracking-wider font-medium">ABV</p>
              <p className="text-2xl font-bold mt-1 text-amber-700 dark:text-amber-300">
                {batch.abv ? `${batch.abv}%` : "—"}
              </p>
            </div>
          </div>

          {batch.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{batch.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
