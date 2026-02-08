"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const { env } = process;
const appConfig = {
    environment: env.NODE_ENV,
    port: env.PORT,
    isDev: env.NODE_ENV === "DEVELOPMENT",
    databaseUri: env.DATABASE_URL || "",
    allowedOrigins: env.ALLOWED_ORIGINS?.split(",") || [],
    synchronizeOrm: env.SYNCHRONIZE_ORM || false,
    jwtSecret: env.JWT_SECRET,
    jwtExpiresIn: env.JWT_EXPIRES_IN || "365d",
    //these hasn't been added to .env file yet
    mailgunApiKey: env.MAILGUN_API_KEY,
    mailgunDomain: env.MAILGUN_DOMAIN,
    appEmail: env.MAILGUN_APP_EMAIL,
    googleOAuthClientId: env.GOOGLE_OAUTH_CLIENT_ID || "",
};
exports.default = appConfig;
//# sourceMappingURL=index.js.map