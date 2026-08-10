import { useState } from "react";
import Header from "../components/Header";
import SectionNav from "../components/SectionNav";
import StudentProfile from "./student/sections/StudentProfile";
import AcademicInfo from "./student/sections/AcademicInfo";
import CourseRegistration from "./student/sections/CourseRegistration";
import GradeViewer from "./student/sections/GradeViewer";

const sections = [
  { key: "profile", label: "Personal Info" },
  { key: "academics", label: "Academic Info" },
  { key: "registration", label: "Course Registration" },
  { key: "grades", label: "Grade Viewer" },
];

const sectionComponents = {
  profile: StudentProfile,
  academics: AcademicInfo,
  registration: CourseRegistration,
  grades: GradeViewer,
};

export default function StudentDashboard() {
  const [activeSection, setActiveSection] = useState("profile");
  const ActiveSectionComponent = sectionComponents[activeSection];

  return (
    <div>
      <Header title="Student Dashboard" />
      <main className="p-4">
        <SectionNav
          sections={sections}
          activeSection={activeSection}
          onSelect={setActiveSection}
        />
        <div className="card p-4">
          <ActiveSectionComponent />
        </div>
      </main>
    </div>
  );
}
