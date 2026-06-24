import { Request, Response } from "express";
import DashboardService from "../services/dashboard.services";
import { defaultResponse } from "../utils";

export default class DashboardController {
  static getSummary = async (req: Request, res: Response): Promise<void> => {
    try {
      const summary = await DashboardService.getSummary();
      const response = defaultResponse(
        200,
        "success",
        "Dashboard summary retrieved successfully",
        summary
      );
      res.status(200).json(response);
    } catch (e) {
      if (e instanceof Error) {
        const response = defaultResponse(500, "fail", e.message);
        res.status(500).json(response);
      }
    }
  };
}
