import { Router, Response, NextFunction } from "express";
import { requireAuth, validateJwtToken } from "middlewares";
import { validateInput } from "middlewares/validateInput";
import { asyncWrapper } from "utils/helpers";
import { IRequest } from "utils/types";
import {
  addReviewSchema,
  countRatingSchema,
  countReviewSchema,
  deleteReviewSchema,
  getReviewSchema,
  getReviewsSchema,
  updateReviewSchema,
} from "./validations.reviews";
import {
  addReview,
  countCookRating,
  countCookReviews,
  deleteReview,
  getReview,
  getReviewsByCookId,
  updateReview,
} from "controllers/reviews";

const router = Router();
router.use(validateJwtToken, requireAuth);

router.post(
  "/",
  validateInput(addReviewSchema),
  asyncWrapper(async (req: IRequest, res: Response, _next: NextFunction) => {
    const { userId } = req;
    const { cookId, rating, comment } = req.body;
    const result = await addReview({ userId, cookId, rating, comment });
    res.json(result);
  }),
);

router.get(
  "/",
  validateInput(getReviewsSchema, "query"),
  asyncWrapper(async (req: IRequest, res: Response, _next: NextFunction) => {
    const { userId } = req;
    const { cookId, count } = req.query;

    const result = await getReviewsByCookId(String(cookId), Number(count));
    res.json(result);
  }),
);

router.post(
  "/retrieve",
  asyncWrapper(async (req: IRequest, res: Response, _next: NextFunction) => {
    const { userId } = req;
    const { cookId, reviewId } = req.body

    const result = await getReview(String(cookId), String(reviewId));
    res.json(result);
  }),
);

router.patch(
  "/",
  validateInput(updateReviewSchema),
  asyncWrapper(async (req: IRequest, res: Response, _next: NextFunction) => {
    const { reviewId, rating, comment } = req.body;
    const { userId } = req;
    const result = await updateReview({ reviewId, userId, rating, comment });
    res.json(result);
  }),
);

router.delete(
  "/",
  validateInput(deleteReviewSchema),
  asyncWrapper(async (req: IRequest, res: Response, _next: NextFunction) => {
    const { userId } = req;
    const { reviewId, cookId } = req.body;
    const result = await deleteReview({ reviewId, userId, cookId });
    res.json(result);
  }),
);

router.get(
  "/total/:cookId",
  validateInput(countReviewSchema, "params"),
  asyncWrapper(async (req: IRequest, res: Response) => {
    const { cookId } = req.params;
    const totalReviews = await countCookReviews(cookId);
    res.json({ totalReviews });
  }),
);

router.get(
  "/ratings/:cookId",
  validateInput(countRatingSchema, "params"),
  asyncWrapper(async (req: IRequest, res: Response) => {
    const { cookId } = req.params;
    const totalRatings = await countCookRating(cookId);
    res.json({ totalRatings });
  }),
);

export default router;
