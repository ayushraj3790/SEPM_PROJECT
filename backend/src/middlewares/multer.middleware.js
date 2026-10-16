import multer from "multer";
import fs from "fs";
import path from "path";

// Temp folder only — NOT served statically (files go to Cloudinary then get deleted)
const uploadFolder = "./uploads";
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname)}`),
});

const fileFilter = (req, file, cb) => {
  const ok = ["image", "video", "audio"].some((t) => file.mimetype.startsWith(t));
  cb(ok ? null : new Error("Unsupported file type"), ok);
};

export const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 }, fileFilter });
