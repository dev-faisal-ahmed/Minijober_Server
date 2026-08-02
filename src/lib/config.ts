import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number(),
});

export const Env = envSchema.parse(envSchema);
