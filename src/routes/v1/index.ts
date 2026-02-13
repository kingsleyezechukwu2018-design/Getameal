import { Router } from "express";
import authRoutes from "./auth";
import otpRoutes from "./otp";
import locationRoutes from "./location";
import deviceTokenRoutes from "./deviceToken";
import userRoutes from "./users";
import cartRoutes from "./carts";
import reviewsRoutes from "./reviews";

const router = Router();

router.use("/auth", authRoutes);
router.use("/otp", otpRoutes);
router.use("/locations", locationRoutes);
router.use("/device-token", deviceTokenRoutes);
router.use("/users", userRoutes);
router.use("/cart", cartRoutes);
router.use("/reviews", reviewsRoutes);

export { router as v1Routes };
