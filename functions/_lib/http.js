// Shared helpers for the ELITE Migracion API (Pages Functions, no build step).
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export function json(data, status = 200, headers = {}) { return Response.json(data, { status, headers }); }
export function ok(extra = {}) { return json({ ok: true, ...extra }); }
export function bad(error, status = 400) { return json({ ok: false, error }, status); }
export function clean(v, max) { if (v === undefined || v === null) return null; const s = String(v).trim(); return s ? s.slice(0, max) : null; }
export async function readBody(request) {
  const ctype = request.headers.get("content-type") || "";
  if (ctype.includes("application/json")) return await request.json();
  if (ctype.includes("form")) return Object.fromEntries((await request.formData()).entries());
  return await request.json();
}
