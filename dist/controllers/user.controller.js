"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_services_1 = __importDefault(require("../services/user.services"));
const response_1 = __importDefault(require("../utils/response"));
class User {
    static listUser = async (req, res) => {
        try {
            const role = req.query.role;
            const userData = await user_services_1.default.listUsers(role);
            const response = (0, response_1.default)(200, 'success', 'user successfully retrieved', userData);
            res.status(200).json(response);
        }
        catch (e) {
            if (e instanceof Error) {
                const response = (0, response_1.default)(400, 'fail', e.message);
                res.status(400).json(response);
            }
            ;
        }
        ;
    };
    static register = async (req, res) => {
        const payload = req.body;
        // const isImage: string | undefined = req.file?.path;
        // const imageType: string | undefined = req.file?.mimetype;
        try {
            const newUser = await user_services_1.default.register(payload);
            const response = (0, response_1.default)(201, 'success', 'user successfully created', newUser);
            res.status(201).json(response);
        }
        catch (e) {
            if (e instanceof Error) {
                const response = (0, response_1.default)(400, 'fail', e.message);
                res.status(400).json(response);
            }
            ;
        }
        ;
    };
    static getUserById = async (req, res) => {
        const userId = req.params.id;
        try {
            const getUser = await user_services_1.default.getUserById(userId);
            const response = (0, response_1.default)(200, 'success', 'user has found', getUser);
            res.status(200).json(response);
        }
        catch (e) {
            if (e instanceof Error) {
                const response = (0, response_1.default)(404, 'fail', e.message);
                res.status(404).json(response);
            }
            ;
        }
        ;
    };
    static login = async (req, res) => {
        const payload = req.body;
        try {
            const result = await user_services_1.default.login(payload);
            const response = (0, response_1.default)(200, 'success', `${result.username} successfully login`, result.token);
            // res.cookie('auth_token', `Bearer ${result.token}`, {
            //   httpOnly: true,
            //   maxAge: 1000 * 60,
            //   secure: process.env.NODE_ENV === "production",
            //   sameSite: 'none',
            // });
            res.status(200).json(response);
        }
        catch (e) {
            if (e instanceof Error) {
                const response = (0, response_1.default)(400, 'fail', e.message);
                res.status(400).json(response);
            }
            ;
        }
        ;
    };
    static logout = async (req, res) => {
        try {
            const token = req.token;
            const username = req.username;
            if (!token || !username) {
                const response = (0, response_1.default)(400, 'fail', 'token and username are required');
                res.status(400).json(response);
                return;
            }
            await user_services_1.default.logout(token, username);
            const response = (0, response_1.default)(200, 'success', 'user successfully logout');
            res.status(200).json(response);
        }
        catch (e) {
            if (e instanceof Error) {
                const response = (0, response_1.default)(400, 'fail', e.message);
                res.status(400).json(response);
            }
        }
    };
    static updateUser = async (req, res) => {
        const id = req.params.id;
        const { grade, nip, fullName, title } = req.body;
        try {
            const user = await user_services_1.default.updateUser(id, { grade, nip, fullName, title });
            const response = (0, response_1.default)(200, 'success', 'User berhasil diupdate', user);
            res.status(200).json(response);
        }
        catch (e) {
            if (e instanceof Error) {
                const response = (0, response_1.default)(400, 'fail', e.message);
                res.status(400).json(response);
            }
        }
    };
    static deleteUserById = async (req, res) => {
        const userId = req.params.id;
        try {
            await user_services_1.default.deleteUserById(userId);
            const response = (0, response_1.default)(200, 'success', 'user successfully deleted');
            res.status(200).json(response);
        }
        catch (e) {
            if (e instanceof Error) {
                const response = (0, response_1.default)(400, 'fail', e.message);
                res.status(400).json(response);
            }
        }
    };
}
exports.default = User;
