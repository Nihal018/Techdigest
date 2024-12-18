import { Request, Response } from "express";
import { PaperService } from "../services/paper.service";
import mongoose from "mongoose";

export class PaperController {
  private paperService: PaperService;

  constructor() {
    this.paperService = new PaperService();
  }

  async getPapers(req: Request, res: Response) {
    try {
      const query = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        category: req.query.category as string,
      };
      const paper = await this.paperService.findPapers(query);
      res.json({ success: true, data: paper });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "failed to fetch papers",
      });
    }
  }
  async getPaperById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid paper ID format",
        });
        return;
      }

      const paper = await this.paperService.findPaperById(id);

      if (!paper) {
        res.status(404).json({
          success: false,
          message: "Paper not found",
        });
        return;
      }

      res.json({ success: true, data: paper });
    } catch (error) {
      console.error("Error finding paper by ID:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch paper",
      });
    }
  }

  async syncPapers(req: Request, res: Response): Promise<void> {
    try {
      await this.paperService.syncPapers();
      res.json({
        success: true,
        message: "Papers synchronized successfully",
      });
    } catch (error) {
      console.error("Error syncing papers:", error);
      res.status(500).json({
        success: false,
        message: "Failed to sync papers",
      });
    }
  }
}
