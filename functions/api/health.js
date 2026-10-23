// GET /api/health
import { ok } from "../_lib/http.js";
export async function onRequestGet() { return ok({ service: "elite-migracion", ts: new Date().toISOString() }); }
