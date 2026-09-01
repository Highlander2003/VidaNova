import type { RequestHandler } from "./$types";
import { postAlertas } from "$controlador/alertasController";

export const POST: RequestHandler = (event) => postAlertas(event);
