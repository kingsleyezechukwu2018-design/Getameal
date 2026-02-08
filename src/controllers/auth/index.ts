import { RouteError } from "configs/errors";
import createLogger, { ModuleType } from "utils/logger";
import { UserEntity } from "models/users/users.entity";
import { createOtp } from "controllers/otp";
import { OtpType } from "controllers/otp/types_otp";
import { verifyGoogleToken } from "configs/googleAuthLibrary";
import { generateAccessToken, generateAppleClientSecret } from "./util_auth";
import { axiosApi } from "utils/helpers";

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

  let response;
  response.user = user;

  if (user.isComplete) {
    const accessToken = generateAccessToken({
      data: { userId: user.id, role: user.role },
    });
    response = { accessToken, ...response };
  }

  return response;
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
