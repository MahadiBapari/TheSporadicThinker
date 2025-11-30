import { Router } from "express";
import {
  getPublicPostBySlug,
  getPublicPosts,
} from "../controllers/postController";

const router = Router();

router.get("/", getPublicPosts);
router.get("/:slug", getPublicPostBySlug);

export default router;


