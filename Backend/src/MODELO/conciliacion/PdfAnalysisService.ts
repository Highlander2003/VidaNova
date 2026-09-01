import { AlertasService, type ReglaAlerta } from "$modelo/alertas/AlertasService";
import type { NivelAlerta } from "$modelo/alertas/matrizAlertas";

type PdfJsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs");
export type HistoriaAnalizada = {
  id: number;
  label: string;
  patientName: string;
  text: string;
  conduct: string;
  matches: ReturnType<AlertasService["analizarTodas"]>;
};
export type DictionaryEntry = { id: number; phrase: string; pattern: string; level: Exclude<NivelAlerta, "NORMAL"> };

type TextFragment = { text: string; hasEOL: boolean };

export class PdfAnalysisService {
  constructor(private readonly pdfjs: PdfJsModule, private readonly alertas: AlertasService) {}

  async analyze(file: File, dictionary: DictionaryEntry[]): Promise<HistoriaAnalizada[]> {
    const pdf = await this.pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(this.extractPageText(content.items));
    }

    const analyzer = dictionary.length > 0 ? new AlertasService(
      dictionary.map((entry) => ({ patron: new RegExp(entry.pattern, "gi"), nivel: entry.level })),
    ) : this.alertas;
    return this.splitHistories(pages.join("\n")).map((historyText, index) => {
      const clinicalText = this.getClinicalText(historyText);
      return { id: index + 1, label: `Historia ${index + 1}`, patientName: this.getPatientName(historyText, index), text: clinicalText, conduct: clinicalText, matches: analyzer.analizarTodas(clinicalText) };
    });
  }

  private extractPageText(items: Array<unknown>): string {
    const fragments: TextFragment[] = items.flatMap((item) => {
      if (!item || typeof item !== "object" || !("str" in item) || typeof item.str !== "string") return [];
      return [{ text: item.str, hasEOL: "hasEOL" in item && item.hasEOL === true }];
    });
    return fragments.map((fragment) => `${fragment.text}${fragment.hasEOL ? "\n" : " "}`).join("").trim();
  }
  private getClinicalText(content: string): string {
    const normalized = content.normalize("NFC").replace(/\r\n?/g, "\n");
    const clinicalStartMatch = normalized.match(/\bconducta\s+a\s+seguir\b|\ban[aá]lisis\s*:/iu);
    const clinicalStart = clinicalStartMatch?.index ?? 0;
    const administrativeStart = normalized.slice(clinicalStart).search(/\bservicio(?:s|\s*\(\s*s\s*\))\s+(?:nombre|c[oó]digo|cups?)\b/iu);
    const clinicalEnd = administrativeStart >= 0 ? clinicalStart + administrativeStart : normalized.length;
    const clinicalContent = normalized.slice(clinicalStart, clinicalEnd);
    return clinicalContent.split("\n").map((line) => line.replace(/[ \t]+/g, " ").trimEnd()).join("\n").trim();
  }
  private splitHistories(content: string): string[] { const sections = content.split(/(?=\b(?:historia\s+cl[ií]nica|paciente\s*:|identificaci[oó]n\s*:|documento\s*:))/giu).map((section) => section.trim()).filter(Boolean); return sections.length > 1 ? sections : [content]; }
  private getPatientName(content: string, index: number): string { const match = content.match(/(?:nombre\s*(?:del|de la)?\s*paciente|paciente|nombre completo)\s*[:\-]?\s*((?:doña\s+|don\s+)?[A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑáéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑáéíóúñ]+){0,5})/iu); return match?.[1]?.trim().replace(/\s+/g, " ") || `Historia ${index + 1}`; }
}
