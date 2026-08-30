import express from "express";
import {
  getMe,
  getUser,
  updateProfile,
  getAllUsers,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  acceptRequest,
  declineRequest,
  getRequests,
  getAdminUsers,
  updateUserStatus,
  updateUserRole,
  updateUserPoints
} from "../controllers/userController.js";
import { protect, requireActive, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all user routes
router.use(protect);

router.get("/admin/users", requireAdmin, getAdminUsers);
router.patch("/admin/:id/status", requireAdmin, updateUserStatus);
router.patch("/admin/:id/role", requireAdmin, updateUserRole);
router.patch("/admin/:id/points", requireAdmin, updateUserPoints);

router.get("/me", getMe);
router.get("/requests", getRequests); // Needs to be exact matched before /:id to prevent regex capture conflict
router.get("/:id", getUser);
router.put("/me", requireActive, updateProfile);
router.get("/", getAllUsers);

router.post("/:id/follow", requireActive, followUser);
router.post("/:id/unfollow", requireActive, unfollowUser);
router.post("/:id/accept", requireActive, acceptRequest);
router.post("/:id/decline", requireActive, declineRequest);
router.get("/:id/followers", getFollowers);
router.get("/:id/following", getFollowing);

export default router;
