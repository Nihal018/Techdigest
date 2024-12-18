import axios from "axios";
import { parseString } from "xml2js";
import { promisify } from "util";

const parseXML = promisify(parseString);

export class ArxivService {
  private readonly baseUrl = "http://export.arxiv.org/api/query";

  async fetchRecentPapers(category: string = "cs.AI", maxResults: number = 10) {
    try {
      const query = `cat:${category}`;
      const response = await axios.get(this.baseUrl, {
        params: {
          search_query: query,
          sortBy: "lastUpdatedDate",
          sortOrder: "descending",
          max_results: maxResults,
        },
      });
      const result = await parseXML(response.data);
      return this.transformArxivResponse(result);
    } catch (error) {
      console.error("Error fetching from arXiv:", error);
      throw new Error("Failed to fetch papers from arXiv");
    }
  }

  private transformArxivResponse(data: any) {
    if (!data.feed || !data.feed.entry) {
      console.log("No entries found in arXiv response");
      return [];
    }

    const entries = Array.isArray(data.feed.entry)
      ? data.feed.entry
      : [data.feed.entry];

    return entries.map((entry: any) => ({
      arxivId: entry.id[0].split("/abs/")[1],
      title: entry.title[0].trim(),
      authors: entry.author.map((author: any) => author.name[0]),
      abstract: entry.summary[0].trim(),
      categories: entry.category
        ? entry.category.map((cat: any) => cat.$.term)
        : [],
      publishedDate: new Date(entry.published[0]),
    }));
  }
}
