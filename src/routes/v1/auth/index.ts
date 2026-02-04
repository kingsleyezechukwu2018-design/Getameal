import { Router, Request, Response, NextFunction } from "express";
import {
  emailLoginSchema,
  emailSignUpSchema,
  googleAuthSchema,
} from "./validation.auth";
import { validateInput } from "middlewares/validateInput";
import { emailLogin, emailSignUp, googleAuth } from "controllers";
import { asyncWrapper } from "utils/helpers";

const router = Router();

router.post(
  "/email/signup",
  validateInput(emailSignUpSchema),
  asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const { email } = req.body;

    const result = await emailSignUp(email);
    res.json(result);
  }),
);

router.post(
  "/email/login",
  validateInput(emailLoginSchema),
  asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const { email } = req.body;

    const result = await emailLogin(email);
    res.json(result);
  }),
);

router.post(
  "/google/callback",
  validateInput(googleAuthSchema),
  asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const { googleToken } = req.body;

    const result = await googleAuth({ googleToken });
    res.json(result);
  }),
);

export default router;
