require("dotenv").config();

const express    = require("express");
const cors       = require("cors");
const helmet     = require("helmet");
const morgan     = require("morgan");
const connectDB  = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

connectDB();

const app = express();

// ── Security ──────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-admin-token"],
  credentials: true,
}));

// ── Body parsing — MUST come before routes ────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ── Logging ───────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── Health check ──────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status:      "online",
    timestamp:   new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime:      Math.floor(process.uptime()) + "s",
  });
});

// ── Public routes ─────────────────────────────────────────
app.use("/api/grind",    require("./routes/grindRoutes"));
app.use("/api/contact",  require("./routes/contactRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/github",   require("./routes/githubRoutes"));
app.use("/api/leetcode", require("./routes/leetcodeRoutes"));
app.use("/api/now", require("./routes/nowRoutes"));
app.use("/api/codeforces", require("./routes/codeforcesRoutes"));

// ── Admin routes ──────────────────────────────────────────
app.use("/api/admin",    require("./routes/adminRoutes"));

// ── 404 handler ───────────────────────────────────────────
app.use((req, res, next) => {
  const error = new Error("Route not found: " + req.originalUrl);
  error.statusCode = 404;
  next(error);
});

// ── Global error handler ──────────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
  });

  process.on("SIGTERM", () => {
    server.close(() => process.exit(0));
  });

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection:", reason);
    server.close(() => process.exit(1));
  });
}

module.exports = app;