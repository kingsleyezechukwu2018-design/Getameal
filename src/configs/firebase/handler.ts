import admin from "firebase-admin";

export async function sendPushNotification({
  token,
  title,
  body,
}: {
  token: string;
  title: string;
  body: string;
}) {
  await admin.messaging().send({
    token,
    notification: {
      title,
      body,
    },
    data: {
      type: "NEW_MESSAGE",
    },
  });
}
