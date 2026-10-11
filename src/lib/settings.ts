import { mkdir, readFile, writeFile } from "node:fs/promises";
import { DATA_DIR, SETTINGS_PATH } from "./paths";
import type { UnitSettings } from "./types";

export const DEFAULT_SETTINGS: UnitSettings = {
  unidade: "Secretaria de Governança de Sistemas",
  prefixoInformacao: "Informação SGS",
  proximoNumeroSgs: "[COMPLETAR]/2026",
  vocativo:
    "Ilmo. Senhor [COMPLETAR],\nSecretário de Governança de Sistemas",
  signatarios:
    "[COMPLETAR]\nCoordenador – SGS 3.1\n\n[COMPLETAR]\nDiretor – SGS 3",
};

export async function readSettings(): Promise<UnitSettings> {
  try {
    const raw = await readFile(SETTINGS_PATH, "utf8");
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function writeSettings(next: UnitSettings): Promise<UnitSettings> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(SETTINGS_PATH, JSON.stringify(next, null, 2), "utf8");
  return next;
}
