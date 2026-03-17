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

const isUrl = (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export async function analyzeArticle({ url, headline, text }) {
  let payload;

  if (url && url.trim().length > 0) {
    payload = { url };
  } else {
    payload = {
      headline: headline || null,
      text: text,
    };
  }

  const response = await fetch(`${API_BASE}/analyze/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function compareArticles(input1, input2) {
  const payload = {
    ...(isUrl(input1) ? { url1: input1 } : { text1: input1 }),
    ...(isUrl(input2) ? { url2: input2 } : { text2: input2 }),
  };

  const response = await fetch(`${API_BASE}/compare/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function compareEvent(url) {
  const response = await fetch(`${API_BASE}/compare_event/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  return handleResponse(response);
}
