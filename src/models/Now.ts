import mongoose from "mongoose";

export interface INow extends mongoose.Document {
  content: string; // Markdown formatted
  lastUpdated: Date;
}

const NowSchema = new mongoose.Schema<INow>(
  {
    content: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Now || mongoose.model<INow>("Now", NowSchema);
