const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: "admin@system.com" } });
  if (!existing) {
    const hash = await bcrypt.hash("admin123", 10);
    await prisma.user.create({ data: { email: "admin@system.com", passwordHash: hash, name: "Admin" } });
    console.log("Admin created: admin@system.com / admin123");
  } else {
    console.log("Admin already exists");
  }
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
