import { error, json } from '@sveltejs/kit';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { RequestHandler } from './$types';

const documentsDirectory = join(process.cwd(), '..', 'Doc_PDF');

export const GET: RequestHandler = async ({ url }) => {
  await mkdir(documentsDirectory, { recursive: true });
  const requestedName = url.searchParams.get('name');
  if (requestedName) {
    const safeName = basename(requestedName);
    const contents = await readFile(join(documentsDirectory, safeName));
    const encodedName = encodeURIComponent(safeName);
    return new Response(contents, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename="documento.pdf"; filename*=UTF-8''${encodedName}` } });
  }
  const names = (await readdir(documentsDirectory)).filter((name) => name.toLowerCase().endsWith('.pdf'));
  return json({ names });
};

export const POST: RequestHandler = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File) || file.type !== 'application/pdf') {
    throw error(400, 'Solo se permiten archivos PDF.');
  }

  await mkdir(documentsDirectory, { recursive: true });
  const safeName = basename(file.name).replace(/[^\p{L}\p{N}._-]/gu, '_');
  const storedName = `${Date.now()}-${randomUUID().slice(0, 8)}-${safeName}`;
  await writeFile(join(documentsDirectory, storedName), Buffer.from(await file.arrayBuffer()));

  return json({ name: storedName });
};
