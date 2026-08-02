import { PrismaPg } from "@prisma/adapter-pg";
import { Env } from "./config.js";
import { PrismaClient } from "@prisma/client/extension";

const adapter = new PrismaPg({ connectionString: Env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });
