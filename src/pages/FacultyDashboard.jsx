import { useState } from "react";
import Header from "../components/Header";
import SectionNav from "../components/SectionNav";
import FacultyProfile from "./faculty/sections/FacultyProfile";
import TeachingHistory from "./faculty/sections/TeachingHistory";
import CurrentSemester from "./faculty/sections/CurrentSemester";
import EmailLog from "./faculty/sections/EmailLog";
import Grading from "./faculty/sections/Grading";

const sections = [
  { key: "profile", label: "Personal Info" },
  { key: "history", label: "Teaching History" },
  { key: "current", label: "Current Semester" },
  { key: "grading", label: "Grading" },
  { key: "emaillog", label: "Email Log" }
];

const sectionComponents = {
  profile: FacultyProfile,
  history: TeachingHistory,
  current: CurrentSemester,
  grading: Grading,
  emaillog: EmailLog
};

export default function FacultyDashboard() {
  const [activeSection, setActiveSection] = useState("profile");
  const ActiveSectionComponent = sectionComponents[activeSection];

  return (
    <div>
      <Header title="Faculty Dashboard" />
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
