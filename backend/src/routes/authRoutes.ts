import { Router } from "express";
import { body } from "express-validator";
import { login, register, getMe } from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post(
  "/register",
  [
    body("username").isString().isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  register
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  login
);

router.get("/me", authenticate, getMe);

export default router;


