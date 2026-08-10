import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTeachingHistory, getCourseStudents } from "../../../api/faculty";
import { handleApiError } from "../../../utils/handleApiError";
import CourseRosterModal from "../../../components/CourseRosterModal";

export default function TeachingHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rosterOpen, setRosterOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [roster, setRoster] = useState([]);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [rosterError, setRosterError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getTeachingHistory()
      .then((data) => {
        if (!cancelled) setHistory(data || []);
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
        term: course.term,
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
    return <p>Loading teaching history...</p>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Group entries by term for a cleaner display
  const groupedByTerm = history.reduce((groups, entry) => {
    if (!groups[entry.term]) groups[entry.term] = [];
    groups[entry.term].push(entry);
    return groups;
  }, {});

  const terms = Object.keys(groupedByTerm);

  return (
    <div>
      <h2>Teaching History</h2>

      {terms.length === 0 ? (
        <p className="text-muted">No past teaching records yet.</p>
      ) : (
        terms.map((term) => (
          <div key={term} className="mb-4">
            <h6 className="text-primary">{term}</h6>
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
                  {groupedByTerm[term].map((c) => (
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
          </div>
        ))
      )}      <CourseRosterModal
        open={rosterOpen}
        onClose={() => setRosterOpen(false)}
        course={selectedCourse}
        term={selectedCourse?.term}
        students={roster}
        loading={rosterLoading}
        error={rosterError}
      />    </div>
  );
}