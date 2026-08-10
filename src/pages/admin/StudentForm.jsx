import { useState } from "react";

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const DEGREE_OPTIONS = ["B.E", "B.Tech", "B.Sc", "M.E", "M.Tech"];
const DEPARTMENT_OPTIONS = ["CSE", "IT", "MECH", "CIVIL"];

// Generates rolling 4-year batch ranges, e.g. 2021-2025 ... 2027-2031
function generateBatchOptions() {
  const currentYear = new Date().getFullYear();
  const batches = [];
  for (let startYear = 2010; startYear <= currentYear ; startYear++) {
    batches.push(`${startYear}-${startYear + 4}`);
  }
  return batches;
}
const BATCH_OPTIONS = generateBatchOptions();

const BLANK_FORM = {
  register_no: "",
  name: "",
  date_of_birth: "",
  gender: "",
  father_name: "",
  mother_name: "",
  degree: "",
  department: "",
  batch: "",
  joining_year: "",
  mobile_number: "",
  email: "",
  password: "",
  active: true,
};

export default function StudentForm({ existingStudent, onSubmit, onCancel }) {
  const isModify = Boolean(existingStudent);

  const initialForm = existingStudent
    ? { ...BLANK_FORM, ...existingStudent, password: "" }
    : BLANK_FORM;

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (e) => {
    const value = field === "active" ? e.target.value === "true" : e.target.value;
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
      <h5 className="mb-3">{isModify ? "Modify Student" : "Create Student"}</h5>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Registration Number</label>
            <input
              type="text"
              className="form-control"
              value={form.register_no}
              onChange={handleChange("register_no")}
              disabled={isModify}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={form.name}
              onChange={handleChange("name")}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              value={form.date_of_birth}
              onChange={handleChange("date_of_birth")}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Gender</label>
            <select
              className="form-select"
              value={form.gender}
              onChange={handleChange("gender")}
              required
            >
              <option value="">Select</option>
              {GENDER_OPTIONS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Father Name</label>
            <input
              type="text"
              className="form-control"
              value={form.father_name}
              onChange={handleChange("father_name")}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Mother Name</label>
            <input
              type="text"
              className="form-control"
              value={form.mother_name}
              onChange={handleChange("mother_name")}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Degree</label>
            <select
              className="form-select"
              value={form.degree}
              onChange={handleChange("degree")}
              required
            >
              <option value="">Select</option>
              {DEGREE_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

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
            <label className="form-label">Joining Year</label>
            <input
              type="month"
              className="form-control"
              value={form.joining_year}
              onChange={handleChange("joining_year")}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Mobile Number</label>
            <input
              type="text"
              className="form-control"
              value={form.mobile_number}
              onChange={handleChange("mobile_number")}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Email ID</label>
            <input
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange("email")}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">
              Password {isModify && <span className="text-muted">(leave blank to keep unchanged)</span>}
            </label>
            <input
              type="password"
              className="form-control"
              value={form.password}
              onChange={handleChange("password")}
              required={!isModify}
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
