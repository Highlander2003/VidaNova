import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { whatsappBusinessService } from "$lib/server/whatsapp/WhatsAppBusinessService";

export const GET: RequestHandler = ({ url }) => {
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
};

export const POST: RequestHandler = async ({ request }) => {
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
};
