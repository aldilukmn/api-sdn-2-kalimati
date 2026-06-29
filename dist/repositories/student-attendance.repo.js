"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const student_attendance_schema_1 = __importDefault(require("../models/schema/student-attendance.schema"));
class StudentAttendanceRepository {
    static async deleteByGradeAndDate(grade, date) {
        await student_attendance_schema_1.default.deleteMany({ grade, date });
    }
    static async createMany(entries) {
        return await student_attendance_schema_1.default.insertMany(entries);
    }
    static async findByGradeAndDate(grade, date) {
        return await student_attendance_schema_1.default.find({ grade, date }).sort({
            studentId: 1,
        });
    }
    static buildMonthFilter(month, year) {
        const filter = {};
        if (month && year) {
            const monthStr = String(month).padStart(2, "0");
            filter.date = { $regex: new RegExp(`^${year}-${monthStr}-`) };
        }
        else if (year) {
            filter.date = { $regex: new RegExp(`^${year}-`) };
        }
        return filter;
    }
    static async countByStatus(month, year) {
        const filter = this.buildMonthFilter(month, year);
        const results = await student_attendance_schema_1.default.aggregate([
            { $match: filter },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);
        const counts = { hadir: 0, sakit: 0, izin: 0, alpha: 0 };
        results.forEach((r) => {
            if (r._id in counts)
                counts[r._id] = r.count;
        });
        return counts;
    }
    static async countUniqueDates(month, year) {
        const filter = this.buildMonthFilter(month, year);
        const dates = await student_attendance_schema_1.default.distinct("date", filter);
        return dates.length;
    }
    static async attendanceRateByGrade(month, year) {
        const filter = this.buildMonthFilter(month, year);
        const results = await student_attendance_schema_1.default.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: "$grade",
                    total: { $sum: 1 },
                    hadir: { $sum: { $cond: [{ $eq: ["$status", "hadir"] }, 1, 0] } },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        return results.map((r) => ({
            grade: r._id,
            rate: r.total > 0 ? Math.round((r.hadir / r.total) * 100) : 0,
        }));
    }
    static async findReportByGrade(grade, month, year) {
        const filter = { grade };
        if (month && year) {
            const monthStr = String(month).padStart(2, "0");
            filter.date = { $regex: new RegExp(`^${year}-${monthStr}-`) };
        }
        else if (year) {
            filter.date = { $regex: new RegExp(`^${year}-`) };
        }
        return await student_attendance_schema_1.default.find(filter).sort({
            date: 1,
            studentId: 1,
        });
    }
}
exports.default = StudentAttendanceRepository;
