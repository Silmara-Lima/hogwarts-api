// src/routes/index.ts
import { Router } from "express";
import characterRoutes from "./characterRoutes";
import houseRoutes from "./houseRoutes";
import subjectRoutes from "./subjectRoutes";

const router = Router();

router.use("/characters", characterRoutes);
router.use("/houses", houseRoutes);
router.use("/subjects", subjectRoutes);

export default router;
