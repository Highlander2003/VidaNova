import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { whatsappBusinessService } from "$lib/server/whatsapp/WhatsAppBusinessService";

export const GET: RequestHandler = ({ url }) => {
  const phone = url.searchParams.get("phone");
  const headers = { "Access-Control-Allow-Origin": "*" };
  if (phone)
    return json(whatsappBusinessService.markRead(phone) || null, { headers });
  return json(
    {
      conversations: whatsappBusinessService.listConversations(),
      unreadCount: whatsappBusinessService.getUnreadCount(),
      configured: whatsappBusinessService.configured,
    },
    { headers },
  );
};
