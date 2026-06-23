import { Request, Response } from "express";
import MasterStudentModel from "../models/schema/master-student.schema";
import { defaultResponse } from "../utils";

export default class MasterStudentController {
  static getByGrade = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const grade = req.query.grade as string;

      if (!grade) {
        res
          .status(400)
          .json(defaultResponse(400, "fail", "Parameter grade wajib diisi!"));
        return;
      }

      const validGrades = ["1", "2", "3", "4", "5", "6"];
      if (!validGrades.includes(grade)) {
        res.status(400).json(defaultResponse(400, "fail", "Kelas tidak ditemukan!"))
      }

      const students = await MasterStudentModel.find({ grade }).sort({
        studentId: 1,
      });

      res
        .status(200)
        .json(
          defaultResponse(200, "success", "Data siswa berhasil diambil", students)
        );
    } catch (e) {
      if (e instanceof Error) {
        res.status(500).json(defaultResponse(500, "fail", e.message));
      }
    }
  };
}
