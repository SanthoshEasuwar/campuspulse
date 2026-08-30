import User from "../models/user.js";
import { signupSchema, loginSchema } from "../validators/authValidator.js";
import jwt from "jsonwebtoken";
import passport from "passport";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_please_change";

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, email, password, bio, profilePicture } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      bio,
      profilePicture,
    });

    if (user) {
      const token = generateToken(user._id);

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, 
      });

      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        adminNotes: user.adminNotes,
        pointsAdjustment: user.pointsAdjustment,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followers: user.followers,
        following: user.following,
        pendingRequests: user.pendingRequests,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.error("FULL ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
export const login = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: info.message || "Invalid credentials" });
    }
    if (user.status === "restricted") {
      return res.status(403).json({ error: "Your account is restricted. Please contact an administrator." });
    }

    req.logIn(user, { session: false }, (err) => {
      if (err) {
        return next(err);
      }

      const token = generateToken(user._id);

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        adminNotes: user.adminNotes,
        pointsAdjustment: user.pointsAdjustment,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followers: user.followers,
        following: user.following,
        pendingRequests: user.pendingRequests,
      });
    });
  })(req, res, next);
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
export const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: "Logged out successfully" });
};
