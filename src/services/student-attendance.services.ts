import StudentAttendanceRequest from "../models/dto/student-attendance.dto";
import StudentAttendance from "../models/entity/student-attendance.entity";
import StudentAttendanceRepository from "../repositories/student-attendance.repo";
import MasterStudentModel from "../models/schema/master-student.schema";

export default class StudentAttendanceService {
  static createOrUpdate = async (
    payload: StudentAttendanceRequest
  ): Promise<StudentAttendance[]> => {
    const { date, grade, entries } = payload;

    if (!date || !grade || !entries || entries.length === 0) {
      throw new Error("Data presensi tidak lengkap!");
    }

    const validStatuses = ["hadir", "sakit", "izin", "absen"];

    const docs: any[] = [];
    for (const entry of entries) {
      if (
        !entry.studentId ||
        !validStatuses.includes(entry.status)
      ) {
        throw new Error(
          `Data entry tidak valid untuk studentId: ${entry.studentId}`
        );
      }

      const student = await MasterStudentModel.findOne({
        studentId: entry.studentId,
      });
      if (!student) {
        throw new Error(
          `Siswa dengan studentId ${entry.studentId} tidak ditemukan`
        );
      }

      docs.push({
        studentId: entry.studentId,
        name: student.name,
        grade,
        date,
        status: entry.status,
      });
    }

    await StudentAttendanceRepository.deleteByGradeAndDate(grade, date);
    return await StudentAttendanceRepository.createMany(docs as StudentAttendance[]);
  };

  static getByGradeAndDate = async (
    grade: string,
    date: string
  ): Promise<StudentAttendance[]> => {
    if (!grade || !date) {
      throw new Error("Parameter grade dan date wajib diisi!");
    }
    return await StudentAttendanceRepository.findByGradeAndDate(grade, date);
  };

  static getReportByGrade = async (
    grade: string,
    month?: number,
    year?: number
  ): Promise<any[]> => {
    if (!grade) {
      throw new Error("Parameter grade wajib diisi!");
    }
    return await StudentAttendanceRepository.findReportByGrade(
      grade,
      month,
      year
    );
  };
}
