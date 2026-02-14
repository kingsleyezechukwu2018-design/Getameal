import {
  getAllLocations,
  getCooks,
  getLocation,
  getUserLocation,
} from "controllers/locations";
import { NextFunction, Router, Request, Response } from "express";
import { validateInput } from "middlewares/validateInput";
import { asyncWrapper } from "utils/helpers";
import {
  getAllLocationsSchema,
  getCooksByLocationSchema,
  getLocationSchema,
} from "./validation.location";
import { IRequest } from "utils/types";
import { requireAuth, validateJwtToken } from "middlewares";

const router = Router();

router.get(
  "/all",
  validateInput(getAllLocationsSchema, "query"),
  asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const { page, per_page } = req.query;

    const result = await getAllLocations({
      page: Number(page),
      per_page: Number(per_page),
    });
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

router.get(
  "/user",
  asyncWrapper(async (req: IRequest, res: Response, _next: NextFunction) => {
    const userId = req.userId;
    const result = await getUserLocation(userId);
    res.json(result);
  }),
);

router.post(
  "/cooks",
  validateInput(getCooksByLocationSchema, "body"),
  asyncWrapper(async (req: IRequest, res: Response, _next: NextFunction) => {
    const userId = req.userId;
    const { lat, lng, count } = req.body;

    const result = await getCooks({ userId, lat, lng, count });
    res.json(result);
  }),
);

export default router;
