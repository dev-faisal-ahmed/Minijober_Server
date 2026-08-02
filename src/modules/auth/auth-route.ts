import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { SuccessResponse } from "../../common/response.js";
import { StatusCode } from "../../common/status-code.js";
import { jsonValidator } from "../../common/validators.js";
import { authSchema } from "./auth-schema.js";
import { AuthService } from "./auth-service.js";
import { Env } from "../../lib/config.js";

const authService = new AuthService();

const REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export const authRoute = new Hono()
  .post("/register", jsonValidator(authSchema.register), async (c) => {
    const value = c.req.valid("json");
    const newUser = await authService.register(value);
    return c.json(
      new SuccessResponse("User registered successfully", newUser),
      StatusCode.CREATED,
    );
  })
  .post("/login", jsonValidator(authSchema.login), async (c) => {
    const value = c.req.valid("json");
    const { accessToken, refreshToken } = await authService.login(value);

    setCookie(c, "refresh_token", refreshToken, {
      httpOnly: true,
      secure: Env.NODE_ENV === "production",
      sameSite: "None",
      path: "/",
      maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
    });

    return c.json(new SuccessResponse("Login successful", { accessToken }));
  });
