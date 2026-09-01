import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { AlertasService } from "$lib/server/alertas/AlertasService";
import { MATRIZ_ALERTAS } from "$lib/server/alertas/matrizAlertas";
import {
  PdfAnalysisService,
  type DictionaryEntry,
} from "$lib/server/conciliacion/PdfAnalysisService";

type ApiDictionaryEntry = Partial<DictionaryEntry>;

const defaultDictionary: DictionaryEntry[] = MATRIZ_ALERTAS.map((rule, id) => ({
  id,
  phrase: rule.patron.source,
  pattern: rule.patron.source,
  level: rule.nivel,
}));
const pdfAnalysis = new PdfAnalysisService(
  await import("pdfjs-dist/legacy/build/pdf.mjs"),
  new AlertasService(MATRIZ_ALERTAS),
);

function getDictionary(value: FormDataEntryValue | null): DictionaryEntry[] {
  if (typeof value !== "string") return defaultDictionary;
  try {
    const entries = JSON.parse(value) as ApiDictionaryEntry[];
    return entries
      .filter(
        (entry) =>
          typeof entry.pattern === "string" &&
          (entry.level === "ROJO" ||
            entry.level === "AMARILLO" ||
            entry.level === "VERDE"),
      )
      .map((entry, id) => ({
        id,
        phrase: entry.phrase || entry.pattern || "",
        pattern: entry.pattern || "",
        level: entry.level as DictionaryEntry["level"],
      }));
  } catch {
    return defaultDictionary;
  }
}

export const POST: RequestHandler = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || file.type !== "application/pdf")
    throw error(400, "Solo se permiten archivos PDF.");
  const histories = await pdfAnalysis.analyze(
    file,
    getDictionary(formData.get("dictionary")),
  );
  return json(
    { histories },
    { headers: { "Access-Control-Allow-Origin": "*" } },
  );
};
