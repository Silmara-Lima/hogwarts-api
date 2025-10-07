import { Request, Response, NextFunction } from "express";
import * as subjectService from "../services/subjectService";

// Listar todas as matérias
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subjects = await subjectService.getAllSubjects();
    res.json(subjects);
  } catch (err) {
    next(err);
  }
};

// Buscar matéria por ID
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id); // ⚡ converter string → number
    if (isNaN(id)) return res.status(400).json({ error: "Invalid subject ID" });

    const subject = await subjectService.getSubjectById(id);
    if (!subject) return res.status(404).json({ error: "Subject not found" });
    res.json(subject);
  } catch (err) {
    next(err);
  }
};

// Criar matéria
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, professor } = req.body;

    if (!name) return res.status(400).json({ error: "name is required" });

    const subject = await subjectService.createSubject({ name, professor });
    res.status(201).json(subject);
  } catch (err: any) {
    if (err.code === "P2002") return res.status(400).json({ error: "Subject name must be unique" });
    next(err);
  }
};

// Atualizar matéria
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid subject ID" });

    const { name, professor } = req.body;
    const updated = await subjectService.updateSubject(id, { name, professor });
    res.json(updated);
  } catch (err: any) {
    if (err.code === "P2025") return res.status(404).json({ error: "Subject not found" });
    if (err.code === "P2002") return res.status(400).json({ error: "Subject name must be unique" });
    next(err);
  }
};

// Remover matéria
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid subject ID" });

    await subjectService.deleteSubject(id);
    res.status(204).send();
  } catch (err: any) {
    if (err.code === "P2025") return res.status(404).json({ error: "Subject not found" });
    next(err);
  }
};
