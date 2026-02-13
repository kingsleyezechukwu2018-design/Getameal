import { getAMeal, getMealsByCook } from "controllers/meal";
import { Router, Response, NextFunction } from "express";
import { requireAuth, validateJwtToken } from "middlewares";
import { validateInput } from "middlewares/validateInput";
import { asyncWrapper } from "utils/helpers";
import { IRequest } from "utils/types";
import { getAMealSchema, getMealsByCookIdSchema } from "./validations.meals";

const router = Router();
router.use(validateJwtToken, requireAuth);

router.get(
  "/:mealId",
  validateInput(getAMealSchema, "params"),
  asyncWrapper(async (req: IRequest, res: Response, _next: NextFunction) => {
    const { userId } = req;
    const { mealId } = req.params;
    const result = await getAMeal(mealId as string, userId);
    res.json(result);
  }),
);

router.post(
  "/",
  validateInput(getMealsByCookIdSchema, "query"),
  asyncWrapper(async (req: IRequest, res: Response, _next: NextFunction) => {
    const { userId } = req;
    const { cookId, count } = req.query;

    const result = await getMealsByCook({
      userId,
      cookId: String(cookId),
      count: Number(count),
    });
    res.json(result);
  }),
);

export default router;
