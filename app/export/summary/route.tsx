import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BatchSummaryPDF } from "@/components/batches/BatchSummaryPDF";
import type { Batch, Profile } from "@/types";
import { renderToStream } from "@react-pdf/renderer";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  let query = supabase
    .from("batches")
    .select("*")
    .eq("user_id", user.id);

  if (startDate) {
    query = query.gte("date", startDate);
  }
  if (endDate) {
    query = query.lte("date", endDate);
  }

  const { data: batchesRaw } = await query
    .order("date", { ascending: false });

  const batches = batchesRaw as Batch[] | null;

  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = profileRaw as Profile | null;

  const pdfStream = await renderToStream(
    <BatchSummaryPDF
      batches={batches ?? []}
      profile={profile!}
      startDate={startDate}
      endDate={endDate}
    />
  );

  const chunks: Buffer[] = [];
  for await (const chunk of pdfStream) {
    if (typeof chunk !== "string") chunks.push(Buffer.from(chunk));
  }
  const pdfBuffer = Buffer.concat(chunks);

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="batch_summary_${new Date().toISOString().split("T")[0]}.pdf"`,
    },
  });
}
