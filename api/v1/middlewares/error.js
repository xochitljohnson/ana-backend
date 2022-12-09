// Import utility error response function
const ErrorResponse = require("../utils/errorResponse");

// Middleware error handler
const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  console.log(err);

  // Mongoose bad ObjectID
  if (err.name === "CastError") {
    const message = `Resource with id ${err.value} not found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }

  // Handle error
  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server error" });
};

module.exports = errorHandler;
