import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { listPdfNames, readPdfFile, savePdfFile } from '$lib/server/docPdfStore';

export const GET: RequestHandler = async ({ url }) => {
  const requestedName = url.searchParams.get('name');
  if (requestedName) {
    const { contents, safeName } = await readPdfFile(requestedName);
    const encodedName = encodeURIComponent(safeName);
    return new Response(contents, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename="documento.pdf"; filename*=UTF-8''${encodedName}` } });
  }
  const names = await listPdfNames();
  return json({ names });
};

export const POST: RequestHandler = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File) || file.type !== 'application/pdf') {
    throw error(400, 'Solo se permiten archivos PDF.');
  }

  const storedName = await savePdfFile(file);
  return json({ name: storedName });
};
