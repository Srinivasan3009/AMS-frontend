import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmailLog } from "../../../api/emailLog";
import { handleApiError } from "../../../utils/handleApiError";

export default function EmailLog() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getEmailLog()
      .then((data) => {
        if (!cancelled) setLogs(data || []);
      })
      .catch((err) => {
        if (!cancelled) handleApiError(err, navigate, setError);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (loading) {
    return <p>Loading email log...</p>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const successCount = logs.filter((l) => l.status === "success").length;
  const failureCount = logs.filter((l) => l.status === "failure").length;

  return (
    <div>
      <h2>Email Log</h2>
      <p className="text-muted">
        A record of every grade notification email sent from your account, and whether it was delivered successfully.
      </p>

      <div className="d-flex gap-3 mb-3">
        <span className="badge bg-success">Sent: {successCount}</span>
        <span className="badge bg-danger">Failed: {failureCount}</span>
      </div>

      {logs.length === 0 ? (
        <p className="text-muted">No email notifications sent yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Register No</th>
                <th>Student</th>
                <th>Course</th>
                <th>Term</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Reason (if failed)</th>
                <th>Sent At</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id}>
                  <td>{l.register_no}</td>
                  <td>{l.student_name}</td>
                  <td>{l.course_no} - {l.course_name}</td>
                  <td>{l.term}</td>
                  <td>{l.grade}</td>
                  <td>
                    {l.status === "success" ? (
                      <span className="badge bg-success">Success</span>
                    ) : (
                      <span className="badge bg-danger">Failed</span>
                    )}
                  </td>
                  <td className="text-muted small">{l.failure_reason || "-"}</td>
                  <td>{l.sent_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}