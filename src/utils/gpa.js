const GRADE_POINTS = {
  "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5,
  "U": 0, "RA": 0, "SA": 0, "W": 0,
};

// Computes credit-weighted GPA for a list of courses. Only courses with a
// grade already assigned are counted; ungraded courses are excluded entirely
// (not counted as 0) since they haven't been evaluated yet.
export function computeGPA(courses) {
  const graded = courses.filter((c) => c.grade && GRADE_POINTS[c.grade] !== undefined);
  if (graded.length === 0) return null;

  const totalPoints = graded.reduce((sum, c) => sum + GRADE_POINTS[c.grade] * c.credit, 0);
  const totalCredits = graded.reduce((sum, c) => sum + c.credit, 0);

  if (totalCredits === 0) return null;
  return (totalPoints / totalCredits).toFixed(2);
}
