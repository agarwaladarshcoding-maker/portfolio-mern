const express   = require("express");
const router    = express.Router();

// ── GET /api/admin/grind ──────────────────────────────────
router.get("/grind", async (req, res) => {
  try {
    const GrindPost = require("../models/GrindPost");
    const posts = await GrindPost.find({}).sort({ dayNumber: -1 }).lean();
    return res.json({ success: true, data: posts });
  } catch (err) {
    console.error("GET /admin/grind error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/admin/grind ─────────────────────────────────
router.post("/grind", async (req, res) => {
  try {
    const GrindPost = require("../models/GrindPost");
    console.log("Creating post with body:", req.body);
    const post = await GrindPost.create(req.body);
    return res.status(201).json({ success: true, data: post });
  } catch (err) {
    console.error("POST /admin/grind error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ── PATCH /api/admin/grind/:id ────────────────────────────
router.patch("/grind/:id", async (req, res) => {
  try {
    const GrindPost = require("../models/GrindPost");
    const post = await GrindPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).json({ success: false, error: "Not found" });
    return res.json({ success: true, data: post });
  } catch (err) {
    console.error("PATCH /admin/grind error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ── DELETE /api/admin/grind/:id ───────────────────────────
router.delete("/grind/:id", async (req, res) => {
  try {
    const GrindPost = require("../models/GrindPost");
    await GrindPost.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("DELETE /admin/grind error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/admin/projects ───────────────────────────────
router.get("/projects", async (req, res) => {
  try {
    const Project = require("../models/Project");
    const projects = await Project.find({}).sort({ displayOrder: 1 }).lean();
    return res.json({ success: true, data: projects });
  } catch (err) {
    console.error("GET /admin/projects error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/admin/projects ──────────────────────────────
router.post("/projects", async (req, res) => {
  try {
    const Project = require("../models/Project");
    const project = await Project.create(req.body);
    return res.status(201).json({ success: true, data: project });
  } catch (err) {
    console.error("POST /admin/projects error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ── PATCH /api/admin/projects/:id ────────────────────────
router.patch("/projects/:id", async (req, res) => {
  try {
    const Project = require("../models/Project");
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ success: false, error: "Not found" });
    return res.json({ success: true, data: project });
  } catch (err) {
    console.error("PATCH /admin/projects error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ── DELETE /api/admin/projects/:id ───────────────────────
router.delete("/projects/:id", async (req, res) => {
  try {
    const Project = require("../models/Project");
    await Project.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("DELETE /admin/projects error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/admin/inbox ──────────────────────────────────
router.get("/inbox", async (req, res) => {
  try {
    const ContactMessage = require("../models/ContactMessage");
    const messages = await ContactMessage.find({})
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, data: messages });
  } catch (err) {
    console.error("GET /admin/inbox error:", err.message);
    // Return empty array if ContactMessage model doesn't exist yet
    return res.json({ success: true, data: [] });
  }
});

module.exports = router;