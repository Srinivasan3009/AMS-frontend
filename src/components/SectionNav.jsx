
export default function SectionNav({ sections, activeSection, onSelect }) {
  return (
    <div className="d-flex flex-wrap gap-2 mb-4">
      {sections.map((section) => (
        <button
          key={section.key}
          type="button"
          className={
            "btn btn-sm rounded-pill " +
            (activeSection === section.key
              ? "btn-primary text-white"
              : "btn-outline-secondary")
          }
          onClick={() => onSelect(section.key)}
        >
          {section.label}
        </button>
      ))}
    </div>
  );
}
