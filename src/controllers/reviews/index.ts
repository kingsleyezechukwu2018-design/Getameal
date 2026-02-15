import { RouteError } from "configs/errors";
import { ReviewEntity } from "models/reviews/review.entity";
import { getUser } from "utils";
import createLogger, { ModuleType } from "utils/logger";

const logger = createLogger(ModuleType.Controller, "REVIEWS");

export async function addReview({
  userId,
  cookId,
  rating,
  comment,
}: {
  userId: string;
  cookId: string;
  rating?: number;
  comment: string;
}) {
  const user = await getUser(userId);
  const cook = await getUser(cookId);

  if (user.id === cook.id) {
    const error = new RouteError("Users cannot review themselves");
    logger.error("Users cannot review themselves", { userId, cookId, error });
    throw error;
  }

  logger.info("Adding review", { userId, cookId, rating });
  return ReviewEntity.createReview({ userId, cookId, rating, comment });
}

export async function getReview(cookId: string, reviewId: string) {
  await getUser(cookId);
  logger.info("Getting review", { cookId, reviewId });
  return ReviewEntity.getReview({ cookId, id: reviewId });
}

export async function getReviewsByCookId(cookId: string, count?: number) {
  await getUser(cookId);
  logger.info("Getting reviews by cookId", { cookId, count });
  return ReviewEntity.getReviews({ cookId }, count);
}

export async function updateReview({
  reviewId,
  userId,
  rating,
  comment,
}: {
  reviewId: string;
  userId: string;
  rating?: number;
  comment?: string;
}) {
  await getUser(userId);
  const review = await ReviewEntity.getReview({ id: reviewId, userId });

  if (!review) {
    logger.warn("Review not found for update", { reviewId, userId });
    throw new Error("Review not found");
  }

  logger.info("Updating review", { reviewId, userId, rating });
  return ReviewEntity.updateReview({ id: reviewId }, { rating, comment });
}

export async function deleteReview({
  reviewId,
  userId,
  cookId,
}: {
  reviewId: string;
  userId: string;
  cookId?: string;
}) {
  await getUser(userId);
  if (cookId) {
    await getUser(cookId);
  }
  const review = await ReviewEntity.getReview({
    id: reviewId,
    userId,
    ...(cookId && { cookId }),
  });

  if (!review) {
    logger.warn("Review not found for delete", { reviewId, userId });
    throw new Error("Review not found");
  }

  logger.info("Deleting review", { reviewId, userId });
  await ReviewEntity.deleteReview({ id: reviewId });

  return { success: true };
}

export async function countCookReviews(cookId: string): Promise<number> {
  await getUser(cookId);
  logger.info("Counting reviews for cook", { cookId });
  return await ReviewEntity.countReviewsByCookId(cookId);
}

export async function countCookRating(cookId: string): Promise<number> {
  await getUser(cookId);
  logger.info("Counting ratings for cook", { cookId });
  return await ReviewEntity.countCookRating(cookId);
}
