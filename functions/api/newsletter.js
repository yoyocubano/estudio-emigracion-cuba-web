// POST /api/newsletter — suscripcion al Boletin Elite (D1: subscribers).
import { EMAIL_RE, bad, ok, readBody } from "../_lib/http.js";
import { notifyOwner } from "../_lib/notify.js";
export async function onRequestPost(context) {
  const { env, request } = context;
  let data;
  try { data = await readBody(request); } catch { return bad("invalid_body"); }
  if (!data || typeof data !== "object") return bad("invalid_body");
  if (data.company) return ok(); // honeypot
  const email = data.email ? String(data.email).trim().toLowerCase().slice(0, 160) : "";
  if (!EMAIL_RE.test(email)) return bad("email_invalid");
  const srcRaw = data.src ? String(data.src).trim().toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40) : "";
  const src = srcRaw || null;
  if (!env.DB) return bad("db_unavailable", 500);
  let inserted = false;
  try {
    const res = await env.DB.prepare("INSERT OR IGNORE INTO subscribers (email, src) VALUES (?, ?)").bind(email, src).run();
    inserted = res.meta.changes > 0;
  } catch { return bad("db_insert_failed", 500); }
  if (inserted) context.waitUntil(notifyOwner(env, "newsletter", { email, src }));
  return ok();
}
