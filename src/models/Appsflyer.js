import mongoose from "mongoose";

/** Stores raw AppsFlyer webhook events **/

const AppsflyerEventSchema = new mongoose.Schema(
  {
    eventName: String,
    customerUserId: String,
    appId: String,
    platform: String,
    eventTime: Date,

    rawPayload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes for querying later
AppsflyerEventSchema.index({ customerUserId: 1 });
AppsflyerEventSchema.index({ eventName: 1 });
AppsflyerEventSchema.index({ eventTime: -1 });

export default mongoose.model("AppsflyerEvent", AppsflyerEventSchema);
