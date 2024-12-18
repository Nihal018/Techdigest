import { Request, Response } from "express";
import { PaperService } from "../services/paper.service";
import { json } from "stream/consumers";

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
      const paper = await this.paperService.findPaperById(req.params.id);

      if (!paper) {
        res.status(404).json({
          success: false,
          message: "Paper not found",
        });
        return;
      }

      res.json({ success: true, data: paper });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch paper",
      });
    }
  }
}
