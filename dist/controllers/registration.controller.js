"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const registration_services_1 = __importDefault(require("../services/registration.services"));
const utils_1 = require("../utils");
class RegistrationController {
    static register = async (req, res) => {
        const payload = req.body;
        try {
            const newRegistration = await registration_services_1.default.register(payload);
            const response = (0, utils_1.defaultResponse)(201, "success", "Pendaftaran berhasil dibuat", newRegistration);
            res.status(201).json(response);
        }
        catch (e) {
            if (e instanceof Error) {
                const response = (0, utils_1.defaultResponse)(400, "fail", e.message);
                res.status(400).json(response);
            }
        }
    };
    static getAll = async (req, res) => {
        try {
            const registrations = await registration_services_1.default.getAll();
            const response = (0, utils_1.defaultResponse)(200, "success", "Data pendaftaran berhasil diambil", registrations);
            res.status(200).json(response);
        }
        catch (e) {
            if (e instanceof Error) {
                const response = (0, utils_1.defaultResponse)(500, "fail", e.message);
                res.status(500).json(response);
            }
        }
    };
    static getById = async (req, res) => {
        const id = req.params.id;
        try {
            const registration = await registration_services_1.default.getById(id);
            const response = (0, utils_1.defaultResponse)(200, "success", "Data pendaftaran berhasil diambil", registration);
            res.status(200).json(response);
        }
        catch (e) {
            if (e instanceof Error) {
                const response = (0, utils_1.defaultResponse)(404, "fail", e.message);
                res.status(404).json(response);
            }
        }
    };
    static updateData = async (req, res) => {
        try {
            const id = req.params.id;
            const result = await registration_services_1.default.updateData(id, req.body);
            const response = (0, utils_1.defaultResponse)(200, "success", "Data pendaftaran berhasil diupdate", result);
            res.json(response);
        }
        catch (e) {
            if (e instanceof Error) {
                const response = (0, utils_1.defaultResponse)(400, "fail", e.message);
                res.status(400).json(response);
            }
        }
    };
    static getTotalCount = async (req, res) => {
        try {
            const count = await registration_services_1.default.getTotalCount();
            const response = (0, utils_1.defaultResponse)(200, "success", "Total pendaftar berhasil diambil", { total: count });
            res.status(200).json(response);
        }
        catch (e) {
            if (e instanceof Error) {
                const response = (0, utils_1.defaultResponse)(500, "fail", e.message);
                res.status(500).json(response);
            }
        }
    };
}
exports.default = RegistrationController;
