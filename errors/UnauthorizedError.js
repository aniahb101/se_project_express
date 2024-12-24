class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
