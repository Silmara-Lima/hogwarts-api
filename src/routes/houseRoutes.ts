// src/routes/houseRoutes.ts
import { Router } from "express";
import * as houseController from "../controllers/houseController";
import { validateBody } from "../middlewares/validate";
import { createHouseSchema, updateHouseSchema } from "../schemas/houseValidator";

const router = Router();

router.get("/", houseController.getAll);
router.get("/:id", houseController.getById);
router.post("/", validateBody(createHouseSchema), houseController.create);
router.put("/:id", validateBody(updateHouseSchema), houseController.update);
router.delete("/:id", houseController.remove);

export default router;
