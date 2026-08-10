import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { getDashboardPath } from "../utils/roleRedirect";

export default function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(identifier, password);
      // persist minimal profile info for UI (role, name, identifier)
      try { localStorage.setItem('user', JSON.stringify({ role: data.role, name: data.name, identifier })); } catch { /* ignore localStorage errors */ }
      navigate(getDashboardPath(data.role));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Username</label>
        <input
          type="text"
          className="form-control"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Register No / Faculty ID / Username"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
        {loading ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}