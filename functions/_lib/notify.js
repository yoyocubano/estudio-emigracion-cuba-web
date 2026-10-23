// Owner notifications via the elite-mailer Worker (MAILER service binding).
// The Worker owns the send_email binding pinned to the owner's inbox and
// hard-codes From/To, so this path can only ever notify the owner.
// Never throws: a notification problem must not fail the request.
function field(label, value) { return value === null || value === undefined || value === "" ? null : `${label}: ${value}`; }
export async function notifyOwner(env, kind, data) {
  try {
    if (!env.MAILER) { console.error("notify: MAILER binding missing"); return false; }
    let subject, text;
    if (kind === "newsletter") {
      subject = "[ELITE Migracion] Nueva suscripcion al Boletin Elite";
      text = ["Nueva suscripcion al Boletin Elite desde la web de ELITE Migracion", "", field("Email", data.email), field("Origen (src)", data.src), "", "Guardada en D1 (elite-migracion-db, tabla subscribers)."].filter((l) => l !== null).join("\n");
    } else {
      const label = kind === "asesoria" ? "ASESORIA" : "CONTACTO";
      subject = `[ELITE Migracion] Nuevo lead (${label}): ${data.nombre || "sin nombre"}`;
      text = [`Nuevo lead desde la web de ELITE Migracion — ${label}`, "", field("Nombre", data.nombre), field("Email", data.email), field("WhatsApp", data.whatsapp), field("Pais de interes", data.pais), "", "Mensaje:", data.mensaje || "(sin mensaje)", "", "Guardado en D1 (elite-migracion-db, tabla leads)."].filter((l) => l !== null).join("\n");
    }
    const res = await env.MAILER.fetch("https://elite-mailer.internal/send", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ subject, text }) });
    if (!res.ok) { console.error("notify: mailer answered " + res.status); return false; }
    return true;
  } catch (err) { console.error("notify failed", err && err.message ? err.message : String(err)); return false; }
}
