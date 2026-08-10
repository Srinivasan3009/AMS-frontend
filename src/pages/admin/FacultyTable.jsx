import { useState } from "react";
import Pagination from "../../components/Pagination";

const ROWS_PER_PAGE = 20;

export default function FacultyTable({ facultyList, onModify }) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!facultyList || facultyList.length === 0) {
    return <p className="text-muted">No faculty records yet.</p>;
  }

  const totalPages = Math.ceil(facultyList.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const pageItems = facultyList.slice(startIndex, startIndex + ROWS_PER_PAGE);

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Faculty ID</th>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Mobile Number</th>
              <th>Email</th>
              <th>Address 1</th>
              <th>Address 2</th>
              <th>Active</th>
              <th>Date of Retirement</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((f) => (
              <tr key={f.faculty_id}>
                <td>{f.faculty_id}</td>
                <td>{f.name}</td>
                <td>{f.date_of_birth}</td>
                <td>{f.gender}</td>
                <td>{f.designation}</td>
                <td>{f.department}</td>
                <td>{f.mobile_number}</td>
                <td>{f.email}</td>
                <td>{f.address_1}</td>
                <td>{f.address_2}</td>
                <td>{f.active ? "Yes" : "No"}</td>
                <td>{f.date_of_retirement || "-"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onModify(f)}
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
