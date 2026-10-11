import { cpaFileName, renderCpaDocx } from "@/lib/export-cpa";
import { getExpediente } from "@/lib/store";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const exp = await getExpediente(id);
  if (!exp) return Response.json({ error: "Expediente não encontrado." }, { status: 404 });
  if (exp.sistema !== "CPA") {
    return Response.json(
      { error: "Exportação Word vale só para expediente CPA. No SEI, copie o texto." },
      { status: 400 },
    );
  }
  if (!exp.minuta) {
    return Response.json({ error: "Gere a Informação antes de baixar o Word." }, { status: 400 });
  }
  const buf = await renderCpaDocx(exp.minuta);
  const filename = cpaFileName(exp.minuta);
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
