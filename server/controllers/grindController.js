// ============================================================
// grindController.js — Business Logic for Grind Posts
// ============================================================
// WHY SEPARATE FROM ROUTES?
//   Controllers contain the "what to do" logic.
//   Routes contain the "when to trigger it" logic.
//   This separation lets you unit-test controllers without
//   spinning up an HTTP server.
// ============================================================

const GrindPost = require("../models/GrindPost");

// --- getAllPosts ---
// Returns all published grind posts, sorted by dayNumber descending
// (most recent day first). Supports ?limit and ?tag query params.
const getAllPosts = async (req, res, next) => {
  try {
    const { limit = 50, tag, page = 1 } = req.query;

    // Build the query filter dynamically
    const filter = { isPublished: true };

    // If a tag filter is passed (?tag=machine-learning),
    // add it to the filter. MongoDB's $in operator checks
    // if the tags array contains the value.
    if (tag) {
      filter.tags = { $in: [tag.toLowerCase()] };
    }

    // Calculate how many documents to skip for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Run the query + a count query in parallel for efficiency.
    // Promise.all fires both queries simultaneously rather than
    // waiting for one to finish before starting the other.
    const [posts, total] = await Promise.all([
      GrindPost.find(filter)
        .sort({ dayNumber: -1 })      // Most recent day first
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),                       // .lean() returns plain JS objects
                                       // instead of Mongoose Documents.
                                       // ~2x faster for read-only queries.
      GrindPost.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: posts,
    });
  } catch (error) {
    // Pass to centralized error handler
    next(error);
  }
};

// --- getPostByDay ---
// Fetch a single post by its dayNumber (not _id).
// We use dayNumber as the public identifier because it's
// human-readable and stable (day 47 is always day 47).
const getPostByDay = async (req, res, next) => {
  try {
    const { dayNumber } = req.params;

    const post = await GrindPost.findOne({
      dayNumber: parseInt(dayNumber),
      isPublished: true,
    }).lean();

    if (!post) {
      // Create a structured error and pass to error handler
      const error = new Error(`No post found for Day ${dayNumber}`);
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// --- createPost ---
// Create a new grind post. In production, protect this route
// with an auth middleware so only you can POST.
const createPost = async (req, res, next) => {
  try {
    const post = await GrindPost.create(req.body);

    res.status(201).json({
      success: true,
      message: `Day ${post.dayNumber} post created successfully`,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// --- updatePost ---
// Update an existing post by dayNumber.
// Uses findOneAndUpdate with { new: true } to return
// the updated document (not the old one).
const updatePost = async (req, res, next) => {
  try {
    const { dayNumber } = req.params;

    const post = await GrindPost.findOneAndUpdate(
      { dayNumber: parseInt(dayNumber) },
      req.body,
      {
        new: true,              // Return updated document
        runValidators: true,    // Re-run schema validators on update
      }
    );

    if (!post) {
      const error = new Error(`No post found for Day ${dayNumber}`);
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// --- getStats ---
// Returns aggregate stats for display in the Grind section header.
// e.g. "Total days logged: 147 | Topics covered: 12"
const getStats = async (req, res, next) => {
  try {
    const [totalDays, allTags] = await Promise.all([
      GrindPost.countDocuments({ isPublished: true }),
      // Aggregate unique tags across all posts
      GrindPost.aggregate([
        { $match: { isPublished: true } },
        { $unwind: "$tags" },
        { $group: { _id: "$tags" } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const latestPost = await GrindPost.findOne({ isPublished: true })
      .sort({ dayNumber: -1 })
      .select("dayNumber title")
      .lean();

    res.status(200).json({
      success: true,
      data: {
        totalDays,
        uniqueTopics: allTags.length,
        topics: allTags.map((t) => t._id),
        currentDay: latestPost?.dayNumber || 0,
        latestTitle: latestPost?.title || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllPosts, getPostByDay, createPost, updatePost, getStats };