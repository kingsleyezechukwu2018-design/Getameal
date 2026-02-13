import jwt from "jsonwebtoken";
import { JwtTokenPayload } from "controllers/users/types_users";
import appConfig from "configs";
import fs from "fs";

const { jwtAccessTokenExpiresIn, jwtAccessTokenSecret } = appConfig;

export function generateToken({
  data,
  expiresIn = jwtAccessTokenExpiresIn,
  audience = "app",
  secret = jwtAccessTokenSecret,
}: JwtTokenPayload): string {
  return jwt.sign(data, secret, {
    expiresIn: expiresIn as any,
    issuer: `getameal`,
    audience: `${audience}-user`,
  });
}

export function generateAppleClientSecret() {
  const privateKey = fs.readFileSync("./AuthKey_XXXXXXXXXX.p8"); // your .p8 file
  const teamId = "YOUR_TEAM_ID";
  const clientId = "YOUR_SERVICE_ID"; // your Service ID
  const keyId = "YOUR_KEY_ID"; // Key ID from Apple

  const token = jwt.sign({}, privateKey, {
    algorithm: "ES256",
    expiresIn: "24h",
    issuer: teamId,
    audience: "https://appleid.apple.com",
    subject: clientId,
    keyid: keyId,
  });

  return token;
}
