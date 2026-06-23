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
