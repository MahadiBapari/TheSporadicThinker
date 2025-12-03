import { Router } from "express";
import {
  getPublicHeroPosts,
  getPublicPostBySlug,
  getPublicPosts,
} from "../controllers/postController";

const router = Router();

router.get("/hero", getPublicHeroPosts);
router.get("/", getPublicPosts);
router.get("/:slug", getPublicPostBySlug);

export default router;


