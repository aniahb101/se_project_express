class ConflictError extends Error {
  constructor(message = "Conflict") {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
