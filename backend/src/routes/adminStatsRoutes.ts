import { Router } from "express";
import { getAdminStats } from "../controllers/statsController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", getAdminStats);

export default router;


