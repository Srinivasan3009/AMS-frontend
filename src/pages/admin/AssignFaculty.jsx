import { useEffect, useMemo, useState } from "react";
import { listFaculty } from "../../api/faculty";
import { listCourses } from "../../api/course";
import { listAssignments, upsertAssignment } from "../../api/assignment";

const DEPARTMENT_OPTIONS = ["CSE", "IT", "MECH", "CIVIL"];

function yearOptions() {
  const y = new Date().getFullYear();
  return [y, y + 1];
}

export default function AssignFaculty() {
  const [month, setMonth] = useState(""); // "Jan" | "July"
  const [year, setYear] = useState(new Date().getFullYear());
  const term = useMemo(() => (month ? `${month} ${year}` : ""), [month, year]);

  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");

  const [facultyList, setFacultyList] = useState([]);
  const [courseList, setCourseList] = useState([]);

  const [rowFaculty, setRowFaculty] = useState({}); // map course_no -> faculty_id

  const [showElective, setShowElective] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // auto-dismiss success message after 3 seconds
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(id);
  }, [message]);

  // semester options depend on month
  const semesterOptions = useMemo(() => {
    if (month === "Jan") return [2, 4, 6, 8];
    if (month === "July") return [1, 3, 5, 7];
    return [];
  }, [month]);

  useEffect(() => {
    let cancelled = false;
    listFaculty()
      .then((data) => { if (!cancelled) setFacultyList(data || []); })
      .catch(() => { if (!cancelled) setFacultyList([]); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    // load courses when department+semester selected
    if (!department || !semester) {
      return;
    }
    let cancelled = false;
    listCourses(department, semester)
      .then((data) => { if (!cancelled) setCourseList(data || []); })
      .catch(() => { if (!cancelled) setCourseList([]); });
    return () => { cancelled = true; };
  }, [department, semester]);

  const computedBatch = useMemo(() => {
    const s = Number(semester);
    if (!month || !semester || Number.isNaN(s)) return "";
    let start;
    if (month === "July") {
      start = year - Math.floor((s - 1) / 2);
    } else if (month === "Jan") {
      start = year - Math.floor(s / 2);
    } else return "";
    return `${start}-${start + 4}`;
  }, [month, year, semester]);

  const handleLoadAssignments = async () => {
    setError("");
    if (!term || !department || !semester) {
      setError("Term, Department and Semester are required to load assignments");
      return;
    }
    try {
      const data = await listAssignments(term, department, semester);
      // build map of existing assignments to preselect faculty
      // normalize course_no keys (trim) to avoid mismatches
      const m = {};
      (data || []).forEach((a) => {
        if (a && a.course_no) m[String(a.course_no).trim()] = a.faculty_id;
      });
      setRowFaculty(m);
      console.log("loaded assignments:", data, "computed mapping:", m);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveRow = async (courseNo) => {
    setError("");
    setMessage("");
    const facultyId = rowFaculty[courseNo];
    if (!facultyId) {
      setError("Select a faculty before saving");
      return;
    }
    try {
      await upsertAssignment({ course_no: courseNo, faculty_id: facultyId, term, department, semester: Number(semester), batch: computedBatch });
      setMessage(`Saved assignment for ${courseNo}`);
      await handleLoadAssignments();
    } catch (err) {
      setError(err.message);
    }
  };

  // filter courses by category (core default) and electives only allowed for sem 7
  const filteredCourses = useMemo(() => {
    let list = courseList || [];
    if (showElective) list = list.filter((c) => c.course_category === "Elective");
    else list = list.filter((c) => c.course_category !== "Elective");
    return list;
  }, [courseList, showElective]);

  // reset elective toggle when semester changes to non-7 in the onChange handler

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Assign Faculty to Course</h4>
      </div>

      <div className="card p-3 mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-2">
            <label className="form-label">Month</label>
            <select className="form-select" value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="">Select</option>
              <option value="Jan">Jan</option>
              <option value="July">July</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Year</label>
            <select className="form-select" value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {yearOptions().map((y) => (<option key={y} value={y}>{y}</option>))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Department</label>
            <select className="form-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="">Select</option>
              {DEPARTMENT_OPTIONS.map((d) => (<option key={d} value={d}>{d}</option>))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Semester</label>
            <select className="form-select" value={semester} onChange={(e) => { setSemester(e.target.value); if (Number(e.target.value) !== 7) setShowElective(false); }}>
              <option value="">Select</option>
              {semesterOptions.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Batch</label>
            <input className="form-control" value={computedBatch} readOnly />
          </div>

          <div className="col-md-1 d-grid">
            <button className="btn btn-primary" onClick={handleLoadAssignments}>Load</button>
          </div>
        </div>
        {error && <div className="alert alert-danger mt-3 py-2">{error}</div>}
      </div>

      <div className="card p-3 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            {Number(semester) === 7 && (
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="electiveToggle" checked={showElective} onChange={(e) => setShowElective(e.target.checked)} />
                <label className="form-check-label" htmlFor="electiveToggle">Show Elective</label>
              </div>
            )}
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-sm table-striped align-middle">
            <thead>
              <tr>
                <th>Course No</th>
                <th>Course Name</th>
                <th>Category</th>
                <th>Assigned Faculty</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((c) => (
                <tr key={c.course_no}>
                  <td>{c.course_no}</td>
                  <td>{c.course_name}</td>
                  <td>{c.course_category || 'Core'}</td>
                  <td>
                    <select className="form-select" value={rowFaculty[c.course_no] || ""} onChange={(e) => setRowFaculty((prev) => ({ ...prev, [c.course_no]: e.target.value }))}>
                      <option value="">-- Select Faculty --</option>
                      {facultyList.map((f) => (
                        <option key={f.faculty_id} value={f.faculty_id}>{f.faculty_id} - {f.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-success" onClick={() => handleSaveRow(c.course_no)}>Save</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {message && <div className="alert alert-success mt-3 py-2">{message}</div>}
      </div>
    </div>
  );
}