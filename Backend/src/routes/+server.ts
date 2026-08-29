import { json } from '@sveltejs/kit';

export function GET() {
  return json({
    name: 'Vidanova Navigator API',
    status: 'ok',
    health: '/api/health'
  });
}
