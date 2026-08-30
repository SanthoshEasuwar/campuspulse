import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./middleware/passportConfig.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import confessionRoutes from "./routes/confessionRoutes.js";
import User from "./models/user.js";

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

const ensureAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@vitstudent.ac.in";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
  const adminName = process.env.ADMIN_NAME || "Campus Admin";
  const legacyAdminEmails = ["admin@campuspulse.local", "admin@campuspulse.com"];

  const existingAdmin = await User.findOne({
    email: { $in: [adminEmail, ...legacyAdminEmails] }
  });
  if (!existingAdmin) {
    await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      status: "active",
      bio: "Platform administrator",
    });
    console.log(`Admin user created: ${adminEmail}`);
    return;
  }

  if (
    existingAdmin.role !== "admin" ||
    existingAdmin.status !== "active" ||
    existingAdmin.email !== adminEmail
  ) {
    existingAdmin.email = adminEmail;
    existingAdmin.role = "admin";
    existingAdmin.status = "active";
    await existingAdmin.save();
    console.log(`Existing user promoted to admin: ${adminEmail}`);
  }
};

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await ensureAdminUser();
  })
  .catch((err) => console.log("MongoDB error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/confessions", confessionRoutes);

app.get("/", (req, res) => {
  res.send("Backend working");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
