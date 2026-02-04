import { Router, Response, NextFunction } from "express";

import { validateInput } from "middlewares/validateInput";
import { asyncWrapper } from "utils/helpers";
import { addDeviceTokenSchema } from "./validation.deviceToken";
import { createDeviceToken } from "controllers/deviceToken";
import { IRequest } from "utils/types";
import { requireAuth, validateJwtToken } from "middlewares";

const router = Router();

router.use(validateJwtToken, requireAuth);

router.post(
  "/",
  validateInput(addDeviceTokenSchema),
  asyncWrapper(async (req: IRequest, res: Response, _next: NextFunction) => {
    const userId = req.userId;
    const { token, platform } = req.body;

    const result = await createDeviceToken({
      userId,
      token,
      platform,
    });
    res.json(result);
  }),
);

export default router;
