import { deleteExpediente, getExpediente, saveExpediente } from "@/lib/store";
import type { Sistema } from "@/lib/types";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const exp = await getExpediente(id);
  if (!exp) return Response.json({ error: "Expediente não encontrado." }, { status: 404 });
  return Response.json(exp);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const exp = await getExpediente(id);
  if (!exp) return Response.json({ error: "Expediente não encontrado." }, { status: 404 });
  const body = (await req.json()) as Partial<{
    sistema: Sistema;
    sistemaConfirmado: boolean;
    assunto: string;
    posicionamento: string;
    informacoesAdicionais: string;
    processo: string;
  }>;
  if (body.sistema) {
    exp.sistema = body.sistema;
    exp.sistemaConfirmado = true;
    exp.deteccao = { ...exp.deteccao, sistema: body.sistema, precisaConfirmar: false };
  }
  if (typeof body.sistemaConfirmado === "boolean") {
    exp.sistemaConfirmado = body.sistemaConfirmado;
  }
  if (typeof body.assunto === "string") exp.assunto = body.assunto;
  if (typeof body.posicionamento === "string") exp.posicionamento = body.posicionamento;
  if (typeof body.informacoesAdicionais === "string") {
    exp.informacoesAdicionais = body.informacoesAdicionais;
  }
  if (typeof body.processo === "string") {
    exp.deteccao = { ...exp.deteccao, processo: body.processo };
  }
  const saved = await saveExpediente(exp);
  return Response.json(saved);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  await deleteExpediente(id);
  return Response.json({ ok: true });
}
