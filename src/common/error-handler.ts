import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ZodError } from "zod";
import { Env } from "../lib/config.js";
import { AppError } from "./app-error.js";
import { ErrorResponse } from "./response.js";
import { StatusCode } from "./status-code.js";
import { HTTPException } from "hono/http-exception";

export function errorHandler(error: unknown, ctx: Context) {
  if (Env.NODE_ENV === "development") {
    console.error("Error occurred:", error);
  }

  let message = "internal_server_error";
  let statusCode: ContentfulStatusCode = StatusCode.INTERNAL_SERVER_ERROR;

  if (error instanceof ZodError) {
    message = error.issues?.[0]?.message || "invalid_request";
    statusCode = StatusCode.BAD_REQUEST;
  } else if (error instanceof HTTPException) {
    message = error.message.split(" ").join("_").toLowerCase();
    statusCode = error.status as ContentfulStatusCode;
  } else if (error instanceof AppError) {
    message = error.message;
    statusCode = error.statusCode as ContentfulStatusCode;
  }

  return ctx.json(new ErrorResponse(message), statusCode);
}

function typeOf(value: unknown) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}
