// ============================================================
// errorHandler.js — Global Express Error Handling Middleware
// ============================================================
// WHY CENTRALIZED ERROR HANDLING?
//   Without this, every route would need its own try/catch with
//   custom error responses. With this middleware, controllers
//   just call next(error) and this function handles the rest
//   consistently across the entire API.
//
// HOW IT WORKS:
//   Express identifies error-handling middleware by its 4-argument
//   signature: (err, req, res, next). It MUST have all 4 params.
//   Register it LAST in server.js, after all routes.
// ============================================================

const errorHandler = (err, req, res, next) => {
  // --- Log the error ---
  // In production, replace console.error with your logger (Winston)
  console.error(`[ERROR] ${req.method} ${req.url} — ${err.message}`);
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  // --- Determine HTTP status code ---
  // If the error object has a statusCode (set by us), use it.
  // Otherwise default to 500 (Internal Server Error).
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // --- Handle specific Mongoose error types ---

  // CastError: Usually means an invalid MongoDB ObjectId in the URL
  // e.g. GET /api/grind/not-a-valid-id
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ValidationError: Mongoose schema validation failed
  // e.g. POST /api/grind with missing required field
  if (err.name === "ValidationError") {
    statusCode = 400;
    // Extract all validation messages into a clean array
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Duplicate key error (MongoDB error code 11000)
  // e.g. trying to insert a GrindPost with a dayNumber that already exists
  if (err.code === 11000) {
    statusCode = 409; // 409 Conflict
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field: ${field}`;
  }

  // --- Send the error response ---
  res.status(statusCode).json({
    success: false,
    error: message,
    // Only include the stack trace in development.
    // NEVER expose stack traces in production — they leak internals.
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;