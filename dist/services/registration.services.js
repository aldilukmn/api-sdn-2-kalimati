"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const normalize_1 = require("../helper/normalize");
const registration_repo_1 = __importDefault(require("../repositories/registration.repo"));
const utils_1 = require("../utils");
const counter_schema_1 = __importDefault(require("../models/schema/counter.schema"));
class RegistrationService {
    static register = async (payload) => {
        try {
            const { student, father, mother, contactPhoneNumber, guardian, hasGuardian } = payload;
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
            (0, utils_1.validateNokk)(student.noKk, 'Nomor KK siswa');
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
            if (!student.numberOfSiblings) {
                throw new Error("Jumlah saudara kandung wajib diisi!");
            }
            if (!contactPhoneNumber) {
                throw new Error("Nomor telepon wajib diisi!");
            }
            student.kindergartenOrigin = !student.kindergartenOrigin
                ? "Tidak Sekolah TK/RA"
                : student.kindergartenOrigin.trim();
            (0, utils_1.validateParent)(father, 'ayah');
            (0, utils_1.validateParent)(mother, 'ibu');
            if (hasGuardian) {
                if (!guardian) {
                    throw new Error("Data wali wajib diisi!");
                }
                if (!guardian.name) {
                    throw new Error("Nama wali wajib diisi!");
                }
                if (!guardian.relationship) {
                    throw new Error("Hubungan wali dengan siswa wajib diisi!");
                }
                if (!guardian.phoneNumber) {
                    throw new Error("Nomor telepon wali wajib diisi!");
                }
            }
            // const totalRegistrations = await RegistrationModel.countDocuments();
            const counter = await counter_schema_1.default.findOneAndUpdate({ _id: 'registrationNumber' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
            const registrationNumber = `SPMB26-SD-${String(counter.seq).padStart(3, "0")}`;
            const newRegistration = {
                ...payload,
                student: {
                    ...student,
                    fullName: (0, utils_1.capitalizeWords)(student.fullName),
                    birthPlace: (0, utils_1.capitalizeWords)(student.birthPlace),
                    address: {
                        ...student.address,
                        street: (0, utils_1.capitalizeWords)(student.address.street),
                        village: (0, utils_1.capitalizeWords)(student.address.village),
                        district: (0, utils_1.capitalizeWords)(student.address.district)
                    },
                },
                father: (0, normalize_1.normalizeParent)(father),
                mother: (0, normalize_1.normalizeParent)(mother),
                registrationNumber,
                status: 'unvalidated',
                hasGuardian: hasGuardian ?? false,
                guardian: hasGuardian && guardian ? {
                    name: (0, utils_1.capitalizeWords)(guardian.name?.trim()),
                    relationship: (0, utils_1.capitalizeWords)(guardian.relationship?.trim()),
                    phoneNumber: guardian.phoneNumber?.trim()
                } : undefined
            };
            await registration_repo_1.default.createRegistration(newRegistration);
            return newRegistration;
        }
        catch (e) {
            if (e.code === 11000) {
                if (e.keyPattern && e.keyPattern['student.nik']) {
                    throw new Error("NIK siswa sudah terdaftar! Silakan coba lagi.");
                }
                throw new Error("Nomor pendaftaran sudah digunakan! Silakan coba lagi.");
            }
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
    static updateData = async (id, payload) => {
        try {
            const existing = await registration_repo_1.default.getRegistrationById(id);
            if (!existing) {
                throw new Error("Data pendaftaran tidak ditemukan!");
            }
            const updateData = {};
            if (payload.status) {
                if (!['unvalidated', 'validated'].includes(payload.status)) {
                    throw new Error("Status tidak valid!");
                }
                updateData.status = payload.status;
            }
            if (payload.student) {
                const student = payload.student;
                if (!student.fullName)
                    throw new Error("Nama lengkap siswa wajib diisi!");
                if (!student.gender)
                    throw new Error("Jenis kelamin wajib diisi!");
                if (!student.nik)
                    throw new Error("NIK siswa wajib diisi!");
                if (!student.noKk)
                    throw new Error("Nomor KK siswa wajib diisi!");
                if (!student.birthPlace)
                    throw new Error("Tempat lahir wajib diisi!");
                if (!student.birthDate)
                    throw new Error("Tanggal lahir wajib diisi!");
                if (!student.religion)
                    throw new Error("Agama wajib diisi!");
                if (!student.childOrder)
                    throw new Error("Urutan anak dalam keluarga wajib diisi!");
                if (!student.numberOfSiblings)
                    throw new Error("Jumlah saudara kandung wajib diisi!");
                (0, utils_1.validateNik)(student.nik, 'NIK siswa');
                (0, utils_1.validateNokk)(student.noKk, 'Nomor KK siswa');
                if (!student.address)
                    throw new Error("Alamat wajib diisi!");
                (0, utils_1.validateAddress)(student.address);
                const existingNik = await registration_repo_1.default.findByStudentNik(student.nik);
                if (existingNik && existingNik._id.toString() !== id) {
                    throw new Error("NIK siswa sudah terdaftar!");
                }
                updateData.student = {
                    ...student,
                    fullName: (0, utils_1.capitalizeWords)(student.fullName),
                    birthPlace: (0, utils_1.capitalizeWords)(student.birthPlace),
                    kindergartenOrigin: !student.kindergartenOrigin
                        ? "Tidak Sekolah TK/RA"
                        : student.kindergartenOrigin.trim(),
                    address: {
                        ...student.address,
                        street: (0, utils_1.capitalizeWords)(student.address.street),
                        village: (0, utils_1.capitalizeWords)(student.address.village),
                        district: (0, utils_1.capitalizeWords)(student.address.district)
                    }
                };
            }
            if (payload.father) {
                (0, utils_1.validateParent)(payload.father, 'ayah');
                updateData.father = (0, normalize_1.normalizeParent)(payload.father);
            }
            if (payload.mother) {
                (0, utils_1.validateParent)(payload.mother, 'ibu');
                updateData.mother = (0, normalize_1.normalizeParent)(payload.mother);
            }
            if (payload.contactPhoneNumber) {
                updateData.contactPhoneNumber = payload.contactPhoneNumber;
            }
            if (payload.hasGuardian !== undefined) {
                if (payload.hasGuardian) {
                    const guardian = payload.guardian;
                    if (!guardian)
                        throw new Error("Data wali wajib diisi!");
                    if (!guardian.name)
                        throw new Error("Nama wali wajib diisi!");
                    if (!guardian.relationship)
                        throw new Error("Hubungan wali dengan siswa wajib diisi!");
                    if (!guardian.phoneNumber)
                        throw new Error("Nomor telepon wali wajib diisi!");
                    updateData.guardian = {
                        name: (0, utils_1.capitalizeWords)(guardian.name?.trim()),
                        relationship: (0, utils_1.capitalizeWords)(guardian.relationship?.trim()),
                        phoneNumber: guardian.phoneNumber?.trim()
                    };
                    updateData.hasGuardian = true;
                }
                else {
                    updateData.guardian = null;
                    updateData.hasGuardian = false;
                }
            }
            if (Object.keys(updateData).length === 0) {
                throw new Error("Tidak ada data yang diupdate!");
            }
            const updated = await registration_repo_1.default.updateRegistration(id, updateData);
            if (!updated) {
                throw new Error("Gagal mengupdate data pendaftaran!");
            }
            return updated;
        }
        catch (e) {
            if (e.code === 11000) {
                if (e.keyPattern && e.keyPattern['student.nik']) {
                    throw new Error("NIK siswa sudah terdaftar!");
                }
            }
            if (e instanceof Error) {
                throw new Error(e.message);
            }
            throw e;
        }
    };
    static getTotalCount = async () => {
        return await registration_repo_1.default.getTotalCount();
    };
}
exports.default = RegistrationService;
