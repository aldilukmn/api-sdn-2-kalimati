"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const master_student_schema_1 = __importDefault(require("../models/schema/master-student.schema"));
class MasterStudentRepository {
    static async countAll() {
        return await master_student_schema_1.default.countDocuments();
    }
    static async countByGrade(grade) {
        return await master_student_schema_1.default.countDocuments({ grade });
    }
    static async countByGradeAndGender(grade) {
        const result = await master_student_schema_1.default.aggregate([
            { $match: { grade } },
            { $group: { _id: "$gender", count: { $sum: 1 } } },
        ]);
        const male = result.find((r) => r._id === "L")?.count || 0;
        const female = result.find((r) => r._id === "P")?.count || 0;
        return { male, female };
    }
}
exports.default = MasterStudentRepository;
