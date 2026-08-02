import { StatusCode, type TStatusCodeKey } from "./status-code.js";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: TStatusCodeKey) {
    super(message);
    this.statusCode = StatusCode[statusCode];
  }
}
