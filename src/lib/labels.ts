import type { ExpedienteStatus, Sistema } from "./types";

export const STATUS_LABEL: Record<ExpedienteStatus, string> = {
  pdf: "PDF recebido",
  analise: "Leitura pronta",
  rascunho: "Rascunho",
  pronto: "Informação pronta",
};

export function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function sistemaHint(sistema: Sistema) {
  return sistema === "CPA"
    ? "A minuta sai em Word no modelo CPA (TJSP/SGS)."
    : "A minuta sai em texto para colar no editor do SEI.";
}
