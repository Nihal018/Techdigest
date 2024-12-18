export interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  summary?: string;
  publishedDate: Date;
}

export interface PaperQuery {
  page?: number;
  limit?: number;
  category?: string;
}
