import { Request, Response } from "express";
import StudentAttendanceRequest from "../models/dto/student-attendance.dto";
import StudentAttendanceService from "../services/student-attendance.services";
import { defaultResponse } from "../utils";

export default class StudentAttendanceController {
  static create = async (req: Request, res: Response): Promise<void> => {
    try {
      const payload: StudentAttendanceRequest = req.body;
      const result = await StudentAttendanceService.createOrUpdate(payload);

      res
        .status(201)
        .json(
          defaultResponse(201, "success", "Data presensi berhasil disimpan", result)
        );
    } catch (e) {
      if (e instanceof Error) {
        res.status(400).json(defaultResponse(400, "fail", e.message));
      }
    }
  };

  static getByGradeAndDate = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const grade = req.query.grade as string;
      const date = req.query.date as string;
      const result = await StudentAttendanceService.getByGradeAndDate(
        grade,
        date
      );

      res
        .status(200)
        .json(
          defaultResponse(200, "success", "Data presensi berhasil diambil", result)
        );
    } catch (e) {
      if (e instanceof Error) {
        res.status(400).json(defaultResponse(400, "fail", e.message));
      }
    }
  };

  static getReportByGrade = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const grade = req.query.grade as string;
      const month = req.query.month ? Number(req.query.month) : undefined;
      const year = req.query.year ? Number(req.query.year) : undefined;
      const result = await StudentAttendanceService.getReportByGrade(
        grade,
        month,
        year
      );

      res
        .status(200)
        .json(
          defaultResponse(200, "success", "Rekap presensi berhasil diambil", result)
        );
    } catch (e) {
      if (e instanceof Error) {
        res.status(400).json(defaultResponse(400, "fail", e.message));
      }
    }
  };
}
