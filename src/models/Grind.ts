import mongoose from "mongoose";

export interface IGrind extends mongoose.Document {
  dayCount: number;
  date: Date;
  title: string;
  body: string; // Markdown formatted
  tags: string[];
  slug: string;
  published: boolean;
}

const GrindSchema = new mongoose.Schema<IGrind>(
  {
    dayCount: { type: Number, required: true, unique: true },
    date: { type: Date, default: Date.now },
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: { type: [String], default: [] },
    slug: { type: String, required: true, unique: true },
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.Grind || mongoose.model<IGrind>("Grind", GrindSchema);
