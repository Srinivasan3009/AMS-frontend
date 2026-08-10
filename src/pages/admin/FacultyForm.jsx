import { useState } from "react";

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const DESIGNATION_OPTIONS = ["Assistant Professor", "Associate Professor", "Professor"];
const DEPARTMENT_OPTIONS = ["CSE", "IT", "MECH", "CIVIL"];

const BLANK_FORM = {
  faculty_id: "",
  name: "",
  date_of_birth: "",
  gender: "",
  designation: "",
  department: "",
  mobile_number: "",
  email: "",
  address_1: "",
  address_2: "",
  password: "",
  active: true,
  date_of_retirement: "",
};

export default function FacultyForm({ existingFaculty, onSubmit, onCancel }) {
  const isModify = Boolean(existingFaculty);

  // Computed once per mount (see key= usage where this component is rendered,
  // which forces a fresh mount whenever we switch between create/modify).
  const initialForm = existingFaculty
    ? {
        ...BLANK_FORM,
        ...existingFaculty,
        password: "", // never pre-fill password
        date_of_retirement: existingFaculty.date_of_retirement || "",
      }
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
      const payload = {
        ...form,
        date_of_retirement: form.date_of_retirement === "" ? null : form.date_of_retirement,
      };
      await onSubmit(payload, isModify);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card p-4 mb-4">
      <h5 className="mb-3">{isModify ? "Modify Faculty" : "Create Faculty"}</h5>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Faculty ID</label>
            <input
              type="text"
              className="form-control"
              value={form.faculty_id}
              onChange={handleChange("faculty_id")}
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
            <label className="form-label">Designation</label>
            <select
              className="form-select"
              value={form.designation}
              onChange={handleChange("designation")}
              required
            >
              <option value="">Select</option>
              {DESIGNATION_OPTIONS.map((d) => (
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
            <label className="form-label">Mobile Number</label>
            <input
              type="text"
              className="form-control"
              value={form.mobile_number}
              onChange={handleChange("mobile_number")}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Email ID</label>
            <input
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange("email")}
              required
            />
          </div>

          <div className="col-md-6">
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

          <div className="col-md-6">
            <label className="form-label">Address 1</label>
            <input
              type="text"
              className="form-control"
              value={form.address_1}
              onChange={handleChange("address_1")}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Address 2</label>
            <input
              type="text"
              className="form-control"
              value={form.address_2}
              onChange={handleChange("address_2")}
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

          <div className="col-md-4">
            <label className="form-label">
              Date of Retirement <span className="text-muted">(optional)</span>
            </label>
            <input
              type="date"
              className="form-control"
              value={form.date_of_retirement || ""}
              onChange={handleChange("date_of_retirement")}
            />
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