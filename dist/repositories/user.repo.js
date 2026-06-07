"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_schema_1 = __importDefault(require("../models/schema/user.schema"));
class UserRepository {
    // Get User By Username
    static async getUserByUsername(userName) {
        const userData = await user_schema_1.default.findOne({
            username: userName
        }).exec();
        return userData;
    }
    // Get User By Email
    static async getUserByEmail(email) {
        const userData = await user_schema_1.default.findOne({
            email
        }).exec();
        return userData;
    }
    // Create User
    static async createUser(user) {
        const newUser = new user_schema_1.default(user);
        return await newUser.save();
    }
    // Get User By Id
    static async getUserById(userId) {
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new Error(`invalid id format: ${userId}`);
        }
        ;
        const userData = await user_schema_1.default.findById(userId);
        if (!userData) {
            throw new Error(`User with id ${userId} not found!`);
        }
        ;
        return userData;
    }
    ;
    static async deleteUserById(userId) {
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new Error(`invalid id format: ${userId}`);
        }
        ;
        const userData = await user_schema_1.default.findById(userId);
        if (!userData) {
            throw new Error(`user with id ${userId} not found!`);
        }
        ;
        // if (userData.image_id) {
        //   await cloudinary.uploader.destroy(userData.image_id);
        // };
        await user_schema_1.default.findByIdAndDelete(userId);
    }
    ;
    // Update User
    static async updateUser(userId, data) {
        if (!userId) {
            throw new Error('user id is required!');
        }
        ;
        if (!data) {
            throw new Error('no data provided for update!');
        }
        ;
        const updateUser = await user_schema_1.default.findByIdAndUpdate(userId, {
            $set: data,
        }, {
            returnDocument: 'after',
            runValidators: true
        });
        if (!updateUser) {
            throw new Error(`user with id ${userId} not found!`);
        }
        return updateUser;
    }
}
exports.default = UserRepository;
