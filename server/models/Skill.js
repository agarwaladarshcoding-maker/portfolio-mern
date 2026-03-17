// ============================================================
// Skill.js — Mongoose Schema for the Skills Matrix
// ============================================================
// WHY STORE SKILLS IN THE DB (instead of hardcoding in React)?
//   Because your stack evolves constantly. When you pick up
//   a new tool (Rust, JAX, QuantLib), you want to add it
//   by hitting an API endpoint — not by editing source code,
//   committing, and redeploying.
// ============================================================

const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
      unique: true,           // No duplicate skill entries
    },

    // Two top-level categories in your matrix:
    // "technical" = languages, frameworks, tools
    // "theoretical" = math/CS domains
    category: {
      type: String,
      required: true,
      enum: {
        values: ["technical", "theoretical"],
        message: 'Category must be "technical" or "theoretical"',
      },
    },

    // Sub-group within the category, for visual grouping in the matrix.
    // Technical sub-groups:  "languages" | "frameworks" | "tools"
    // Theoretical sub-groups: "mathematics" | "cs-theory" | "finance"
    subGroup: {
      type: String,
      trim: true,
    },

    // Proficiency: 1–5 scale.
    // 1 = Learning, 3 = Proficient, 5 = Expert
    // Used to render a visual bar or dot indicator.
    proficiency: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },

    // Icon identifier string. Maps to a React icon component
    // or a Devicon class on the frontend.
    // e.g. "cpp", "python", "mongodb", "react"
    icon: {
      type: String,
      trim: true,
      default: null,
    },

    displayOrder: {
      type: Number,
      default: 99,
    },
  },
  { timestamps: true }
);

skillSchema.index({ category: 1, subGroup: 1, displayOrder: 1 });

module.exports =
  mongoose.models.Skill || mongoose.model("Skill", skillSchema);