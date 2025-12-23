import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import appsflyerRoutes from "./routes/appsflyer.js";
import registerdevice from "./routes/registerdevice.js";
import health from "./routes/health.js";
import cronRoutes from "./routes/cron.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "2mb" }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error", err));

app.use("/", health);
app.use("/webhook", appsflyerRoutes);
app.use("/webhook", registerdevice);
app.use("/cron", cronRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
