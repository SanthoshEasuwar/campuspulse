import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  status: { type: String, enum: ["active", "restricted"], default: "active" },
  adminNotes: { type: String, default: "" },
  pointsAdjustment: { type: Number, default: 0 },
  bio: { type: String, default: "" },
  profilePicture: { type: String, default: "" },
  followers: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
  following: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
  pendingRequests: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
  activities: [{
    type: { type: String, enum: ["FOLLOW", "FOLLOW_REQUEST"], required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre("save", async function() {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual `id` that mirrors `_id` as a string
userSchema.virtual("id").get(function () {
  return this._id.toString();
});

userSchema.set("toJSON", { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password; // Never return the user's password hash
    return ret;
  }
});

export default mongoose.model("User", userSchema);
