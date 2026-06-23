"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const presensi_repo_1 = __importDefault(require("../repositories/presensi.repo"));
class PresensiService {
    static createOrUpdate = async (payload) => {
        const { tanggal, kelas, entries } = payload;
        if (!tanggal || !kelas || !entries || entries.length === 0) {
            throw new Error("Data presensi tidak lengkap!");
        }
        const validStatuses = ["hadir", "sakit", "izin", "alpha"];
        for (const entry of entries) {
            if (!entry.nisn || !entry.nama || !validStatuses.includes(entry.status)) {
                throw new Error(`Data entry tidak valid untuk NISN: ${entry.nisn}`);
            }
        }
        await presensi_repo_1.default.deleteByClassAndDate(kelas, tanggal);
        const docs = entries.map((e) => ({
            nisn: e.nisn,
            nama: e.nama,
            kelas,
            tanggal,
            status: e.status,
        }));
        return await presensi_repo_1.default.createMany(docs);
    };
    static getByClass = async (kelas, tanggal) => {
        if (!kelas || !tanggal) {
            throw new Error("Parameter kelas dan tanggal wajib diisi!");
        }
        return await presensi_repo_1.default.findByClassAndDate(kelas, tanggal);
    };
    static getRekapByNisn = async (nisn, bulan, tahun) => {
        if (!nisn) {
            throw new Error("Parameter NISN wajib diisi!");
        }
        return await presensi_repo_1.default.findRekapByNisn(nisn, bulan, tahun);
    };
    static getRekapByKelas = async (kelas, bulan, tahun) => {
        if (!kelas) {
            throw new Error("Parameter kelas wajib diisi!");
        }
        return await presensi_repo_1.default.findRekapByKelasBulanTahun(kelas, bulan, tahun);
    };
}
exports.default = PresensiService;
