import { apiFetch } from "./apiClient";

export async function listAssignments(term, department, semester) {
  const params = new URLSearchParams();
  if (term) params.append("term", term);
  if (department) params.append("department", department);
  if (semester) params.append("semester", semester);

  const query = [...params].length ? `?${params.toString()}` : "";
  return apiFetch(`/api/admin/assignments${query}`);
}

export async function upsertAssignment(payload) {
  return apiFetch("/api/admin/assignments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export default { listAssignments, upsertAssignment };
