import mongoose from "mongoose";
import { Privategroup } from "../models/privategroup.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// ---------- helpers ----------
const generateInvitationCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusing characters
  let code = "FAM-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

const sameId = (a, b) => String(a) === String(b);
const isMemberOf = (group, userId) => group.members.some((m) => sameId(m.user_id, userId));
const isOwnerOf = (group, userId) => sameId(group.createdBy, userId);
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const loadGroup = async (groupId) => {
  if (!mongoose.isValidObjectId(groupId)) throw new ApiError(400, "Invalid group id");
  const group = await Privategroup.findById(groupId);
  if (!group) throw new ApiError(404, "Group not found");
  return group;
};

const userSummaries = async (ids) => {
  const users = await User.find({ _id: { $in: ids } }).select("fullname username profilePhoto").lean();
  return Object.fromEntries(users.map((u) => [String(u._id), u]));
};

// ---------- groups ----------
export const createPrivateGroup = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name?.trim()) throw new ApiError(400, "Group name is required");

  let inviteCode;
  do { inviteCode = generateInvitationCode(); } while (await Privategroup.exists({ inviteCode }));

  const group = await Privategroup.create({
    name: name.trim(),
    description: description?.trim() || "",
    inviteCode,
    createdBy: req.user._id,
    members: [{ user_id: req.user._id, role: "owner" }],
  });
  return res.status(201).json(new ApiResponse(201, group, "Private group created successfully"));
});

export const joinPrivateGroup = asyncHandler(async (req, res) => {
  const inviteCode = req.body.inviteCode?.trim().toUpperCase();
  if (!inviteCode) throw new ApiError(400, "Invite code is required");

  const group = await Privategroup.findOne({ inviteCode });
  if (!group) throw new ApiError(404, "Group not found");
  if (isMemberOf(group, req.user._id)) throw new ApiError(400, "Already a member of this group");

  group.members.push({ user_id: req.user._id, role: "member" });
  await group.save();
  return res.status(200).json(new ApiResponse(200, group, "Joined private group successfully"));
});

export const getMyPrivateGroups = asyncHandler(async (req, res) => {
  const groups = await Privategroup.find({ "members.user_id": req.user._id }, { __v: 0, story: 0 })
    .sort({ updatedAt: -1 })
    .lean();
  return res.status(200).json(new ApiResponse(200, groups, "Fetched your private groups successfully"));
});

export const getGroupDetails = asyncHandler(async (req, res) => {
  const group = await loadGroup(req.params.groupId);
  if (!isMemberOf(group, req.user._id)) throw new ApiError(403, "You are not a member of this group");

  const userMap = await userSummaries(group.members.map((m) => m.user_id));
  const data = {
    _id: group._id, name: group.name, description: group.description,
    inviteCode: group.inviteCode, createdBy: group.createdBy,
    members: group.members.map((m) => {
      const u = userMap[String(m.user_id)];
      return {
        user_id: m.user_id, role: m.role, joinedAt: m.joinedAt,
        fullname: u?.fullname || null, username: u?.username || null, profilePhoto: u?.profilePhoto || null,
      };
    }),
  };
  return res.status(200).json(new ApiResponse(200, data, "Group details fetched"));
});

export const updatePrivateGroup = asyncHandler(async (req, res) => {
  const group = await loadGroup(req.params.groupId);
  if (!isOwnerOf(group, req.user._id)) throw new ApiError(403, "Only the owner can update group details");

  const { name, description } = req.body;
  if (name?.trim()) group.name = name.trim();
  if (description?.trim()) group.description = description.trim();
  await group.save();
  return res.status(200).json(new ApiResponse(200, group, "Group updated successfully"));
});

export const deletePrivateGroup = asyncHandler(async (req, res) => {
  const group = await loadGroup(req.params.groupId);
  if (!isOwnerOf(group, req.user._id)) throw new ApiError(403, "Only the owner can delete this group");
  await group.deleteOne();
  return res.status(200).json(new ApiResponse(200, {}, "Group deleted successfully"));
});

// ---------- members ----------
export const removeMember = asyncHandler(async (req, res) => {
  const { memberId } = req.body;
  if (!memberId) throw new ApiError(400, "memberId is required");

  const group = await loadGroup(req.params.groupId);
  if (!isOwnerOf(group, req.user._id)) throw new ApiError(403, "Only owner can remove members");

  const target = group.members.find((m) => sameId(m.user_id, memberId));
  if (!target) throw new ApiError(404, "Member not found in this group");
  if (target.role === "owner") throw new ApiError(400, "Owner cannot be removed from the group");

  group.members = group.members.filter((m) => !sameId(m.user_id, memberId));
  await group.save();
  return res.status(200).json(new ApiResponse(200, { members: group.members }, "Member removed successfully"));
});

export const leavePrivateGroup = asyncHandler(async (req, res) => {
  const group = await loadGroup(req.params.groupId);
  const idx = group.members.findIndex((m) => sameId(m.user_id, req.user._id));
  if (idx === -1) throw new ApiError(400, "You are not a member of this group");
  if (group.members[idx].role === "owner")
    throw new ApiError(400, "Owner cannot leave the group. Delete the group instead.");

  group.members.splice(idx, 1);
  await group.save();
  return res.status(200).json(new ApiResponse(200, {}, "You left the group successfully"));
});

// ---------- stories ----------
export const addGroupStory = asyncHandler(async (req, res) => {
  const { contentType, text } = req.body;
  const file = req.file;
  if (!contentType) throw new ApiError(400, "Story contentType is required");

  const group = await loadGroup(req.params.groupId);
  if (!isMemberOf(group, req.user._id)) throw new ApiError(403, "You are not a member of this group");

  let story;
  if (contentType === "text") {
    if (!text?.trim()) throw new ApiError(400, "Text content is required for text story");
    story = { contentType, text, createdBy: req.user._id };
  } else {
    if (!file) throw new ApiError(400, `${contentType} file is required`);
    const resourceType = ["image", "video", "audio"].includes(contentType) ? contentType : "auto";
    const uploaded = await uploadOnCloudinary(file.path, resourceType);
    story = {
      contentType, url: uploaded.secure_url, mimeType: file.mimetype, size: file.size,
      text: text || "", createdBy: req.user._id,
    };
  }

  group.story.push(story);
  await group.save();
  return res.status(201).json(new ApiResponse(201, group.story.at(-1), "Story added successfully"));
});

export const getGroupStories = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

  const group = await loadGroup(req.params.groupId);
  if (!isMemberOf(group, req.user._id)) throw new ApiError(403, "You are not a member of this group");

  const all = group.story.map((s) => s.toObject()).sort((a, b) => b.createdAt - a.createdAt);
  const pageItems = all.slice((page - 1) * limit, page * limit);
  const userMap = await userSummaries([...new Set(pageItems.map((s) => String(s.createdBy)))]);

  const stories = pageItems.map((s) => {
    const u = userMap[String(s.createdBy)] || {};
    return {
      ...s,
      createdBy: {
        user_id: s.createdBy, fullname: u.fullname || "Unknown User",
        username: u.username || null, profilePhoto: u.profilePhoto || null,
      },
    };
  });

  return res.status(200).json(
    new ApiResponse(200, {
      stories,
      pagination: { total: all.length, page, limit, totalPages: Math.ceil(all.length / limit) },
    }, "Group stories fetched successfully")
  );
});

export const removeGroupStory = asyncHandler(async (req, res) => {
  const group = await loadGroup(req.params.groupId);
  const story = group.story.id(req.params.storyId);
  if (!story) throw new ApiError(404, "Story not found");

  if (!isOwnerOf(group, req.user._id) && !sameId(story.createdBy, req.user._id))
    throw new ApiError(403, "You are not authorized to delete this story");

  story.deleteOne();
  await group.save();
  return res.status(200).json(new ApiResponse(200, {}, "Story removed successfully"));
});

// ---------- search ----------
export const searchPrivateGroups = asyncHandler(async (req, res) => {
  const query = req.body.query?.trim();
  if (!query) throw new ApiError(400, "Search query is required");

  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
  const filter = { "members.user_id": req.user._id, name: new RegExp(escapeRegex(query), "i") };

  const [total, groups] = await Promise.all([
    Privategroup.countDocuments(filter),
    Privategroup.find(filter)
      .select("name description inviteCode createdBy members")
      .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
  ]);

  return res.status(200).json(
    new ApiResponse(200, { groups, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } },
      "Groups fetched successfully")
  );
});
