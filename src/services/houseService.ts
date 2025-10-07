import prisma from "../utils/prisma";

// ===== GET ALL HOUSES =====
export const getAllHouses = async () => {
  try {
    return await prisma.house.findMany({
      include: { characters: true }, // retorna array vazio se não houver personagens
    });
  } catch (err) {
    console.error("Error fetching houses:", err);
    throw new Error("Failed to fetch houses");
  }
};

// ===== GET HOUSE BY ID =====
export const getHouseById = async (id: number) => {
  try {
    return await prisma.house.findUnique({
      where: { id },
      include: { characters: true },
    });
  } catch (err) {
    console.error(`Error fetching house ${id}:`, err);
    throw new Error("Failed to fetch house");
  }
};

// ===== CREATE HOUSE =====
export const createHouse = async (data: any) => {
  try {
    const { name, mascot, founder } = data;
    return await prisma.house.create({
      data: { name, mascot, founder },
      include: { characters: true },
    });
  } catch (err: any) {
    // repassa erro de constraint
    throw err;
  }
};

// ===== UPDATE HOUSE =====
export const updateHouse = async (id: number, data: any) => {
  try {
    const { name, mascot, founder } = data;
    return await prisma.house.update({
      where: { id },
      data: { name, mascot, founder },
      include: { characters: true },
    });
  } catch (err: any) {
    throw err;
  }
};

// ===== DELETE HOUSE =====
export const deleteHouse = async (id: number) => {
  try {
    return await prisma.house.delete({
      where: { id },
    });
  } catch (err: any) {
    throw err;
  }
};
