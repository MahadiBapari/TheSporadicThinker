import type { Request, Response, NextFunction } from "../types/express";
import jwt from "jsonwebtoken";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = (req as any).headers?.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  if (!token) {
    return (res as any).status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const secret = process.env.JWT_SECRET || "changeme";
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded as Express.Request["user"];
    (next as any)();
  } catch (err) {
    return (res as any).status(401).json({ message: "Not authorized, token invalid" });
  }
}


