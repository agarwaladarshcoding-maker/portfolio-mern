import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String, // secure random hex token for email verification
    required: true,
  },
  tokenExpires: {
    type: Date, // token is valid for 24 hours
    required: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Subscriber ||
  mongoose.model("Subscriber", SubscriberSchema);
