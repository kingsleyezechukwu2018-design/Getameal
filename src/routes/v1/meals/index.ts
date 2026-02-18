import {
  addMeal,
  getAMeal,
  getMealsByCook,
  uploadMealImage,
} from "controllers/meal";
import { Router, Response, NextFunction } from "express";
import { requireAuth, validateJwtToken } from "middlewares";
import { validateInput } from "middlewares/validateInput";
import { asyncWrapper } from "utils/helpers";
import { IRequest } from "utils/types";
import {
  addAMealByCookIdSchema,
  getAMealSchema,
  getMealsByCookIdSchema,
  imageUploadSchema,
} from "./validations.meals";
import { ensureUserIsACook } from "middlewares/ensureUserIsACook";
import { RouteError } from "configs/errors";
import upload from "middlewares/uploadFile";

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

router.get(
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

router.use(ensureUserIsACook);
router.post(
  "/add",
  validateInput(addAMealByCookIdSchema),
  asyncWrapper(async (req: IRequest, res: Response, _next: NextFunction) => {
    const { userId } = req;

    const result = await addMeal({ ...req.body, cookId: userId });
    res.json(result);
  }),
);

router.post(
  "/upload-image",
  upload.single("mealImage"),
  validateInput(imageUploadSchema, "query"),
  asyncWrapper(async (req: IRequest, res: Response) => {
    if (!req.file) {
      throw new RouteError("please upload a file", 400);
    }

    const { userId } = req;
    console.log("public id: ", String(req.query.publicId));
    const result = await uploadMealImage({
      file: req.file,
      userId,
      publicId: String(req.query.publicId),
    });

    res.json(result);
  }),
);

export default router;
