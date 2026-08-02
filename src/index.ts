import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { ErrorResponse, SuccessResponse } from "./common/response.js";
import { StatusCode } from "./common/status-code.js";
import { Env } from "./lib/config.js";

const app = new Hono();

app.get("/", (c) => {
  return c.json(new SuccessResponse("Welcome to Minijober API!"));
});

app.all("*", (c) => {
  return c.json(new ErrorResponse("Route Not Found!"), StatusCode.NOT_FOUND);
});

serve({ fetch: app.fetch, port: Env.PORT }, (info) => {
  console.log(`Server is running on http://localhost:${Env.PORT}`);
});
