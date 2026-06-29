import MasterStudentModel from "../models/schema/master-student.schema";

export default class MasterStudentRepository {
  static async countAll(): Promise<number> {
    return await MasterStudentModel.countDocuments();
  }

  static async countByGrade(grade: string): Promise<number> {
    return await MasterStudentModel.countDocuments({ grade });
  }

  static async countByGradeAndGender(grade: string): Promise<{ male: number; female: number }> {
    const result = await MasterStudentModel.aggregate([
      { $match: { grade } },
      { $group: { _id: "$gender", count: { $sum: 1 } } },
    ]);
    const male = result.find((r: any) => r._id === "L")?.count || 0;
    const female = result.find((r: any) => r._id === "P")?.count || 0;
    return { male, female };
  }
}
