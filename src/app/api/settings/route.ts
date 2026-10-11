import { readSettings, writeSettings } from "@/lib/settings";
import type { UnitSettings } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  return Response.json(await readSettings());
}

export async function PUT(req: Request) {
  const body = (await req.json()) as UnitSettings;
  return Response.json(await writeSettings(body));
}
