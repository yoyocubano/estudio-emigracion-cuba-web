// POST /api/lead — asesoria y contacto. Guarda en D1 (leads) y avisa al dueno.
import { EMAIL_RE, bad, clean, ok, readBody } from "../_lib/http.js";
import { notifyOwner } from "../_lib/notify.js";
export async function onRequestPost(context) {
  const { env, request } = context;
  let data;
  try { data = await readBody(request); } catch { return bad("invalid_body"); }
  if (!data || typeof data !== "object") return bad("invalid_body");
  if (data.company) return ok(); // honeypot
  const tipo = clean(data.tipo, 20) || "contacto";
  const nombre = clean(data.nombre, 120);
  const email = data.email ? String(data.email).trim().toLowerCase().slice(0, 160) : null;
  const whatsapp = clean(data.whatsapp, 40);
  const pais = clean(data.pais, 60);
  const mensaje = clean(data.mensaje, 2000);
  if (!nombre) return bad("nombre_required");
  if (!email && !whatsapp) return bad("contact_required");
  if (email && !EMAIL_RE.test(email)) return bad("email_invalid");
  if (!env.DB) return bad("db_unavailable", 500);
  let id = null;
  try {
    const res = await env.DB.prepare("INSERT INTO leads (tipo, nombre, email, whatsapp, pais, mensaje) VALUES (?, ?, ?, ?, ?, ?)").bind(tipo, nombre, email, whatsapp, pais, mensaje).run();
    id = res.meta.last_row_id;
  } catch { return bad("db_insert_failed", 500); }
  context.waitUntil(notifyOwner(env, tipo === "asesoria" ? "asesoria" : "contacto", { nombre, email, whatsapp, pais, mensaje }));
  return ok({ id });
}
