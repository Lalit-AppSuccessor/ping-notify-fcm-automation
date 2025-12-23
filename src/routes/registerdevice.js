import express from "express";
import UserActivity from "../models/Useractivity.js";

const router = express.Router();

/**
 * Register or refresh FCM token
 */

router.post("/register-device", async (req, res) => {
  try {
    const { userId, fcmToken } = req.body;

    if (!userId || !fcmToken) {
      return res.status(400).json({ error: "Missing userId or fcmToken" });
    }

    await UserActivity.findOneAndUpdate(
      { userId },
      {
        userId,
        fcmToken,
        fcmUpdatedAt: new Date(),
        isFcmValid: true, // reset on refresh
        lastActiveAt: new Date(), // app is active
      },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Register device error:", err);
    res.status(500).json({ error: "Internal error" });
  }
});

export default router;
