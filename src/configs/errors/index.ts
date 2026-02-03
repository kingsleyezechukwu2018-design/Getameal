import { HttpCode } from "./types";

class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BaseError";
  }

  toString() {
    return JSON.stringify({
      name: this.name,
      message: this.message,
      stack: this.stack,
    });
  }
}

/**
 * Internal server error
 * is handled internally.
 * It should not be sent to the client
 */
export class InternalError extends BaseError {
  readonly statusCode: HttpCode;

  constructor(message: string) {
    super(message);

    this.name = "InternalError";
    this.statusCode = 500;
  }
}

/**
 * Route error
 * is handled by the router and should be sent to the client for display to the user.
 * The error message can be shown to the user without formatting.
 */
export class RouteError extends BaseError {
  readonly statusCode: HttpCode;

  constructor(message: string, httpCode?: HttpCode) {
    super(message);

    this.name = "RouteError";
    this.statusCode = httpCode || 422;
  }
}