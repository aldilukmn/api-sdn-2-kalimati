"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_repo_1 = __importDefault(require("../repositories/user.repo"));
const token_blacklist_repo_1 = __importDefault(require("../repositories/token-blacklist.repo"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import { handleCloudinary, isValidImage } from "../utils";
class UserService {
    static register = async (payload) => {
        const { username, password, role } = payload;
        try {
            if (!username || !password || !role) {
                throw new Error(`${!username ? 'username' : !password ? 'password' : !role ? 'role' : null} is required!`);
            }
            // if (!email.includes('@')) {
            //   throw new Error('Not email format!');
            // }
            if (password.length < 8) {
                throw new Error('Password length should be more than 8 characters!');
            }
            // if (isValidImage(imageType)) {
            //   throw new Error('It\'s not image format!')
            // };
            // if (!isImage) {
            //   throw new Error('Image is undefined!')
            // }
            const getUsername = await user_repo_1.default.getUserByUsername(username);
            // const getUserEmail = await UserRepository.getUserByEmail(email) as User;
            // if (getUsername ?? getUserEmail) {
            //   throw new Error(`${getUsername ? 'username' : 'email'} already exist!`);
            // }
            if (getUsername) {
                throw new Error(`${getUsername ? 'username' : 'email'} already exist!`);
            }
            // const imageUrl = await handleCloudinary(isImage, 'user');
            const salt = await bcrypt_1.default.genSalt();
            const hasPass = await bcrypt_1.default.hash(password, salt);
            const newUser = {
                username: username.toLowerCase(),
                password: hasPass,
                role: role.toLowerCase(),
                // image_url: imageUrl.secure_url,
                // image_id: imageUrl.public_id
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
                role: getUser.role
            }, process.env.SECRET_KEY, {
                expiresIn: '1h'
            });
            return {
                username,
                role: getUser.role,
                token,
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
    // static updateUser = async (payload: UserRequest, userId: string, image: string | undefined, imageType: any): Promise<User | undefined> => {
    //   let userUpdate: UserRequest;
    //   try {
    //     if (image) {
    //       if (!isValidImage(imageType)) {
    //         throw new Error('It\'s not image format!');
    //       };
    //       const newImageUrl = await handleCloudinary(image, 'user');
    //       userUpdate = await UserService.saveUpdate(payload, userId, newImageUrl.secure_url, newImageUrl.public_id);
    //     } else {
    //       userUpdate = await UserService.saveUpdate(payload, userId);
    //     }
    //     return userUpdate as User;
    //   } catch (e) {
    //     if (e instanceof Error) {
    //       throw new Error(e.message);
    //     }
    //   }
    // };
    static async saveUpdate(options, userId, newImageUrl, newImageId) {
        const { password } = options;
        const salt = await bcrypt_1.default.genSalt();
        const newHasPass = await bcrypt_1.default.hash(password, salt);
        const existingUser = await user_repo_1.default.getUserById(userId);
        const passIsCorrect = await bcrypt_1.default.compare(password, existingUser.password);
        const updateUser = {
            username: existingUser.username,
            password: !passIsCorrect ? newHasPass : existingUser.password,
            // image_url: newImageUrl || existingUser.image_url,
            // image_id: newImageId || existingUser.image_id
        };
        await user_repo_1.default.updateUser(userId, updateUser);
        return updateUser;
    }
    ;
}
exports.default = UserService;
