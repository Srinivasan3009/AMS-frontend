import { useState } from "react";

const DEPARTMENT_OPTIONS = ["CSE", "IT", "MECH", "CIVIL"];
const COURSE_TYPE_OPTIONS = ["Theory", "Lab", "Theory+Lab"];
const COURSE_CATEGORY_OPTIONS = ["Core", "Elective"];

function generateBatchOptions() {
  const currentYear = new Date().getFullYear();
  const batches = [];
  for (let startYear = currentYear - 5; startYear <= currentYear + 2; startYear++) {
    batches.push(`${startYear}-${startYear + 4}`);
  }
  return batches;
}
const BATCH_OPTIONS = generateBatchOptions();

const BLANK_FORM = {
  course_no: "",
  course_name: "",
  department: "",
  semester: "",
  batch: "",
  course_type: "",
  course_category: "Core",
  lecture_hours: 0,
  tutorial_hours: 0,
  practical_hours: 0,
  credit: "",
  active: true,
};

export default function CourseForm({ existingCourse, onSubmit, onCancel }) {
  const isModify = Boolean(existingCourse);

  const initialForm = existingCourse ? { ...BLANK_FORM, ...existingCourse } : BLANK_FORM;

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const tcp =
    (Number(form.lecture_hours) || 0) +
    (Number(form.tutorial_hours) || 0) +
    (Number(form.practical_hours) || 0);

  const handleChange = (field) => (e) => {
    let value = e.target.value;
    if (field === "active") value = value === "true";
    if (["semester", "lecture_hours", "tutorial_hours", "practical_hours", "credit"].includes(field)) {
      value = value === "" ? "" : Number(value);
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit(form, isModify);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card p-4 mb-4">
      <h5 className="mb-3">{isModify ? "Modify Course" : "Create Course"}</h5>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Department</label>
            <select
              className="form-select"
              value={form.department}
              onChange={handleChange("department")}
              required
            >
              <option value="">Select</option>
              {DEPARTMENT_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Semester</label>
            <input
              type="number"
              min="1"
              max="8"
              className="form-control"
              value={form.semester}
              onChange={handleChange("semester")}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Batch</label>
            <select
              className="form-select"
              value={form.batch}
              onChange={handleChange("batch")}
              required
            >
              <option value="">Select</option>
              {BATCH_OPTIONS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Course No</label>
            <input
              type="text"
              className="form-control"
              value={form.course_no}
              onChange={handleChange("course_no")}
              disabled={isModify}
              required
            />
          </div>

          <div className="col-md-8">
            <label className="form-label">Course Name</label>
            <input
              type="text"
              className="form-control"
              value={form.course_name}
              onChange={handleChange("course_name")}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Course Type</label>
            <select
              className="form-select"
              value={form.course_type}
              onChange={handleChange("course_type")}
              required
            >
              <option value="">Select</option>
              {COURSE_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={form.course_category}
              onChange={handleChange("course_category")}
              required
            >
              {COURSE_CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Credit</label>
            <input
              type="number"
              min="0"
              className="form-control"
              value={form.credit}
              onChange={handleChange("credit")}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">L (Lecture)</label>
            <input
              type="number"
              min="0"
              className="form-control"
              value={form.lecture_hours}
              onChange={handleChange("lecture_hours")}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">T (Tutorial)</label>
            <input
              type="number"
              min="0"
              className="form-control"
              value={form.tutorial_hours}
              onChange={handleChange("tutorial_hours")}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">P (Practical)</label>
            <input
              type="number"
              min="0"
              className="form-control"
              value={form.practical_hours}
              onChange={handleChange("practical_hours")}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">TCP</label>
            <input
              type="text"
              className="form-control"
              value={tcp}
              disabled
              readOnly
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Active</label>
            <select
              className="form-select"
              value={String(form.active)}
              onChange={handleChange("active")}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        {error && <div className="alert alert-danger mt-3 py-2">{error}</div>}

        <div className="mt-3">
          <button type="submit" className="btn btn-primary me-2" disabled={saving}>
            {saving ? "Saving..." : isModify ? "Update" : "Create"}
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}