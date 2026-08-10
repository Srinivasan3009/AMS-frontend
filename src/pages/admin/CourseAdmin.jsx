import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseForm from "../../pages/admin/CourseForm";
import CourseTable from "../../pages/admin/CourseTable";
import { listCourses, createCourse, updateCourse } from "../../api/course";
import { handleApiError } from "../../utils/handleApiError";

const DEPARTMENT_OPTIONS = ["CSE", "IT", "MECH", "CIVIL"];

export default function CourseAdmin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null); // null | "create" | "modify" | "view"

  // shared list of all courses, used to populate the "Modify" dropdown
  const [allCourses, setAllCourses] = useState([]);
  const [loadError, setLoadError] = useState("");

  // modify mode
  const [selectedCourseNo, setSelectedCourseNo] = useState("");

  // view mode
  const [viewDept, setViewDept] = useState("");
  const [viewSemester, setViewSemester] = useState("");
  const [viewResults, setViewResults] = useState([]);
  const [viewError, setViewError] = useState("");

  const loadAllCourses = async () => {
    try {
      const data = await listCourses();
      setAllCourses(data || []);
    } catch (err) {
      handleApiError(err, navigate, setLoadError);
    }
  };

  useEffect(() => {
    let cancelled = false;

    listCourses()
      .then((data) => {
        if (!cancelled) setAllCourses(data || []);
      })
      .catch((err) => {
        if (!cancelled) handleApiError(err, navigate, setLoadError);
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleFormSubmit = async (form, isModify) => {
    if (isModify) {
      await updateCourse(form.course_no, form);
    } else {
      await createCourse(form);
    }
    setMode(null);
    setSelectedCourseNo("");
    await loadAllCourses();
  };

  const handleViewSearch = async () => {
    setViewError("");
    if (!viewDept || !viewSemester) {
      setViewError("Select both Department and Semester");
      return;
    }
    try {
      const data = await listCourses(viewDept, viewSemester);
      setViewResults(data || []);
    } catch (err) {
      handleApiError(err, navigate, setViewError);
    }
  };

  const courseBeingModified = allCourses.find((c) => c.course_no === selectedCourseNo);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Course Admin</h4>
        <div className="btn-group">
          <button
            className={`btn btn-outline-success ${mode === "create" ? "active" : ""}`}
            onClick={() => { setMode("create"); setSelectedCourseNo(""); }}
          >
            + Create Course
          </button>
          <button
            className={`btn btn-outline-primary ${mode === "modify" ? "active" : ""}`}
            onClick={() => setMode("modify")}
          >
            Modify Course
          </button>
          <button
            className={`btn btn-outline-secondary ${mode === "view" ? "active" : ""}`}
            onClick={() => setMode("view")}
          >
            View Course
          </button>
        </div>
      </div>

      {mode === "create" && (
        <CourseForm
          key="new"
          existingCourse={null}
          onSubmit={handleFormSubmit}
          onCancel={() => setMode(null)}
        />
      )}

      {mode === "modify" && (
        <div className="card p-3 mb-4">
          <label className="form-label">Select Course</label>
          <select
            className="form-select mb-3"
            value={selectedCourseNo}
            onChange={(e) => setSelectedCourseNo(e.target.value)}
          >
            <option value="">-- Select Course No / Name --</option>
            {allCourses.map((c) => (
              <option key={c.course_no} value={c.course_no}>
                {c.course_no} - {c.course_name}
              </option>
            ))}
          </select>

          {courseBeingModified && (
            <CourseForm
              key={courseBeingModified.course_no}
              existingCourse={courseBeingModified}
              onSubmit={handleFormSubmit}
              onCancel={() => { setMode(null); setSelectedCourseNo(""); }}
            />
          )}
        </div>
      )}

      {mode === "view" && (
        <div className="card p-3 mb-4">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                value={viewDept}
                onChange={(e) => setViewDept(e.target.value)}
              >
                <option value="">Select</option>
                {DEPARTMENT_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Semester</label>
              <select
                className="form-select"
                value={viewSemester}
                onChange={(e) => setViewSemester(e.target.value)}
              >
                <option value="">Select</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <button className="btn btn-primary" onClick={handleViewSearch}>
                Search
              </button>
            </div>
          </div>
          {viewError && <div className="alert alert-danger mt-3 py-2">{viewError}</div>}
        </div>
      )}

      {loadError && <div className="alert alert-danger">{loadError}</div>}

      {mode === "view" ? (
        <CourseTable courseList={viewResults} onModify={null} />
      ) : (
        <CourseTable courseList={allCourses} onModify={(course) => { setMode("modify"); setSelectedCourseNo(course.course_no); }} />
      )}
    </div>
  );
}
