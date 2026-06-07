"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const registration_schema_1 = __importDefault(require("../models/schema/registration.schema"));
class RegistrationRepository {
    static async createRegistration(registration) {
        const newRegistration = new registration_schema_1.default(registration);
        return await newRegistration.save();
    }
    static async getAllRegistrations() {
        return await registration_schema_1.default.find().sort({
            createdAt: -1
        });
    }
    static async findByStudentNik(nik) {
        return registration_schema_1.default.findOne({
            "student.nik": nik
        });
    }
    static async getRegistrationById(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error(`invalid id format: ${id}`);
        }
        ;
        const registration = await registration_schema_1.default.findById(id);
        if (!registration) {
            throw new Error(`Registration with id ${id} not found!`);
        }
        ;
        return registration;
    }
    static async updateStatus(id, status) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error(`invalid id format: ${id}`);
        }
        return await registration_schema_1.default.findByIdAndUpdate(id, {
            status,
            updatedAt: new Date()
        }, { returnDocument: 'after' });
    }
}
exports.default = RegistrationRepository;
