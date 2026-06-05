"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const normalize_1 = require("../helper/normalize");
const registration_repo_1 = __importDefault(require("../repositories/registration.repo"));
const utils_1 = require("../utils");
const registration_schema_1 = __importDefault(require("../models/schema/registration.schema"));
class RegistrationService {
    static register = async (payload) => {
        try {
            const { student, father, mother, contactPhoneNumber } = payload;
            const existingStudent = await registration_repo_1.default.findByStudentNik(student.nik);
            if (existingStudent) {
                throw new Error("NIK siswa sudah terdaftar");
            }
            if (!student) {
                throw new Error("Data siswa wajib diisi!");
            }
            if (!student.fullName) {
                throw new Error("Nama lengkap siswa wajib diisi!");
            }
            if (!student.gender) {
                throw new Error("Jenis kelamin wajib diisi!");
            }
            (0, utils_1.validateNik)(student.nik, 'NIK siswa');
            (0, utils_1.validateNokk)(student.nokk, 'Nomor KK siswa');
            if (!student.birthPlace) {
                throw new Error("Tempat lahir wajib diisi!");
            }
            if (!student.birthDate) {
                throw new Error("Tanggal lahir wajib diisi!");
            }
            if (!student.religion) {
                throw new Error("Agama wajib diisi!");
            }
            if (!student.address) {
                throw new Error("Alamat wajib diisi!");
            }
            (0, utils_1.validateAddress)(student.address);
            if (!student.childOrder) {
                throw new Error("Urutan anak dalam keluarga wajib diisi!");
            }
            if (!contactPhoneNumber) {
                throw new Error("Nomor telepon wajib diisi!");
            }
            (0, utils_1.validateParent)(father, 'ayah');
            (0, utils_1.validateParent)(mother, 'ibu');
            const totalRegistrations = await registration_schema_1.default.countDocuments();
            const registrationNumber = `PPDB26-SD-${String(totalRegistrations + 1).padStart(3, "0")}`;
            const newRegistration = {
                ...payload,
                student: {
                    ...student,
                    fullName: (0, utils_1.capitalizeWords)(student.fullName),
                    birthPlace: (0, utils_1.capitalizeWords)(student.birthPlace)
                },
                father: (0, normalize_1.normalizeParent)(father),
                mother: (0, normalize_1.normalizeParent)(mother),
                registrationNumber,
                status: 'Unvalidated'
            };
            await registration_repo_1.default.createRegistration(newRegistration);
            return newRegistration;
        }
        catch (e) {
            if (e instanceof Error) {
                throw new Error(e.message);
            }
        }
    };
    static getAll = async () => {
        return await registration_repo_1.default.getAllRegistrations();
    };
    static getById = async (id) => {
        const registration = await registration_repo_1.default.getRegistrationById(id);
        if (!registration) {
            throw new Error("Data pendaftaran tidak ditemukan!");
        }
        return registration;
    };
}
exports.default = RegistrationService;
