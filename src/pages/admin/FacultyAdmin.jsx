import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FacultyForm from "../../pages/admin/FacultyForm";
import FacultyTable from "../../pages/admin/FacultyTable";
import SearchInput from "../../components/SearchInput";
import { listFaculty, createFaculty, updateFaculty } from "../../api/faculty";
import { handleApiError } from "../../utils/handleApiError";

export default function FacultyAdmin() {
  const navigate = useNavigate();
  const [facultyList, setFacultyList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null); // null = create mode
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");

  const loadFaculty = async () => {
    try {
      const data = await listFaculty();
      setFacultyList(data || []);
    } catch (err) {
      handleApiError(err, navigate, setLoadError);
    }
  };

  useEffect(() => {
    let cancelled = false;

    listFaculty()
      .then((data) => {
        if (!cancelled) setFacultyList(data || []);
      })
      .catch((err) => {
        if (!cancelled) handleApiError(err, navigate, setLoadError);
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleAddClick = () => {
    setEditingFaculty(null);
    setShowForm(true);
  };

  const handleModifyClick = (faculty) => {
    setEditingFaculty(faculty);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingFaculty(null);
  };

  const handleFormSubmit = async (form, isModify) => {
    if (isModify) {
      await updateFaculty(form.faculty_id, form);
    } else {
      await createFaculty(form);
    }
    setShowForm(false);
    setEditingFaculty(null);
    await loadFaculty();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Faculty Admin</h4>
        {!showForm && (
          <button className="btn btn-success" onClick={handleAddClick}>
            + Add Faculty
          </button>
        )}
      </div>

      {showForm && (
        <FacultyForm
          key={editingFaculty ? editingFaculty.faculty_id : "new"}
          existingFaculty={editingFaculty}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      {loadError && <div className="alert alert-danger">{loadError}</div>}

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by ID, name, department, designation..."
      />

      <FacultyTable
        key={search}
        facultyList={facultyList.filter((f) => {
          const q = search.toLowerCase();
          return (
            f.faculty_id?.toLowerCase().includes(q) ||
            f.name?.toLowerCase().includes(q) ||
            f.department?.toLowerCase().includes(q) ||
            f.designation?.toLowerCase().includes(q) ||
            f.email?.toLowerCase().includes(q)
          );
        })}
        onModify={handleModifyClick}
      />
    </div>
  );
}
