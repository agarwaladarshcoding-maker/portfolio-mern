// Simple session token model for admin auth
const mongoose = require("mongoose");

const adminSessionSchema = new mongoose.Schema(
  {
    // Hashed token stored here — never plain text
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.AdminSession ||
  mongoose.model("AdminSession", adminSessionSchema);