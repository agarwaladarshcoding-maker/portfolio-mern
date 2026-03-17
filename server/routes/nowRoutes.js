const express   = require("express");
const router    = express.Router();
const NowConfig = require("../models/NowConfig");

// ── GET /api/now ───────────────────────────────────────────
// Returns the single now config document (or empty defaults)
router.get("/", async (req, res, next) => {
  try {
    // There's only ever one document — findOne or create
    let config = await NowConfig.findOne();
    if (!config) {
      config = await NowConfig.create({});
    }
    res.json({ success: true, data: config });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/now — upsert the single now config ───────────
router.post("/", async (req, res, next) => {
  try {
    const { location, lastUpdated, instagram, thinking, building, learning, reading } = req.body;

    let config = await NowConfig.findOne();
    if (!config) {
      config = new NowConfig({});
    }

    if (location    !== undefined) config.location    = location;
    if (lastUpdated !== undefined) config.lastUpdated = lastUpdated;
    if (instagram   !== undefined) config.instagram   = instagram;
    if (thinking    !== undefined) config.thinking    = thinking;
    if (building    !== undefined) config.building    = building;
    if (learning    !== undefined) config.learning    = learning;
    if (reading     !== undefined) config.reading     = reading;

    await config.save();
    res.json({ success: true, data: config });
  } catch (err) {
    next(err);
  }
});

module.exports = router;