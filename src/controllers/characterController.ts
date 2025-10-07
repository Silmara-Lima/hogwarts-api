// src/controllers/characterController.ts
import { Request, Response, NextFunction } from "express";
import * as characterService from "../services/characterService";

// ===== LISTAR TODOS OS PERSONAGENS =====
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const characters = await characterService.getAllCharacters();
    res.json(characters);
  } catch (err) {
    console.error("Error fetching characters:", err);
    next(err);
  }
};

// ===== BUSCAR PERSONAGEM POR ID =====
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid character ID" });

    const character = await characterService.getCharacterById(id);
    if (!character) return res.status(404).json({ error: "Character not found" });

    res.json(character);
  } catch (err) {
    console.error(`Error fetching character ${req.params.id}:`, err);
    next(err);
  }
};

// ===== CRIAR PERSONAGEM =====
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, houseId, role, bloodStatus, subjectIds } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ error: "firstName and lastName are required" });
    }

    // Converter houseId para number se fornecido
    const parsedHouseId = houseId !== undefined ? Number(houseId) : undefined;
    if (houseId !== undefined && isNaN(parsedHouseId)) {
      return res.status(400).json({ error: "Invalid houseId" });
    }

    const newCharacter = await characterService.createCharacter({
      firstName,
      lastName,
      role,
      bloodStatus,
      houseId: parsedHouseId,
      subjectIds,
    });

    res.status(201).json(newCharacter);
  } catch (err) {
    console.error("Error creating character:", err);
    next(err);
  }
};

// ===== ATUALIZAR PERSONAGEM =====
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid character ID" });

    const { firstName, lastName, houseId, role, bloodStatus, subjectIds } = req.body;

    const parsedHouseId =
      houseId !== undefined && houseId !== null ? Number(houseId) : houseId;
    if (houseId !== undefined && houseId !== null && isNaN(parsedHouseId)) {
      return res.status(400).json({ error: "Invalid houseId" });
    }

    const updatedCharacter = await characterService.updateCharacter(id, {
      firstName,
      lastName,
      role,
      bloodStatus,
      houseId: parsedHouseId,
      subjectIds,
    });

    res.json(updatedCharacter);
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Character not found" });
    }
    console.error(`Error updating character ${req.params.id}:`, err);
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
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Character not found" });
    }
    console.error(`Error deleting character ${req.params.id}:`, err);
    next(err);
  }
};
