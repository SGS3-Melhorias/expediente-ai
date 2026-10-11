import type { Marcacao } from "./types";

export function extractMarkers(text: string): Marcacao[] {
  const found: Marcacao[] = [];
  const re = /\[(COMPLETAR|VERIFICAR)\]([^\n[]{0,180})/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    found.push({
      tipo: m[1] as "COMPLETAR" | "VERIFICAR",
      trecho: m[0].trim(),
      contexto: m[2].trim() || "Campo marcado no texto da Informação.",
    });
  }
  const unique = new Map<string, Marcacao>();
  for (const item of found) unique.set(`${item.tipo}:${item.trecho}`, item);
  return [...unique.values()];
}

export function hasUnresolved(text: string) {
  return /\[COMPLETAR\]|\[VERIFICAR\]/.test(text);
}
