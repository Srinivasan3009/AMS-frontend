import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentCourses, getCourseStudents } from "../../../api/faculty";
import { handleApiError } from "../../../utils/handleApiError";
import CourseRosterModal from "../../../components/CourseRosterModal";

export default function CurrentSemester() {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rosterOpen, setRosterOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [roster, setRoster] = useState([]);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [rosterError, setRosterError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getCurrentCourses()
      .then((data) => {
        if (cancelled) return;
        setTerm(data.term);
        setCourses(data.courses || []);
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

  const loadCourseStudents = async (course) => {
    setSelectedCourse(course);
    setRosterLoading(true);
    setRosterError("");
    setRoster([]);
    setRosterOpen(true);

    try {
      const students = await getCourseStudents({
        courseNo: course.course_no,
        term,
        department: course.department,
        batch: course.batch,
      });
      setRoster(students || []);
    } catch (err) {
      handleApiError(err, navigate, setRosterError);
    } finally {
      setRosterLoading(false);
    }
  };

  if (loading) {
    return <p>Loading current semester courses...</p>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h2>Current Semester</h2>
      <p className="text-muted">Term: {term}</p>

      {courses.length === 0 ? (
        <p className="text-muted">No courses assigned to you for this term yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Course No</th>
                <th>Course Name</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Batch</th>
                <th>Type</th>
                <th>Category</th>
                <th>Credit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.course_no}>
                  <td>{c.course_no}</td>
                  <td>{c.course_name}</td>
                  <td>{c.department}</td>
                  <td>{c.semester}</td>
                  <td>{c.batch}</td>
                  <td>{c.course_type}</td>
                  <td>{c.course_category}</td>
                  <td>{c.credit}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => loadCourseStudents(c)}
                    >
                      View Students
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <CourseRosterModal
        open={rosterOpen}
        onClose={() => setRosterOpen(false)}
        course={selectedCourse}
        term={term}
        students={roster}
        loading={rosterLoading}
        error={rosterError}
      />
    </div>
  );
}