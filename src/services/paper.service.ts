// src/services/paper.service.ts
import { IPaper, Paper } from "../models/paper.model";
import { ArxivService } from "./arxiv.service";

export class PaperService {
  private arxivService: ArxivService;

  constructor() {
    this.arxivService = new ArxivService();
  }

  async findPapers(query: {
    page?: number;
    limit?: number;
    category?: string;
  }): Promise<IPaper[]> {
    const { page = 1, limit = 10, category } = query;

    const filter = category ? { categories: category } : {};

    // For now, return mock data
    return Paper.find(filter)
      .sort({ publishedDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async syncPapers(): Promise<void> {
    try {
      const papers = await this.arxivService.fetchRecentPapers();
      for (const paper of papers) {
        await Paper.findOneAndUpdate({ arxivId: paper.arxivId }, paper, {
          upsert: true,
          new: true,
        });
      }
    } catch (error) {
      console.error("Error syncing papers:", error);
      throw error;
    }
  }
}
