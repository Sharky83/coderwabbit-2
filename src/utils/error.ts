// Utility for fetch error handling
export async function safeFetch<T = unknown>(input: RequestInfo, init?: RequestInit): Promise<{ data?: T; error?: string }> {
  try {
    const res = await fetch(input, init);
    const data = await res.json();
    if (!res.ok) {
      return { error: data?.error || 'Unknown error' };
    }
    return { data };
  } catch (err) {
    let errorMsg = 'Unknown error';
    if (typeof err === 'string') errorMsg = err;
    else if (
      err &&
      typeof err === 'object' &&
      'message' in (err as Record<string, unknown>) &&
      typeof (err as { message?: unknown }).message === 'string'
    ) {
      errorMsg = (err as { message: string }).message;
    }
    return { error: errorMsg };
  }
}
