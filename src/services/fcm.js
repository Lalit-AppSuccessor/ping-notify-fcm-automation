import admin from "firebase-admin";
import UserActivity from "../models/Useractivity.js";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FCM_PROJECT_ID,
      clientEmail: process.env.FCM_CLIENT_EMAIL,
      privateKey: process.env.FCM_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

export async function sendPush(user) {
  if (!user.fcmToken || user.isFcmValid === false) return;

  try {
    await admin.messaging().send({
      token: user.fcmToken,
      notification: {
        title: "We miss you 👋",
        body: "You’ve been inactive. Open the app now!",
      },
      data: {
        deeplink: "myapp://home",
      },
    });
  } catch (err) {
    console.error("❌ FCM error:", err.code);

    //  Mark token invalid if FCM rejects it
    if (
      err.code === "messaging/registration-token-not-registered" ||
      err.code === "messaging/invalid-registration-token"
    ) {
      await UserActivity.updateOne({ _id: user._id }, { isFcmValid: false });
    }
  }
}
