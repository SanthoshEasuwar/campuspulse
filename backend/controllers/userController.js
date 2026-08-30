import User from "../models/user.js";

// @desc    Get current user profile
// @route   GET /api/users/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password -__v")
      .populate("activities.sender", "name profilePicture email _id");
    if (user) {
      res.json(user.toJSON());
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("getMe error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Get user profile by ID
// @route   GET /api/users/:id
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -__v");
    if (user) {
      res.json(user.toJSON());
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/me
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.profilePicture = req.body.profilePicture !== undefined ? req.body.profilePicture : user.profilePicture;
      const updatedUser = await user.save();
      res.json(updatedUser.toJSON());
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Get all users
// @route   GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password -__v");
    res.json(users.map(u => u.toJSON()));
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Send a follow request
// @route   POST /api/users/:id/follow
export const followUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const alreadyFollowing = targetUser.followers.some(
      id => id.toString() === req.user._id.toString()
    );
    if (alreadyFollowing) {
      return res.status(400).json({ error: "You already follow this user" });
    }

    const alreadyPending = targetUser.pendingRequests.some(
      id => id.toString() === req.user._id.toString()
    );
    if (alreadyPending) {
      return res.status(400).json({ error: "Follow request already pending" });
    }

    targetUser.pendingRequests.push(req.user._id);
    await targetUser.save();

    res.status(200).json({ message: "Follow request sent" });
  } catch (error) {
    console.error("followUser error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Unfollow a user
// @route   POST /api/users/:id/unfollow
export const unfollowUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ error: "You cannot unfollow yourself" });
    }

    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFollowing = targetUser.followers.some(
      id => id.toString() === req.user._id.toString()
    );

    if (isFollowing) {
      targetUser.followers = targetUser.followers.filter(
        id => id.toString() !== req.user._id.toString()
      );
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== targetUser._id.toString()
      );
      await targetUser.save();
      await currentUser.save();
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      res.status(400).json({ error: "You don't follow this user" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Accept a follow request
// @route   POST /api/users/:id/accept
export const acceptRequest = async (req, res) => {
  try {
    const senderId = req.params.id;
    const currentUser = await User.findById(req.user._id);
    const senderUser = await User.findById(senderId);

    if (!currentUser || !senderUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const hasPending = currentUser.pendingRequests.some(
      id => id.toString() === senderId
    );
    if (!hasPending) {
      return res.status(400).json({ error: "No pending request found from this user" });
    }

    // Remove from pending
    currentUser.pendingRequests = currentUser.pendingRequests.filter(
      id => id.toString() !== senderId
    );

    // Add follower/following bond
    if (!currentUser.followers.some(id => id.toString() === senderId)) {
      currentUser.followers.push(senderId);
    }
    if (!senderUser.following.some(id => id.toString() === currentUser._id.toString())) {
      senderUser.following.push(currentUser._id);
    }

    // Record activity so the frontend notifications tab shows it
    currentUser.activities.push({
      type: "FOLLOW",
      sender: senderId,
      timestamp: new Date(),
    });

    await currentUser.save();
    await senderUser.save();

    res.status(200).json({ message: "Follow request accepted" });
  } catch (error) {
    console.error("acceptRequest error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Decline a follow request
// @route   POST /api/users/:id/decline
export const declineRequest = async (req, res) => {
  try {
    const senderId = req.params.id;
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    currentUser.pendingRequests = currentUser.pendingRequests.filter(
      id => id.toString() !== senderId
    );
    await currentUser.save();

    res.status(200).json({ message: "Follow request declined" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Get user's incoming follow requests
// @route   GET /api/users/requests
export const getRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "pendingRequests",
      "_id name email profilePicture bio"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.pendingRequests.map(u => u.toJSON ? u.toJSON() : u));
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Get user's followers
// @route   GET /api/users/:id/followers
export const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "followers",
      "_id name email profilePicture bio"
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.followers.map(u => u.toJSON ? u.toJSON() : u));
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Get users a user is following
// @route   GET /api/users/:id/following
export const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "following",
      "_id name email profilePicture bio"
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.following.map(u => u.toJSON ? u.toJSON() : u));
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Admin: Get all users
// @route   GET /api/users/admin/users
export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password -__v");
    res.json(users.map(u => u.toJSON()));
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Admin: Update user status (active/restricted)
// @route   PATCH /api/users/admin/:id/status
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "restricted"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select("-password -__v");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Admin: Update user role (user/admin)
// @route   PATCH /api/users/admin/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role value" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password -__v");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Admin: Adjust user leaderboard points
// @route   PATCH /api/users/admin/:id/points
export const updateUserPoints = async (req, res) => {
  try {
    const { pointsAdjustment } = req.body;
    if (typeof pointsAdjustment !== "number") {
      return res.status(400).json({ error: "pointsAdjustment must be a number" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { pointsAdjustment },
      { new: true }
    ).select("-password -__v");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};