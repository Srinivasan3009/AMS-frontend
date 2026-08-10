import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAssignedCourses,
  getAssignedTerms,
  getGradeRoster,
  submitGrades,
} from "../../../api/grading";
import { downloadRosterAsCSV, parseGradesCSV } from "../../../utils/csvGrades";
import { handleApiError } from "../../../utils/handleApiError";

const DEPARTMENT_OPTIONS = ["CSE", "IT", "MECH", "CIVIL"];
const GRADE_OPTIONS = ["O", "A+", "A", "B+", "B", "C", "U", "RA", "SA", "W"];

export default function Grading() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [department, setDepartment] = useState("");
  const [courseOptions, setCourseOptions] = useState([]);
  const [courseNo, setCourseNo] = useState("");
  const [termOptions, setTermOptions] = useState([]);
  const [term, setTerm] = useState("");

  const [roster, setRoster] = useState([]); // [{ register_no, name, grade }]
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [failedRows, setFailedRows] = useState([]);
  const [emailFailures, setEmailFailures] = useState([]);
  const [saving, setSaving] = useState(false);

  // Load course options when department changes
  useEffect(() => {
    setCourseNo("");
    setTermOptions([]);
    setTerm("");
    setRoster([]);
    if (!department) {
      setCourseOptions([]);
      return;
    }
    let cancelled = false;
    getAssignedCourses(department)
      .then((data) => {
        if (!cancelled) setCourseOptions(data || []);
      })
      .catch((err) => {
        if (!cancelled) handleApiError(err, navigate, setError);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department]);

  // Load term options when course changes
  useEffect(() => {
    setTerm("");
    setRoster([]);
    if (!courseNo) {
      setTermOptions([]);
      return;
    }
    let cancelled = false;
    getAssignedTerms(courseNo)
      .then((data) => {
        if (!cancelled) setTermOptions(data || []);
      })
      .catch((err) => {
        if (!cancelled) handleApiError(err, navigate, setError);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseNo]);

  // Load roster when term changes
  useEffect(() => {
    if (!courseNo || !term) {
      setRoster([]);
      return;
    }
    let cancelled = false;
    setLoadingRoster(true);
    setError("");
    getGradeRoster(courseNo, term)
      .then((data) => {
        if (!cancelled) setRoster(data || []);
      })
      .catch((err) => {
        if (!cancelled) handleApiError(err, navigate, setError);
      })
      .finally(() => {
        if (!cancelled) setLoadingRoster(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseNo, term]);

  const handleGradeChange = (registerNo, newGrade) => {
    setRoster((prev) =>
      prev.map((r) => (r.register_no === registerNo ? { ...r, grade: newGrade } : r))
    );
  };

  const handleDownload = () => {
    downloadRosterAsCSV(roster, `${courseNo}_${term}_grades.csv`.replace(/\s+/g, "_"));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError("");
    try {
      const text = await file.text();
      const parsed = parseGradesCSV(text);

      setRoster((prev) =>
        prev.map((r) => {
          const match = parsed.find((p) => p.register_no === r.register_no);
          return match ? { ...r, grade: match.grade } : r;
        })
      );
    } catch (err) {
      setError(err.message);
    } finally {
      e.target.value = ""; // allow re-uploading the same filename later
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setFailedRows([]);
    setEmailFailures([]);
    setSaving(true);
    try {
      const gradesPayload = roster
        .filter((r) => r.grade)
        .map((r) => ({ register_no: r.register_no, grade: r.grade }));

      if (gradesPayload.length === 0) {
        setError("No grades entered to submit.");
        setSaving(false);
        return;
      }

      const result = await submitGrades({ course_no: courseNo, term, grades: gradesPayload });

      setSuccess(`${result.succeeded_count} grade(s) saved and student(s) notified by email.`);
      setFailedRows(result.failed || []);
      setEmailFailures(result.email_failures || []);

      // Refresh roster so the table reflects what actually got saved
      const refreshed = await getGradeRoster(courseNo, term);
      setRoster(refreshed || []);
    } catch (err) {
      handleApiError(err, navigate, setError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>Grading</h2>

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label className="form-label">Department</label>
          <select
            className="form-select"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">Select</option>
            {DEPARTMENT_OPTIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Course No</label>
          <select
            className="form-select"
            value={courseNo}
            onChange={(e) => setCourseNo(e.target.value)}
            disabled={!department || courseOptions.length === 0}
          >
            <option value="">Select</option>
            {courseOptions.map((c) => (
              <option key={c.course_no} value={c.course_no}>
                {c.course_no} - {c.course_name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Term</label>
          <select
            className="form-select"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            disabled={!courseNo || termOptions.length === 0}
          >
            <option value="">Select</option>
            {termOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {courseNo && term && (
        <div className="mb-3 d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={handleDownload} disabled={roster.length === 0}>
            Download Student List (CSV)
          </button>
          <button className="btn btn-outline-secondary btn-sm" onClick={handleUploadClick}>
            Upload Grades CSV
          </button>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      )}

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {success && <div className="alert alert-success py-2">{success}</div>}

      {failedRows.length > 0 && (
        <div className="alert alert-warning py-2">
          <strong>{failedRows.length} row(s) could not be saved:</strong>
          <ul className="mb-0 mt-1">
            {failedRows.map((f, i) => (
              <li key={i}>{f.register_no || "(blank)"} — {f.reason}</li>
            ))}
          </ul>
        </div>
      )}

      {emailFailures.length > 0 && (
        <div className="alert alert-warning py-2">
          <strong>Grade saved, but email notification failed for {emailFailures.length} student(s):</strong>
          <ul className="mb-0 mt-1">
            {emailFailures.map((f, i) => (
              <li key={i}>{f.register_no} — {f.reason}</li>
            ))}
          </ul>
        </div>
      )}

      {loadingRoster ? (
        <p>Loading roster...</p>
      ) : courseNo && term && roster.length > 0 ? (
        <>
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Register No</th>
                  <th>Name</th>
                  <th style={{ width: "160px" }}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((r) => (
                  <tr key={r.register_no}>
                    <td>{r.register_no}</td>
                    <td>{r.name}</td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={r.grade || ""}
                        onChange={(e) => handleGradeChange(r.register_no, e.target.value)}
                      >
                        <option value="">-</option>
                        {GRADE_OPTIONS.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Submit Grades"}
          </button>
        </>
      ) : courseNo && term ? (
        <p className="text-muted">No students registered for this course and term.</p>
      ) : null}
    </div>
  );
}
