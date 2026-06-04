"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_repo_1 = __importDefault(require("../repositories/user.repo"));
const utils_1 = require("../utils");
dotenv_1.default.config();
class UserMiddleware {
    static verifyToken = async (req, res, next) => {
        try {
            const token = req.headers.authorization;
            const getToken = (0, utils_1.validateToken)(token);
            const decoded = jsonwebtoken_1.default.verify(getToken, `${process.env.SECRET_KEY}`);
            const user = await user_repo_1.default.getUserByUsername(decoded.user);
            const isUser = user.username === decoded.user;
            if (!isUser) {
                throw new Error('user not found!');
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
            const isAdmin = user.role === decoded.role;
            if (!isAdmin) {
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
