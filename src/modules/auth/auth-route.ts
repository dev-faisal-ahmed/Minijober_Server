import { Hono } from "hono";
import { SuccessResponse } from "../../common/response.js";

export const authRoute = new Hono().post("/login", (c) => {
  return c.json(new SuccessResponse("Login successful"));
});
