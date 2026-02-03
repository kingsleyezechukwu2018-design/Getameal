import { OAuth2Client } from "google-auth-library";
import createLogger, { ModuleType } from "utils/logger";
import appConfig from "configs";
import { RouteError } from "configs/errors";

const logger = createLogger(ModuleType.Config, "GOOGLE_AUTH_CONFIG");
const { googleOAuthClientId } = appConfig;

const client = new OAuth2Client(googleOAuthClientId);

export async function verifyGoogleToken(
  idToken: string,
): Promise<{ email: string }> {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: googleOAuthClientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      const error = new RouteError("Invalid Login Credentials", 401);
      logger.info("Invalid login credentials", { idToken });
      throw error;
    }

    logger.info("google token verified", { payload });
    const { email } = payload;
    return { email };
  } catch (error) {
    logger.error("Error verifying Google token", { error });
    throw error;
  }
}
//google redirect URI: 
