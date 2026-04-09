import mongoose from "mongoose";

export interface IProject extends mongoose.Document {
  slug: string; // unique identifier (e.g., "hft-order-book")
  hasGithubLink: boolean;
  githubUrl: string;
}

const ProjectSchema = new mongoose.Schema<IProject>(
  {
    slug: { type: String, required: true, unique: true },
    hasGithubLink: { type: Boolean, default: false },
    githubUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
