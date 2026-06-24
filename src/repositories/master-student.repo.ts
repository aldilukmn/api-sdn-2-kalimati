import MasterStudentModel from "../models/schema/master-student.schema";

export default class MasterStudentRepository {
  static async countAll(): Promise<number> {
    return await MasterStudentModel.countDocuments();
  }
}
