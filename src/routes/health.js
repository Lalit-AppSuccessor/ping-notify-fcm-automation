import express from "express";

const router = express.Router();

/**
 * POST /cron/ping-inactive
 * Triggered by cron-job.org
 */

router.get("/ping", async (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default router;