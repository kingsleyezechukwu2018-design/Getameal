import { RouteError } from "configs/errors";
import createLogger, { ModuleType } from "utils/logger";
import { UserEntity } from "models/users/users.entity";
import { createOtp } from "controllers/otp";
import { OtpType } from "controllers/otp/types_otp";
import { verifyGoogleToken } from "configs/googleAuthLibrary";

const logger = createLogger(ModuleType.Controller, "AUTH");

export async function emailSignUp(email: string) {
  logger.info("email signup request", { email });

  const user = await UserEntity.findByParams({ email });
  if (!user) {
    logger.info("creating new user...", { email });
    await UserEntity.createUser({ email });
  }

  const otp = await createOtp(email, OtpType.AUTH);
  //TODO: send email with otp code

  logger.info("otp sent to email", { email, otp });
  return { message: "OTP code has been sent to your email" };
}

export async function emailLogin(email: string) {
  logger.info("email login request", { email });
  const user = await UserEntity.findByParams({ email });

  if (!user) {
    const error = new RouteError("Account does not exist");
    logger.info("email login failed", { email, error });

    throw error;
  }

  const otp = await createOtp(email, OtpType.AUTH);
  //TODO: send email with otp code

  logger.info("otp sent to email", { email, otp });
  return { message: "OTP code has been sent to your email" };
}

export async function googleAuth({ googleToken }: { googleToken: string }) {
  logger.info("google auth request", { googleToken });
  const { email } = await verifyGoogleToken(googleToken);

  logger.info("email signup request", { email });

  const user = await UserEntity.findByParams({ email });
  if (!user) {
    logger.info("creating new user...", { email });
    await UserEntity.createUser({ email });
  }

  const otp = await createOtp(email, OtpType.AUTH);
  //TODO: send email with otp code

  logger.info("otp sent to email", { email, otp });
  return { message: "OTP code has been sent to your email" };
}

export async function appleAuth({ appleId }: { appleId: string }) {
  
}
