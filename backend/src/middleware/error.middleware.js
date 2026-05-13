function errorHandler(err, req, res, next) {
  console.error("--- Unexpected Error ---");
  console.error(err); 
  console.error("------------------------");
  if (err.status) {
    return res.status(err.status).json({
      error: err.message || err.error || "Bad Request",
    });
  }

  const msg = String(err?.message || err || "");

  if (msg.includes("UNIQUE constraint failed")) {
    return res.status(409).json({
      error: "Unique constraint violation (user already exists)",
    });
  }

  if (
    msg.includes("NOT NULL constraint failed") ||
    msg.includes("CHECK constraint failed")
  ) {
    return res.status(400).json({
      error: "Invalid data (missing fields or wrong values)",
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
  });
}

module.exports = { errorHandler };