import express from "express";
import AppsflyerEvent from "../models/Appsflyer.js";
import UserActivity from "../models/Useractivity.js";

const router = express.Router();

/**
 * POST /webhook/appsflyer
 * Receives AppsFlyer webhook events
 */

router.post("/appsflyer", async (req, res) => {
  try {
    const payload = req.body;

    const { event_name, customer_user_id, event_time, app_id, platform } =
      payload;

    // 1️⃣ Store RAW event
    await AppsflyerEvent.create({
      eventName: event_name || null,
      customerUserId: customer_user_id || null,
      appId: app_id || null,
      platform: platform || null,
      eventTime: event_time ? new Date(event_time) : new Date(),
      rawPayload: payload,
    });

    // 2️⃣ Update last activity (only if user exists)
    if (customer_user_id) {
      await UserActivity.findOneAndUpdate(
        { userId: customer_user_id },
        {
          userId: customer_user_id,
          lastActiveAt: event_time ? new Date(event_time) : new Date(),
        },
        { upsert: true }
      );
    }

    // MUST respond 200
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ AppsFlyer webhook error:", err);

    // Still return 200 to prevent retries storm
    res.status(200).json({ success: false });
  }
});

export default router;
