import { RouteError } from "configs/errors";
import { OtpEntity } from "models/otp/otp.entity";
import { generateOtp, getOtpExpireAt } from "./util_otp";
import createLogger, { ModuleType } from "utils/logger";
import { AllowedLoginOtpTypes, OtpType, VerifyOtpResponse } from "./types_otp";
import { UserEntity } from "models/users/users.entity";
import { generateToken } from "controllers/auth/util_auth";

const logger = createLogger(ModuleType.Controller, "OTP");

/**
 * Create or update an OTP
 * @param email - The email address to associate with the OTP
 */
export async function createOtp(
  email: string,
  type: OtpType,
): Promise<OtpEntity> {
  logger.info("otp creation request", { email });

  try {
    let otp = await OtpEntity.findByParams({ email, type });

    if (otp && !otp.isUsed) {
      const code = generateOtp();
      const expireAt = getOtpExpireAt();

      otp = await OtpEntity.updateOtp({ id: otp.id }, { code, expireAt });
      logger.info("otp updated", { email, code, expireAt, otp });
      return otp;
    }

    const code = generateOtp();
    const expireAt = getOtpExpireAt();

    otp = await OtpEntity.createOtp({ email, code, expireAt, type });
    logger.info("otp created", { email, code, expireAt, otp });

    return otp;
  } catch (error) {
    throw error;
  }
}

export async function verifyOtp(
  email: string,
  code: string,
  type: OtpType,
): Promise<VerifyOtpResponse> {
  try {
    logger.info("otp verification request", { email, code, type });
    let otp = await OtpEntity.findByParams({ email, type, code });

    if (!otp || otp.isUsed || otp.expireAt < new Date()) {
      const error = new RouteError("Invalid OTP");
      logger.info("otp verification failed", { email, otp, error });

      throw error;
    }

    otp = await OtpEntity.updateOtp({ id: otp.id }, { isUsed: true });
    logger.info("otp verification successful", { email, code, otp, type });

    let user,
      response: VerifyOtpResponse = { isOtpVerified: true };

    if (AllowedLoginOtpTypes.includes(otp.type)) {
      logger.info("attempting authentication", { email });
      user = await UserEntity.findByParams({ email });
      response.user = user;

      if (user && user.isComplete) {
        logger.info("generating access token for user", { user });
        const accessToken = generateToken({
          data: { userId: user.id, role: user.role },
        });
        response = { accessToken, ...response };
      }

      return response;
    }

    return response;
  } catch (error) {
    throw error;
  }
}

export async function resendOtp(
  email: string,
  type: OtpType,
): Promise<{ message: string }> {
  try {
    logger.info("otp resend request", { email, type });
    const otp = await createOtp(email, type);
    //TODO: send otp via email service (TODO)

    logger.info("otp sent to email", { email, otp });
    return { message: "OTP code has been sent to your email" };
  } catch (error) {
    throw error;
  }
}
