const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4040';

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const payload = (await response.json().catch(() => null)) as { message?: string } | T | null;
  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload ? payload.message : undefined;
    throw new Error(message ?? 'The request could not be completed.');
  }
  return payload as T;
}
