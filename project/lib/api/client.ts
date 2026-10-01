/**
 * Centralized API client for FinSight.
 *
 * All API calls go through ONE base URL — NEXT_PUBLIC_API_BASE_URL —
 * which represents the Spring Cloud API Gateway. The frontend never
 * calls individual microservices directly.
 *
 * Current: returns mock data.
 * Future: requests will be routed through the API Gateway → Eureka → microservices.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

const TOKEN_STORAGE_KEY = 'finsight_token';

/** Token storage abstraction — centralizes token read/write. */
export const tokenStorage = {
  get(): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  },
  set(token: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  },
  clear(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  },
};

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Unified request function. In production this will perform a real
 * fetch to the API Gateway with the JWT in the Authorization header.
 * Currently returns mock data via the mock handlers.
 */
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  // Future production implementation (commented for clarity):
  //
  // const token = tokenStorage.get();
  // const response = await fetch(`${API_BASE_URL}${path}`, {
  //   method,
  //   headers: {
  //     'Content-Type': 'application/json',
  //     ...(token ? { Authorization: `Bearer ${token}` } : {}),
  //     ...headers,
  //   },
  //   body: body ? JSON.stringify(body) : undefined,
  // });
  // if (!response.ok) throw new ApiError(response.status, await response.text());
  // return response.json() as Promise<T>;

  // Mock mode — the mock service layer intercepts before this is reached.
  // This fallback simulates network latency.
  await new Promise((r) => setTimeout(r, 200));
  return body as unknown as T;
}

/** Builds the gateway URL for display/documentation purposes. */
export function gatewayUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}
