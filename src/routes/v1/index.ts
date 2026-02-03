import { Router } from "express";
import authRoutes from "./auth";
import otpRoutes from "./otp";

const router = Router();

router.use("/auth", authRoutes);
router.use("/otp", otpRoutes);

export { router as v1Routes };