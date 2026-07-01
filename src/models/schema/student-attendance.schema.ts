import mongoose, { Schema } from "mongoose";
import StudentAttendance from "../entity/student-attendance.entity";

const StudentAttendanceSchema: Schema = new Schema(
  {
    studentId: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    grade: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["hadir", "sakit", "izin", "absen"],
      required: true,
    },
    note: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    collection: "student_attendances",
    timestamps: true,
  }
);

StudentAttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });
StudentAttendanceSchema.index({ grade: 1, date: 1 });

const StudentAttendanceModel = mongoose.model<StudentAttendance>(
  "student_attendances",
  StudentAttendanceSchema
);

export default StudentAttendanceModel;
