import mongoose from "mongoose";

/**
 * One document per user stores latest FCM token safely
 */

const UserActivitySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    fcmToken: { type: String },
    fcmUpdatedAt: { type: Date },
    lastActiveAt: { type: Date, required: true },
    lastPingSentAt: { type: Date },
    isFcmValid: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserActivitySchema.index({ lastActiveAt: 1 });

export default mongoose.model("UserActivity", UserActivitySchema);
