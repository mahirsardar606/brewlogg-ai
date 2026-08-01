import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BatchPDF } from "@/components/batches/BatchPDF";
import type { Batch, Profile } from "@/types";
import { renderToStream } from "@react-pdf/renderer";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: batchRaw } = await supabase
    .from("batches")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  const batch = batchRaw as Batch | null;

  if (!batch) {
    return NextResponse.json({ error: "Batch not found" }, { status: 404 });
  }

  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = profileRaw as Profile | null;

  const pdfStream = await renderToStream(
    <BatchPDF batch={batch} profile={profile!} />
  );

  const chunks: Buffer[] = [];
  for await (const chunk of pdfStream) {
    if (typeof chunk !== "string") chunks.push(Buffer.from(chunk));
  }
  const pdfBuffer = Buffer.concat(chunks);

  const safeName = batch.beer_name.replace(/[^a-zA-Z0-9]/g, "_");

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeName}_batch_${batch.batch_number}.pdf"`,
    },
  });
}
