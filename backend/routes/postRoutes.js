import express from "express";
import Post from "../models/post.js";
import { protect, requireActive } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", requireActive, async (req, res) => {
  try {
    const eventDate = req.body?.eventDate || new Date().toISOString().split("T")[0];

    const newPost = new Post({
      ...req.body,
      eventDate,
      userId: req.user._id,
      ts: Date.now(),
      likes: [],
      reactions: {},
      comments: [],
    });

    const saved = await newPost.save();
    res.json(saved.toJSON());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const posts = await Post.find({}).sort({ ts: -1 });
    res.json(posts.map((p) => p.toJSON()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.id }).sort({ ts: -1 });
    res.json(posts.map((p) => p.toJSON()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
});

router.post("/:id/like", requireActive, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const uid = req.user._id.toString();
    const idx = post.likes.indexOf(uid);
    if (idx === -1) post.likes.push(uid);
    else post.likes.splice(idx, 1);

    await post.save();
    res.json(post.toJSON());
  } catch (_err) {
    res.status(500).json({ error: "Failed to like post" });
  }
});

router.post("/:id/react", requireActive, async (req, res) => {
  try {
    const { emoji } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const uid = req.user._id.toString();
    const current = post.reactions.get(emoji) || [];
    if (current.includes(uid)) {
      post.reactions.set(emoji, current.filter((id) => id !== uid));
    } else {
      post.reactions.set(emoji, [...current, uid]);
    }
    await post.save();
    res.json(post.toJSON());
  } catch (_err) {
    res.status(500).json({ error: "Failed to react" });
  }
});

router.post("/:id/comment", requireActive, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: "Comment text required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.comments.push({
      id: "c" + Date.now(),
      userId: req.user._id.toString(),
      text: text.trim(),
      ts: Date.now(),
    });
    await post.save();
    res.json(post.toJSON());
  } catch (_err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

router.delete("/:id", requireActive, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }
    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (_err) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;
