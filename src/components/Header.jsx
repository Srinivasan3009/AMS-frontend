import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout } from "../api/auth";

export default function Header({ title }) {
  const navigate = useNavigate();
  const [user] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const handleLogout = async () => {
    try {
      await logout(); // clears the httpOnly cookie server-side
    } catch {
      // even if the network call fails, still clear local state and redirect
    }
    try {
      localStorage.removeItem("user");
    } catch {
      /* ignore localStorage errors */
    }
    navigate("/", { replace: true });
  };

  return (
    <header className="bg-primary text-white py-3 d-flex justify-content-between align-items-center px-4">
      <div>
        <h3 className="mb-0">Anna University</h3>
        {title ? <div className="small text-white-50">{title}</div> : null}
      </div>

      <div className="d-flex align-items-center gap-3">
        {user ? (
          <div className="text-end">
            <div className="fw-bold">{user.name}</div>
            <div className="small text-white-50">{user.role}</div>
          </div>
        ) : null}

        <button
          type="button"
          className="btn btn-sm btn-outline-light"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
