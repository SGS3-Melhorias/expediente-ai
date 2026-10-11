import { apiStatus } from "@/lib/api-key";

export const runtime = "nodejs";

export function GET() {
  return Response.json(apiStatus());
}
