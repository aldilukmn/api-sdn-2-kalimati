import mongoose from 'mongoose';
import RegistrationRequest from '../models/dto/registration.dto';
import Registration from '../models/entity/registration.entity';
import RegistrationModel from '../models/schema/registration.schema';

export default class RegistrationRepository {
  static async createRegistration(
    registration: RegistrationRequest
  ): Promise<Registration> {
    const newRegistration = new RegistrationModel(
      registration
    );

    return await newRegistration.save();
  }

  static async getAllRegistrations(): Promise<Registration[]> {
    return await RegistrationModel.find().sort({
      createdAt: -1
    });
  }

  static async findByStudentNik(
  nik: string
  ): Promise<Registration | null> {
    return RegistrationModel.findOne({
      "student.nik": nik
    });
  }

  static async getRegistrationById(
    id: string
  ): Promise<Registration | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`invalid id format: ${id}`);
    };
    const registration = await RegistrationModel.findById(id);
    if (!registration) {
      throw new Error(`Registration with id ${id} not found!`)
    };
    return registration;
  }

  static async updateRegistration(
    id: string,
    data: Partial<RegistrationRequest>
  ): Promise<Registration | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`invalid id format: ${id}`);
    }

    return await RegistrationModel.findByIdAndUpdate(
      id,
      { $set: data },
      { returnDocument: 'after' }
    );
  }
  static async getTotalCount(): Promise<number> {
    return await RegistrationModel.countDocuments();
  }

  static async countByStatus(status: string): Promise<number> {
    const filter: Record<string, string> = { status };
    return await RegistrationModel.countDocuments(filter as any);
  }
}