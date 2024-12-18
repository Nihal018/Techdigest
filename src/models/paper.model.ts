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

const PaperSchema = new Schema<IPaper>(
  {
    arxivId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    authors: [{ type: String, required: true }],
    abstract: { type: String, required: true },
    summary: { type: String },
    categories: [{ type: String }],
    publishedDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Paper = mongoose.model<IPaper>("Paper", PaperSchema);
