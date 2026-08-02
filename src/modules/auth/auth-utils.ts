import argon, { verify } from "argon2";

import { sign } from "hono/jwt";
import { Env } from "../../lib/config.js";

export class AuthUtils {
  private readonly accessTokenExpirationTime: number = 5;
  private readonly refreshTokenExpirationTime: number = 60 * 24 * 30;

  /* Hash a password */
  async hashPassword(password: string) {
    return argon.hash(password, { type: argon.argon2d });
  }

  /* Verify a password against a hash */
  async verifyPassword(password: string, hash: string) {
    return argon.verify(hash, password);
  }

  /* Generate an access token */
  async generateAccessToken(userId: string) {
    return sign(
      { userId, exp: this.getExpirationTime(this.accessTokenExpirationTime) },
      Env.JWT_SECRET,
    );
  }

  /* Verify an access token */
  async verifyAccessToken(token: string) {
    return verify(token, Env.JWT_SECRET);
  }

  /* Generate a refresh token */
  async generateRefreshToken(userId: string) {
    return sign(
      { userId, exp: this.getExpirationTime(this.refreshTokenExpirationTime) },
      Env.JWT_SECRET,
    );
  }

  /* Verify a refresh token */
  async verifyRefreshToken(token: string) {
    return verify(token, Env.JWT_SECRET);
  }

  // private helpers

  /* Get the expiration time in seconds */
  private getExpirationTime(minutes: number) {
    return Math.floor(Date.now() / 1000) + minutes * 60;
  }
}
