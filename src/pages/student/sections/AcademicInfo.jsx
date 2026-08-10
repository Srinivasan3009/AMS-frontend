import { useEffect, useState } from "react";
import { getAcademicRecord } from "../../../api/student";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "../../../utils/handleApiError";
import { computeGPA } from "../../../utils/gpa";

export default function AcademicInfo() {
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getAcademicRecord()
      .then((data) => {
        if (cancelled) return;
        setRecord(data);
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
    return <p>Loading academic history...</p>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!record) {
    return <p className="text-muted">No academic information available.</p>;
  }

  const { student } = record;
  const courses = record.courses || [];

  const semesters = [...new Set(courses.map((c) => c.semester))].sort((a, b) => a - b);
  const totalCredits = courses.reduce((sum, c) => sum + (c.credit || 0), 0);
  const cgpa = computeGPA(courses);

  return (
    <div>
      <h2>Academic Information</h2>
      <div className="mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="card p-3">
              <h5>{student.name}</h5>
              <p className="mb-1 text-muted">Register No: {student.register_no}</p>
              <p className="mb-1 text-muted">Department: {student.department}</p>
              <p className="mb-1 text-muted">Batch: {student.batch}</p>
              <p className="mb-1 text-muted">Email: {student.email}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card p-3 bg-light">
              <p className="mb-2"><strong>Total courses registered</strong> {courses.length}</p>
              <p className="mb-2"><strong>Total credits</strong> {totalCredits}</p>
              <p className="mb-0"><strong>CGPA</strong> {cgpa !== null ? cgpa : "Not yet available"}</p>
            </div>
          </div>
        </div>
      </div>

      {semesters.length === 0 ? (
        <p className="text-muted">No course history available yet.</p>
      ) : (
        semesters.map((semester) => {
          const semesterCourses = courses.filter((c) => c.semester === semester);
          const semesterCredits = semesterCourses.reduce((sum, c) => sum + (c.credit || 0), 0);
          const sgpa = computeGPA(semesterCourses);

          return (
            <div key={semester} className="mb-4">
              <h5 className="text-primary">
                Semester {semester}
                <span className="text-muted small ms-2">
                  ({semesterCourses.length} course{semesterCourses.length !== 1 ? "s" : ""}, {semesterCredits} credits
                  {sgpa !== null ? `, SGPA ${sgpa}` : ""})
                </span>
              </h5>
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Course No</th>
                      <th>Course Name</th>
                      <th>Department</th>
                      <th>Term</th>
                      <th>Type</th>
                      <th>Category</th>
                      <th>Credit</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semesterCourses.map((course) => (
                      <tr key={`${course.term}-${course.course_no}`}>
                        <td>{course.course_no}</td>
                        <td>{course.course_name}</td>
                        <td>{course.department}</td>
                        <td>{course.term}</td>
                        <td>{course.course_type}</td>
                        <td>{course.course_category}</td>
                        <td>{course.credit}</td>
                        <td>
                          {course.grade ? (
                            <span className="badge bg-primary">{course.grade}</span>
                          ) : (
                            <span className="text-muted small">Pending</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
