const mongoose = require("mongoose");

const NowConfigSchema = new mongoose.Schema(
  {
    location:    { type: String, default: "Mumbai, India" },
    lastUpdated: { type: String, default: "" },
    instagram:   { type: String, default: "" },
    thinking:    { type: String, default: "" },
    building: [{
      title:  { type: String },
      detail: { type: String },
    }],
    learning: [{ type: String }],
    reading: [{
      title:  { type: String },
      author: { type: String },
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("NowConfig", NowConfigSchema);