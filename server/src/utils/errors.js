export class AppError extends Error {
  constructor(statusCode, message, code = "APP_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const notFound = (message = "Not found") => new AppError(404, message, "NOT_FOUND");
export const badRequest = (message = "Bad request") => new AppError(400, message, "BAD_REQUEST");
export const unauthorized = (message = "Unauthorized") =>
  new AppError(401, message, "UNAUTHORIZED");
export const forbidden = (message = "Forbidden") => new AppError(403, message, "FORBIDDEN");
