import { Request, Response, NextFunction } from "express";
import * as houseService from "../services/houseService";

// Listar todas as casas
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const houses = await houseService.getAllHouses();
    res.json(houses);
  } catch (err) {
    next(err);
  }
};

// Buscar casa por ID
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id); // ⚡ converter string → number
    if (isNaN(id)) return res.status(400).json({ error: "Invalid house ID" });

    const house = await houseService.getHouseById(id);
    if (!house) return res.status(404).json({ error: "House not found" });

    res.json(house);
  } catch (err) {
    next(err);
  }
};

// Criar casa
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, mascot, founder } = req.body;

    // Validação básica
    if (!name) return res.status(400).json({ error: "name is required" });

    const created = await houseService.createHouse({ name, mascot, founder });
    res.status(201).json(created);
  } catch (err: any) {
    // Unique constraint violation
    if (err.code === "P2002") return res.status(400).json({ error: "House name must be unique" });
    next(err);
  }
};

// Atualizar casa
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid house ID" });

    const { name, mascot, founder } = req.body;

    const updated = await houseService.updateHouse(id, { name, mascot, founder });
    res.json(updated);
  } catch (err: any) {
    // Prisma lança P2025 se não encontrar o registro
    if (err.code === "P2025") return res.status(404).json({ error: "House not found" });
    // Unique constraint
    if (err.code === "P2002") return res.status(400).json({ error: "House name must be unique" });
    next(err);
  }
};

// Remover casa
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid house ID" });

    await houseService.deleteHouse(id);
    res.status(204).send();
  } catch (err: any) {
    if (err.code === "P2025") return res.status(404).json({ error: "House not found" });
    next(err);
  }
};
