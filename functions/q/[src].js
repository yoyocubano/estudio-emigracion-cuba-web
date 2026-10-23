// GET /q/:src — registro de escaneos QR (patron ScanPush) y redireccion a la portada.
export async function onRequestGet(context) {
  const { env, request, params, waitUntil } = context;
  const raw = params && params.src ? String(params.src) : "qr";
  const src = raw.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40) || "qr";
  if (env.DB) {
    waitUntil(env.DB.prepare("INSERT INTO qr_scans (src, country, ua) VALUES (?, ?, ?)").bind(src, (request.cf && request.cf.country) || null, (request.headers.get("user-agent") || "").slice(0, 200)).run().catch(() => {}));
  }
  return Response.redirect(new URL("/qr?src=" + encodeURIComponent(src), request.url).toString(), 302);
}
