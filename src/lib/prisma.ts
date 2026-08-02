import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { Env } from "./config.js";

const adapter = new PrismaPg({ connectionString: Env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });
