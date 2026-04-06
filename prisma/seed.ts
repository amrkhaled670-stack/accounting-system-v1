import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: "admin@system.com" },
  });

  if (!existing) {
    const hash = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        email: "admin@system.com",
        passwordHash: hash,
        name: "Admin",
      },
    });
    console.log("✅ Default admin user created: admin@system.com / admin123");
  } else {
    console.log("ℹ️  Admin user already exists, skipping seed.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
