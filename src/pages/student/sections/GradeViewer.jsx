import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAcademicRecord } from "../../../api/student";
import { handleApiError } from "../../../utils/handleApiError";
import { computeGPA } from "../../../utils/gpa";

export default function GradeViewer() {
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("recent"); // "recent" | "all" | semester number

  useEffect(() => {
    let cancelled = false;

    getAcademicRecord()
      .then((data) => {
        if (cancelled) return;
        setRecord(data);
        const semesters = [...new Set((data.courses || []).map((c) => c.semester))];
        if (semesters.length > 0) {
          setSemesterFilter(Math.max(...semesters)); // default to most recent semester
        }
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
    return <p>Loading transcript...</p>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!record) {
    return <p className="text-muted">No transcript available.</p>;
  }

  const { student } = record;
  const courses = record.courses || [];
  const allSemesters = [...new Set(courses.map((c) => c.semester))].sort((a, b) => a - b);
  const cgpa = computeGPA(courses);
  const totalCredits = courses
    .filter((c) => c.grade)
    .reduce((sum, c) => sum + (c.credit || 0), 0);

  const semestersToShow =
    semesterFilter === "all"
      ? allSemesters
      : semesterFilter === "recent"
      ? allSemesters.slice(-1)
      : [Number(semesterFilter)];

  return (
    <div>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .transcript-page { padding: 0 !important; }
        }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-3 no-print">
        <h2 className="mb-0">Grade Viewer</h2>
        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select form-select-sm"
            style={{ width: "180px" }}
            value={semesterFilter}
            onChange={(e) => {
              const val = e.target.value;
              setSemesterFilter(val === "all" ? "all" : Number(val) || val);
            }}
          >
            <option value="recent">Recent Semester</option>
            <option value="all">All Semesters</option>
            {allSemesters.map((s) => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
          <button className="btn btn-outline-primary btn-sm" onClick={() => window.print()}>
            Print
          </button>
        </div>
      </div>

      <div className="transcript-page border rounded p-4">
        <div className="text-center mb-4">
          <h4 className="mb-1">Anna University</h4>
          <div className="text-muted small">Academic Transcript</div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <p className="mb-1"><strong>Name:</strong> {student.name}</p>
            <p className="mb-1"><strong>Register No:</strong> {student.register_no}</p>
          </div>
          <div className="col-md-6">
            <p className="mb-1"><strong>Department:</strong> {student.department}</p>
            <p className="mb-1"><strong>Batch:</strong> {student.batch}</p>
          </div>
        </div>

        {semestersToShow.length === 0 ? (
          <p className="text-muted">No grades recorded yet.</p>
        ) : (
          semestersToShow.map((semester) => {
            const semesterCourses = courses.filter((c) => c.semester === semester);
            const sgpa = computeGPA(semesterCourses);

            return (
              <div key={semester} className="mb-4">
                <h6 className="border-bottom pb-1">
                  Semester {semester}
                  {sgpa !== null && <span className="float-end">SGPA: {sgpa}</span>}
                </h6>
                <table className="table table-sm table-bordered mb-1">
                  <thead className="table-light">
                    <tr>
                      <th>Course No</th>
                      <th>Course Name</th>
                      <th>Credit</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semesterCourses.map((c) => (
                      <tr key={`${c.term}-${c.course_no}`}>
                        <td>{c.course_no}</td>
                        <td>{c.course_name}</td>
                        <td>{c.credit}</td>
                        <td>{c.grade || "In Progress"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })
        )}

        {semesterFilter === "all" && (
          <div className="border-top pt-3 mt-4 d-flex justify-content-between">
            <div><strong>Total Credits Earned:</strong> {totalCredits}</div>
            <div><strong>CGPA:</strong> {cgpa !== null ? cgpa : "N/A"}</div>
          </div>
        )}
      </div>
    </div>
  );
}