import { Document } from "mongoose";

export type StudentAttendanceStatus = "hadir" | "sakit" | "izin" | "alpha";

export default interface StudentAttendance extends Document {
  studentId: string;
  name: string;
  grade: string;
  date: string;
  status: StudentAttendanceStatus;
  note?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
