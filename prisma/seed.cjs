const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || "file:./prisma/dev.db",
  }),
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
