import { NavLink, Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";

const NAV_ITEMS = [
  { path: "faculty", label: "Faculty Admin" },
  { path: "students", label: "Student Admin" },
  { path: "courses", label: "Course Admin" },
  { path: "assign-faculty", label: "Assign Faculty to Course" },
  { path: "menu-enable", label: "Menu Enable" },
];

function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  // segments example: ["admin", "dashboard", "faculty"]

  const currentSection = NAV_ITEMS.find((item) => item.path === segments[2]);

  return (
    <nav aria-label="breadcrumb" className="px-4 pt-2">
      <ol className="breadcrumb mb-0">
        <li className="breadcrumb-item">Admin</li>
        {currentSection ? (
          <li className="breadcrumb-item active" aria-current="page">
            {currentSection.label}
          </li>
        ) : (
          <li className="breadcrumb-item active" aria-current="page">
            Dashboard
          </li>
        )}
      </ol>
    </nav>
  );
}

export default function AdminLayout() {
  return (
    <div>
      <Header title="Admin Dashboard" />

      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom px-4">
        <div className="navbar-nav flex-row flex-wrap gap-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                "nav-link" + (isActive ? " fw-bold text-primary" : "")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <Breadcrumbs />

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}