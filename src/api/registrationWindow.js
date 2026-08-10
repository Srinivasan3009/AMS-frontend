import { apiFetch } from "./apiClient";

// Admin
export async function getRegistrationWindow() {
  return apiFetch("/api/admin/menu-windows/course-registration");
}

export async function setRegistrationWindow(payload) {
  return apiFetch("/api/admin/menu-windows/course-registration", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Student
export async function getRegistrationWindowStatus() {
  return apiFetch("/api/student/registration-window");
}

export async function getAvailableCourses() {
  return apiFetch("/api/student/available-courses");
}

export async function registerForCourse(courseNo) {
  return apiFetch("/api/student/register-course", {
    method: "POST",
    body: JSON.stringify({ course_no: courseNo }),
  });
}

export async function getMyRegistrations() {
  return apiFetch("/api/student/my-registrations");
}
