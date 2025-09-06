// Utility for making authorized fetch requests
export async function fetchWithAuth(url: string, accessToken?: string, options: RequestInit = {}) {
  // Use accessToken from sessionStorage if not provided
  const token = accessToken || sessionStorage.getItem("accessToken") || "";
  const headers = {
    ...(options.headers || {}),
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const response = await fetch(url, { ...options, headers });
  return response;
}
