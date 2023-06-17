// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  const category = await prisma.category.upsert({
    where: { name: "Prisma Adds Support for PostgresSQL" },
    update: {},
    create: {
      name: "Prisma Adds Support for MongoDB",
      description:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
    },
  });

  console.log({ category });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
