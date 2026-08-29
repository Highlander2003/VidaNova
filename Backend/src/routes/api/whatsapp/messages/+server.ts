import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { whatsappBusinessService } from "$lib/server/whatsapp/WhatsAppBusinessService";

export const POST: RequestHandler = async ({ request }) => {
  const body = (await request.json()) as { to?: string; message?: string };
  const headers = { "Access-Control-Allow-Origin": "*" };
  if (!body.to?.trim() || !body.message?.trim()) return json({ error: "Los campos to y message son obligatorios." }, { status: 400, headers });
  try { return json(await whatsappBusinessService.sendMessage(body.to.trim(), body.message.trim()), { headers }); }
  catch (cause) { return json({ error: cause instanceof Error ? cause.message : "No fue posible enviar el mensaje." }, { status: 502, headers }); }
};
