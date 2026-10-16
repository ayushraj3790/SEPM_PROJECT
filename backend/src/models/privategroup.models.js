import mongoose, { Schema } from "mongoose";

const storySchema = new Schema(
  {
    contentType: { type: String, enum: ["text", "image", "video", "audio", "file"], required: true },
    text: String,
    url: String,
    mimeType: String,
    size: Number,
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true } // gives each story createdAt (needed for sorting)
);

const privategroupSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, trim: true },
    inviteCode: { type: String, unique: true, index: true },
    isPrivate: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [
      {
        _id: false,
        user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, enum: ["owner", "member"], default: "member" },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    story: [storySchema],
  },
  { timestamps: true }
);

privategroupSchema.index({ "members.user_id": 1 });

export const Privategroup = mongoose.model("Privategroup", privategroupSchema);
