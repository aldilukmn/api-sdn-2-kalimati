"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const student_attendance_repo_1 = __importDefault(require("../repositories/student-attendance.repo"));
const master_student_schema_1 = __importDefault(require("../models/schema/master-student.schema"));
class StudentAttendanceService {
    static createOrUpdate = async (payload) => {
        const { date, grade, entries } = payload;
        if (!date || !grade || !entries || entries.length === 0) {
            throw new Error("Data presensi tidak lengkap!");
        }
        const validStatuses = ["hadir", "sakit", "izin", "absen"];
        const docs = [];
        for (const entry of entries) {
            if (!entry.studentId ||
                !validStatuses.includes(entry.status)) {
                throw new Error(`Data entry tidak valid untuk studentId: ${entry.studentId}`);
            }
            const student = await master_student_schema_1.default.findOne({
                studentId: entry.studentId,
            });
            if (!student) {
                throw new Error(`Siswa dengan studentId ${entry.studentId} tidak ditemukan`);
            }
            docs.push({
                studentId: entry.studentId,
                name: student.name,
                grade,
                date,
                status: entry.status,
            });
        }
        await student_attendance_repo_1.default.deleteByGradeAndDate(grade, date);
        return await student_attendance_repo_1.default.createMany(docs);
    };
    static getByGradeAndDate = async (grade, date) => {
        if (!grade || !date) {
            throw new Error("Parameter grade dan date wajib diisi!");
        }
        return await student_attendance_repo_1.default.findByGradeAndDate(grade, date);
    };
    static getReportByGrade = async (grade, month, year) => {
        if (!grade) {
            throw new Error("Parameter grade wajib diisi!");
        }
        return await student_attendance_repo_1.default.findReportByGrade(grade, month, year);
    };
}
exports.default = StudentAttendanceService;
