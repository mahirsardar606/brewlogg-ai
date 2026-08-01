import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Beer, Calendar, FileDown } from "lucide-react";
import type { Batch } from "@/types";

export function BatchCard({ batch }: { batch: Batch }) {
  return (
    <Link href={`/batches/${batch.id}`}>
      <Card className="p-5 card-hover border border-border/60 rounded-2xl group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm ring-1 ring-amber-200/50 dark:ring-amber-700/30">
              <Beer className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate text-base group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">{batch.beer_name}</h3>
                <Badge variant="secondary" className="text-xs font-medium shrink-0 bg-muted/80 hover:bg-muted">#{batch.batch_number}</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {batch.og && <Badge variant="outline" className="text-xs font-medium border-border/60 hover:border-amber-300 hover:text-amber-700 transition-colors">OG {batch.og}</Badge>}
                {batch.fg && <Badge variant="outline" className="text-xs font-medium border-border/60 hover:border-amber-300 hover:text-amber-700 transition-colors">FG {batch.fg}</Badge>}
                {batch.abv && (
                  <Badge className="text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-0 hover:bg-amber-200 dark:hover:bg-amber-900/70 transition-colors">
                    {batch.abv}% ABV
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-muted-foreground hidden sm:flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(batch.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-amber-100 dark:group-hover:bg-amber-900/50 transition-colors">
              <FileDown className="h-4 w-4 text-muted-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
