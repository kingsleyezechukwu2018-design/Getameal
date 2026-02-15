import cors from "cors";
import express, { Response, Request, NextFunction } from "express";
import helmet from "helmet";

import { handleResponse } from "../utils/response";
import { v1Routes } from "../routes";
import appConfig from ".";
import { RouteError } from "./errors";
import createLogger, { ModuleType } from "utils/logger";

const app = express();

const { allowedOrigins: origin } = appConfig;
const logger = createLogger(ModuleType.Config, "app");

app
  .use(cors({ origin }))
  .use(express.json({ limit: "10mb" }))
  .use(express.urlencoded({ limit: "10mb", extended: true }))
  .use(helmet());

app.get("/", (_req, res) => {
  res.json({ message: "welcome! Testing..." });
});

app
  .use("/v1", v1Routes)
  .use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    // Global error handler
    let error;

    if (err instanceof RouteError) {
      error = { message: err.message, statusCode: err.statusCode };
    } else if (err instanceof SyntaxError) {
      error = { message: "Invalid JSON payload", statusCode: 400 };
    } else if (
      err.name === "JsonWebTokenError" ||
      err.message === "invalid token"
    ) {
      logger.error("invalid jwt token", { error: err });
      error = { message: "Invalid token", statusCode: 401 };
    } else if (
      err.name === "TokenExpiredError" ||
      err.message === "authentication expired"
    ) {
      logger.error("jwt token expired", { error: err });
      error = {
        message: "Authentication expired. Please login again",
        statusCode: 401,
      };
    } else {
      error = {
        message: "Something went wrong, try again later",
        statusCode: 500,
      };
    }

    logger.error("Global error caught", { error, err, message: err.message });
    return handleResponse({
      res,
      status: error.statusCode,
      data: error,
    });
  })
  .use((_req: Request, res: Response) => {
    // Catch-all 404 handler
    logger.info("404 Not Found", { url: _req.originalUrl });
    res.status(404).json({ message: "Not found!" });
  });

export default app;
