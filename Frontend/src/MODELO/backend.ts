export function getBackendUrl(): string {
  return import.meta.env.PUBLIC_API_URL || "http://localhost:3001";
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${getBackendUrl()}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}
