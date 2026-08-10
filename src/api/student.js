import { apiFetch } from "./apiClient";

export async function listStudents() {
  return apiFetch("/api/admin/students");
}

export async function createStudent(payload) {
  return apiFetch("/api/admin/students", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateStudent(registerNo, payload) {
  return apiFetch(`/api/admin/students/${registerNo}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getStudentDetails() {
  return apiFetch("/api/student/details");
}

export async function getAcademicRecord() {
  return apiFetch("/api/student/academic-record");
}
