module.exports = (err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      code: err.code || "SERVER_ERROR",
      message: err.message || "Unexpected error"
    }
  });
};