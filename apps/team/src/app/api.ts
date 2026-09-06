const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002';
const REQUEST_TIMEOUT_MS = 15000;

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }

  get unauthorized(): boolean {
    return this.status === 401;
  }

  get forbidden(): boolean {
    return this.status === 403;
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(`${apiUrl}${path}`, {
      ...options,
      credentials: 'include',
      signal: options.signal ?? controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch (requestError) {
    if (requestError instanceof Error && requestError.name === 'AbortError') {
      throw new Error('The request timed out. Check the API connection and try again.');
    }
    throw new Error('Unable to reach the API. Check your connection and try again.');
  } finally {
    clearTimeout(timeout);
  }

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof payload === 'object' &&
      payload !== null &&
      'message' in payload &&
      typeof payload.message === 'string'
        ? payload.message
        : undefined;
    throw new ApiError(
      response.status,
      message ?? `The request failed with status ${response.status}.`,
    );
  }
  if (payload === null) {
    throw new Error('The API returned an empty response.');
  }
  return payload as T;
}
