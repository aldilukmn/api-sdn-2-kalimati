import { Request, Response } from "express";
import RegistrationRequest from "../models/dto/registration.dto";
import RegistrationService from '../services/registration.services';
import { defaultResponse } from '../utils';

export default class RegistrationController {
  static register = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const payload: RegistrationRequest = req.body;
    try {
      const newRegistration =
        await RegistrationService.register(payload);

      const response = defaultResponse(
        201,
        "success",
        "Pendaftaran berhasil dibuat",
        newRegistration
      );

      res.status(201).json(response);
    } catch (e) {
      if (e instanceof Error) {
        const response = defaultResponse(
          400,
          "fail",
          e.message
        );

        res.status(400).json(response);
      }
    }
  };

  static getAll = async (
  req: Request,
  res: Response
  ): Promise<void> => {
    try {
      const registrations =
        await RegistrationService.getAll();

      const response = defaultResponse(
        200,
        "success",
        "Data pendaftaran berhasil diambil",
        registrations
      );

      res.status(200).json(response);
    } catch (e) {
      if (e instanceof Error) {
        const response = defaultResponse(
          500,
          "fail",
          e.message
        );

        res.status(500).json(response);
      }
    }
  };

  static getById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;

  try {
    const registration =
      await RegistrationService.getById(id);

    const response = defaultResponse(
      200,
      "success",
      "Data pendaftaran berhasil diambil",
      registration
    );

    res.status(200).json(response);
    } catch (e: Error | unknown) {
      if (e instanceof Error) {
        const response = defaultResponse(
          404,
          "fail",
          e.message
        );

        res.status(404).json(response);
      }
    }
  };

  static updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const result = await RegistrationService.updateStatus(id, status);
      const response = defaultResponse(
      200,
      "success",
      "Status pendaftaran berhasil diupdate",
      result
    );
    res.json(response);
    } catch (e: Error | unknown) {
      if (e instanceof Error) {
        const response = defaultResponse(
          404,
          "fail",
          e.message
        );

        res.status(404).json(response);
      }
    }
  }
}