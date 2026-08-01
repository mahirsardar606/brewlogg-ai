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
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ExportForm() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExportSummary = async () => {
    if (startDate && endDate && startDate > endDate) {
      toast.error("Start date must be before end date");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);

      const response = await fetch(`/export/summary?${params.toString()}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `batch_summary_${new Date().toISOString().split("T")[0]}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Report downloaded");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Export failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Export Summary Report</CardTitle>
        <CardDescription>
          Download a PDF summary of all batches in a date range
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">From</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">To</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <Button
          onClick={handleExportSummary}
          disabled={loading}
          variant="outline"
          className="w-full"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="mr-2 h-4 w-4" />
          )}
          Download Summary PDF
        </Button>
      </CardContent>
    </Card>
  );
}
