const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    tagline: {
      type: String,
      required: [true, "Tagline is required"],
      trim: true,
      maxlength: [200, "Tagline cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
    },
    // ── Full markdown write-up shown on project detail page ──
    longDescription: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
      enum: {
        values: ["quant", "ai-ml", "software"],
        message: 'Category must be "quant", "ai-ml", or "software"',
      },
    },
    techStack: {
      type: [String],
      default: [],
    },
    metrics: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    githubUrl: {
      type: String,
      trim: true,
      default: null,
    },
    liveUrl: {
      type: String,
      trim: true,
      default: null,
    },
    displayOrder: {
      type: Number,
      default: 99,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

projectSchema.index({ isPublished: 1, category: 1, displayOrder: 1 });
projectSchema.index({ isFeatured: 1 });

module.exports =
  mongoose.models.Project || mongoose.model("Project", projectSchema);