// ============================================================
// db.js — MongoDB Connection Module
// ============================================================
// WHY THIS EXISTS AS A SEPARATE MODULE:
//   Keeping DB connection logic isolated means:
//   1. server.js stays clean — it just calls connectDB()
//   2. You can mock this module easily in tests
//   3. If you ever switch from MongoDB to PostgreSQL,
//      you change ONE file, not your entire app
//
// NOTE ON REMOVED OPTIONS (Mongoose 8+):
//   useNewUrlParser and useUnifiedTopology were deprecated
//   in Mongoose 7 and fully removed in Mongoose 8.
//   The modern MongoDB Node.js driver (v4+) handles these
//   behaviors automatically — you no longer need to pass them.
//   Passing them now throws an explicit error, so we omit them.
// ============================================================

const mongoose = require("mongoose");

// --- connectDB ---
// An async function that establishes the MongoDB connection.
// We use async/await instead of .then()/.catch() for cleaner
// stack traces when something goes wrong in production.
const connectDB = async () => {
  try {
    // mongoose.connect() returns a connection object.
    // We only pass options that are still valid in Mongoose 8+.
    const conn = await mongoose.connect(process.env.MONGO_URI, {

      // maxPoolSize: How many simultaneous connections Mongoose
      // keeps open to MongoDB. 10 is a solid default for a
      // portfolio site. Scale this up for high-traffic apps.
      // WHY POOL? Opening a new TCP connection for every query
      // is expensive (~100ms). A pool keeps connections warm
      // and reuses them — queries respond in microseconds.
      maxPoolSize: 10,

      // serverSelectionTimeoutMS: How long Mongoose waits to
      // find an available MongoDB server before throwing.
      // 5 seconds is reasonable — keeps startup failures fast
      // and visible rather than hanging indefinitely.
      serverSelectionTimeoutMS: 5000,

      // socketTimeoutMS: How long a send/receive on a socket
      // can be inactive before the driver closes it.
      // 45 seconds is the MongoDB recommended default.
      // Too low = dropped connections on slow queries.
      // Too high = zombie connections linger after network issues.
      socketTimeoutMS: 45000,
    });

    // Log the host so you can confirm WHICH database you hit.
    // conn.connection.host shows "localhost" in development
    // or your Atlas cluster URL (e.g. cluster0.xyz.mongodb.net)
    // in production. Useful for catching misconfigured .env files.
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {
    // Log the full error message for debugging.
    // In production, replace console.error with your
    // Winston logger: logger.error(`DB Error: ${error.message}`)
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    // WHY process.exit(1)?
    //   Exit code 1 = abnormal termination (something went wrong).
    //   Exit code 0 = normal/intentional shutdown.
    //
    //   If we can't reach the database, the entire API is broken —
    //   every route will fail. It's better to crash loudly here
    //   and let a process manager (PM2, Docker, Railway, Render)
    //   restart us automatically than to silently serve 500 errors
    //   on every single request.
    process.exit(1);
  }
};

module.exports = connectDB;