import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    fullname: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    profilePhoto: { type: String, default: null },
    refreshToken: { type: String, default: "" },
  },
  { timestamps: true }
);

// Keep the `user_id` field the frontend already expects
userSchema.virtual("user_id").get(function () { return this._id.toString(); });

userSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.passwordHash; delete ret.refreshToken; delete ret.__v; delete ret.id;
    return ret;
  },
});

userSchema.pre("save", async function () {
  if (this.isModified("passwordHash")) this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
});

userSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};
userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
  });
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const User = mongoose.model("User", userSchema);
