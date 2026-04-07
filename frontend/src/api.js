const API_BASE = "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getTasks() {
  return request("/tasks");
}

export function addTask(title) {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export function toggleTask(id) {
  return request(`/tasks/${id}/toggle`, { method: "POST" });
}

export function pinTask(id) {
  return request(`/tasks/${id}/pin`, { method: "POST" });
}
