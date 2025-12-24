import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import healthRoutes from "./routes/healthRoutes";
import postRoutes from "./routes/postRoutes";
import adminPostRoutes from "./routes/adminPostRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import adminCategoryRoutes from "./routes/adminCategoryRoutes";
import adminStatsRoutes from "./routes/adminStatsRoutes";
import { errorHandler, notFound } from "./middleware/errorHandler";
import path from "path";

dotenv.config();

const app = express() as any;

// Use helmet but disable Cross-Origin-Resource-Policy so images can be
// loaded from the frontend origin (e.g. localhost:3000).
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.CORS_ORIGIN 
        ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
        : ["http://localhost:3000"];
      
      // Allow requests with no origin (like mobile apps, Postman, or server-to-server requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS: Blocked request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());

// Serve uploaded images with CORS headers (for backward compatibility with old images)
// Note: New uploads use Cloudinary, but we keep this for existing images that may still reference /uploads/
const uploadsPath = path.join(process.cwd(), "uploads");
app.use(
  "/uploads",
  express.static(uploadsPath, {
    setHeaders: (res: any, req: any) => {
      const origin = req.headers.origin;
      const allowedOrigins = process.env.CORS_ORIGIN 
        ? process.env.CORS_ORIGIN.split(',').map((o: string) => o.trim())
        : ["http://localhost:3000"];
      
      if (origin && allowedOrigins.includes(origin)) {
        res.set("Access-Control-Allow-Origin", origin);
      } else {
        res.set("Access-Control-Allow-Origin", allowedOrigins[0] || "http://localhost:3000");
      }
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin/posts", adminPostRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/admin/stats", adminStatsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend API running on port ${PORT}`);
});


