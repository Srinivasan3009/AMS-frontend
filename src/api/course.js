import { apiFetch } from "./apiClient";

export async function listCourses(department, semester, batch, category) {
  const params = new URLSearchParams();
  if (department) params.append("department", department);
  if (semester) params.append("semester", semester);
  if (batch) params.append("batch", batch);
  if (category) params.append("category", category);

  const query = [...params].length ? `?${params.toString()}` : "";
  return apiFetch(`/api/admin/courses${query}`);
}

export async function createCourse(payload) {
  return apiFetch("/api/admin/courses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCourse(courseNo, payload) {
  return apiFetch(`/api/admin/courses/${courseNo}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
