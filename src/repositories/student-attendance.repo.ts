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

  static buildMonthFilter(month?: number, year?: number): Record<string, any> {
    const filter: Record<string, any> = {};
    if (month && year) {
      const monthStr = String(month).padStart(2, "0");
      filter.date = { $regex: new RegExp(`^${year}-${monthStr}-`) };
    } else if (year) {
      filter.date = { $regex: new RegExp(`^${year}-`) };
    }
    return filter;
  }

  static async countByStatus(month?: number, year?: number): Promise<{ hadir: number; sakit: number; izin: number; absen: number }> {
    const filter = this.buildMonthFilter(month, year);
    const results = await StudentAttendanceModel.aggregate([
      { $match: filter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const counts = { hadir: 0, sakit: 0, izin: 0, absen: 0 };
    results.forEach((r: { _id: string; count: number }) => {
      if (r._id in counts) (counts as any)[r._id] = r.count;
    });
    return counts;
  }

  static async countUniqueDates(month?: number, year?: number): Promise<number> {
    const filter = this.buildMonthFilter(month, year);
    const dates = await StudentAttendanceModel.distinct("date", filter);
    return dates.length;
  }

  static async attendanceRateByGrade(month?: number, year?: number): Promise<{ grade: string; rate: number; studentCount: number }[]> {
    const filter = this.buildMonthFilter(month, year);
    const results = await StudentAttendanceModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$grade",
          total: { $sum: 1 },
          hadir: { $sum: { $cond: [{ $eq: ["$status", "hadir"] }, 1, 0] } },
          studentIds: { $addToSet: "$studentId" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    return results.map((r: { _id: string; total: number; hadir: number; studentIds: string[] }) => ({
      grade: r._id,
      rate: r.total > 0 ? Math.round((r.hadir / r.total) * 100) : 0,
      studentCount: r.studentIds.length,
    }));
  }

  static async findReportByGrade(
    grade: string,
    month?: number,
    year?: number
  ): Promise<any[]> {
    const filter: Record<string, any> = { grade };

    if (month && year) {
      const monthStr = String(month).padStart(2, "0");
      filter.date = { $regex: new RegExp(`^${year}-${monthStr}-`) };
    } else if (year) {
      filter.date = { $regex: new RegExp(`^${year}-`) };
    }

    return await StudentAttendanceModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$studentId",
          name: { $first: "$name" },
          hadir: { $sum: { $cond: [{ $eq: ["$status", "hadir"] }, 1, 0] } },
          sakit: { $sum: { $cond: [{ $eq: ["$status", "sakit"] }, 1, 0] } },
          izin: { $sum: { $cond: [{ $eq: ["$status", "izin"] }, 1, 0] } },
          absen: { $sum: { $cond: [{ $eq: ["$status", "absen"] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }
}
