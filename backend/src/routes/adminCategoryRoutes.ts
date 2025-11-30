import { Router } from "express";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from "../controllers/categoryController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", getAdminCategories);
router.post("/", createAdminCategory);
router.put("/:id", updateAdminCategory);
router.delete("/:id", deleteAdminCategory);

export default router;


