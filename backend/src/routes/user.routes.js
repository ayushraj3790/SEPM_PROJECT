import { Router } from "express";
import {
  registerUser, loginUser, logout, refreshAccessToken, getCurrentUser, getUserProfile,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.post("/register", upload.single("profilePhoto"), registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, getCurrentUser);
router.get("/:userId/profile", verifyJWT, getUserProfile);
export default router;
