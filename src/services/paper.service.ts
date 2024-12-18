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
      console.log("Starting paper synchronization");
      const papers = await this.arxivService.fetchRecentPapers();
      console.log(`Fetched ${papers.length} papers from arXiv`);

      for (const paper of papers) {
        console.log(`Attempting to save paper with arXiv ID: ${paper.arxivId}`);
        const result = await Paper.findOneAndUpdate(
          { arxivId: paper.arxivId },
          paper,
          { upsert: true, new: true }
        );
        console.log(`Saved paper with MongoDB ID: ${result._id}`);
      }

      const count = await Paper.countDocuments();
      console.log(`Total papers in database after sync: ${count}`);
    } catch (error) {
      console.error("Error syncing papers:", error);
      throw error;
    }
  }
  async findPaperById(id: string): Promise<IPaper | null> {
    try {
      const paper = await Paper.findById(id);
      return paper;
    } catch (error) {
      console.error("Error finding paper by ID:", error);
      throw error;
    }
  }
}
