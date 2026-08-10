export default function CourseRosterModal({ open, onClose, course, term, students, loading, error }) {
  if (!open) return null;

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h5 className="modal-title">Student Roster</h5>
              <p className="mb-0 text-muted small">
                {course ? `${course.course_no} - ${course.course_name}` : "Course details"}
                {term ? ` | ${term}` : ""}
              </p>
            </div>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {loading ? (
              <div className="text-center py-4">Loading students...</div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : students && students.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-bordered align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Register No</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Batch</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.register_no}>
                        <td>{student.register_no}</td>
                        <td>{student.name}</td>
                        <td>{student.department}</td>
                        <td>{student.batch}</td>
                        <td>{student.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-muted">No students found for this course.</div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
