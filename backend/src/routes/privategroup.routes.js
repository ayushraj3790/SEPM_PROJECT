import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import * as c from "../controllers/privategroup.controller.js";

const router = Router();
router.use(verifyJWT);

router.post("/create", c.createPrivateGroup);
router.post("/join", c.joinPrivateGroup);
router.post("/search", c.searchPrivateGroups);
router.get("/my", c.getMyPrivateGroups);

router.get("/:groupId", c.getGroupDetails);
router.patch("/:groupId", c.updatePrivateGroup);
router.delete("/:groupId", c.deletePrivateGroup);

router.delete("/:groupId/members", c.removeMember);
router.delete("/:groupId/members/me", c.leavePrivateGroup);

router.post("/:groupId/stories", upload.single("file"), c.addGroupStory);
router.get("/:groupId/stories", c.getGroupStories);
router.delete("/:groupId/stories/:storyId", c.removeGroupStory);

export default router;
