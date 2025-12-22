import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create storage engine for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req, file) => {
    const ext = file.originalname.split('.').pop() || 'jpg';
    const base = file.originalname
      .replace(/\s+/g, "-")
      .toLowerCase()
      .replace(/\.[^/.]+$/, "");
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    return {
      folder: "thesporadicthinker",
      public_id: `post-${base}-${unique}`,
      format: ext,
      resource_type: "image" as const,
    };
  },
});

export const upload = multer({ storage });


