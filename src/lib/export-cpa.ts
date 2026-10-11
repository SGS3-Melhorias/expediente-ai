import { readFile } from "node:fs/promises";
import path from "node:path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { TEMPLATES_DIR } from "./paths";
import type { Minuta } from "./types";

export async function renderCpaDocx(minuta: Minuta): Promise<Buffer> {
  const template = await readFile(path.join(TEMPLATES_DIR, "cpa-informacao.docx"));
  const zip = new PizZip(template);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: { start: "{{", end: "}}" },
  });
  doc.render({
    processo: minuta.processo,
    assunto: minuta.assunto,
    numeroInformacao: minuta.numeroInformacao,
    vocativo: minuta.vocativo,
    corpo: minuta.corpo,
    signatarios: minuta.signatarios,
  });
  const out = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });
  return Buffer.from(out);
}

export function cpaFileName(minuta: Minuta) {
  const proc = minuta.processo.replaceAll("/", "-").replaceAll("\\", "-");
  return `Informacao_SGS_${minuta.numeroInformacao.replaceAll("/", "-")}_CPA_${proc}.docx`;
}
