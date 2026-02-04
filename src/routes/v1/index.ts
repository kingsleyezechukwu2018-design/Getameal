import { Router } from "express";
import authRoutes from "./auth";
import otpRoutes from "./otp";
import locationRoutes from "./location";
import deviceTokenRoutes from "./deviceToken";

const router = Router();

router.use("/auth", authRoutes);
router.use("/otp", otpRoutes);
router.use("/location", locationRoutes);
router.use("/device-token", deviceTokenRoutes);

export { router as v1Routes };