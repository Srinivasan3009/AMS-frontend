import { useState } from "react";
import Pagination from "../../components/Pagination";

const ROWS_PER_PAGE = 20;

export default function CourseTable({ courseList, onModify }) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!courseList || courseList.length === 0) {
    return <p className="text-muted">No courses to show.</p>;
  }

  const totalPages = Math.ceil(courseList.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const pageItems = courseList.slice(startIndex, startIndex + ROWS_PER_PAGE);

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Course No</th>
              <th>Course Name</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Batch</th>
              <th>Type</th>
              <th>Category</th>
              <th>L-T-P</th>
              <th>TCP</th>
              <th>Credit</th>
              <th>Active</th>
              {onModify && <th></th>}
            </tr>
          </thead>
          <tbody>
            {pageItems.map((c) => (
              <tr key={c.course_no}>
                <td>{c.course_no}</td>
                <td>{c.course_name}</td>
                <td>{c.department}</td>
                <td>{c.semester}</td>
                <td>{c.batch}</td>
                <td>{c.course_type}</td>
                <td>{c.course_category}</td>
                <td>{c.lecture_hours}-{c.tutorial_hours}-{c.practical_hours}</td>
                <td>{c.tcp}</td>
                <td>{c.credit}</td>
                <td>{c.active ? "Yes" : "No"}</td>
                {onModify && (
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onModify(c)}
                    >
                      Modify
                    </button>
                  </td>
                )}
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
