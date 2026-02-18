import { Queue, } from "bullmq";
import { redis as connection } from "configs/redis";

const queue = new Queue("Notifications", {
  connection,
});

// ensures retries and delayed jobs
//TODO:
// new QueueScheduler("Notifications", {
//   connection,
// });

export async function sendNewMealPushNotification({
  mealId,
  cookId,
}: {
  mealId: string;
  cookId: string;
}) {
  await queue.add(
    "newMeal",
    {
      mealId,
      cookId,
      title: "New Meal Alert",
      body: "A cook just added a meal!",
    },
    {
      removeOnComplete: true,
      removeOnFail: 1000,
    },
  );
}
