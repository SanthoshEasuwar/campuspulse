import express from "express";
import Confession from "../models/confession.js";
import { protect, requireActive } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", async (_req, res) => {
  try {
    const confessions = await Confession.find({}).sort({ ts: -1 });
    res.json(confessions.map((confession) => confession.toJSON()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch confessions" });
  }
});

router.post("/", requireActive, async (req, res) => {
  try {
    const text = req.body?.text?.trim();
    const tag = req.body?.tag?.trim() || "Campus";

    if (!text) {
      return res.status(400).json({ error: "Confession text is required" });
    }

    const confession = await Confession.create({
      text,
      tag,
      createdBy: req.user._id,
      ts: Date.now(),
    });

    res.status(201).json(confession.toJSON());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to post confession" });
  }
});

router.post("/:id/like", requireActive, async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);
    if (!confession) {
      return res.status(404).json({ error: "Confession not found" });
    }

    confession.likes += 1;
    await confession.save();
    res.json(confession.toJSON());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to like confession" });
  }
});

export default router;
