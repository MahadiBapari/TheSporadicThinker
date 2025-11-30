import { Router } from "express";
import {
  createAdminPost,
  deleteAdminPost,
  getAdminPostById,
  getAdminPosts,
  updateAdminPost,
} from "../controllers/postController";
import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

router.use(authenticate);

router.get("/", getAdminPosts);
router.get("/:id", getAdminPostById);
router.post("/", upload.single("featuredImage"), createAdminPost);
router.put("/:id", upload.single("featuredImage"), updateAdminPost);
router.delete("/:id", deleteAdminPost);

export default router;


