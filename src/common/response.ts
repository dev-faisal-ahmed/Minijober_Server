import type { TPageInfo } from "../lib/types.js";

export class SuccessResponse<T> {
  success = true;
  message: string;
  data?: T;
  pageInfo?: TPageInfo;

  constructor(message: string, data?: T, pageInfo?: TPageInfo) {
    this.message = message;
    this.data = data;
    this.pageInfo = pageInfo;
  }
}

export class ErrorResponse {
  success = false;
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
