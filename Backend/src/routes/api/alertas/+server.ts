import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { alertasService } from "$lib/server/alertas/AlertasService";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body: unknown = await request.json();
    if (
      typeof body !== "object" ||
      body === null ||
      !("texto" in body) ||
      typeof body.texto !== "string" ||
      body.texto.trim() === ""
    ) {
      return json({ error: "El campo texto es obligatorio." }, { status: 400 });
    }

    return json({
      principal: alertasService.analizarPrincipal(body.texto),
      todas: alertasService.analizarTodas(body.texto),
    });
  } catch (cause: unknown) {
    console.error("Error al analizar alertas:", cause);
    return json({ error: "Error interno al analizar las alertas." }, { status: 500 });
  }
};
