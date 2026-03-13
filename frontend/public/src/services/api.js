const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function handleResponse(response) {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (!response.ok) {
    const errorBody = isJson ? await response.json() : await response.text();
    const message = errorBody?.detail || errorBody?.message || JSON.stringify(errorBody);
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return isJson ? response.json() : null;
}

export async function analyzeArticle(url) {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  return handleResponse(response);
}

export async function compareArticles(url1, url2) {
  const response = await fetch(`${API_BASE}/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url1, url2 }),
  });

  return handleResponse(response);
}

export async function compareEvent(url) {
  const response = await fetch(`${API_BASE}/compare_event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  return handleResponse(response);
}
