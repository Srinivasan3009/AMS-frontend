import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import FacultyAdmin from "./pages/admin/FacultyAdmin";
import StudentAdmin from "./pages/admin/StudentAdmin";
import CourseAdmin from "./pages/admin/CourseAdmin";
import AssignFaculty from "./pages/admin/AssignFaculty";
import MenuEnable from "./pages/admin/MenuEnable";
import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="faculty" element={<FacultyAdmin />} />
          <Route path="students" element={<StudentAdmin />} />
          <Route path="courses" element={<CourseAdmin />} />
          <Route path="assign-faculty" element={<AssignFaculty />} />
          <Route path="menu-enable" element={<MenuEnable />} />
        </Route>

        <Route
          path="/faculty/dashboard"
          element={
            <ProtectedRoute role="faculty">
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}