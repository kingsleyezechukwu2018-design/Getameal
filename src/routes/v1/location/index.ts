import {
  addUserLocation,
  getAllLocations,
  getLocation,
  getUserLocation,
} from "controllers/locations";
import { NextFunction, Router, Request, Response } from "express";
import { validateInput } from "middlewares/validateInput";
import { asyncWrapper } from "utils/helpers";
import {
  addUserLocationSchema,
  getLocationSchema,
} from "./validation.location";
import { IRequest } from "utils/types";
import { requireAuth, validateJwtToken } from "middlewares";

const router = Router();

router.get(
  "/all",
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getAllLocations();
    res.json(result);
  }),
);

router.get(
  "/",
  validateInput(getLocationSchema, "query"),
  asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const { lat, lng } = req.query;
    const result = await getLocation(Number(lat), Number(lng));
    res.json(result);
  }),
);

router.use(validateJwtToken, requireAuth);

router.post(
  "/user",
  validateInput(addUserLocationSchema),
  asyncWrapper(async (req: IRequest, res: Response, _next: NextFunction) => {
    const userId = req.userId;
    const { lat, lng } = req.body;
    const result = await addUserLocation(userId, Number(lat), Number(lng));
    res.json(result);
  }),
);

router.get(
  "/user",
  asyncWrapper(async (req: IRequest, res: Response, _next: NextFunction) => {
    const userId = req.userId;
    const result = await getUserLocation(userId);
    res.json(result);
  }),
);

export default router;
