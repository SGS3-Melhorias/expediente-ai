import { readFile } from "node:fs/promises";
import path from "node:path";
import { PROMPTS_DIR, TEMPLATES_DIR } from "./paths";
import type { UnitSettings } from "./types";

export async function loadLeitorPrompt() {
  const raw = await readFile(path.join(PROMPTS_DIR, "leitor-pdf.md"), "utf8");
  return raw
    .replace(
      "{{OBJETIVO_DO_USUARIO}}",
      "manifestação em expediente administrativo da Secretaria de Governança de Sistemas (SGS/TJSP)",
    )
    .replace("{{NIVEL_DETALHE}}", "completo")
    .replace("{{FOCO_ESPECIFICO}}", "fatos, despachos, pedidos e encaminhamentos relevantes para Informação")
    .replace("{{FORMATO_SAIDA}}", "markdown");
}

export async function loadRedacaoPrompt() {
  return readFile(path.join(PROMPTS_DIR, "redacao-informacao.md"), "utf8");
}

export async function loadSeiTemplate() {
  return readFile(path.join(TEMPLATES_DIR, "sei-informacao.md"), "utf8");
}

export function settingsBlock(s: UnitSettings) {
  return `Unidade: ${s.unidade}
Prefixo: ${s.prefixoInformacao}
Número SGS sugerido: ${s.proximoNumeroSgs}
Vocativo padrão:
${s.vocativo}
Signatários padrão:
${s.signatarios}`;
}
