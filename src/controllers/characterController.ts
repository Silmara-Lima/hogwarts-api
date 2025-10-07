// src/controllers/characterController.ts
import { Request, Response, NextFunction } from "express";
import * as characterService from "../services/characterService";
import { createCharacterSchema, updateCharacterSchema } from "../schemas/characterValidator";

// ===== LISTAR TODOS OS PERSONAGENS =====
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const characters = await characterService.getAllCharacters();
    res.json(characters);
  } catch (err) {
    next(err);
  }
};

// ===== BUSCAR PERSONAGEM POR ID =====
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid character ID" });

    const character = await characterService.getCharacterById(id);
    res.json(character);
  } catch (err: any) {
    if (err.message === "Character not found") {
      return res.status(404).json({ error: "Character not found" });
    }
    next(err);
  }
};

// ===== CRIAR PERSONAGEM =====
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Conversão de tipos antes do Zod
    const body = {
      ...req.body,
      houseId: req.body.houseId !== undefined ? Number(req.body.houseId) : undefined,
      subjectIds: req.body.subjectIds
        ? req.body.subjectIds.map((id: any) => Number(id))
        : undefined,
    };

    const parsedData = createCharacterSchema.parse(body);
    const newCharacter = await characterService.createCharacter(parsedData);
    res.status(201).json(newCharacter);
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({
        message: "Erro de validação dos dados enviados.",
        errors: err.errors,
      });
    }
    next(err);
  }
};

// ===== ATUALIZAR PERSONAGEM =====
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid character ID" });

    // Conversão de tipos antes do Zod
    const body = {
      ...req.body,
      houseId:
        req.body.houseId !== undefined && req.body.houseId !== null
          ? Number(req.body.houseId)
          : req.body.houseId,
      subjectIds: req.body.subjectIds
        ? req.body.subjectIds.map((id: any) => Number(id))
        : undefined,
    };

    const parsedData = updateCharacterSchema.parse(body);
    const updatedCharacter = await characterService.updateCharacter(id, parsedData);

    res.json(updatedCharacter);
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({
        message: "Erro de validação dos dados enviados.",
        errors: err.errors,
      });
    }
    if (err.message === "Character not found") {
      return res.status(404).json({ error: "Character not found" });
    }
    next(err);
  }
};

// ===== REMOVER PERSONAGEM =====
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid character ID" });

    await characterService.deleteCharacter(id);
    res.status(204).send();
  } catch (err: any) {
    if (err.message === "Character not found") {
      return res.status(404).json({ error: "Character not found" });
    }
    next(err);
  }
};
