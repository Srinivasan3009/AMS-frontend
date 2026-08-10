import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRegistrationWindow, setRegistrationWindow } from "../../api/registrationWindow";
import { handleApiError } from "../../utils/handleApiError";

// Splits a "YYYY-MM-DD HH:MM:SS" timestamp string into separate date and time parts
// for pre-filling the date/time input fields.
function splitDatetime(datetimeStr) {
  if (!datetimeStr) return { date: "", time: "" };
  const [date, time] = datetimeStr.split(" ");
  return { date, time: time ? time.slice(0, 5) : "" };
}

export default function MenuEnable() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getRegistrationWindow()
      .then((data) => {
        if (cancelled) return;
        const start = splitDatetime(data.start_datetime);
        const end = splitDatetime(data.end_datetime);
        setStartDate(start.date);
        setStartTime(start.time);
        setEndDate(end.date);
        setEndTime(end.time);
      })
      .catch((err) => {
        if (!cancelled) handleApiError(err, navigate, setError);
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await setRegistrationWindow({
        start_date: startDate,
        start_time: startTime,
        end_date: endDate,
        end_time: endTime,
      });
      setSuccess("Registration window saved.");
    } catch (err) {
      handleApiError(err, navigate, setError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h4 className="mb-3">Menu Enable</h4>
      <p className="text-muted">
        Set the window during which Course Registration is open to students.
        Students will only see and register for their courses within this time range.
      </p>

      <div className="card p-4" style={{ maxWidth: "600px" }}>
        <h5 className="mb-3">Course Registration Window</h5>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                className="form-control"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">End Time</label>
              <input
                type="time"
                className="form-control"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <div className="alert alert-danger mt-3 py-2">{error}</div>}
          {success && <div className="alert alert-success mt-3 py-2">{success}</div>}

          <button type="submit" className="btn btn-primary mt-3" disabled={saving}>
            {saving ? "Saving..." : "Save Window"}
          </button>
        </form>
      </div>
    </div>
  );
}
