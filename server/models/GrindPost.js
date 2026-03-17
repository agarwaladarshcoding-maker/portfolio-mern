const mongoose = require("mongoose");

const GrindPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    dayNumber: {
      type: Number,
      required: [true, "Day number is required"],
    },
    // URL slug — e.g. "day-70"
    // Auto-generated from dayNumber if not provided
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    linkedInUrl: {
      type: String,
      default: "",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    codeforcesProblems: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Auto-generate slug from dayNumber before saving
GrindPostSchema.pre("save", function(next) {
  if (!this.slug && this.dayNumber) {
    this.slug = "day-" + this.dayNumber;
  }
  next();
});

module.exports = mongoose.models.GrindPost ||
  mongoose.model("GrindPost", GrindPostSchema);