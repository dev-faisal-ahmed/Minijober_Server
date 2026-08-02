import { AuthUtils } from "../modules/auth/auth-utils.js";
import { Env } from "../lib/config.js";
import { prisma } from "../lib/prisma.js";

const seedSuperAdmin = async () => {
  const authUtils = new AuthUtils();

  const existing = await prisma.user.findFirst({
    where: { email: Env.SUPER_ADMIN_EMAIL },
    include: { userUserRoles: true },
  });

  if (existing) {
    const hasSuperAdminRole = existing.userUserRoles.some(
      (role) => role.role === "SUPER_ADMIN",
    );

    if (!hasSuperAdminRole) {
      await prisma.userUserRole.create({
        data: {
          userId: existing.id,
          role: "SUPER_ADMIN",
        },
      });
      console.log(`Assigned SUPER_ADMIN role to ${existing.email}`);
    } else {
      console.log(`Super admin already exists: ${existing.email}`);
    }

    return;
  }

  const hashedPassword = await authUtils.hashPassword(Env.SUPER_ADMIN_PASSWORD);

  const user = await prisma.user.create({
    data: {
      name: Env.SUPER_ADMIN_NAME,
      email: Env.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      provider: "CREDENTIALS",
      status: "ACTIVE",
      verifiedAt: new Date(),
      userUserRoles: {
        create: {
          role: "SUPER_ADMIN",
        },
      },
    },
  });

  console.log(`Super admin seeded: ${user.email}`);
};

seedSuperAdmin()
  .catch((error) => {
    console.error("Failed to seed super admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
