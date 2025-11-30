import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import {
  createUser,
  findUserByEmail,
  verifyPassword,
  UserRecord,
} from "../models/userModel";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body as {
      username: string;
      email: string;
      password: string;
    };

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({
      username,
      email,
      passwordHash,
      role: "admin",
    });

    return res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const user = (await findUserByEmail(email)) as UserRecord | null;
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await verifyPassword(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const secret = process.env.JWT_SECRET || "changeme";
    const expiresIn: string = process.env.JWT_EXPIRES_IN || "7d";
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      secret,
      { expiresIn } as jwt.SignOptions
    );

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId || !req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // TODO: Fetch user from database for complete user info
    // For now, return user from token
    const user = {
      id: req.user.id,
      username: req.user.username || "Admin",
      email: req.user.email,
      role: req.user.role,
    };

    return res.json({ user });
  } catch (err) {
    next(err);
  }
}


