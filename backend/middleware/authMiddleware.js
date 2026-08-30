import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Make sure to define JWT_SECRET in your .env file
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_please_change";

export const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ error: "Not authorized, user not found" });
    }
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({ error: "Not authorized, token failed" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

export const requireActive = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authorized" });
  }
  if (req.user.status === "restricted") {
    return res.status(403).json({ error: "Your account is restricted. Please contact an administrator." });
  }
  next();
};
