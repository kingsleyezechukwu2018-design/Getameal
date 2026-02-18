import admin from "firebase-admin";
import { DeviceTokenEntity } from "models/deviceTokens/device_token.entity";
import createLogger, { ModuleType } from "utils/logger";

const logger = createLogger(ModuleType.Config, "NOTIFICATIONS");

export async function sendPushNotification({
  fcmToken,
  title,
  body,
}: {
  fcmToken: string;
  title: string;
  body: string;
}) {
  await admin.messaging().send({
    token: fcmToken,
    notification: {
      title,
      body,
    },
    data: {
      type: "NEW_MESSAGE",
    },
  });
}

export const sendBulkPushNotifications = async (
  tokens: string[],
  title: string,
  body: string,
) => {
  const message = {
    notification: {
      title,
      body,
    },
    tokens,
  };

  const { responses } = await admin.messaging().sendEachForMulticast(message);

  responses.forEach(async (resp, index) => {
    if (!resp.success) {
      const failedToken = tokens[index];

      switch (resp.error?.code) {
        case "messaging/registration-token-not-registered":
        case "messaging/invalid-argument":
        case "messaging/messaging-unknown":
          logger.info("Soft deleting invalid token:", { failedToken });
          //Soft Delete from DB
          const deviceToken = await DeviceTokenEntity.findByParams({
            token: failedToken,
          });
          if (deviceToken) {
            await DeviceTokenEntity.updateDeviceToken(deviceToken.id, {
              isDeleted: true,
            });
          }
          break;

        default:
          logger.warn("Other FCM error:", {
            code: resp.error?.code,
            failedToken,
          });
      }
    }
  });

  logger.info("Bulk push notification results", {
    responses,
    totalTokens: tokens.length,
    successCount: responses.filter((r) => r.success).length,
    failureCount: responses.filter((r) => !r.success).length,
  });
};

// export async function sendPushNotificationsToAllUsers() {
//   await admin.messaging().send({
//     topic: "new_meals",
//     notification: {
//       title: "New Meal Alert 🍽",
//       body: "A cook just added a new meal!",
//     },
//   });
// }
