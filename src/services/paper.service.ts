// src/services/paper.service.ts
import { Paper, PaperQuery } from "../types/paper.types";

export class PaperService {
  private papers: Paper[] = [];

  async findPapers(query: PaperQuery): Promise<Paper[]> {
    // For now, return mock data
    return [
      {
        id: "1",
        title: "Sample Paper",
        authors: ["John Doe"],
        abstract: "This is a sample abstract",
        publishedDate: new Date(),
      },
    ];
  }

  async findPaperById(id: string): Promise<Paper | null> {
    const paper = this.papers.find((p) => p.id === id);
    return paper || null;
  }
}
