import { hasAnthropicKey } from "@/lib/api-key";
import { draftInformacao } from "@/lib/claude";
import { getExpediente, saveExpediente } from "@/lib/store";

export const runtime = "nodejs";
export const maxDuration = 120;

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const exp = await getExpediente(id);
  if (!exp) return Response.json({ error: "Expediente não encontrado." }, { status: 404 });
  if (!exp.sistemaConfirmado && exp.deteccao.precisaConfirmar) {
    return Response.json(
      { error: "Confirme se o expediente é SEI ou CPA antes de redigir." },
      { status: 409 },
    );
  }
  if (!exp.posicionamento.trim()) {
    return Response.json(
      { error: "Descreva o posicionamento da SGS antes de gerar a Informação." },
      { status: 400 },
    );
  }
  if (!hasAnthropicKey()) {
    if (exp.minuta) return Response.json(exp);
    return Response.json(
      { error: "Sem ANTHROPIC_API_KEY não é possível gerar uma nova Informação." },
      { status: 503 },
    );
  }
  const minuta = await draftInformacao({ expediente: exp });
  exp.minuta = minuta;
  exp.status = "pronto";
  const saved = await saveExpediente(exp);
  return Response.json(saved);
}
