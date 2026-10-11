import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { EXPEDIENTES_DIR, UPLOADS_DIR } from "./paths";
import type { Expediente } from "./types";
import { DEMO_EXPEDIENTE } from "./demo-data";

async function ensureDirs() {
  await mkdir(EXPEDIENTES_DIR, { recursive: true });
  await mkdir(UPLOADS_DIR, { recursive: true });
}

function fileFor(id: string) {
  return path.join(EXPEDIENTES_DIR, `${id}.json`);
}

export async function seedDemoIfEmpty() {
  await ensureDirs();
  const files = await readdir(EXPEDIENTES_DIR).catch(() => []);
  const jsons = files.filter((f) => f.endsWith(".json"));
  if (jsons.length === 0) {
    await saveExpediente(DEMO_EXPEDIENTE);
  }
}

export async function listExpedientes(): Promise<Expediente[]> {
  await seedDemoIfEmpty();
  const files = (await readdir(EXPEDIENTES_DIR)).filter((f) => f.endsWith(".json"));
  const items = await Promise.all(
    files.map(async (f) => {
      const raw = await readFile(path.join(EXPEDIENTES_DIR, f), "utf8");
      return JSON.parse(raw) as Expediente;
    }),
  );
  return items.sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm));
}

export async function getExpediente(id: string): Promise<Expediente | null> {
  await seedDemoIfEmpty();
  try {
    const raw = await readFile(fileFor(id), "utf8");
    return JSON.parse(raw) as Expediente;
  } catch {
    if (id === DEMO_EXPEDIENTE.id) return DEMO_EXPEDIENTE;
    return null;
  }
}

export async function saveExpediente(exp: Expediente): Promise<Expediente> {
  await ensureDirs();
  const next = { ...exp, atualizadoEm: new Date().toISOString() };
  await writeFile(fileFor(exp.id), JSON.stringify(next, null, 2), "utf8");
  return next;
}

export async function deleteExpediente(id: string): Promise<void> {
  const exp = await getExpediente(id);
  if (!exp) return;
  await unlink(fileFor(id)).catch(() => undefined);
  if (exp.pdfPath) await unlink(exp.pdfPath).catch(() => undefined);
}

export function newId() {
  return `exp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
