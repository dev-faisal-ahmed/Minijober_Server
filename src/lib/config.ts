import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number(),
  JWT_SECRET: z.string(),
  NODE_ENV:z.enum(["development", "production"])
});

export const Env = envSchema.parse(process.env);
