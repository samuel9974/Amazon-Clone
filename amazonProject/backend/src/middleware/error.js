import { HttpError } from "../utils/httpError.js";

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message =
    err instanceof HttpError || statusCode < 500
      ? err.message
      : "Internal server error";

  if (statusCode >= 500) {
    console.error(err);
  }

  const body = { message, statusCode };
  if (err.code) body.code = err.code;
  res.status(statusCode).json(body);
}
