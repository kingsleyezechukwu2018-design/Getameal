import { ReviewEntity } from "models/reviews/review.entity";
import { getUser } from "utils";

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
  await getUser(userId);
  await getUser(cookId);

  return ReviewEntity.createReview({ userId, cookId, rating, comment });
}

export async function getReview(cookId: string, reviewId: string) {
  await getUser(cookId);
  return ReviewEntity.getReview({ cookId, id: reviewId });
}

export async function getReviewsByCookId(cookId: string, count?: number) {
  await getUser(cookId);
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
    throw new Error("Review not found");
  }

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
  const review = await ReviewEntity.getReview({ id: reviewId, userId, ...(cookId && { cookId }) });

  if (!review) {
    throw new Error("Review not found");
  }

  await ReviewEntity.deleteReview({ id: reviewId });
}

export async function countCookReviews(cookId: string): Promise<number> {
  await getUser(cookId);

  return await ReviewEntity.countReviewsByCookId(cookId);
}

export async function countCookRating(cookId: string): Promise<number> {
  await getUser(cookId);

  return await ReviewEntity.countCookRating(cookId);
}
