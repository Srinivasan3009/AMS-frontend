const ROLE_ROUTES = {
  admin: "/admin/dashboard",
  faculty: "/faculty/dashboard",
  student: "/student/dashboard",
};

export function getDashboardPath(role) {
  return ROLE_ROUTES[role] || "/";
}
