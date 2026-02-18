import { NextFunction, Router, Request, Response } from "express";
import { validateInput } from "middlewares/validateInput";
import { asyncWrapper } from "utils/helpers";

import { IRequest } from "utils/types";
import { requireAuth, validateJwtToken } from "middlewares";
import {
  addMealToCart,
  getCartItem,
  getCartItems,
  removeMealFromCart,
} from "controllers/carts";
import {
  addMealToCartSchema,
  getMealFromCartSchema,
  removeMealFromCartSchema,
} from "./validations.cart";

const router = Router();
router.use(validateJwtToken, requireAuth);

router.post(
  "/add",
  validateInput(addMealToCartSchema),
  asyncWrapper(async (req: IRequest, res: Response, _next: NextFunction) => {
    const { userId: customerId } = req;
    const { mealId } = req.body;
    const result = await addMealToCart({ customerId, mealId });
    res.json(result);
  }),
);

router.post(
  "/remove",
  validateInput(removeMealFromCartSchema),
  asyncWrapper(async (req: IRequest, res: Response, _next: NextFunction) => {
    const { userId: customerId } = req;
    const { mealId, shouldDelete } = req.body;
    const result = await removeMealFromCart({customerId, mealId, shouldDelete});
    res.json(result);
  }),
);

router.get(
  "/",
  asyncWrapper(async (req: IRequest, res: Response, _next: NextFunction) => {
    const { userId: customerId } = req;
    const result = await getCartItems(customerId);
    res.json(result);
  }),
);

router.post(
  "/meal",
  validateInput(getMealFromCartSchema),
  asyncWrapper(async (req: IRequest, res: Response, _next: NextFunction) => {
    const { userId: customerId } = req;
    const { mealId } = req.body;
    const result = await getCartItem(customerId, mealId);
    res.json(result);
  }),
);

export default router;
