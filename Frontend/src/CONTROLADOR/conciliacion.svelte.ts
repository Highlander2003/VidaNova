import {
  type DictionaryEntry,
  type DocumentItem,
  type Level,
  buildDefaultDictionary,
  normalizeMatches,
  analyzeDocument,
  fetchDocPdfNames,
  fetchDocPdfBlob,
  fetchDocPdfFile,
  uploadDocPdf,
} from "$modelo/conciliacion";
import { checkBackendHealth } from "$modelo/backend";

export class ConciliacionController {
  dictionary = $state<DictionaryEntry[]>(buildDefaultDictionary());
  dictionaryOpen = $state(false);
  editingEntryId = $state<number | null>(null);
  draftPhrase = $state("");
  draftLevel = $state<Level>("AMARILLO");

  documents = $state<DocumentItem[]>([]);
  selectedDocumentId = $state<number | null>(null);
  selectedHistoryId = $state<number | null>(null);
  error = $state("");
  decision = $state("");
  backendConnected = $state(false);

  selectedDocument = $derived(
    this.documents.find((document) => document.id === this.selectedDocumentId),
  );
  selectedHistory = $derived(
    this.selectedDocument?.histories.find(
      (history) => history.id === this.selectedHistoryId,
    ) ?? null,
  );
  matches = $derived(this.selectedHistory?.matches ?? []);

  async checkBackend(): Promise<void> {
    this.backendConnected = await checkBackendHealth();
  }

  async refreshMatches(): Promise<void> {
    for (const document of this.documents) {
      try {
        const blob = await fetchDocPdfBlob(document.name);
        const result = await analyzeDocument(blob, document.name, this.dictionary);
        this.documents = this.documents.map((item) =>
          item.id === document.id
            ? {
                ...item,
                histories: result.histories.map((history, index) => ({
                  ...history,
                  id: document.id + index + 1,
                  matches: normalizeMatches(history.matches),
                })),
              }
            : item,
        );
      } catch {
        this.backendConnected = false;
      }
    }
  }

  startEdit(entry: DictionaryEntry): void {
    this.editingEntryId = entry.id;
    this.draftPhrase = entry.phrase;
    this.draftLevel = entry.level;
  }

  saveEntry(): void {
    const phrase = this.draftPhrase.trim();
    if (!phrase) return;
    const entry = {
      phrase,
      pattern: phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      level: this.draftLevel,
    };
    if (this.editingEntryId === null)
      this.dictionary = [...this.dictionary, { ...entry, id: Date.now() }];
    else
      this.dictionary = this.dictionary.map((item) =>
        item.id === this.editingEntryId ? { ...item, ...entry } : item,
      );
    this.editingEntryId = null;
    this.draftPhrase = "";
    void this.refreshMatches();
  }

  deleteEntry(id: number): void {
    this.dictionary = this.dictionary.filter((entry) => entry.id !== id);
    if (this.editingEntryId === id) this.editingEntryId = null;
    void this.refreshMatches();
  }

  async loadFolder(): Promise<void> {
    try {
      const names = await fetchDocPdfNames();
      await Promise.all(
        names.map(async (name) => {
          const file = await fetchDocPdfFile(name);
          if (!file) return;
          await this.readPdf(file, false);
        }),
      );
    } catch (cause) {
      this.error =
        cause instanceof Error
          ? cause.message
          : "No fue posible consultar Doc_PDF.";
    }
  }

  async readPdf(file: File, persist = true): Promise<void> {
    this.error = "";
    this.decision = "";
    if (file.type !== "application/pdf") {
      this.error = "Selecciona un archivo PDF válido.";
      return;
    }
    const id = Date.now() + Math.random();
    this.documents = [
      { id, name: file.name, status: "procesando", histories: [] },
      ...this.documents,
    ];
    this.selectedDocumentId = id;
    try {
      if (persist) await uploadDocPdf(file);
      const result = await analyzeDocument(file, file.name, this.dictionary);
      this.backendConnected = true;
      const histories = result.histories.map((history, index) => ({
        ...history,
        id: id + index + 1,
        matches: normalizeMatches(history.matches),
      }));
      this.documents = this.documents.map((document) =>
        document.id === id
          ? { ...document, status: "listo" as const, histories }
          : document,
      );
      this.selectedHistoryId = null;
    } catch (cause) {
      if (
        cause instanceof TypeError ||
        (cause instanceof Error && cause.message.includes("Backend"))
      )
        this.backendConnected = false;
      const message =
        cause instanceof Error
          ? `No fue posible leer el PDF: ${cause.message}`
          : "No fue posible leer el PDF.";
      this.error = message;
      this.documents = this.documents.map((document) =>
        document.id === id
          ? { ...document, status: "error" as const, error: message }
          : document,
      );
    }
  }

  selectDocument(document: DocumentItem): void {
    this.selectedDocumentId = document.id;
    this.selectedHistoryId = document.histories[0]?.id ?? null;
    this.decision = "";
  }
}
