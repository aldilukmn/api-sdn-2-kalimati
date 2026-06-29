"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_services_1 = __importDefault(require("../services/dashboard.services"));
const utils_1 = require("../utils");
class DashboardController {
    static getSummary = async (req, res) => {
        try {
            const month = req.query.month ? Number(req.query.month) : undefined;
            const year = req.query.year ? Number(req.query.year) : undefined;
            const summary = await dashboard_services_1.default.getSummary(month, year);
            const response = (0, utils_1.defaultResponse)(200, "success", "Dashboard summary retrieved successfully", summary);
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
exports.default = DashboardController;
