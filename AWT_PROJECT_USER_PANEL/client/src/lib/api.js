export function getApiBaseUrl() {
  return import.meta.env.VITE_API_URL || 'http://localhost:3000';
}

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const url = `${getApiBaseUrl()}${path}`;
  const headers = {};
  let payload;

  if (body instanceof FormData) {
    payload = body;
  } else if (body) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { method, headers, body: payload });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    const message = data.message || data.error || 'Request failed';
    throw new Error(message);
  }
  return data;
}


