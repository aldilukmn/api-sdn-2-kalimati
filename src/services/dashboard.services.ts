import RegistrationRepository from "../repositories/registration.repo";
import UserRepository from "../repositories/user.repo";
import MasterStudentRepository from "../repositories/master-student.repo";

export default class DashboardService {
  static getSummary = async () => {
    const [totalRegistrants, validated, unvalidated, totalStudents, totalTeachers] =
      await Promise.all([
        RegistrationRepository.getTotalCount(),
        RegistrationRepository.countByStatus("validated"),
        RegistrationRepository.countByStatus("unvalidated"),
        MasterStudentRepository.countAll(),
        UserRepository.countByRole("guru"),
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
