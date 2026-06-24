"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const registration_repo_1 = __importDefault(require("../repositories/registration.repo"));
const user_repo_1 = __importDefault(require("../repositories/user.repo"));
const master_student_repo_1 = __importDefault(require("../repositories/master-student.repo"));
class DashboardService {
    static getSummary = async () => {
        const [totalRegistrants, validated, unvalidated, totalStudents, totalTeachers] = await Promise.all([
            registration_repo_1.default.getTotalCount(),
            registration_repo_1.default.countByStatus("validated"),
            registration_repo_1.default.countByStatus("unvalidated"),
            master_student_repo_1.default.countAll(),
            user_repo_1.default.countByRole("guru"),
        ]);
        return {
            totalRegistrants,
            validated,
            unvalidated,
            totalStudents,
            totalTeachers,
        };
    };
}
exports.default = DashboardService;
