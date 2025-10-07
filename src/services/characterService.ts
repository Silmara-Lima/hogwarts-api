import prisma from "../utils/prisma";

type CharacterData = {
  firstName: string;
  lastName: string;
  role?: "student" | "teacher";
  bloodStatus?: string;
  houseId?: number | null;
  subjectIds?: number[];
};

export const getAllCharacters = async () => {
  return await prisma.character.findMany({
    include: {
      house: true,
      enrollments: { include: { subject: true } },
    },
  });
};

export const getCharacterById = async (id: number) => {
  const character = await prisma.character.findUnique({
    where: { id },
    include: {
      house: true,
      enrollments: { include: { subject: true } },
    },
  });
  if (!character) throw new Error("Character not found");
  return character;
};

export const createCharacter = async (data: CharacterData) => {
  try {
    const { firstName, lastName, role, bloodStatus, houseId, subjectIds } = data;

    const character = await prisma.character.create({
      data: {
        firstName,
        lastName,
        role,
        bloodStatus,
        house: houseId ? { connect: { id: houseId } } : undefined,
      },
      include: { house: true },
    });

    if (subjectIds?.length) {
      await prisma.enrollment.createMany({
        data: subjectIds.map((subjectId) => ({
          characterId: character.id,
          subjectId,
        })),
      });
    }

    return getCharacterById(character.id);
  } catch (err: any) {
    console.error("🔥 Prisma error:", err.message);

    if (err.code === "P2003") {
      throw new Error("Foreign key constraint failed: houseId or subjectId not found");
    }
    if (err.code === "P2002") {
      throw new Error("Unique constraint failed");
    }
    throw err;
  }
};

export const updateCharacter = async (id: number, data: CharacterData) => {
  try {
    const { firstName, lastName, role, bloodStatus, houseId, subjectIds } = data;

    await prisma.character.update({
      where: { id },
      data: {
        firstName,
        lastName,
        role,
        bloodStatus,
        house:
          houseId !== undefined
            ? houseId === null
              ? { disconnect: true }
              : { connect: { id: houseId } }
            : undefined,
      },
    });

    if (subjectIds) {
      await prisma.enrollment.deleteMany({ where: { characterId: id } });
      await prisma.enrollment.createMany({
        data: subjectIds.map((subjectId) => ({ characterId: id, subjectId })),
      });
    }

    return getCharacterById(id);
  } catch (err: any) {
    console.error("🔥 Prisma error (update):", err.message);

    if (err.code === "P2025") throw new Error("Character not found");
    if (err.code === "P2003") throw new Error("Foreign key constraint failed");
    throw err;
  }
};

export const deleteCharacter = async (id: number) => {
  try {
    await prisma.enrollment.deleteMany({ where: { characterId: id } });
    return await prisma.character.delete({ where: { id } });
  } catch (err: any) {
    if (err.code === "P2025") throw new Error("Character not found");
    throw err;
  }
};
