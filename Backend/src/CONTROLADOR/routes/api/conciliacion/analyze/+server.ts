import type { RequestHandler } from "./$types";
import { postConciliacionAnalyze } from "$controlador/conciliacionController";

export const POST: RequestHandler = (event) => postConciliacionAnalyze(event);
