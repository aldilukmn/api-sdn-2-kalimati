import StudentAttendance from "../models/entity/student-attendance.entity";
import StudentAttendanceModel from "../models/schema/student-attendance.schema";

export default class StudentAttendanceRepository {
  static async deleteByGradeAndDate(
    grade: string,
    date: string
  ): Promise<void> {
    await StudentAttendanceModel.deleteMany({ grade, date });
  }

  static async createMany(
    entries: StudentAttendance[]
  ): Promise<StudentAttendance[]> {
    return await StudentAttendanceModel.insertMany(entries);
  }

  static async findByGradeAndDate(
    grade: string,
    date: string
  ): Promise<StudentAttendance[]> {
    return await StudentAttendanceModel.find({ grade, date }).sort({
      studentId: 1,
    });
  }

  static async findReportByGrade(
    grade: string,
    month?: number,
    year?: number
  ): Promise<StudentAttendance[]> {
    const filter: Record<string, any> = { grade };

    if (month && year) {
      const monthStr = String(month).padStart(2, "0");
      filter.date = { $regex: new RegExp(`^${year}-${monthStr}-`) };
    } else if (year) {
      filter.date = { $regex: new RegExp(`^${year}-`) };
    }

    return await StudentAttendanceModel.find(filter).sort({
      date: 1,
      studentId: 1,
    });
  }
}
