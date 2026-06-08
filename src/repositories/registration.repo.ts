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

  static async updateStatus(
    id: string,
    status: 'unvalidated' | 'validated'
  ): Promise<Registration | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`invalid id format: ${id}`);
    }
    
    return await RegistrationModel.findByIdAndUpdate(
      id,
      { 
        status,
        updatedAt: new Date() 
      },
      { returnDocument: 'after' }
    );
  }
  static async getTotalCount(): Promise<number> {
  return await RegistrationModel.countDocuments();
}
}