import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentForm from "../../pages/admin/StudentForm";
import StudentTable from "../../pages/admin/StudentTable";
import { listStudents, createStudent, updateStudent } from "../../api/student";
import { handleApiError } from "../../utils/handleApiError";

export default function StudentAdmin() {
  const navigate = useNavigate();
  const [studentList, setStudentList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null); // null = create mode
  const [loadError, setLoadError] = useState("");

  const loadStudents = async () => {
    try {
      const data = await listStudents();
      setStudentList(data || []);
    } catch (err) {
      handleApiError(err, navigate, setLoadError);
    }
  };

  useEffect(() => {
    let cancelled = false;

    listStudents()
      .then((data) => {
        if (!cancelled) setStudentList(data || []);
      })
      .catch((err) => {
        if (!cancelled) handleApiError(err, navigate, setLoadError);
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleAddClick = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleModifyClick = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleFormSubmit = async (form, isModify) => {
    if (isModify) {
      await updateStudent(form.register_no, form);
    } else {
      await createStudent(form);
    }
    setShowForm(false);
    setEditingStudent(null);
    await loadStudents();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Student Admin</h4>
        {!showForm && (
          <button className="btn btn-success" onClick={handleAddClick}>
            + Add Student
          </button>
        )}
      </div>

      {showForm && (
        <StudentForm
          key={editingStudent ? editingStudent.register_no : "new"}
          existingStudent={editingStudent}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      {loadError && <div className="alert alert-danger">{loadError}</div>}

      <StudentTable studentList={studentList} onModify={handleModifyClick} />
    </div>
  );
}
