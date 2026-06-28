"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_repo_1 = __importDefault(require("../repositories/user.repo"));
const token_blacklist_repo_1 = __importDefault(require("../repositories/token-blacklist.repo"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../utils");
// import { handleCloudinary, isValidImage } from "../utils";
class UserService {
    static register = async (payload) => {
        const { username, password, role, grade, nip, fullName, title } = payload;
        try {
            if (!username || !password || !role || !fullName || !title || !nip) {
                throw new Error(`${!username ? 'username' :
                    !password ? 'password' :
                        !role ? 'role' :
                            !fullName ? 'nama lengkap' :
                                !title ? 'gelar' :
                                    !nip ? 'nip' :
                                        null} wajib diisi!`);
            }
            if (role === 'guru' && !grade) {
                throw new Error('Grade wajib diisi untuk role guru!');
            }
            if (password.length < 8) {
                throw new Error('Password length should be more than 8 characters!');
            }
            const getUsernameOrGrade = await user_repo_1.default.getUserByUsername(username || grade);
            if (getUsernameOrGrade || grade) {
                throw new Error(`${getUsernameOrGrade ? 'username sudah ada' : grade ? 'kelas sudah terisi' : null}`);
            }
            const salt = await bcrypt_1.default.genSalt();
            const hasPass = await bcrypt_1.default.hash(password, salt);
            const newUser = {
                username: username.toLowerCase(),
                password: hasPass,
                role: role.toLowerCase(),
                grade,
                nip,
                fullName: (0, utils_1.capitalizeWords)(fullName),
                title,
            };
            await user_repo_1.default.createUser(newUser);
            return newUser;
        }
        catch (e) {
            if (e instanceof Error) {
                throw new Error(e.message);
            }
        }
        ;
    };
    static listUsers = async (role) => {
        if (role) {
            return await user_repo_1.default.getUsersByRole(role);
        }
        return await user_repo_1.default.getAllUsers();
    };
    static getUserById = async (userId) => {
        const getUser = await user_repo_1.default.getUserById(userId);
        return getUser;
    };
    static login = async (payload) => {
        try {
            const { username, password } = payload;
            if (!username || !password) {
                throw new Error(`${!username ? 'username' : 'password'} is required!`);
            }
            const getUser = await user_repo_1.default.getUserByUsername(username);
            if (!getUser || !getUser.username) {
                throw new Error('username doesn\'t exist!');
            }
            const passIsCorrect = await bcrypt_1.default.compare(password, getUser.password);
            if (!passIsCorrect) {
                throw new Error('wrong password!');
            }
            ;
            if (!process.env.SECRET_KEY) {
                // const response = defaultResponse(500, 'fail', 'secret key is not defined in the environment variable!')
                // return response;
                throw new Error('secret key is not defined in the environment variable!');
            }
            ;
            const token = jsonwebtoken_1.default.sign({
                user: username,
                role: getUser.role,
                grade: getUser.grade,
                fullName: getUser.fullName,
                title: getUser.title,
            }, process.env.SECRET_KEY, {
                expiresIn: '1h'
            });
            return {
                token,
                username
            };
        }
        catch (e) {
            if (e instanceof Error)
                throw new Error(e.message);
            throw new Error('an unknow error occured during login');
        }
        ;
    };
    static logout = async (token, username) => {
        try {
            if (!token) {
                throw new Error('token is required!');
            }
            if (!process.env.SECRET_KEY) {
                throw new Error('secret key is not defined in the environment variable!');
            }
            // Decode token to get expiresAt
            const decoded = jsonwebtoken_1.default.decode(token);
            if (!decoded || !decoded.exp) {
                throw new Error('invalid token format!');
            }
            // Convert exp (seconds) to milliseconds and create Date
            const expiresAt = new Date(decoded.exp * 1000);
            // Add token to blacklist
            await token_blacklist_repo_1.default.addToBlacklist(token, username, expiresAt);
        }
        catch (e) {
            if (e instanceof Error)
                throw new Error(e.message);
            throw new Error('an unknown error occurred during logout');
        }
    };
    static updateUser = async (id, data) => {
        const user = await user_repo_1.default.getUserById(id);
        if (data.grade !== undefined) {
            if (user.role !== 'guru') {
                throw new Error('Hanya user dengan role guru yang bisa memiliki grade!');
            }
            const validGrades = ['1', '2', '3', '4', '5', '6'];
            if (!validGrades.includes(data.grade)) {
                throw new Error('grade tidak valid! Harus 1-6.');
            }
            if (user.role === 'guru' && !data.grade) {
                throw new Error('grade wajib diisi untuk role guru!');
            }
        }
        const getGrade = await user_repo_1.default.getUserByGrade(data.grade);
        if (getGrade) {
            throw new Error('kelas sudah terisi!');
        }
        return await user_repo_1.default.updateUser(id, data);
    };
    static deleteUserById = async (userId) => {
        try {
            const deleteUser = await user_repo_1.default.deleteUserById(userId);
            return deleteUser;
        }
        catch (e) {
            if (e instanceof Error)
                throw new Error(e.message);
        }
    };
}
exports.default = UserService;
