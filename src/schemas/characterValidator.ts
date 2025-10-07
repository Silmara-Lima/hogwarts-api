// src/schemas/characterValidator.ts
import { z } from "zod";

// Schema para criar personagem
export const createCharacterSchema = z.object({
  firstName: z.string().min(2, "O primeiro nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "O sobrenome deve ter pelo menos 2 caracteres"),
  role: z.enum(["student", "teacher"]).optional(),
  bloodStatus: z.string().optional(),
  houseId: z.number().optional(),
  subjectIds: z.array(z.number()).optional(),
});

// Schema para atualizar personagem (parcial)
export const updateCharacterSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  role: z.enum(["student", "teacher"]).optional(),
  bloodStatus: z.string().optional(),
  houseId: z.number().nullable().optional(),
  subjectIds: z.array(z.number()).optional(),
});
