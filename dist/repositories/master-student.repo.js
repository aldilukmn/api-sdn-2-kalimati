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
}
exports.default = MasterStudentRepository;
