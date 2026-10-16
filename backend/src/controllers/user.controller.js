import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const isProd = process.env.NODE_ENV === "production";
const cookieOptions = { httpOnly: true, secure: isProd, sameSite: isProd ? "none" : "lax" };

const issueTokens = async (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const normalizeUserInput = (value) => (typeof value === "string" ? value.trim() : "");

export const registerUser = asyncHandler(async (req, res) => {
  const fullname = normalizeUserInput(req.body.fullname);
  const username = normalizeUserInput(req.body.username).toLowerCase();
  const email = normalizeUserInput(req.body.email).toLowerCase();
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (![fullname, username, email].every(Boolean) || !password)
    throw new ApiError(400, "fullname, username, email and password are required");
  if (password.length < 6) throw new ApiError(400, "Password must be at least 6 characters");

  const exists = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (exists) throw new ApiError(409, "Email or username already in use");

  let profilePhoto = null;
  if (req.file) profilePhoto = (await uploadOnCloudinary(req.file.path, "image")).secure_url;

  const user = await User.create({ fullname, username, email, passwordHash: password, profilePhoto });
  const { accessToken, refreshToken } = await issueTokens(user);

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, { ...cookieOptions })
    .json(new ApiResponse(201, { user, accessToken, refreshToken }, "Registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const identifier = normalizeUserInput(req.body.identifier);
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!identifier || !password) throw new ApiError(400, "All fields are required");

  const id = identifier.toLowerCase();
  const user = await User.findOne({ $or: [{ email: id }, { username: id }] });
  if (!user || !(await user.isPasswordCorrect(password))) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = await issueTokens(user);
  return res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, { ...cookieOptions })
    .json(new ApiResponse(200, { user, accessToken, refreshToken }, "Login successful"));
});

export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: "" });
  return res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logged out"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incoming = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incoming) throw new ApiError(401, "Unauthorized request");

  let decoded;
  try {
    decoded = jwt.verify(incoming, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, "Invalid refresh token");
  }
  const user = await User.findById(decoded._id);
  if (!user || user.refreshToken !== incoming) throw new ApiError(403, "Refresh token expired or used");

  const { accessToken, refreshToken } = await issueTokens(user);
  return res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user, accessToken, refreshToken }, "Token refreshed"));
});

export const getCurrentUser = asyncHandler(async (req, res) =>
  res.json(new ApiResponse(200, req.user, "Current user fetched"))
);

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).select("fullname username profilePhoto createdAt");
  if (!user) throw new ApiError(404, "User not found");
  return res.json(new ApiResponse(200, user, "User profile fetched"));
});
