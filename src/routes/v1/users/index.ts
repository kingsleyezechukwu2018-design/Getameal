import {
  addFavouriteCook,
  completeUserProfile,
  getUserProfile,
  removeFavouriteCook,
  uploadProfilePicture,
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
  uploadProfilePictureUploadSchema,
} from "./validation.users";
import upload from "middlewares/uploadFile";
import { RouteError } from "configs/errors";

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

router.post(
  "/upload/profile-picture",
  upload.single("profilePicture"),
  validateInput(uploadProfilePictureUploadSchema, "query"),
  asyncWrapper(async (req: IRequest, res: Response) => {
    if (!req.file) {
      throw new RouteError("please upload a file", 400);
    }

    const { userId } = req;
    console.log("public id: ", String(req.query.publicId));
    const result = await uploadProfilePicture({
      file: req.file,
      userId,
      publicId: String(req.query.publicId),
    });

    res.json(result);
  }),
);

export default router;
