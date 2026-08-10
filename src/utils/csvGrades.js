// Builds a CSV string from the roster and triggers a browser download.
export function downloadRosterAsCSV(roster, filename) {
  const header = "register_no,name,grade";
  const rows = roster.map((r) => `${r.register_no},${r.name},${r.grade || ""}`);
  const csvContent = [header, ...rows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Parses an uploaded CSV file's text into { register_no, grade } pairs.
// Robust to column order via header names; ignores any extra columns.
export function parseGradesCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const registerNoIdx = header.indexOf("register_no");
  const gradeIdx = header.indexOf("grade");

  if (registerNoIdx === -1 || gradeIdx === -1) {
    throw new Error("CSV must have 'register_no' and 'grade' columns");
  }

  return lines.slice(1).map((line) => {
    const cols = line.split(",");
    return {
      register_no: (cols[registerNoIdx] || "").trim(),
      grade: (cols[gradeIdx] || "").trim().toUpperCase(),
    };
  }).filter((row) => row.register_no);
}
