import { Worker } from "bullmq";
import { redis as connection } from "configs/redis";
import { sendBulkPushNotifications } from "configs/notificationLibrary/firebase/handler";
import { batchPushNotification } from "configs/notificationLibrary/firebase/notificationMessages";

new Worker(
  "Notifications",
  async (job) => {
    if (job.name === "newMeal") {
      const { mealId, cookId, title, body } = job.data;
      console.log({ mealId, cookId, title, body });

      await batchPushNotification((tokens: string[]) =>
        sendBulkPushNotifications(tokens, title, body),
      );
    }
  },
  {
    connection
  },
);
