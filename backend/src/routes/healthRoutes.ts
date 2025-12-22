import { Router, type Request, type Response } from "express";

const router = Router();

router.get("/health", (req: Request, res: Response) => {
  (res as any).json({ status: "ok", uptime: process.uptime() });
});

export default router;


