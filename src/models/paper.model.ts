import mongoose, { Document, Schema } from "mongoose";

export interface IPaper extends Document {
  arxivId: string;
  title: string;
  authors: string[];
  abstract: string;
  summary: string;
  categories: string[];
  publishedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
