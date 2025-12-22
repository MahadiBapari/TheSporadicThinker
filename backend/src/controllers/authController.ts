import type { Request, Response, NextFunction } from "express";

// Type assertions for Express 5 compatibility
type ExpressRequest = Request & { body?: any; user?: any };
type ExpressResponse = Response & { status: (code: number) => ExpressResponse; json: (body: any) => ExpressResponse };
type ExpressNextFunction = (err?: any) => void;
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
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return (res as any).status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = (req.body || {}) as {
      username: string;
      email: string;
      password: string;
    };

    const existing = await findUserByEmail(email);
    if (existing) {
      return (res as any).status(400).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({
      username,
      email,
      passwordHash,
      role: "admin",
    });

    return (res as any).status(201).json({ user });
  } catch (err) {
    (next as any)(err);
  }
}

export async function login(req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return (res as any).status(400).json({ errors: errors.array() });
    }

    const { email, password } = (req.body || {}) as {
      email: string;
      password: string;
    };

    const user = (await findUserByEmail(email)) as UserRecord | null;
    if (!user) {
      return (res as any).status(401).json({ message: "Invalid credentials" });
    }

    const match = await verifyPassword(password, user.password);
    if (!match) {
      return (res as any).status(401).json({ message: "Invalid credentials" });
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

    return (res as any).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    (next as any)(err);
  }
}

export async function getMe(req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) {
  try {
    const userId = (req as any).user?.id;
    if (!userId || !(req as any).user) {
      return (res as any).status(401).json({ message: "Not authorized" });
    }

    // TODO: Fetch user from database for complete user info
    // For now, return user from token
    const user = {
      id: (req as any).user.id,
      username: (req as any).user.username || "Admin",
      email: (req as any).user.email,
      role: (req as any).user.role,
    };

    return (res as any).json({ user });
  } catch (err) {
    (next as any)(err);
  }
}


