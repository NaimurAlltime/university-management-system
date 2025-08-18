export const Grade = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F", "NA"]

export const GradePoints: Record<string, number> = {
  "A+": 4.0,
  A: 3.75,
  "A-": 3.5,
  "B+": 3.25,
  B: 3.0,
  "B-": 2.75,
  "C+": 2.5,
  C: 2.25,
  "C-": 2.0,
  "D+": 1.75,
  D: 1.5,
  F: 0.0,
  NA: 0.0,
}

export const EnrolledCourseSearchableFields = ["student", "course", "semesterRegistration"]
