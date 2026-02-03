import jwt from "jsonwebtoken";
import { JwtTokenPayload } from "controllers/users/types_users";
import appConfig from "configs";

const { jwtExpiresIn, jwtSecret } = appConfig;

export function generateAccessToken({
  data,
  expiresIn = jwtExpiresIn,
  audience = "app",
}: JwtTokenPayload): string {
  return jwt.sign(data, jwtSecret, {
    expiresIn: Number(expiresIn),
    issuer: `getameal`,
    audience: `${audience}-user`,
  });
}

