import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { errorHandler } from "./common/error-handler.js";
import { SuccessResponse } from "./common/response.js";
import { Env } from "./lib/config.js";
import { authRoute } from "./modules/auth/auth-route.js";

const app = new Hono()
  .get("/", (c) => {
    return c.json(new SuccessResponse("Welcome to Minijober API!"));
  })
  .basePath("/api/v1")
  .route("/auth", authRoute)
  .onError(errorHandler);

serve({ fetch: app.fetch, port: Env.PORT }, (info) => {
  console.log(`Server is running on http://localhost:${Env.PORT}`);
});
