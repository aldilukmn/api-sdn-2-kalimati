import RegistrationRepository from "../repositories/registration.repo";
import UserRepository from "../repositories/user.repo";
import MasterStudentRepository from "../repositories/master-student.repo";
import StudentAttendanceRepository from "../repositories/student-attendance.repo";

export default class DashboardService {
  static getSummary = async (month?: number, year?: number) => {
    const [totalRegistrants, validated, unvalidated, totalStudents, totalTeachers, attendanceByStatus, attendanceByGrade] =
      await Promise.all([
        RegistrationRepository.getTotalCount(),
        RegistrationRepository.countByStatus("validated"),
        RegistrationRepository.countByStatus("unvalidated"),
        MasterStudentRepository.countAll(),
        UserRepository.countByRole("guru"),
        StudentAttendanceRepository.countByStatus(month, year),
        StudentAttendanceRepository.attendanceRateByGrade(month, year),
      ]);

    return {
      totalRegistrants,
      validated,
      unvalidated,
      totalStudents,
      totalTeachers,
      attendanceByStatus,
      attendanceByGrade,
    };
  };
}
