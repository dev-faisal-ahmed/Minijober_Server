import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number(),
  JWT_SECRET: z.string(),
  NODE_ENV: z.enum(["development", "production"]),
  SUPER_ADMIN_NAME: z.string().min(1),
  SUPER_ADMIN_EMAIL: z.email(),
  SUPER_ADMIN_PASSWORD: z.string().min(1),
});

export const Env = envSchema.parse(process.env);
