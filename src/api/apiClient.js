const API_URL = import.meta.env.VITE_API_URL;

/**
 * Shared fetch wrapper for all authenticated API calls.
 * - Always sends credentials (httpOnly cookie).
 * - On 401, throws Error("unauthorized") so callers can catch this specific
 *   message and redirect to login, instead of showing a confusing inline error.
 * - On other non-OK responses, throws the backend's error message (or a fallback).
 * - On success, returns the parsed JSON (or null for empty responses).
 */
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    throw new Error("unauthorized");
  }

  // Try to parse JSON regardless of status, since our backend always returns JSON bodies.
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error((data && data.error) || "Something went wrong");
  }

  return data;
}
