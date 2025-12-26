import express from "express";
import UserActivity from "../models/Useractivity.js";
import { sendPush } from "../services/fcm.js";

const router = express.Router();

router.post("/ping-inactive", async (req, res) => {
  const inactiveLimitMs =
    Number(process.env.INACTIVE_LIMIT_HOURS) * 60 * 60 * 1000;
  const pingIntervalMs =
    Number(process.env.PING_INTERVAL_HOURS) * 60 * 60 * 1000;
  
    const now = Date.now();

  const users = await UserActivity.find({
    lastActiveAt: { $lte: new Date(now - inactiveLimitMs) },
    isFcmValid: true,
    $or: [
      { lastPingSentAt: null },
      { lastPingSentAt: { $lte: new Date(now - pingIntervalMs) } },
    ],
  });

  let pinged = 0;

  for (const user of users) {
    await sendPush(user);
    user.lastPingSentAt = new Date();
    await user.save();
    pinged++;
  }

  res.json({
    success: true,
    pingedUsers: "Notification sent to " + pinged + " user.",
  });
});

export default router;
