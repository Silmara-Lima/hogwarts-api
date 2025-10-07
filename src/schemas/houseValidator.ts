// src/schemas/houseValidator.ts
import { z } from "zod";

export const createHouseSchema = z.object({
  name: z.string().min(2, "O nome da casa é obrigatório"),
  mascot: z.string().optional(),
  founder: z.string().optional(),
});

export const updateHouseSchema = z.object({
  name: z.string().min(2).optional(),
  mascot: z.string().optional(),
  founder: z.string().optional(),
});
