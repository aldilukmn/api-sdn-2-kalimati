"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const student_attendance_services_1 = __importDefault(require("../services/student-attendance.services"));
const utils_1 = require("../utils");
class StudentAttendanceController {
    static create = async (req, res) => {
        try {
            const payload = req.body;
            const result = await student_attendance_services_1.default.createOrUpdate(payload);
            res
                .status(201)
                .json((0, utils_1.defaultResponse)(201, "success", "Data presensi berhasil disimpan", result));
        }
        catch (e) {
            if (e instanceof Error) {
                res.status(400).json((0, utils_1.defaultResponse)(400, "fail", e.message));
            }
        }
    };
    static getByGradeAndDate = async (req, res) => {
        try {
            const grade = req.query.grade;
            const date = req.query.date;
            const result = await student_attendance_services_1.default.getByGradeAndDate(grade, date);
            res
                .status(200)
                .json((0, utils_1.defaultResponse)(200, "success", "Data presensi berhasil diambil", result));
        }
        catch (e) {
            if (e instanceof Error) {
                res.status(400).json((0, utils_1.defaultResponse)(400, "fail", e.message));
            }
        }
    };
    static getReportByGrade = async (req, res) => {
        try {
            const grade = req.query.grade;
            const month = req.query.month ? Number(req.query.month) : undefined;
            const year = req.query.year ? Number(req.query.year) : undefined;
            const result = await student_attendance_services_1.default.getReportByGrade(grade, month, year);
            res
                .status(200)
                .json((0, utils_1.defaultResponse)(200, "success", "Rekap presensi berhasil diambil", result));
        }
        catch (e) {
            if (e instanceof Error) {
                res.status(400).json((0, utils_1.defaultResponse)(400, "fail", e.message));
            }
        }
    };
}
exports.default = StudentAttendanceController;
