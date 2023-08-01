const validationError = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  if (err.name === "ValidationError") {
    const errorResponse = {
      type: "Validation error",
      errors: Object.keys(err.errors).map((field) => ({
        resource: field,
        message: err.errors[field].message,
      })),
    };
    return res.status(statusCode).json(errorResponse);
  }
  res.status(statusCode).json({ error: message });
};


module.exports = { validationError };
