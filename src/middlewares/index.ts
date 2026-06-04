import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedType } from './types';
import env from 'dotenv';
import User from '../models/entity/user.entity';
import UserRepository from '../repositories/user.repo';
import { createDefaultResponse, validateToken } from '../utils';
env.config();

export default class UserMiddleware {
  static verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token: string | undefined = req.headers.authorization;

      const getToken = validateToken(token);

      const decoded = jwt.verify(getToken, `${process.env.SECRET_KEY}`) as DecodedType;

      const user = await UserRepository.getUserByUsername(decoded.user) as User;

      const isUser: boolean = user.username === decoded.user;

      if (!isUser) {
        throw new Error('user not found!');
      } 

      next();
    } catch (e) {
      if (e instanceof Error) {
        const response = createDefaultResponse(401, 'fail', e.message);
        res.status(401).json(response);
      }
    }
  };

  static isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token: string | undefined = req.headers.authorization;

      const getToken = validateToken(token);
      
      const decoded = jwt.verify(getToken, `${process.env.SECRET_KEY}`) as DecodedType;

      const user = await UserRepository.getUserByUsername(decoded.user) as User;

      const isAdmin: boolean = user.role === decoded.role;

      if (!isAdmin) {
        throw new Error('it\'s not admin!');
      }

      next();

    } catch (e) {
      if (e instanceof Error) {
        const response = createDefaultResponse(401, 'fail', e.message);
        res.status(401).json(response);
      }
    }
  }
}