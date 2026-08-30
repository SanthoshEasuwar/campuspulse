import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  id: String,
  userId: String, // stored as string for easy frontend comparison
  text: String,
  ts: Number,
});

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  body: String,
  eventDate: String,
  eventTime: String,
  tag: { type: String, default: "general" },
  mood: String,
  location: String,
  mapX: Number,
  mapY: Number,
  ts: { type: Number, default: () => Date.now() },
  likes: { type: [String], default: [] },
  reactions: { type: Map, of: [String], default: {} },
  comments: { type: [commentSchema], default: [] },
}, { timestamps: true });

// Virtual `id` mirrors `_id` as string
postSchema.virtual("id").get(function () {
  return this._id.toString();
});

// CRITICAL: Serialize to JSON with userId as string and reactions as plain object
postSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    // userId must be a plain string so frontend can compare: post.userId === myId
    if (ret.userId && typeof ret.userId !== "string") {
      ret.userId = ret.userId.toString();
    }
    // Convert Mongoose Map → plain object so frontend can do: post.reactions["🔥"]
    if (doc.reactions instanceof Map) {
      const obj = {};
      doc.reactions.forEach((val, key) => { obj[key] = val; });
      ret.reactions = obj;
    }
    return ret;
  },
});

export default mongoose.model("Post", postSchema);
