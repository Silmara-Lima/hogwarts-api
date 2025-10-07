// src/schemas/subjectValidator.ts
import { z } from "zod";

export const createSubjectSchema = z.object({
  name: z.string().min(2, "O nome da matéria é obrigatório"),
});

export const updateSubjectSchema = z.object({
  name: z.string().min(2).optional(),
});
