import { writeFile } from "node:fs/promises";
import path from "node:path";
import { detectSystem } from "@/lib/detect-system";
import { extractPdf } from "@/lib/pdf";
import { UPLOADS_DIR } from "@/lib/paths";
import { listExpedientes, newId, saveExpediente } from "@/lib/store";
import type { Expediente } from "@/lib/types";
import { mkdir } from "node:fs/promises";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function GET() {
  const items = await listExpedientes();
  return Response.json(
    items.map((e) => ({
      id: e.id,
      arquivoNome: e.arquivoNome,
      assunto: e.assunto,
      sistema: e.sistema,
      sistemaConfirmado: e.sistemaConfirmado,
      confianca: e.deteccao.confianca,
      processo: e.deteccao.processo,
      status: e.status,
      demo: e.demo,
      paginas: e.paginas,
      criadoEm: e.criadoEm,
      atualizadoEm: e.atualizadoEm,
    })),
  );
}

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("arquivo");
  if (!(file instanceof File)) {
    return Response.json({ error: "Envie o PDF do processo." }, { status: 400 });
  }
  if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
    return Response.json({ error: "O arquivo precisa ser um PDF." }, { status: 400 });
  }
  if (file.size > 40 * 1024 * 1024) {
    return Response.json({ error: "PDF acima de 40 MB." }, { status: 400 });
  }

  const buffer = new Uint8Array(await file.arrayBuffer());
  const extracted = await extractPdf(buffer);
  const assuntoForm = String(form.get("assunto") ?? "").trim();
  const deteccao = detectSystem(extracted.text, {
    title: extracted.title,
    fileName: file.name,
  });
  const id = newId();
  await mkdir(UPLOADS_DIR, { recursive: true });
  const pdfPath = path.join(UPLOADS_DIR, `${id}.pdf`);
  await writeFile(pdfPath, buffer);

  const now = new Date().toISOString();
  const expediente: Expediente = {
    id,
    arquivoNome: file.name,
    pdfPath,
    textoExtraido: extracted.text,
    paginas: extracted.pages,
    assunto: assuntoForm || deteccao.assunto || file.name.replace(/\.pdf$/i, ""),
    sistema: deteccao.sistema,
    sistemaConfirmado: !deteccao.precisaConfirmar,
    deteccao,
    status: "pdf",
    perguntas: [],
    posicionamento: "",
    informacoesAdicionais: "",
    criadoEm: now,
    atualizadoEm: now,
  };
  await saveExpediente(expediente);
  return Response.json({
    ...expediente,
    truncated: extracted.truncated,
  });
}
