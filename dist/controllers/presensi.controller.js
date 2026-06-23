"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const presensi_services_1 = __importDefault(require("../services/presensi.services"));
const utils_1 = require("../utils");
class PresensiController {
    static create = async (req, res) => {
        try {
            const payload = req.body;
            const result = await presensi_services_1.default.createOrUpdate(payload);
            const response = (0, utils_1.defaultResponse)(201, "success", "Data presensi berhasil disimpan", result);
            res.status(201).json(response);
        }
        catch (e) {
            if (e instanceof Error) {
                const response = (0, utils_1.defaultResponse)(400, "fail", e.message);
                res.status(400).json(response);
            }
        }
    };
    static getByClass = async (req, res) => {
        try {
            const kelas = req.query.kelas;
            const tanggal = req.query.tanggal;
            const result = await presensi_services_1.default.getByClass(kelas, tanggal);
            const response = (0, utils_1.defaultResponse)(200, "success", "Data presensi berhasil diambil", result);
            res.status(200).json(response);
        }
        catch (e) {
            if (e instanceof Error) {
                const response = (0, utils_1.defaultResponse)(400, "fail", e.message);
                res.status(400).json(response);
            }
        }
    };
    static getRekapByNisn = async (req, res) => {
        try {
            const nisn = req.params.nisn;
            const bulan = req.query.bulan ? Number(req.query.bulan) : undefined;
            const tahun = req.query.tahun ? Number(req.query.tahun) : undefined;
            const result = await presensi_services_1.default.getRekapByNisn(nisn, bulan, tahun);
            const response = (0, utils_1.defaultResponse)(200, "success", "Rekap presensi berhasil diambil", result);
            res.status(200).json(response);
        }
        catch (e) {
            if (e instanceof Error) {
                const response = (0, utils_1.defaultResponse)(400, "fail", e.message);
                res.status(400).json(response);
            }
        }
    };
    static getRekapByKelas = async (req, res) => {
        try {
            const kelas = req.query.kelas;
            const bulan = req.query.bulan ? Number(req.query.bulan) : undefined;
            const tahun = req.query.tahun ? Number(req.query.tahun) : undefined;
            const result = await presensi_services_1.default.getRekapByKelas(kelas, bulan, tahun);
            const response = (0, utils_1.defaultResponse)(200, "success", "Rekap presensi berhasil diambil", result);
            res.status(200).json(response);
        }
        catch (e) {
            if (e instanceof Error) {
                const response = (0, utils_1.defaultResponse)(400, "fail", e.message);
                res.status(400).json(response);
            }
        }
    };
}
exports.default = PresensiController;
