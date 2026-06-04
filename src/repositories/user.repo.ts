import mongoose from "mongoose";
import User from "../models/entity/user.entity";
import UserModel from "../models/schema/user.schema";
import UserRequest from "../models/dto/user.dto";
import cloudinary from "../config/cloudinary";

export default class UserRepository {
  // Get User By Username
  static async getUserByUsername(userName: string): Promise<User> {
    const userData = await UserModel.findOne({
      username: userName
    }).exec();

    return userData as User;
  }

  // Get User By Email
  static async getUserByEmail(email: string): Promise<User | null> {
    const userData = await UserModel.findOne({
      email
    }).exec();

    return userData;
  }

  // Create User
  static async createUser(user: UserRequest): Promise<User> {
    const newUser = new UserModel(user);
    return await newUser.save();
  }

  // Get User By Id
  static async getUserById (userId: string): Promise<User> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error(`invalid id format: ${userId}`);
    };
    const userData = await UserModel.findById(userId);

    if (!userData) {
      throw new Error(`User with id ${userId} not found!`)
    };

    return userData;
  };

  static async deleteUserById (userId: string): Promise <void> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error(`invalid id format: ${userId}`);
    };

    const userData = await UserModel.findById(userId);

    if (!userData) {
      throw new Error(`user with id ${userId} not found!`);
    };

    // if (userData.image_id) {
    //   await cloudinary.uploader.destroy(userData.image_id);
    // };

    await UserModel.findByIdAndDelete(userId);
  };

  // Update User
  static async updateUser (userId: string, data: UserRequest): Promise<User> {
    if (!userId) {
      throw new Error('user id is required!');
    };

    if (!data) {
      throw new Error('no data provided for update!');
    };

    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: data,
      }, {
        new: true,
        runValidators: true
      }
    );

    if (!updateUser) {
      throw new Error(`user with id ${userId} not found!`);
    }
    return updateUser;
  }
}