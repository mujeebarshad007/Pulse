import { getDatabase } from "@/server/database";
import { json } from "@/server/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    await getDatabase().query("SELECT 1 FROM pulse.reports LIMIT 0");
    return json({ status: "ok" });
  } catch {
    return json({ status: "unavailable" }, 503);
  }
}
