import { json } from '@sveltejs/kit';

export function GET() {
  return json({ status: 'ok' }, { headers: { 'Access-Control-Allow-Origin': '*' } });
}
