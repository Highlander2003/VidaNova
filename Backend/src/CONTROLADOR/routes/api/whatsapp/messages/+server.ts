import type { RequestHandler } from "./$types";
import { postMessage } from "$controlador/whatsappController";

export const POST: RequestHandler = (event) => postMessage(event);
