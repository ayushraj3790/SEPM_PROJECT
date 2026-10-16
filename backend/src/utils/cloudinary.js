import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const safeUnlink = (p) => { try { fs.unlinkSync(p); } catch { /* already gone */ } };

export const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
  if (!localFilePath) return null;
  try {
    return await cloudinary.uploader.upload(localFilePath, { resource_type: resourceType });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new ApiError(500, "Upload failed");
  } finally {
    safeUnlink(localFilePath);
  }
};
