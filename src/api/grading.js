import { apiFetch } from "./apiClient";

export async function getAssignedCourses(department) {
  const query = department ? `?department=${encodeURIComponent(department)}` : "";
  return apiFetch(`/api/faculty/assigned-courses${query}`);
}

export async function getAssignedTerms(courseNo) {
  return apiFetch(`/api/faculty/assigned-terms?course_no=${encodeURIComponent(courseNo)}`);
}

export async function getGradeRoster(courseNo, term) {
  const params = new URLSearchParams({ course_no: courseNo, term });
  return apiFetch(`/api/faculty/grade-roster?${params.toString()}`);
}

export async function submitGrades(payload) {
  return apiFetch("/api/faculty/submit-grades", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}