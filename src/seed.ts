import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ===== Houses =====
  const gryffindor = await prisma.house.upsert({
    where: { name: "Grifinória" },
    update: {},
    create: {
      name: "Grifinória",
      mascot: "Leão",
      founder: "Godric Gryffindor",
    },
  });

  const slytherin = await prisma.house.upsert({
    where: { name: "Sonserina" },
    update: {},
    create: {
      name: "Sonserina",
      mascot: "Serpente",
      founder: "Salazar Slytherin",
    },
  });

  const hufflepuff = await prisma.house.upsert({
    where: { name: "Lufa-Lufa" },
    update: {},
    create: {
      name: "Lufa-Lufa",
      mascot: "Texugo",
      founder: "Helga Hufflepuff",
    },
  });

  const ravenclaw = await prisma.house.upsert({
    where: { name: "Corvinal" },
    update: {},
    create: {
      name: "Corvinal",
      mascot: "Águia",
      founder: "Rowena Ravenclaw",
    },
  });

  console.log("Houses seeded ✅");

  // ===== Subjects =====
  const subjects = ["Poções", "Herbologia", "Defesa Contra as Artes das Trevas", "Transfiguração", "Feitiços"];

  for (const name of subjects) {
    await prisma.subject.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Subjects seeded ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
