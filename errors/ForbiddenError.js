class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
