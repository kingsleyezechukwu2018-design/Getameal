import { Router, Request, Response, NextFunction } from "express";
import { validateInput } from "middlewares/validateInput";
import { resendOtpSchema, verifyOtpSchema } from "./validation.otp";
import { resendOtp, verifyOtp } from "controllers";
import { asyncWrapper } from "utils/helpers";

const router = Router();

router.post(
  "/resend",
  validateInput(resendOtpSchema),
  async (req, res, next) => {
    try {
      const { email, type } = req.body;
      const result = await resendOtp(email, type);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/verify",
  validateInput(verifyOtpSchema),
  asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const { email, code, type } = req.body;
    const result = await verifyOtp(email, code, type);

    res.json(result);
  }),
);

export default router;
