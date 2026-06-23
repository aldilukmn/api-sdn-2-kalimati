"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const presensi_schema_1 = __importDefault(require("../models/schema/presensi.schema"));
class PresensiRepository {
    static async deleteByClassAndDate(kelas, tanggal) {
        await presensi_schema_1.default.deleteMany({ kelas, tanggal });
    }
    static async createMany(entries) {
        return await presensi_schema_1.default.insertMany(entries);
    }
    static async findByClassAndDate(kelas, tanggal) {
        return await presensi_schema_1.default.find({ kelas, tanggal }).sort({ nisn: 1 });
    }
    static async findRekapByNisn(nisn, bulan, tahun) {
        const filter = { nisn };
        if (bulan && tahun) {
            const monthStr = String(bulan).padStart(2, "0");
            filter.tanggal = { $regex: new RegExp(`^${tahun}-${monthStr}-`) };
        }
        else if (tahun) {
            filter.tanggal = { $regex: new RegExp(`^${tahun}-`) };
        }
        return await presensi_schema_1.default.find(filter).sort({ tanggal: 1 });
    }
    static async findRekapByKelasBulanTahun(kelas, bulan, tahun) {
        const filter = { kelas };
        if (bulan && tahun) {
            const monthStr = String(bulan).padStart(2, "0");
            filter.tanggal = { $regex: new RegExp(`^${tahun}-${monthStr}-`) };
        }
        else if (tahun) {
            filter.tanggal = { $regex: new RegExp(`^${tahun}-`) };
        }
        return await presensi_schema_1.default.find(filter).sort({ tanggal: 1, nisn: 1 });
    }
}
exports.default = PresensiRepository;
