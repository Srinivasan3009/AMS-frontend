/**
 * Call this in any catch block for an apiFetch-based call.
 * If the session expired (401 -> "unauthorized"), redirect to login.
 * Otherwise, pass the error message to the page's own error state setter.
 */
export function handleApiError(err, navigate, setError) {
  if (err.message === "unauthorized") {
    navigate("/", { replace: true });
    return;
  }
  setError(err.message);
}