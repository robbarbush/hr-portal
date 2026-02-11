const API_BASE = '/api';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Request failed');
  }
  return response.json();
}

export async function httpGet(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`);
  return handleResponse(response);
}

export async function httpPost(endpoint, data) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function httpPatch(endpoint, data) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function httpDelete(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}
