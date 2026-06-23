"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const master_student_schema_1 = __importDefault(require("../models/schema/master-student.schema"));
const utils_1 = require("../utils");
class MasterStudentController {
    static getByGrade = async (req, res) => {
        try {
            const grade = req.query.grade;
            if (!grade) {
                res
                    .status(400)
                    .json((0, utils_1.defaultResponse)(400, "fail", "Parameter grade wajib diisi!"));
                return;
            }
            const validGrades = ["1", "2", "3", "4", "5", "6"];
            if (!validGrades.includes(grade)) {
                res.status(400).json((0, utils_1.defaultResponse)(400, "fail", "Kelas tidak ditemukan!"));
            }
            const students = await master_student_schema_1.default.find({ grade }).sort({
                studentId: 1,
            });
            res
                .status(200)
                .json((0, utils_1.defaultResponse)(200, "success", "Data siswa berhasil diambil", students));
        }
        catch (e) {
            if (e instanceof Error) {
                res.status(500).json((0, utils_1.defaultResponse)(500, "fail", e.message));
            }
        }
    };
}
exports.default = MasterStudentController;
