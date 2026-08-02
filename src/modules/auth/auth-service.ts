import { AppError } from "../../common/app-error.js";
import { ErrorMessages } from "../../lib/error-messages.js";
import { prisma } from "../../lib/prisma.js";
import type { TLogin, TRegister } from "./auth-schema.js";
import { AuthUtils } from "./auth-utils.js";

export class AuthService {
  private readonly authUtils: AuthUtils;

  constructor() {
    this.authUtils = new AuthUtils();
  }

  /* Register a new user */
  async register(input: TRegister) {
    const { email, name, password } = input;

    const user = await prisma.user.findFirst({
      where: { email },
      select: { id: true },
    });

    if (user) {
      throw new AppError(ErrorMessages.userAlreadyExists, "CONFLICT");
    }

    const hashedPassword = await this.authUtils.hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        provider: true,
        status: true,
      },
    });

    return newUser;
  }

  /* Login a user */
  async login(input: TLogin) {
    const { email, password } = input;

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
      select: { id: true, password: true, status: true },
    });

    if (!user) {
      throw new AppError(ErrorMessages.userNotFound, "NOT_FOUND");
    }

    const isPasswordValid = await this.authUtils.verifyPassword(
      password,
      user.password ?? "",
    );

    if (!isPasswordValid) {
      throw new AppError(ErrorMessages.invalidCredentials, "UNAUTHORIZED");
    }

    const accessToken = await this.authUtils.generateAccessToken(user.id);
    const refreshToken = await this.authUtils.generateRefreshToken(user.id);

    return { accessToken, refreshToken };
  }
}
