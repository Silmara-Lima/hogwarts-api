// src/routes/characterRoutes.ts
import { Router } from "express";
import * as characterController from "../controllers/characterController";
import { validateBody } from "../middlewares/validate";
import { createCharacterSchema, updateCharacterSchema } from "../schemas/characterValidator";

const router = Router();

router.get("/", characterController.getAll);
router.get("/:id", characterController.getById);
router.post("/", validateBody(createCharacterSchema), characterController.create);
router.put("/:id", validateBody(updateCharacterSchema), characterController.update);
router.delete("/:id", characterController.remove);

export default router;
