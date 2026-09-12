import { hashPassword } from "@buntok/core";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const password = await hashPassword("PitoK123");

  const user = await prisma.user.upsert({
    where: { email: "pitok@pitok.my.id" },
    update: {},
    create: {
      email: "pitok@pitok.my.id",
      password,
    },
  });

  console.log("Seeded user:", { id: user.id, email: user.email });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
