import UserRequest from "../models/dto/user.dto";
import User from "../models/entity/user.entity";
import UserRepository from "../repositories/user.repo";
import TokenBlacklistRepository from "../repositories/token-blacklist.repo";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { capitalizeWords } from '../utils';
// import { handleCloudinary, isValidImage } from "../utils";

export default class UserService {
  static register = async (payload: UserRequest): Promise<UserRequest | undefined> => {
    const { username, password, role, grade, nip, fullName, title }: UserRequest = payload
    try {
      if (!username || !password || !role || !fullName || !title || !nip) {
        throw new Error(`${!username ? 'username' :
          !password ? 'password' :
            !role ? 'role' :
              !fullName ? 'nama lengkap' :
                !title ? 'gelar' :
                  !nip ? 'nip' :
                    null} wajib diisi!`)
      }

      if (role === 'guru' && !grade) {
        throw new Error('Grade wajib diisi untuk role guru!');
      }

      if (password.length < 8) {
        throw new Error('Password length should be more than 8 characters!')
      }

      const existingUser = await UserRepository.getUserByUsername(username) as User;
      if (existingUser) {
        throw new Error('username sudah ada');
      }

      if (role === 'guru' && grade) {
        const existingGrade = await UserRepository.getUserByGrade(grade);
        if (existingGrade) {
          throw new Error('kelas sudah terisi');
        }
      }

      const salt = await bcrypt.genSalt();
      const hasPass: string = await bcrypt.hash(password, salt);

      const newUser: UserRequest = {
        username: username.toLowerCase(),
        password: hasPass,
        role: role.toLowerCase(),
        grade,
        nip,
        fullName: capitalizeWords(fullName),
        title,
      }
      await UserRepository.createUser(newUser);
      return newUser;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
    };
  }

  static listUsers = async (role?: string): Promise<User[]> => {
    if (role) {
      return await UserRepository.getUsersByRole(role);
    }
    return await UserRepository.getAllUsers();
  }

  static getUserById = async (userId: string): Promise<User> => {
    const getUser = await UserRepository.getUserById(userId);
    return getUser as User;
  }

  static login = async (payload: UserRequest): Promise<{token: string, username: string}> => {
    try {
      const { username, password } = payload;

      if (!username || !password) {
        throw new Error(`${!username ? 'username' : 'password'} is required!`);
      }

      const getUser = await UserRepository.getUserByUsername(username);
      
      if (!getUser || !getUser.username) {
        throw new Error('username doesn\'t exist!');
      }

      const passIsCorrect: boolean = await bcrypt.compare(password, getUser.password);

      if (!passIsCorrect) {
        throw new Error('wrong password!');
      };

      if (!process.env.SECRET_KEY) {
        // const response = defaultResponse(500, 'fail', 'secret key is not defined in the environment variable!')
        // return response;
        throw new Error('secret key is not defined in the environment variable!');
      };

      const token = jwt.sign({
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
    } catch (e) {
      if (e instanceof Error)
        throw new Error(e.message);
      throw new Error('an unknow error occured during login');
    };
  }

  static logout = async (token: string, username: string): Promise<void> => {
    try {
      if (!token) {
        throw new Error('token is required!');
      }

      if (!process.env.SECRET_KEY) {
        throw new Error('secret key is not defined in the environment variable!');
      }

      // Decode token to get expiresAt
      const decoded = jwt.decode(token) as { exp?: number };
      
      if (!decoded || !decoded.exp) {
        throw new Error('invalid token format!');
      }

      // Convert exp (seconds) to milliseconds and create Date
      const expiresAt = new Date(decoded.exp * 1000);

      // Add token to blacklist
      await TokenBlacklistRepository.addToBlacklist(token, username, expiresAt);
    } catch (e) {
      if (e instanceof Error)
        throw new Error(e.message);
      throw new Error('an unknown error occurred during logout');
    }
  }

  static updateUser = async (id: string, data: User ): Promise<User> => {
    const user = await UserRepository.getUserById(id);

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
    if (data.grade && data.grade !== user.grade) {
      const existingGrade = await UserRepository.getUserByGrade(data.grade);
      if (existingGrade) {
        throw new Error('kelas sudah terisi');
      }
    }

    return await UserRepository.updateUser(id, data as UserRequest);
  };

  static deleteUserById = async (userId: string): Promise<void> => {
    try {
      const deleteUser = await UserRepository.deleteUserById(userId);
      return deleteUser;
    } catch (e) {
      if (e instanceof Error)
        throw new Error(e.message);
    }
  }

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

  // static async saveUpdate (options: UserRequest, userId: string, newImageUrl?: string, newImageId?: string): Promise<UserRequest> {
  //   const { password } = options;
  //   const salt = await bcrypt.genSalt();
  //   const newHasPass: string = await bcrypt.hash(password, salt);
  //   const existingUser = await UserRepository.getUserById(userId);
  //   const passIsCorrect = await bcrypt.compare(password, existingUser.password)
  //   const updateUser: UserRequest = {
  //     username: existingUser.username,
  //     password: !passIsCorrect ? newHasPass : existingUser.password,
  //     // image_url: newImageUrl || existingUser.image_url,
  //     // image_id: newImageId || existingUser.image_id
  //   };

  //   await UserRepository.updateUser(userId, updateUser);
  //   return updateUser;
  // };
}