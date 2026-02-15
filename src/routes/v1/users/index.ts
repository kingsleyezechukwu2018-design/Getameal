import {
  addFavouriteCook,
  completeUserProfile,
  getUserProfile,
  removeFavouriteCook,
} from "controllers/users";
import { Router, Request, Response, NextFunction } from "express";
import { requireAuth, validateJwtToken } from "middlewares";
import { validateInput } from "middlewares/validateInput";
import { asyncWrapper } from "utils/helpers";
import { IRequest } from "utils/types";
import {
  addFavouriteCookSchema,
  completeUserSchema,
  removeFavouriteCookSchema,
} from "./validation.users";

const router = Router();

router.post(
  "/complete-profile",
  validateInput(completeUserSchema),
  asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const {
      lat,
      lng,
      fullName,
      userId,
      loginOption,
      phoneNumber,
      countryCode,
    } = req.body;
    const result = await completeUserProfile({
      userId,
      latitude: Number(lat),
      longitude: Number(lng),
      fullName,
      loginOption,
      phoneNumber,
      countryCode,
    });
    res.json(result);
  }),
);

router.use(validateJwtToken, requireAuth);

router.get(
  "/me",
  asyncWrapper(async (req: IRequest, res: Response, _next: NextFunction) => {
    const userId = req.userId;
    const result = await getUserProfile(userId);
    res.json(result);
  }),
);

router.get(
  "/add-favourite-cook/:cookId",
  validateInput(addFavouriteCookSchema, "params"),
  asyncWrapper(async (req: IRequest, res: Response, _next: NextFunction) => {
    const userId = req.userId;
    const { cookId } = req.params;
    const result = await addFavouriteCook(userId, cookId);
    res.json(result);
  }),
);

router.get(
  "/remove-favourite-cook/:cookId",
  validateInput(removeFavouriteCookSchema, "params"),
  asyncWrapper(async (req: IRequest, res: Response, _next: NextFunction) => {
    const userId = req.userId;
    const { cookId } = req.params;
    const result = await removeFavouriteCook(userId, cookId);
    res.json(result);
  }),
);

export default router;
