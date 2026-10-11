import { hasAnthropicKey } from "@/lib/api-key";
import { answerQuestion } from "@/lib/claude";
import { getExpediente, saveExpediente } from "@/lib/store";

export const runtime = "nodejs";
export const maxDuration = 120;

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const exp = await getExpediente(id);
  if (!exp) return Response.json({ error: "Expediente não encontrado." }, { status: 404 });
  if (!hasAnthropicKey()) {
    return Response.json(
      { error: "Perguntas sobre o PDF exigem ANTHROPIC_API_KEY." },
      { status: 503 },
    );
  }
  const { pergunta } = (await req.json()) as { pergunta?: string };
  if (!pergunta?.trim()) {
    return Response.json({ error: "Escreva a pergunta." }, { status: 400 });
  }
  const resposta = await answerQuestion({ expediente: exp, pergunta: pergunta.trim() });
  exp.perguntas = [
    ...exp.perguntas,
    { pergunta: pergunta.trim(), resposta, em: new Date().toISOString() },
  ];
  const saved = await saveExpediente(exp);
  return Response.json(saved);
}
