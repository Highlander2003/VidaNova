import type { RequestHandler } from "./$types";
import {
  getWebhookVerification,
  postWebhook,
} from "$controlador/whatsappController";

export const GET: RequestHandler = (event) => getWebhookVerification(event);
export const POST: RequestHandler = (event) => postWebhook(event);
