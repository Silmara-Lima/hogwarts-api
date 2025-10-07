import prisma from "../utils/prisma";

// ===== GET ALL CHARACTERS =====
export const getAllCharacters = async () => {
  try {
    return await prisma.character.findMany({
      include: {
        house: true, // retorna null se não houver houseId
        enrollments: { include: { subject: true } }, // retorna array vazio se não houver
      },
    });
  } catch (err) {
    console.error("Error fetching characters:", err);
    throw new Error("Failed to fetch characters");
  }
};

// ===== GET CHARACTER BY ID =====
export const getCharacterById = async (id: number) => {
  try {
    return await prisma.character.findUnique({
      where: { id },
      include: {
        house: true,
        enrollments: { include: { subject: true } },
      },
    });
  } catch (err) {
    console.error(`Error fetching character ${id}:`, err);
    throw new Error("Failed to fetch character");
  }
};

// ===== CREATE CHARACTER =====
export const createCharacter = async (data: any) => {
  try {
    const { firstName, lastName, role, bloodStatus, houseId, subjectIds } = data;

    const character = await prisma.character.create({
      data: {
        firstName,
        lastName,
        role,
        bloodStatus,
        house: houseId ? { connect: { id: Number(houseId) } } : undefined,
      },
      include: { house: true },
    });

    if (subjectIds?.length) {
      await prisma.enrollment.createMany({
        data: subjectIds.map((subjectId: number) => ({
          characterId: character.id,
          subjectId: Number(subjectId),
        })),
      });
    }

    return getCharacterById(character.id);
  } catch (err) {
    console.error("Error creating character:", err);
    throw new Error("Failed to create character");
  }
};

// ===== UPDATE CHARACTER =====
export const updateCharacter = async (id: number, data: any) => {
  try {
    const { firstName, lastName, role, bloodStatus, houseId, subjectIds } = data;

    await prisma.character.update({
      where: { id },
      data: {
        firstName,
        lastName,
        role,
        bloodStatus,
        house: houseId
          ? { connect: { id: Number(houseId) } }
          : houseId === null
          ? { disconnect: true }
          : undefined,
      },
    });

    if (subjectIds) {
      // Remove inscrições antigas e recria
      await prisma.enrollment.deleteMany({ where: { characterId: id } });
      await prisma.enrollment.createMany({
        data: subjectIds.map((subjectId: number) => ({
          characterId: id,
          subjectId: Number(subjectId),
        })),
      });
    }

    return getCharacterById(id);
  } catch (err) {
    console.error(`Error updating character ${id}:`, err);
    throw new Error("Failed to update character");
  }
};

// ===== DELETE CHARACTER =====
export const deleteCharacter = async (id: number) => {
  try {
    await prisma.enrollment.deleteMany({ where: { characterId: id } });
    return await prisma.character.delete({ where: { id } });
  } catch (err) {
    console.error(`Error deleting character ${id}:`, err);
    throw new Error("Failed to delete character");
  }
};
