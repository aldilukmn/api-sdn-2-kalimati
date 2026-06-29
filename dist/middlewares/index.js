"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_repo_1 = __importDefault(require("../repositories/user.repo"));
const token_blacklist_repo_1 = __importDefault(require("../repositories/token-blacklist.repo"));
const utils_1 = require("../utils");
dotenv_1.default.config();
class UserMiddleware {
    static verifyToken = async (req, res, next) => {
        try {
            const token = req.headers.authorization;
            const getToken = (0, utils_1.validateToken)(token);
            // Check if token is blacklisted
            const isBlacklisted = await token_blacklist_repo_1.default.isTokenBlacklisted(getToken);
            if (isBlacklisted) {
                throw new Error('token has been revoked!');
            }
            const decoded = jsonwebtoken_1.default.verify(getToken, `${process.env.SECRET_KEY}`);
            const user = await user_repo_1.default.getUserByUsername(decoded.user);
            const isUser = user.username === decoded.user;
            if (!isUser) {
                throw new Error('user not found!');
            }
            // Attach token & username to request for later use in logout
            req.token = getToken;
            req.username = decoded.user;
            next();
        }
        catch (e) {
            if (e instanceof Error) {
                const response = (0, utils_1.defaultResponse)(401, 'fail', e.message);
                res.status(401).json(response);
            }
        }
    };
    static verifyTeacherGrade = async (req, res, next) => {
        try {
            const { grade } = req.body;
            if (!grade)
                return next();
            const token = req.headers.authorization;
            const getToken = (0, utils_1.validateToken)(token);
            const decoded = jsonwebtoken_1.default.verify(getToken, `${process.env.SECRET_KEY}`);
            if (decoded.role === 'admin' || decoded.role === 'kepala')
                return next();
            if (decoded.grade !== grade) {
                throw new Error(`Akses ditolak! Anda hanya bisa input presensi untuk kelas ${decoded.grade}.`);
            }
            next();
        }
        catch (e) {
            if (e instanceof Error) {
                const response = (0, utils_1.defaultResponse)(401, 'fail', e.message);
                res.status(401).json(response);
            }
        }
    };
    static isTeacherOrAdmin = async (req, res, next) => {
        try {
            const token = req.headers.authorization;
            const getToken = (0, utils_1.validateToken)(token);
            const decoded = jsonwebtoken_1.default.verify(getToken, `${process.env.SECRET_KEY}`);
            const user = await user_repo_1.default.getUserByUsername(decoded.user);
            if (user.role !== "admin" && user.role !== "guru" && user.role !== "kepala") {
                throw new Error("Akses ditolak! Hanya guru, admin, dan kepala sekolah yang diizinkan.");
            }
            req.token = getToken;
            req.username = decoded.user;
            next();
        }
        catch (e) {
            if (e instanceof Error) {
                const response = (0, utils_1.defaultResponse)(401, "fail", e.message);
                res.status(401).json(response);
            }
        }
    };
    static isAdminOrHead = async (req, res, next) => {
        try {
            const token = req.headers.authorization;
            const getToken = (0, utils_1.validateToken)(token);
            const decoded = jsonwebtoken_1.default.verify(getToken, `${process.env.SECRET_KEY}`);
            const user = await user_repo_1.default.getUserByUsername(decoded.user);
            if (user.role !== 'admin' && user.role !== 'kepala') {
                throw new Error("Akses ditolak! Hanya admin dan kepala sekolah yang diizinkan.");
            }
            next();
        }
        catch (e) {
            if (e instanceof Error) {
                const response = (0, utils_1.defaultResponse)(401, 'fail', e.message);
                res.status(401).json(response);
            }
        }
    };
    static isAdmin = async (req, res, next) => {
        try {
            const token = req.headers.authorization;
            const getToken = (0, utils_1.validateToken)(token);
            const decoded = jsonwebtoken_1.default.verify(getToken, `${process.env.SECRET_KEY}`);
            const user = await user_repo_1.default.getUserByUsername(decoded.user);
            if (user.role !== 'admin') {
                throw new Error('it\'s not admin!');
            }
            next();
        }
        catch (e) {
            if (e instanceof Error) {
                const response = (0, utils_1.defaultResponse)(401, 'fail', e.message);
                res.status(401).json(response);
            }
        }
    };
}
exports.default = UserMiddleware;
