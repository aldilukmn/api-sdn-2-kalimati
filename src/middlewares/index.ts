import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedType } from './types';
import env from 'dotenv';
import User from '../models/entity/user.entity';
import UserRepository from '../repositories/user.repo';
import TokenBlacklistRepository from '../repositories/token-blacklist.repo';
import { defaultResponse, validateToken } from '../utils';
env.config();

export default class UserMiddleware {
  static verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token: string | undefined = req.headers.authorization as string;

      const getToken = validateToken(token);

      // Check if token is blacklisted
      const isBlacklisted = await TokenBlacklistRepository.isTokenBlacklisted(getToken);
      if (isBlacklisted) {
        throw new Error('token has been revoked!');
      }

      const decoded = jwt.verify(getToken, `${process.env.SECRET_KEY}`) as DecodedType;

      const user = await UserRepository.getUserByUsername(decoded.user) as User;

      const isUser: boolean = user.username === decoded.user;

      if (!isUser) {
        throw new Error('user not found!');
      } 

      // Attach token & username to request for later use in logout
      (req as any).token = getToken;
      (req as any).username = decoded.user;

      next();
    } catch (e) {
      if (e instanceof Error) {
        const response = defaultResponse(401, 'fail', e.message);
        res.status(401).json(response);
      }
    }
  };

  static verifyTeacherGrade = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { grade } = req.body;
      if (!grade) return next();

      const token: string | undefined = req.headers.authorization as string;
      const getToken = validateToken(token);
      const decoded = jwt.verify(getToken, `${process.env.SECRET_KEY}`) as DecodedType;

      if (decoded.role === 'admin' || decoded.role === 'kepala') return next();

      if (decoded.grade !== grade) {
        throw new Error(`Akses ditolak! Anda hanya bisa input presensi untuk kelas ${decoded.grade}.`);
      }

      next();
    } catch (e) {
      if (e instanceof Error) {
        const response = defaultResponse(401, 'fail', e.message);
        res.status(401).json(response);
      }
    }
  };

  static isTeacherOrAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token: string | undefined = req.headers.authorization as string;

      const getToken = validateToken(token);

      const decoded = jwt.verify(getToken, `${process.env.SECRET_KEY}`) as DecodedType;

      const user = await UserRepository.getUserByUsername(decoded.user) as User;

      if (user.role !== "admin" && user.role !== "guru" && user.role !== "kepala") {
        throw new Error("Akses ditolak! Hanya guru, admin, dan kepala sekolah yang diizinkan.");
      }

      (req as any).token = getToken;
      (req as any).username = decoded.user;

      next();
    } catch (e) {
      if (e instanceof Error) {
        const response = defaultResponse(401, "fail", e.message);
        res.status(401).json(response);
      }
    }
  };

  static isAdminOrHead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token: string | undefined = req.headers.authorization as string;
      const getToken = validateToken(token);
      const decoded = jwt.verify(getToken, `${process.env.SECRET_KEY}`) as DecodedType;
      const user = await UserRepository.getUserByUsername(decoded.user) as User;

      if (user.role !== 'admin' && user.role !== 'kepala') {
        throw new Error("Akses ditolak! Hanya admin dan kepala sekolah yang diizinkan.");
      }

      next();
    } catch (e) {
      if (e instanceof Error) {
        const response = defaultResponse(401, 'fail', e.message);
        res.status(401).json(response);
      }
    }
  };

  static isTeacher = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token: string | undefined = req.headers.authorization as string;
      const getToken = validateToken(token);
      const decoded = jwt.verify(getToken, `${process.env.SECRET_KEY}`) as DecodedType;

      if (decoded.role !== 'guru') {
        throw new Error('Akses ditolak! Hanya guru yang diizinkan.');
      }

      (req as any).grade = decoded.grade;
      next();
    } catch (e) {
      if (e instanceof Error) {
        const response = defaultResponse(401, 'fail', e.message);
        res.status(401).json(response);
      }
    }
  };

  static isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token: string | undefined = req.headers.authorization as string;

      const getToken = validateToken(token);
      
      const decoded = jwt.verify(getToken, `${process.env.SECRET_KEY}`) as DecodedType;

      const user = await UserRepository.getUserByUsername(decoded.user) as User;

      if (user.role !== 'admin') {
        throw new Error('it\'s not admin!');
      }

      next();

    } catch (e) {
      if (e instanceof Error) {
        const response = defaultResponse(401, 'fail', e.message);
        res.status(401).json(response);
      }
    }
  }
}