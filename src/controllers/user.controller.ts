import UserRequest from '../models/dto/user.dto'
import type { Request, Response} from 'express';
import UserService from '../services/user.services';
import UserModel from '../models/schema/user.schema';
import createDefaultResponse from '../utils/response';

export default class User {
  static listUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData = await UserModel.find();
      const response = createDefaultResponse(200, 'success', 'user successfully retrieved', userData);
      res.status(200).json(response);
    } catch (e) {
      if (e instanceof Error) {
        const response = createDefaultResponse(400, 'fail', e.message);
        res.status(400).json(response);
      };
    };
  }

  static register = async (req: Request, res: Response): Promise<void> => {
    const payload: UserRequest = req.body;
    // const isImage: string | undefined = req.file?.path;
    // const imageType: string | undefined = req.file?.mimetype;
    try {
      const newUser = await UserService.register(payload);
      const response = createDefaultResponse(201, 'success', 'user successfully created', newUser);
      res.status(201).json(response);
    } catch (e) {
      if (e instanceof Error) {
        const response = createDefaultResponse(400, 'fail', e.message);
        res.status(400).json(response);
      };
    };
  }

  static getUserById = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id as string;
    try {
      const getUser = await UserService.getUserById(userId);
      const response = createDefaultResponse(200, 'success', 'user has found', getUser);
      res.status(200).json(response);
    } catch (e) {
      if (e instanceof Error) {
        const response = createDefaultResponse(404, 'fail', e.message);
        res.status(404).json(response);
      };
    };
  }

  static login = async (req: Request, res: Response): Promise<void> => {
    const payload: UserRequest = req.body;
    try {
      const result = await UserService.login(payload);
      const response = createDefaultResponse(200, 'success', `${result.username} successfully login`, result.token);
      // res.cookie('auth_token', `Bearer ${result.token}`, {
      //   httpOnly: true,
      //   maxAge: 60 * 60 + 1000,
      //   secure: true
      // });
      res.status(200).json(response);
    } catch (e) {
      if (e instanceof Error) {
        const response = createDefaultResponse(400, 'fail', e.message);
        res.status(400).json(response);
      };
    };
  };

  static logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = createDefaultResponse(200, 'success', 'user successfully logout');
      res.status(200).json(response);
    } catch (e) {
      if (e instanceof Error) {
        const response = createDefaultResponse(400, 'fail', e.message);
        res.status(400).json(response);
      }
    }
  }

  static deleteUserById = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id as string;
    try {
      await UserService.deleteUserById(userId);
      const response = createDefaultResponse(200, 'success', 'user successfully deleted');
      res.status(200).json(response);
    } catch (e) {
      if (e instanceof Error) {
        const response = createDefaultResponse(400, 'fail', e.message);
        res.status(400).json(response);
      }
      }
  };

  // static updateUserById = async (req: Request, res: Response): Promise<void> => {
  //   const userId = req.params.id as string;
  //   const payload: UserRequest = req.body;
  //   const image: string | undefined = req.file?.path;
  //   const typeImage: string | undefined = req.file?.mimetype;
  //   try {
  //     const userUpdate = await UserService.updateUse(payload, userId, image, typeImage);
  //     const response = createDefaultResponse(200, 'success', 'user successfully updated', userUpdate);
  //     res.status(200).json(response);

  //   } catch (e) {
  //     if (e instanceof Error) {
  //       const response = createDefaultResponse(400, 'fail', e.message);
  //       res.status(400).json(response);
  //     }
  //   }
  // }
}