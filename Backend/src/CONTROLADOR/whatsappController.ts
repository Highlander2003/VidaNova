import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { whatsappBusinessService } from "$modelo/whatsapp/WhatsAppBusinessService";

const corsHeaders = { "Access-Control-Allow-Origin": "*" };

export function getConversations({ url }: RequestEvent) {
  const phone = url.searchParams.get("phone");
  if (phone)
    return json(whatsappBusinessService.markRead(phone) || null, {
      headers: corsHeaders,
    });
  return json(
    {
      conversations: whatsappBusinessService.listConversations(),
      unreadCount: whatsappBusinessService.getUnreadCount(),
      configured: whatsappBusinessService.configured,
    },
    { headers: corsHeaders },
  );
}

export async function postMessage({ request }: RequestEvent) {
  const body = (await request.json()) as { to?: string; message?: string };
  if (!body.to?.trim() || !body.message?.trim())
    return json(
      { error: "Los campos to y message son obligatorios." },
      { status: 400, headers: corsHeaders },
    );
  try {
    return json(
      await whatsappBusinessService.sendMessage(
        body.to.trim(),
        body.message.trim(),
      ),
      { headers: corsHeaders },
    );
  } catch (cause) {
    return json(
      {
        error:
          cause instanceof Error
            ? cause.message
            : "No fue posible enviar el mensaje.",
      },
      { status: 502, headers: corsHeaders },
    );
  }
}

export function getWebhookVerification({ url }: RequestEvent) {
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  if (
    mode === "subscribe" &&
    token === whatsappBusinessService.verifyToken &&
    challenge
  )
    return new Response(challenge, { status: 200 });
  return new Response("Forbidden", { status: 403 });
}

export async function postWebhook({ request }: RequestEvent) {
  const payload = (await request.json()) as {
    entry?: Array<{
      changes?: Array<{
        value?: {
          contacts?: Array<{ wa_id?: string; profile?: { name?: string } }>;
          messages?: Array<{
            id: string;
            from: string;
            timestamp?: string;
            text?: { body?: string };
            type?: string;
          }>;
        };
      }>;
    }>;
  };
  for (const entry of payload.entry || [])
    for (const change of entry.changes || []) {
      const value = change.value;
      for (const message of value?.messages || []) {
        const contact = value?.contacts?.find(
          (item) => item.wa_id === message.from,
        );
        whatsappBusinessService.receiveWebhook(message, contact?.profile?.name);
      }
    }
  return json({ received: true });
}
