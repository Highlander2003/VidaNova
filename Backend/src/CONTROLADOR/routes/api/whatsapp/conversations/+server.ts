import type { RequestHandler } from "./$types";
import { getConversations } from "$controlador/whatsappController";

export const GET: RequestHandler = (event) => getConversations(event);
