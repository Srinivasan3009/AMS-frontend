import { apiFetch } from "./apiClient";

export async function getEmailLog() {
  return apiFetch("/api/faculty/email-log");
}