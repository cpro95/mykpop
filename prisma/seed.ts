import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "admin@mykpop.fly.dev";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("mykpopiscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      role: "admin",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "환영합니다!",
      body: `Hi, Guys!

      K- Pop is Everywhere!
      
      유튜브 조회수를 참고하여 최신 케이팝 트렌드를 따라가 보세요!`,
      userId: user.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
