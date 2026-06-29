import express from 'express';
// import Gtk from '../controllers/gtk';
import User from '../controllers/user.controller';
import UserMiddleware from '../middlewares';
import RegistrationController from '../controllers/registration.controller';
import StudentAttendanceController from '../controllers/student-attendance.controller';
import MasterStudentController from '../controllers/master-student.controller';
import DashboardController from '../controllers/dashboard.controller';
// import { handleImage } from '../utils';
// import UserMiddleware from '../middlewares/user';

const router = express.Router();
const baseUrl = '/api';
const userUrl = `${baseUrl}/user`;
const registrationUrl = `${baseUrl}/registration`;
const studentAttendanceUrl = `${baseUrl}/student-attendance`;

// FOR ADMIN
router.post(`${userUrl}`, UserMiddleware.verifyToken, UserMiddleware.isAdmin , User.register);
router.get(`${userUrl}`, UserMiddleware.verifyToken, UserMiddleware.isAdminOrHead, User.listUser);
router.delete(`${userUrl}/:id`, UserMiddleware.verifyToken, UserMiddleware.isAdmin, User.deleteUserById);
router.post(`${baseUrl}/login`, User.login);
router.post(`${baseUrl}/logout`, UserMiddleware.verifyToken, User.logout);
router.patch(`${userUrl}/:id`, UserMiddleware.verifyToken, UserMiddleware.isAdmin, User.updateUser);

// PPDB
router.post(
  `${registrationUrl}`,
  RegistrationController.register
);

router.get(
  `${registrationUrl}`, UserMiddleware.verifyToken, UserMiddleware.isAdminOrHead,
  RegistrationController.getAll
);

router.get(
  `${registrationUrl}/count`,
  RegistrationController.getTotalCount
);

router.get(
  `${registrationUrl}/:id`,
  RegistrationController.getById
);

router.patch(
  `${registrationUrl}/:id`,
  UserMiddleware.verifyToken, UserMiddleware.isAdmin,
  RegistrationController.updateData
);

// STUDENT ATTENDANCE
router.post(
  `${studentAttendanceUrl}`,
  UserMiddleware.verifyToken,
  UserMiddleware.isTeacherOrAdmin,
  UserMiddleware.verifyTeacherGrade,
  StudentAttendanceController.create
);

router.get(
  `${studentAttendanceUrl}`,
  StudentAttendanceController.getByGradeAndDate
);

router.get(
  `${studentAttendanceUrl}/report`,
  StudentAttendanceController.getReportByGrade
);

// MASTER STUDENTS
router.get(
  `${baseUrl}/students`,
  MasterStudentController.getByGrade
);

// TEACHER BY GRADE (PUBLIC)
router.get(
  `${baseUrl}/teacher-by-grade/:grade`,
  User.getTeacherByGrade
);

// DASHBOARD
router.get(
  `${baseUrl}/dashboard`,
  UserMiddleware.verifyToken,
  UserMiddleware.isAdminOrHead,
  DashboardController.getSummary
);

router.get(
  `${baseUrl}/dashboard/teacher`,
  UserMiddleware.verifyToken,
  UserMiddleware.isTeacher,
  DashboardController.getTeacherSummary
);

export default router;