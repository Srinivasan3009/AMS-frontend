import { apiFetch } from "./apiClient";

export async function listFaculty() {
  return apiFetch("/api/admin/faculty");
}

export async function createFaculty(payload) {
  return apiFetch("/api/admin/faculty", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateFaculty(facultyId, payload) {
  return apiFetch(`/api/admin/faculty/${facultyId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getFacultyDetails() {
  return apiFetch("/api/faculty/details");
}

export async function getCurrentCourses() {
  return apiFetch("/api/faculty/current-courses");
}

export async function getTeachingHistory() {
  return apiFetch("/api/faculty/teaching-history");
}

export async function getCourseStudents({ courseNo, term, department, batch }) {
  const params = new URLSearchParams({
    course_no: courseNo,
    term,
    department,
    batch,
  });
  return apiFetch(`/api/faculty/course-students?${params.toString()}`);
}

