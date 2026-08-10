const API_URL = import.meta.env.VITE_API_URL;

export async function login(identifier, password) {
  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // required so the httpOnly JWT cookie gets stored
    body: JSON.stringify({ identifier, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data; // { message, role, name }
}

export async function checkAuth() {
  // Intentionally NOT using apiFetch here - checkAuth is used by ProtectedRoute
  // to silently verify a session, and returning null (not throwing) on failure
  // is the expected behavior for that use case.
  const res = await fetch(`${API_URL}/api/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    return null; // not authenticated
  }

  return res.json(); // { user_id, role }
}

export async function logout() {
  await fetch(`${API_URL}/api/logout`, {
    method: "POST",
    credentials: "include",
  });
}
