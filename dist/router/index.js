"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import Gtk from '../controllers/gtk';
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const middlewares_1 = __importDefault(require("../middlewares"));
const registration_controller_1 = __importDefault(require("../controllers/registration.controller"));
const student_attendance_controller_1 = __importDefault(require("../controllers/student-attendance.controller"));
const master_student_controller_1 = __importDefault(require("../controllers/master-student.controller"));
const dashboard_controller_1 = __importDefault(require("../controllers/dashboard.controller"));
// import { handleImage } from '../utils';
// import UserMiddleware from '../middlewares/user';
const router = express_1.default.Router();
const baseUrl = '/api';
const userUrl = `${baseUrl}/user`;
const registrationUrl = `${baseUrl}/registration`;
const studentAttendanceUrl = `${baseUrl}/student-attendance`;
// FOR ADMIN
router.post(`${userUrl}`, middlewares_1.default.verifyToken, middlewares_1.default.isAdmin, user_controller_1.default.register);
router.get(`${userUrl}`, middlewares_1.default.verifyToken, middlewares_1.default.isAdmin, user_controller_1.default.listUser);
router.post(`${baseUrl}/login`, user_controller_1.default.login);
router.post(`${baseUrl}/logout`, middlewares_1.default.verifyToken, user_controller_1.default.logout);
router.patch(`${userUrl}/:id`, middlewares_1.default.verifyToken, middlewares_1.default.isAdmin, user_controller_1.default.updateUser);
// PPDB
router.post(`${registrationUrl}`, registration_controller_1.default.register);
router.get(`${registrationUrl}`, middlewares_1.default.verifyToken, middlewares_1.default.isAdmin, registration_controller_1.default.getAll);
router.get(`${registrationUrl}/count`, registration_controller_1.default.getTotalCount);
router.get(`${registrationUrl}/:id`, registration_controller_1.default.getById);
router.patch(`${registrationUrl}/:id`, middlewares_1.default.verifyToken, middlewares_1.default.isAdmin, registration_controller_1.default.updateData);
// STUDENT ATTENDANCE
router.post(`${studentAttendanceUrl}`, middlewares_1.default.verifyToken, middlewares_1.default.isTeacherOrAdmin, middlewares_1.default.verifyTeacherGrade, student_attendance_controller_1.default.create);
router.get(`${studentAttendanceUrl}`, student_attendance_controller_1.default.getByGradeAndDate);
router.get(`${studentAttendanceUrl}/report`, student_attendance_controller_1.default.getReportByGrade);
// MASTER STUDENTS
router.get(`${baseUrl}/students`, master_student_controller_1.default.getByGrade);
// DASHBOARD
router.get(`${baseUrl}/dashboard`, middlewares_1.default.verifyToken, middlewares_1.default.isAdmin, dashboard_controller_1.default.getSummary);
exports.default = router;
