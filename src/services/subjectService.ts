import prisma from "../utils/prisma";

// ===== GET ALL SUBJECTS =====
export const getAllSubjects = async () => {
  try {
    return await prisma.subject.findMany({
      include: {
        enrollments: {
          include: { character: true },
        },
      },
    });
  } catch (err) {
    console.error("Error fetching subjects:", err);
    throw new Error("Failed to fetch subjects");
  }
};

// ===== GET SUBJECT BY ID =====
export const getSubjectById = async (id: number) => {
  try {
    return await prisma.subject.findUnique({
      where: { id },
      include: {
        enrollments: { include: { character: true } },
      },
    });
  } catch (err) {
    console.error(`Error fetching subject ${id}:`, err);
    throw new Error("Failed to fetch subject");
  }
};

// ===== CREATE SUBJECT =====
export const createSubject = async (data: any) => {
  try {
    const { name, professor } = data;
    return await prisma.subject.create({
      data: { name, professor },
      include: { enrollments: { include: { character: true } } },
    });
  } catch (err: any) {
    // Unique constraint violation
    if (err.code === "P2002") throw err;
    console.error("Error creating subject:", err);
    throw new Error("Failed to create subject");
  }
};

// ===== UPDATE SUBJECT =====
export const updateSubject = async (id: number, data: any) => {
  try {
    const { name, professor } = data;
    return await prisma.subject.update({
      where: { id },
      data: { name, professor },
      include: { enrollments: { include: { character: true } } },
    });
  } catch (err: any) {
    throw err;
  }
};

// ===== DELETE SUBJECT =====
export const deleteSubject = async (id: number) => {
  try {
    await prisma.enrollment.deleteMany({ where: { subjectId: id } });
    return await prisma.subject.delete({ where: { id } });
  } catch (err: any) {
    throw err;
  }
};
