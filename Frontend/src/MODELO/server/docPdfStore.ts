import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { randomUUID } from "node:crypto";

const documentsDirectory = join(process.cwd(), "..", "Doc_PDF");

async function ensureDocumentsDirectory(): Promise<void> {
  await mkdir(documentsDirectory, { recursive: true });
}

export async function listPdfNames(): Promise<string[]> {
  await ensureDocumentsDirectory();
  return (await readdir(documentsDirectory)).filter((name) =>
    name.toLowerCase().endsWith(".pdf"),
  );
}

export async function readPdfFile(requestedName: string) {
  await ensureDocumentsDirectory();
  const safeName = basename(requestedName);
  const contents = await readFile(join(documentsDirectory, safeName));
  return { contents, safeName };
}

export async function savePdfFile(file: File): Promise<string> {
  await ensureDocumentsDirectory();
  const safeName = basename(file.name).replace(/[^\p{L}\p{N}._-]/gu, "_");
  const storedName = `${Date.now()}-${randomUUID().slice(0, 8)}-${safeName}`;
  await writeFile(
    join(documentsDirectory, storedName),
    Buffer.from(await file.arrayBuffer()),
  );
  return storedName;
}
