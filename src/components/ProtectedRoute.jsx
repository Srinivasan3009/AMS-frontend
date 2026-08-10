import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkAuth } from "../api/auth";

export default function ProtectedRoute({ role, children }) {
  const [status, setStatus] = useState("checking"); // "checking" | "authorized" | "unauthorized"

  useEffect(() => {
    checkAuth().then((data) => {
      if (data && data.role === role) {
        setStatus("authorized");
      } else {
        setStatus("unauthorized");
      }
    });
  }, [role]);

  if (status === "checking") {
    return <p>Checking session...</p>;
  }

  if (status === "unauthorized") {
    return <Navigate to="/" replace />;
  }

  return children;
}
