const express = require("express");
const router  = express.Router();
const Project = require("../models/Project");

// ── GET /api/projects ──────────────────────────────────────
router.get("/", async (req, res, next) => {
  try {
    const projects = await Project.find({ isPublished: true })
      .sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/projects/:id ──────────────────────────────────
router.get("/:id", async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      const err = new Error("Project not found");
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, data: project });
  } catch (err) {
    if (err.name === "CastError") {
      const notFound = new Error("Project not found");
      notFound.statusCode = 404;
      return next(notFound);
    }
    next(err);
  }
});

// ── POST /api/projects ─────────────────────────────────────
router.post("/", async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
});

// ── PATCH /api/projects/:id ────────────────────────────────
router.patch("/:id", async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!project) {
      const err = new Error("Project not found");
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/projects/:id ───────────────────────────────
router.delete("/:id", async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      const err = new Error("Project not found");
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
});

module.exports = router;