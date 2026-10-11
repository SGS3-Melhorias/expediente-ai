import type { ConfiancaDeteccao, Deteccao, Sistema } from "./types";

const SEI_PROCESSO =
  /\b(20\d{2}\/\d\.\d{2}\.\d{5,}\.\d)\b/;
const CPA_PROCESSO =
  /\b(20\d{2}[/-]\d{8})\b/;
const SEI_DOC = /\b0\d{6,}\b/;

function count(haystack: string, needle: RegExp): number {
  return haystack.match(new RegExp(needle, "gi"))?.length ?? 0;
}

export function detectSystem(
  text: string,
  meta?: { title?: string; fileName?: string },
): Deteccao {
  const blob = `${meta?.title ?? ""}\n${meta?.fileName ?? ""}\n${text}`.slice(
    0,
    80_000,
  );
  const upper = blob.toUpperCase();

  const seiProcesso = blob.match(SEI_PROCESSO)?.[1];
  const cpaProcesso = blob.match(CPA_PROCESSO)?.[1];

  const sinais: string[] = [];
  let sei = 0;
  let cpa = 0;

  if (seiProcesso) {
    sei += 4;
    sinais.push(`Número SEI ${seiProcesso}`);
  }
  if (/\bSEI\b/i.test(blob) || /SISTEMA ELETR[OÔ]NICO DE INFORMA/i.test(blob)) {
    sei += 3;
    sinais.push("Menção a SEI");
  }
  if (/assinado eletronicamente/i.test(blob) || /documento assinado eletr/i.test(blob)) {
    sei += 3;
    sinais.push("Assinatura eletrônica típica do SEI");
  }
  if (/informa[cç][aã]o sgs\s+\d+\/\d+\s*\(\s*0\d+/i.test(blob) || SEI_DOC.test(meta?.fileName ?? "")) {
    sei += 2;
    sinais.push("Documento numerado no padrão SEI");
  }
  if (upper.includes("SEI_")) {
    sei += 2;
    sinais.push("Nome de arquivo SEI");
  }

  if (cpaProcesso) {
    cpa += 4;
    sinais.push(`Número CPA ${cpaProcesso}`);
  }
  if (/\bCPA\b/.test(upper) || /SAJADM/i.test(blob) || /\bSAJ\b/.test(upper)) {
    cpa += 3;
    sinais.push("Menção a CPA/SAJ");
  }
  if (/sajadm-cpa/i.test(blob) || /sistema de automa[cç][aã]o da justi/i.test(blob)) {
    cpa += 2;
    sinais.push("SAJADM-CPA");
  }
  if (/informa[cç][aã]o sgs[\s_]+[\d-]+_cpa/i.test(meta?.fileName ?? "")) {
    cpa += 2;
    sinais.push("Nome de arquivo CPA");
  }

  sei += count(blob, /\bSEI\b/) > 3 ? 1 : 0;

  let sistema: Sistema;
  let confianca: ConfiancaDeteccao;

  if (sei === 0 && cpa === 0) {
    sistema = "SEI";
    confianca = "baixa";
    sinais.push("Nenhum marcador claro — palpite inicial SEI");
  } else if (sei === cpa) {
    sistema = seiProcesso ? "SEI" : "CPA";
    confianca = "baixa";
    sinais.push("Empate entre sinais SEI e CPA");
  } else if (Math.abs(sei - cpa) <= 1) {
    sistema = sei > cpa ? "SEI" : "CPA";
    confianca = "media";
  } else {
    sistema = sei > cpa ? "SEI" : "CPA";
    confianca = "alta";
  }

  const assuntoMatch =
    blob.match(/assunto\s*[:\-–]\s*(.+)/i)?.[1]?.split("\n")[0]?.trim();

  return {
    sistema,
    confianca,
    processo: (sistema === "SEI" ? seiProcesso : cpaProcesso) ?? seiProcesso ?? cpaProcesso,
    assunto: assuntoMatch?.slice(0, 220),
    sinais,
    precisaConfirmar: confianca !== "alta",
  };
}
