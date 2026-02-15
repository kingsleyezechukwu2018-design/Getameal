import { InternalError, RouteError } from "configs/errors";
import createLogger, { ModuleType } from "utils/logger";
import { UserEntity } from "models/users/users.entity";
import { createOtp } from "controllers/otp";
import { OtpType } from "controllers/otp/types_otp";
import { verifyGoogleToken } from "configs/googleAuthLibrary";
import { generateToken } from "./util_auth";
import { AuthEntity, LoginOption } from "models/auth/auth.entity";
import appConfig from "configs";
import { IToken } from "utils/types";
import jwt from "jsonwebtoken";
import { getUser, prepareLoginToken } from "utils";
import { sendOtpEmail } from "configs/mailgun/emailTemplates";

const logger = createLogger(ModuleType.Controller, "AUTH");
const { jwtRefreshTokenExpiresIn, jwtRefreshTokenSecret } = appConfig;

export async function emailSignUp(email: string) {
  logger.info("email signup request", { email });

  let user = await UserEntity.findByParams({ email });
  if (!user) {
    logger.info("creating new user...", { email });

    try {
      user = await UserEntity.createUser({ email });
      await AuthEntity.createAuth({
        userId: user.id,
      });
    } catch (error) {
      logger.error("error creating a user account", error);
      throw error;
    }
  }

  const otp = await createOtp(email, OtpType.AUTH);
  await sendOtpEmail(email, otp.code);

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
  await sendOtpEmail(email, otp.code);

  logger.info("otp sent to email", { email, otp });
  return { message: "OTP code has been sent to your email" };
}

export async function googleAuth({ googleToken }: { googleToken: string }) {
  logger.info("google auth request", { googleToken });
  const { email } = await verifyGoogleToken(googleToken);

  logger.info("email signup request", { email });

  let user = await UserEntity.findByParams({ email });
  let userAuth: AuthEntity;
  if (!user) {
    logger.info("creating new user...", { email });
    user = await UserEntity.createUser({ email });
    userAuth = await AuthEntity.createAuth({ userId: user.id });
  }

  let response;
  response.user = user;

  if (user.isComplete) {
    response = await completedUserLoginResponse(user, LoginOption.GOOGLE);
  }

  return response;
}

export async function refreshToken(userId: string) {
  logger.info("refresh token request", { userId });

  const user = await getUser(userId);

  const auth = await AuthEntity.getAuthByParams({ userId });
  if (!auth) {
    throw new InternalError("Account not found");
  }

  console.log("refresh token", auth.refreshToken);
  const payload = jwt.decode(auth.refreshToken) as IToken;
  if (payload.exp*1000 < Date.now()) {
    logger.info("refresh token expired", { userId });
    throw new RouteError("expired token. Please login again");
  }

  const accessToken = generateToken({
    data: { userId: user.id, role: user.role },
  });

  return { accessToken };
}

export async function completedUserLoginResponse(
  user: UserEntity,
  lastLoginOption?: LoginOption,
) {
  logger.info("generating login response for completed user", {
    userId: user.id,
  });
  let userAuth = await AuthEntity.getAuthByParams({ userId: user.id });

  if (!userAuth) {
    logger.error("Invalid auth record or missing refresh token", {
      userId: user.id,
    });
    throw new InternalError("Invalid auth record or missing refresh token");
  }

  const { accessToken, refreshToken } = await prepareLoginToken(user, userAuth);

  userAuth = await AuthEntity.updateAuth(
    { userId: user.id },
    { lastLoginOption, refreshToken },
  );

  return {
    accessToken,
    ...user,
    lastLoginOption: userAuth.lastLoginOption,
  };
}

// export async function appleAuth({
//   appleIdToken,
//   code,
// }: {
//   appleIdToken: string;
//   code: string;
// }) {
//   const clientSecret = generateAppleClientSecret();

//   const tokenResponse = await axiosApi(
//     "https://appleid.apple.com/auth/token",
//     "post",
//     { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
//     {
//       grant_type: "authorization_code",
//       code,
//       redirect_uri: REDIRECT_URI, //route after successful sign-in
//       client_id: CLIENT_ID,
//       client_secret: clientSecret,
//     },
//   );

//   const { access_token, id_token, refresh_token } = tokenResponse.data;

//   // id_token is a JWT containing user's Apple ID info
//   // You can verify it using jsonwebtoken library
//   // Example:
//   const decoded = jwt.decode(id_token);
//   console.log(decoded); // contains sub (user id), email, etc.
// }
