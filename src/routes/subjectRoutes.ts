// src/routes/subjectRoutes.ts
import { Router } from "express";
import * as subjectController from "../controllers/subjectController";
import { validateBody } from "../middlewares/validate";
import { createSubjectSchema, updateSubjectSchema } from "../schemas/subjectValidator";

const router = Router();

router.get("/", subjectController.getAll);
router.get("/:id", subjectController.getById);
router.post("/", validateBody(createSubjectSchema), subjectController.create);
router.put("/:id", validateBody(updateSubjectSchema), subjectController.update);
router.delete("/:id", subjectController.remove);

export default router;
