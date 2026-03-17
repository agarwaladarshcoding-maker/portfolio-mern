const express   = require("express");
const router    = express.Router();
const GrindPost = require("../models/GrindPost");
const mongoose  = require("mongoose");

// ── GET /api/grind ─────────────────────────────────────────
router.get("/", async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    const posts = await GrindPost.find({ isPublished: true })
      .sort({ dayNumber: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/grind/stats ───────────────────────────────────
// MUST be before /:slug to avoid "stats" being treated as slug
router.get("/stats", async (req, res, next) => {
  try {
    const totalPublished = await GrindPost.countDocuments({ isPublished: true });
    const latest = await GrindPost.findOne({ isPublished: true })
      .sort({ dayNumber: -1 });

    res.json({
      success: true,
      data: {
        totalPublished,
        currentStreak: latest ? latest.dayNumber : 0,
      }
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/grind/:slug ───────────────────────────────────
// Accepts BOTH slug (day-70) AND MongoDB ObjectId
router.get("/:slug", async (req, res, next) => {
  try {
    const param = req.params.slug;
    let post = null;

    // Try slug first (e.g. "day-70")
    post = await GrindPost.findOne({ slug: param });

    // If not found by slug, try MongoDB ObjectId
    if (!post && mongoose.Types.ObjectId.isValid(param)) {
      post = await GrindPost.findById(param);
    }

    if (!post) {
      const err = new Error("Post not found");
      err.statusCode = 404;
      return next(err);
    }

    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/grind ────────────────────────────────────────
router.post("/", async (req, res, next) => {
  try {
    const { title, content, dayNumber, tags, linkedInUrl, isPublished } = req.body;

    // Auto-generate slug
    const slug = "day-" + dayNumber;

    const post = await GrindPost.create({
      title,
      content,
      dayNumber,
      slug,
      tags,
      linkedInUrl,
      isPublished: isPublished || false,
    });
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
});

// ── PATCH /api/grind/:slug ─────────────────────────────────
router.patch("/:slug", async (req, res, next) => {
  try {
    const param = req.params.slug;
    let post = null;

    // Try slug first, then ObjectId
    post = await GrindPost.findOne({ slug: param });
    if (!post && mongoose.Types.ObjectId.isValid(param)) {
      post = await GrindPost.findById(param);
    }

    if (!post) {
      const err = new Error("Post not found");
      err.statusCode = 404;
      return next(err);
    }

    // If dayNumber changed, update slug too
    if (req.body.dayNumber && req.body.dayNumber !== post.dayNumber) {
      req.body.slug = "day-" + req.body.dayNumber;
    }

    Object.assign(post, req.body);
    await post.save();

    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/grind/:slug ────────────────────────────────
router.delete("/:slug", async (req, res, next) => {
  try {
    const param = req.params.slug;
    let post = null;

    post = await GrindPost.findOne({ slug: param });
    if (!post && mongoose.Types.ObjectId.isValid(param)) {
      post = await GrindPost.findById(param);
    }

    if (!post) {
      const err = new Error("Post not found");
      err.statusCode = 404;
      return next(err);
    }

    await post.deleteOne();
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
});

module.exports = router;