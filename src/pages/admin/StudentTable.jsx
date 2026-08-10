import { useState } from "react";
import Pagination from "../../components/Pagination";

const ROWS_PER_PAGE = 20;

export default function StudentTable({ studentList, onModify }) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!studentList || studentList.length === 0) {
    return <p className="text-muted">No student records yet.</p>;
  }

  const totalPages = Math.ceil(studentList.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const pageItems = studentList.slice(startIndex, startIndex + ROWS_PER_PAGE);

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Registration No</th>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Father Name</th>
              <th>Mother Name</th>
              <th>Degree</th>
              <th>Department</th>
              <th>Batch</th>
              <th>Joining Year</th>
              <th>Mobile Number</th>
              <th>Email</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((s) => (
              <tr key={s.register_no}>
                <td>{s.register_no}</td>
                <td>{s.name}</td>
                <td>{s.date_of_birth}</td>
                <td>{s.gender}</td>
                <td>{s.father_name}</td>
                <td>{s.mother_name}</td>
                <td>{s.degree}</td>
                <td>{s.department}</td>
                <td>{s.batch}</td>
                <td>{s.joining_year}</td>
                <td>{s.mobile_number}</td>
                <td>{s.email}</td>
                <td>{s.active ? "Yes" : "No"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onModify(s)}
                  >
                    Modify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
