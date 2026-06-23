export interface StudentAttendanceEntry {
  studentId: string;
  status: "hadir" | "sakit" | "izin" | "alpha";
}

export default interface StudentAttendanceRequest {
  date: string;
  grade: string;
  entries: StudentAttendanceEntry[];
}
