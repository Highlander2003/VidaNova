import { getBackendUrl } from "./backend";

export type Level = "ROJO" | "AMARILLO" | "VERDE";
export type Match = {
  level: Level;
  colorEmoji?: string;
  fraseClave?: string;
  phrase?: string;
  context?: string;
};
export type ApiMatch = { nivel: Level; colorEmoji?: string; fraseClave?: string };
export type DictionaryEntry = {
  id: number;
  phrase: string;
  pattern: string;
  level: Level;
};
export type DocumentStatus = "pendiente" | "procesando" | "listo" | "error";
export type DocumentItem = {
  id: number;
  name: string;
  status: DocumentStatus;
  histories: HistoryItem[];
  error?: string;
};
export type HistoryItem = {
  id: number;
  label: string;
  patientName: string;
  text: string;
  conduct: string;
  matches: Match[];
};
export type AnalyzeResponseHistory = Omit<HistoryItem, "matches"> & {
  matches: ApiMatch[];
};

export const priorities: Record<Level, number> = {
  ROJO: 1,
  AMARILLO: 2,
  VERDE: 3,
};

export function displayPhrase(phrase: string): string {
  return phrase
    .replace(/\\b/g, "")
    .replace(/\(\?![^)]*\)/g, "")
    .replace(/\\d\+/g, "número")
    .replace(
      /\[([^\]]+)\]/g,
      (_match, options: string) =>
        [...options].find((letter) => "áéíóúÁÉÍÓÚ".includes(letter)) ??
        options[0],
    )
    .replace(/[()?!]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const defaultDictionarySource: Array<[string, Level]> = [
  ["cat[eé]ter venoso implantable", "ROJO"],
  ["urgente", "ROJO"],
  ["falla respiratoria", "ROJO"],
  ["deterioro cl[ií]nico", "ROJO"],
  ["ingreso hospitalario", "ROJO"],
  ["hospitalizado", "ROJO"],
  ["\\bUCI\\b", "ROJO"],
  ["urgencia vital", "ROJO"],
  ["shock", "ROJO"],
  ["insuficiencia", "ROJO"],
  ["hemorragia", "ROJO"],
  ["paro cardiorrespiratorio", "ROJO"],
  ["si persiste el dolor", "AMARILLO"],
  ["nueva biopsia", "AMARILLO"],
  ["control estricto", "AMARILLO"],
  ["revisar en", "AMARILLO"],
  ["segunda opini[oó]n", "AMARILLO"],
  ["manejo ambulatorio", "AMARILLO"],
  ["falta de respuesta", "AMARILLO"],
  ["procedimiento programado", "AMARILLO"],
  ["control en(?!\\s+\\d+\\s+d[ií]as)", "AMARILLO"],
  ["se discute caso", "AMARILLO"],
  ["evaluaci[oó]n adicional", "AMARILLO"],
  ["biopsia guiada", "VERDE"],
  ["hallazgo sospechoso", "VERDE"],
  ["evoluci[oó]n favorable", "VERDE"],
  ["sin complicaciones", "VERDE"],
  ["tratamiento establecido", "VERDE"],
  ["derivaci[oó]n a especialista", "VERDE"],
  ["control en \\d+ d[ií]as", "VERDE"],
  ["paciente estable", "VERDE"],
  ["citolog[ií]a", "VERDE"],
  ["ex[aá]menes de laboratorio", "VERDE"],
  ["manejo sintom[aá]tico", "VERDE"],
  ["alta m[eé]dica", "VERDE"],
];

export function buildDefaultDictionary(): DictionaryEntry[] {
  return defaultDictionarySource.map(([pattern, level], index) => ({
    id: index + 1,
    phrase: displayPhrase(pattern),
    pattern,
    level,
  }));
}

export function normalizeMatches(matches: ApiMatch[]): Match[] {
  return matches.map((match) => ({
    level: match.nivel,
    colorEmoji: match.colorEmoji,
    fraseClave: match.fraseClave,
  }));
}

export function normalizeText(content: string): string {
  return content
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("es");
}

export function contextParts(
  match: Match,
  content: string,
): Array<{ text: string; highlighted: boolean }> {
  const phrase = match.fraseClave ?? match.phrase ?? "";
  if (!phrase) return [{ text: content, highlighted: false }];
  const start = content
    .toLocaleLowerCase("es")
    .indexOf(phrase.toLocaleLowerCase("es"));
  if (start < 0) return [{ text: content, highlighted: false }];
  return [
    { text: content.slice(0, start), highlighted: false },
    { text: content.slice(start, start + phrase.length), highlighted: true },
    { text: content.slice(start + phrase.length), highlighted: false },
  ];
}

export function conductLines(content: string): string[] {
  return content
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(
      (line, index, lines) =>
        line.length > 0 || (index > 0 && index < lines.length - 1),
    );
}

export function conductParts(
  line: string,
  lineMatches: Match[],
): Array<{ text: string; level?: Level }> {
  const highlights: Array<{
    start: number;
    end: number;
    level: Level;
    priority: number;
  }> = [];
  for (const match of lineMatches) {
    const phrase = match.fraseClave ?? match.phrase ?? "";
    const start = line
      .toLocaleLowerCase("es")
      .indexOf(phrase.toLocaleLowerCase("es"));
    if (phrase && start >= 0)
      highlights.push({
        start,
        end: start + phrase.length,
        level: match.level,
        priority: priorities[match.level],
      });
  }
  const parts: Array<{ text: string; level?: Level }> = [];
  let cursor = 0;
  for (const highlight of highlights.sort(
    (a, b) => a.start - b.start || a.priority - b.priority,
  )) {
    if (highlight.start < cursor) continue;
    if (highlight.start > cursor)
      parts.push({ text: line.slice(cursor, highlight.start) });
    parts.push({
      text: line.slice(highlight.start, highlight.end),
      level: highlight.level,
    });
    cursor = highlight.end;
  }
  if (cursor < line.length) parts.push({ text: line.slice(cursor) });
  return parts;
}

export async function analyzeDocument(
  file: Blob,
  name: string,
  dictionary: DictionaryEntry[],
): Promise<{ histories: AnalyzeResponseHistory[] }> {
  const formData = new FormData();
  formData.append(
    "file",
    new File([file], name, { type: "application/pdf" }),
  );
  formData.append("dictionary", JSON.stringify(dictionary));
  const response = await fetch(`${getBackendUrl()}/api/conciliacion/analyze`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Backend no Conectado");
  return (await response.json()) as { histories: AnalyzeResponseHistory[] };
}

export async function fetchDocPdfNames(): Promise<string[]> {
  const response = await fetch("/api/doc-pdf");
  if (!response.ok) throw new Error("No fue posible consultar Doc_PDF.");
  const { names } = (await response.json()) as { names: string[] };
  return names;
}

export async function fetchDocPdfFile(name: string): Promise<File | null> {
  const response = await fetch(`/api/doc-pdf?name=${encodeURIComponent(name)}`);
  if (!response.ok) return null;
  return new File([await response.arrayBuffer()], name, {
    type: "application/pdf",
  });
}

export async function fetchDocPdfBlob(name: string): Promise<Blob> {
  const response = await fetch(`/api/doc-pdf?name=${encodeURIComponent(name)}`);
  return response.blob();
}

export async function uploadDocPdf(file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);
  const stored = await fetch("/api/doc-pdf", {
    method: "POST",
    body: formData,
  });
  if (!stored.ok)
    throw new Error("No fue posible guardar el documento en Doc_PDF.");
}
