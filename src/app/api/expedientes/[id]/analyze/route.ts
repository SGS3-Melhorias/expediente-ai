import { hasDeepSeekKey } from "@/lib/api-key";
import { analyzePdfText } from "@/lib/claude";
import { getExpediente, saveExpediente } from "@/lib/store";

export const runtime = "nodejs";
export const maxDuration = 120;

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const exp = await getExpediente(id);
  if (!exp) return Response.json({ error: "Expediente não encontrado." }, { status: 404 });
  if (!hasDeepSeekKey()) {
    if (exp.analise) return Response.json(exp);
    return Response.json(
      {
        error:
          "Sem DEEPSEEK_API_KEY. Crie uma chave em platform.deepseek.com e coloque-a no .env.local.",
      },
      { status: 503 },
    );
  }
  if (!exp.textoExtraido.trim()) {
    return Response.json({ error: "Não há texto extraído deste PDF." }, { status: 400 });
  }
  const analise = await analyzePdfText({
    text: exp.textoExtraido,
    pages: exp.paginas,
    fileName: exp.arquivoNome,
  });
  exp.analise = analise;
  exp.status = exp.minuta ? "pronto" : "analise";
  const saved = await saveExpediente(exp);
  return Response.json(saved);
}
