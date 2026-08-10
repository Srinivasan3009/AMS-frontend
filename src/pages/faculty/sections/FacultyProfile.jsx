import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFacultyDetails } from "../../../api/faculty";
import { handleApiError } from "../../../utils/handleApiError";

export default function FacultyProfile() {
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getFacultyDetails()
      .then((data) => {
        if (!cancelled) setFaculty(data);
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
    return <p>Loading faculty information...</p>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!faculty) {
    return <div className="alert alert-warning">No faculty information available.</div>;
  }

  return (
    <div>
      <h2>Personal Information</h2>
      <div className="row gy-3">
        <div className="col-md-6">
          <div className="border rounded p-3">
            <strong>Faculty ID</strong>
            <div>{faculty.faculty_id}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-3">
            <strong>Name</strong>
            <div>{faculty.name}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-3">
            <strong>Date of Birth</strong>
            <div>{faculty.date_of_birth}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-3">
            <strong>Gender</strong>
            <div>{faculty.gender}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-3">
            <strong>Designation</strong>
            <div>{faculty.designation}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-3">
            <strong>Department</strong>
            <div>{faculty.department}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-3">
            <strong>Mobile Number</strong>
            <div>{faculty.mobile_number}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-3">
            <strong>Email</strong>
            <div>{faculty.email}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-3">
            <strong>Address 1</strong>
            <div>{faculty.address_1}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-3">
            <strong>Address 2</strong>
            <div>{faculty.address_2}</div>
          </div>
        </div>
      </div>
    </div>
  );
}