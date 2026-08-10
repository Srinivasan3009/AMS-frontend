import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getRegistrationWindowStatus,
  getAvailableCourses,
  registerForCourse,
  getMyRegistrations,
} from "../../../api/registrationWindow";
import { handleApiError } from "../../../utils/handleApiError";

function formatDatetime(datetimeStr) {
  if (!datetimeStr) return "";
  const [date, time] = datetimeStr.split(" ");
  return `${date} ${time ? time.slice(0, 5) : ""}`;
}

export default function CourseRegistration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [windowStatus, setWindowStatus] = useState(null);
  const [semester, setSemester] = useState(null);
  const [courses, setCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [registeringCourseNo, setRegisteringCourseNo] = useState(null);
  const [actionError, setActionError] = useState("");

  const loadEverything = async () => {
    setLoading(true);
    setError("");
    try {
      const status = await getRegistrationWindowStatus();
      setWindowStatus(status);

      if (status.is_open) {
        const [data, myRegs] = await Promise.all([
          getAvailableCourses(),
          getMyRegistrations(),
        ]);
        setSemester(data.semester);
        setCourses(data.courses || []);
        setRegisteredCourses(myRegs.registered_courses || []);
      }
    } catch (err) {
      handleApiError(err, navigate, setError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadEverything();
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRegister = async (courseNo) => {
    setActionError("");
    setRegisteringCourseNo(courseNo);
    try {
      await registerForCourse(courseNo);
      setRegisteredCourses((prev) => [...prev, courseNo]);
    } catch (err) {
      handleApiError(err, navigate, setActionError);
    } finally {
      setRegisteringCourseNo(null);
    }
  };

  if (loading) {
    return <p>Checking registration status...</p>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!windowStatus || !windowStatus.is_open) {
    return (
      <div>
        <h2>Course Registration</h2>
        <div className="alert alert-warning">
          Course registration is not currently open.
          {windowStatus && windowStatus.start_datetime && (
            <div className="mt-2 small">
              Opens: {formatDatetime(windowStatus.start_datetime)} &nbsp;|&nbsp;
              Closes: {formatDatetime(windowStatus.end_datetime)}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Course Registration</h2>
      <p className="text-muted">
        Semester {semester} courses for your department. Register for courses below.
      </p>

      {actionError && <div className="alert alert-danger py-2">{actionError}</div>}

      {courses.length === 0 ? (
        <p className="text-muted">No courses found for your current semester.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Course No</th>
                <th>Course Name</th>
                <th>Type</th>
                <th>Category</th>
                <th>Credit</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => {
                const isRegistered = registeredCourses.includes(c.course_no);
                const isSubmitting = registeringCourseNo === c.course_no;
                return (
                  <tr key={c.course_no}>
                    <td>{c.course_no}</td>
                    <td>{c.course_name}</td>
                    <td>{c.course_type}</td>
                    <td>{c.course_category}</td>
                    <td>{c.credit}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${isRegistered ? "btn-outline-success" : "btn-success"}`}
                        disabled={isRegistered || isSubmitting}
                        onClick={() => handleRegister(c.course_no)}
                      >
                        {isRegistered ? "Registered" : isSubmitting ? "Registering..." : "Register"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
