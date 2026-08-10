import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentDetails } from "../../../api/student";

export default function StudentProfile() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDetails() {
      try {
        const data = await getStudentDetails();
        if (!cancelled) {
          setStudent(data);
          setError(null);
        }
      } catch (err) {
        if (cancelled) return;
        if (err.message === "unauthorized") {
          navigate("/", { replace: true });
          return;
        }
        setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDetails();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (loading) {
    return <p>Loading student information...</p>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!student) {
    return <div className="alert alert-warning">No student information available.</div>;
  }

  return (
    <div>
      <h2>Personal Information</h2>
      <div className="row gy-3">
        <div className="col-md-6">
          <div className="border rounded p-3">
            <strong>Name</strong>
            <div>{student.name}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-3">
            <strong>Register No</strong>
            <div>{student.register_no}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-3">
            <strong>Date of Birth</strong>
            <div>{student.date_of_birth}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-3">
            <strong>Gender</strong>
            <div>{student.gender}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-3">
            <strong>Father's Name</strong>
            <div>{student.father_name}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-3">
            <strong>Mother's Name</strong>
            <div>{student.mother_name}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-3">
            <strong>Department</strong>
            <div>{student.department}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-3">
            <strong>Batch</strong>
            <div>{student.batch}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-3">
            <strong>Joining Year</strong>
            <div>{student.joining_year}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-3">
            <strong>Mobile Number</strong>
            <div>{student.mobile_number}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-3">
            <strong>Email</strong>
            <div>{student.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
